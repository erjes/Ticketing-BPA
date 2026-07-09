<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with(['user'])->latest()->get();

        return Inertia::render('SuperAdmin/ActivityLogs/Index', [
            'logs' => $logs
        ]);
    }
}
