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

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:user,admin,super_admin',
            'nim_nip' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:Mahasiswa,Dosen,Pegawai',
            'prodi_unit' => 'nullable|string|max:255',
        ]);

        $oldData = [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'nim_nip' => $user->nim_nip,
            'status' => $user->status,
            'prodi_unit' => $user->prodi_unit,
        ];

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'nim_nip' => $request->nim_nip,
            'status' => $request->status,
            'prodi_unit' => $request->prodi_unit,
            'is_profile_complete' => $request->nim_nip && $request->status && $request->prodi_unit ? true : $user->is_profile_complete,
        ]);

        $changes = [];
        foreach ($oldData as $key => $value) {
            if ($user->$key != $value) {
                $changes[] = "{$key}: '{$value}' menjadi '{$user->$key}'";
            }
        }
        
        $changeDescription = count($changes) > 0 ? implode(', ', $changes) : 'tidak ada perubahan';

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update_user',
            'description' => "Super Admin memperbarui data user {$user->name} ({$changeDescription})",
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
