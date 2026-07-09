<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $searchResults = null;

        if ($search) {
            $searchResults = Ticket::with('user')
                ->where(function ($q) use ($search) {
                    $q->where('ticket_number', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($qu) use ($search) {
                            $qu->where('name', 'like', "%{$search}%")
                                ->orWhere('nim_nip', 'like', "%{$search}%");
                        });
                })
                ->latest()
                ->get();
        }

        $dbCounts = Ticket::select('category', \DB::raw('count(*) as total'))
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        $categories = \App\Models\TicketCategory::all()->map(function ($cat) use ($dbCounts) {
            return [
                'name' => $cat->name,
                'description' => $cat->description,
                'count' => $dbCounts[$cat->name] ?? 0,
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'open' => Ticket::where('status', 'Open')->count(),
                'in_progress' => Ticket::where('status', 'In Progress')->count(),
                'resolved' => Ticket::where('status', 'Resolved')->count(),
            ],
            'categories' => $categories,
            'searchResults' => $searchResults,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function tickets(Request $request)
    {
        $query = Ticket::with('user')->latest();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $query->get(),
            'currentStatus' => $request->status
        ]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['user', 'replies.user', 'admin', 'attachments']);
        $categories = \App\Models\TicketCategory::orderBy('name')->pluck('name');

        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'category' => 'required|string',
            'message' => 'required|string',
        ]);

        $ticket->update([
            'category' => $request->category,
            'message' => $request->message,
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'edit_ticket',
            'description' => 'Admin mengubah detail tiket',
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }

    public function destroy(Request $request, Ticket $ticket)
    {
        $ticketId = $ticket->id;
        $ticketNumber = $ticket->ticket_number;
        $ticket->delete();

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete_ticket',
            'description' => 'Admin menghapus tiket ' . $ticketNumber,
            'model_type' => Ticket::class,
            'model_id' => $ticketId,
        ]);

        return redirect()->route('admin.tickets.index');
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|in:Open,In Progress,Resolved,Closed',
        ]);

        $oldStatus = $ticket->status;
        
        $ticket->update([
            'status' => $request->status,
            'admin_id' => $request->user()->id,
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update_ticket_status',
            'description' => "Admin mengubah status tiket dari {$oldStatus} menjadi {$request->status}",
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $request->validate([
            'message' => 'required|string',
            'is_internal' => 'boolean',
        ]);

        $reply = $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_internal' => $request->is_internal ?? false,
        ]);

        $ticket->update(['admin_id' => $request->user()->id]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'reply_ticket',
            'description' => $request->is_internal ? 'Admin menambahkan catatan internal' : 'Admin membalas tiket',
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }
}
