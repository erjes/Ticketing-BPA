<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function show(Request $request)
    {
        if ($request->user()->is_profile_complete) {
            return redirect()->to($this->dashboardForRole($request->user()->role));
        }

        return Inertia::render('auth/onboarding');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nim_nip' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:Mahasiswa,Dosen,Pegawai'],
            'prodi_unit' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->update([
            'nim_nip' => $request->nim_nip,
            'status' => $request->status,
            'prodi_unit' => $request->prodi_unit,
            'is_profile_complete' => true,
        ]);

        return redirect()->to($this->dashboardForRole($request->user()->role));
    }

    /**
     * Return the correct dashboard URL based on user role.
     */
    private function dashboardForRole(string $role): string
    {
        return match ($role) {
            'admin' => '/admin/dashboard',
            'super_admin' => '/super-admin/dashboard',
            default => '/dashboard',
        };
    }
}
