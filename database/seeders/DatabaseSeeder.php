<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@telkomuniversity.ac.id',
            'role' => 'super_admin',
            'password' => bcrypt('password'),
            'is_profile_complete' => true,
        ]);

        User::factory()->create([
            'name' => 'Pegawai BPA (Admin)',
            'email' => 'admin@telkomuniversity.ac.id',
            'role' => 'admin',
            'password' => bcrypt('password'),
            'is_profile_complete' => true,
        ]);

        User::factory()->create([
            'name' => 'Dina Nur Aulia',
            'email' => 'dina@student.telkomuniversity.ac.id',
            'role' => 'user',
            'password' => bcrypt('password'),
            'nim_nip' => '1103223001',
            'status' => 'Mahasiswa',
            'prodi_unit' => 'S1 Sistem Informasi',
            'is_profile_complete' => true,
        ]);
    }
}
