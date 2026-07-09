<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Data Sertifikasi Dosen',
            'Data Mahasiswa',
            'Program Magang Berdampak',
            'Data Kerjasama'
        ];

        foreach ($categories as $category) {
            \App\Models\TicketCategory::create(['name' => $category]);
        }
    }
}
