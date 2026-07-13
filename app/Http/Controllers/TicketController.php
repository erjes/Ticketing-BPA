<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $categories = \App\Models\TicketCategory::orderBy('name')->pluck('name');
        return Inertia::render('Dashboard', [
            'categories' => $categories
        ]);
    }

    public function tickets(Request $request)
    {
        $tickets = Ticket::where('user_id', $request->user()->id)->latest()->get();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function searchSuggestions(Request $request)
    {
        $search = $request->query('query');
        if (!$search) return response()->json([]);

        $tickets = Ticket::where('user_id', $request->user()->id)
            ->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->limit(5)
            ->get(['ticket_number', 'subject', 'category', 'status']);
            
        return response()->json($tickets);
    }

    public function create()
    {
        $categories = \App\Models\TicketCategory::orderBy('name')->pluck('name');
        return Inertia::render('Tickets/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'attachments.*' => 'nullable|file|mimes:jpg,gif,jpeg,png,pdf,doc,docx,zip|max:2048000', // max 2GB
        ]);

        $ticket = DB::transaction(function () use ($request) {
            $maxId = Ticket::lockForUpdate()->max('id') ?? 0;
            $ticketNumber = 'BPA-'.date('Y').'-'.str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);

            $ticket = Ticket::create([
                'ticket_number' => $ticketNumber,
                'user_id' => $request->user()->id,
                'category' => $request->category,
                'subject' => $request->subject,
                'description' => $request->description,
                'status' => 'Open',
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('attachments', 'public');
                    $ticket->attachments()->create([
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            return $ticket;
        });

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create_ticket',
            'description' => 'User membuat tiket baru',
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        $admins = \App\Models\User::whereIn('role', ['admin', 'super_admin'])->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\NewTicketCreated($ticket));
        }

        return redirect()->route('tickets.show', $ticket->ticket_number);
    }

    public function show(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->user()->unreadNotifications
            ->where('data.ticket_id', $ticket->id)
            ->markAsRead();

        $ticket->load(['replies' => function ($query) {
            $query->where('is_internal', false)->with(['user', 'attachments']);
        }, 'admin', 'attachments']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'message' => 'required|string',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,gif,pdf,doc,docx,zip|max:10240',
        ]);

        $reply = $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_internal' => false,
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('tickets', 'public');
                $ticket->attachments()->create([
                    'ticket_reply_id' => $reply->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        if ($ticket->admin_id) {
            $ticket->admin->notify(new \App\Notifications\NewTicketReply($ticket, $reply));
        } else {
            $admins = \App\Models\User::whereIn('role', ['admin', 'super_admin'])->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\NewTicketReply($ticket, $reply));
            }
        }

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'reply_ticket',
            'description' => 'User membalas tiket',
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }

    public function rate(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:1000',
        ]);

        $ticket->update([
            'rating' => $request->rating,
            'feedback' => $request->feedback,
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'rate_ticket',
            'description' => "User memberikan rating {$request->rating} untuk tiket {$ticket->ticket_number}",
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }

    public function categoryIndex(Request $request)
    {
        $category = $request->query('category');
        $search = $request->query('search');

        $query = Ticket::with('user')
            ->where('category', $category)
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($qu) use ($search) {
                        $qu->where('name', 'like', "%{$search}%")
                            ->orWhere('nim_nip', 'like', "%{$search}%");
                    });
            });
        }

        $tickets = $query->get();

        return Inertia::render('Admin/Tickets/CategoryIndex', [
            'category' => $category,
            'tickets' => $tickets,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }
}
