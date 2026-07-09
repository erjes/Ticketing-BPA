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

        $categoryCounts = [
            'Data Sertifikasi Dosen' => $dbCounts['Data Sertifikasi Dosen'] ?? 0,
            'Data Mahasiswa' => $dbCounts['Data Mahasiswa'] ?? 0,
            'Program Magang Berdampak' => $dbCounts['Program Magang Berdampak'] ?? 0,
            'Data Kerjasama' => $dbCounts['Data Kerjasama'] ?? 0,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'open' => Ticket::where('status', 'Open')->count(),
                'in_progress' => Ticket::where('status', 'In Progress')->count(),
                'resolved' => Ticket::where('status', 'Resolved')->count(),
            ],
            'categoryCounts' => $categoryCounts,
            'searchResults' => $searchResults,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['user', 'replies.user', 'admin']);

        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket,
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
            'is_internal' => 'boolean',
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
