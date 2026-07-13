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

        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $label = now()->subDays($i)->translatedFormat('d M');
            $count = Ticket::whereDate('created_at', $date)->count();
            $trend[] = [
                'date' => $label,
                'count' => $count,
            ];
        }

        // CSAT Statistics
        $csatQuery = Ticket::whereNotNull('rating');
        $totalRated = $csatQuery->count();
        $averageRating = $totalRated > 0 ? round($csatQuery->avg('rating'), 1) : 0;
        
        $ratingCounts = Ticket::whereNotNull('rating')
            ->select('rating', \DB::raw('count(*) as total'))
            ->groupBy('rating')
            ->pluck('total', 'rating')
            ->toArray();

        $ratingBreakdown = [];
        for ($star = 5; $star >= 1; $star--) {
            $ratingBreakdown[] = [
                'stars' => $star,
                'count' => $ratingCounts[$star] ?? 0,
            ];
        }

        $csatStats = [
            'average' => $averageRating,
            'total' => $totalRated,
            'breakdown' => $ratingBreakdown,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'open' => Ticket::where('status', 'Open')->count(),
                'in_progress' => Ticket::where('status', 'In Progress')->count(),
                'resolved' => Ticket::where('status', 'Resolved')->count(),
            ],
            'categories' => $categories,
            'searchResults' => $searchResults,
            'trend' => $trend,
            'csatStats' => $csatStats,
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

    public function searchSuggestions(Request $request)
    {
        $search = $request->query('query');
        if (!$search) return response()->json([]);

        $tickets = Ticket::with('user:id,name,nim_nip')
            ->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($qu) use ($search) {
                      $qu->where('name', 'like', "%{$search}%")
                         ->orWhere('nim_nip', 'like', "%{$search}%");
                  });
            })
            ->latest()
            ->limit(5)
            ->get(['id', 'ticket_number', 'subject', 'category', 'status', 'user_id']);

        return response()->json($tickets);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $request->user()->unreadNotifications
            ->where('data.ticket_id', $ticket->id)
            ->markAsRead();

        $ticket->load(['user', 'replies.user', 'replies.attachments', 'admin', 'attachments']);
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

        $ticket->user->notify(new \App\Notifications\TicketStatusUpdated($ticket, $oldStatus, $request->status));

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
            'attachments.*' => 'file|mimes:jpg,jpeg,png,gif,pdf,doc,docx,zip|max:10240',
        ]);

        $reply = $ticket->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_internal' => filter_var($request->is_internal, FILTER_VALIDATE_BOOLEAN),
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

        $ticket->update(['admin_id' => $request->user()->id]);

        if (!$reply->is_internal) {
            $ticket->user->notify(new \App\Notifications\NewTicketReply($ticket, $reply));
        }

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'reply_ticket',
            'description' => $request->is_internal ? 'Admin menambahkan catatan internal' : 'Admin membalas tiket',
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }

    public function claim(Request $request, Ticket $ticket)
    {
        $ticket->update([
            'admin_id' => $request->user()->id,
            'status' => $ticket->status === 'Open' ? 'In Progress' : $ticket->status
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'claim_ticket',
            'description' => "Admin mengeklaim penugasan tiket {$ticket->ticket_number}",
            'model_type' => Ticket::class,
            'model_id' => $ticket->id,
        ]);

        return back();
    }
}
