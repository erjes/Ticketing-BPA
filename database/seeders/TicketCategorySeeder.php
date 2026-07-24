<?php

namespace Database\Seeders;

use App\Models\TicketCategory;
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
            'Data & Informasi Kurikulum',
            'Monitoring & Evaluasi OBE',
            'Pengelolaan Kurikulum & Mata Kuliah',
            'Setting RPS & Komponennya',
            'Verifikasi & Dispensasi Akademik'
        ];
    
        foreach ($categories as $category) {
            TicketCategory::updateOrCreate(
                ['name' => $category],
                ['description' => 'Kategori tiket terkait layanan ' . $category]
            );
        }
    }
}
