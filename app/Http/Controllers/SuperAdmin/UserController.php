<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:user,admin,super_admin',
        ]);

        $oldRole = $user->role;
        $user->update(['role' => $request->role]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update_user_role',
            'description' => "Super Admin mengubah role {$user->name} dari {$oldRole} menjadi {$request->role}",
            'model_type' => User::class,
            'model_id' => $user->id,
        ]);

        return back();
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userId = $user->id;
        $userName = $user->name;
        $user->delete();

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete_user',
            'description' => "Super Admin menghapus user {$userName}",
            'model_type' => User::class,
            'model_id' => $userId,
        ]);

        return back();
    }
}
