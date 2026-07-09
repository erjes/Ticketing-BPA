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
        $tickets = Ticket::where('user_id', $request->user()->id)->latest()->get();

        return Inertia::render('Dashboard', [
            'tickets' => $tickets,
        ]);
    }

    public function create()
    {
        return Inertia::render('Tickets/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'description' => 'required|string',
        ]);

        $ticket = DB::transaction(function () use ($request) {
            $maxId = Ticket::lockForUpdate()->max('id') ?? 0;
            $ticketNumber = 'BPA-'.date('Y').'-'.str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);

            return Ticket::create([
                'ticket_number' => $ticketNumber,
                'user_id' => $request->user()->id,
                'category' => $request->category,
                'description' => $request->description,
                'status' => 'Open',
            ]);
        });

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
        ]);

        $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_internal' => false,
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
