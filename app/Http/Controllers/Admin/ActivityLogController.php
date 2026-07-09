<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with(['user'])->where('model_type', \App\Models\Ticket::class)->latest()->get();

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs
        ]);
    }
}
