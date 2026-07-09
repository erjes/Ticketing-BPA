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
            'tickets' => $tickets
        ]);
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
            $ticketNumber = 'BPA-' . date('Y') . '-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);

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

        return redirect()->route('tickets.show', $ticket->ticket_number);
    }

    public function show(Ticket $ticket)
    {
        if ($ticket->user_id !== request()->user()->id) {
            abort(403);
        }

        $ticket->load(['replies' => function ($query) {
            $query->where('is_internal', false)->with('user');
        }, 'admin']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'message' => 'required|string',
        ]);

        $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_internal' => false,
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'reply_ticket',
            'description' => 'User membalas tiket',
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }
}

