<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with('user')->latest()->get();
        return Inertia::render('Admin/Dashboard', [
            'tickets' => $tickets,
            'stats' => [
                'open' => Ticket::where('status', 'Open')->count(),
                'in_progress' => Ticket::where('status', 'In Progress')->count(),
                'resolved' => Ticket::where('status', 'Resolved')->count(),
            ]
        ]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['user', 'replies.user', 'admin']);
        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|in:Open,In Progress,Resolved,Closed',
        ]);

        $ticket->update([
            'status' => $request->status,
            'admin_id' => $request->user()->id,
        ]);

        return back();
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $request->validate([
            'message' => 'required|string',
            'is_internal' => 'boolean'
        ]);

        $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_internal' => $request->is_internal ?? false,
        ]);

        $ticket->update(['admin_id' => $request->user()->id]);

        return back();
    }
}
