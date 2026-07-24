<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->text('detail_data')->nullable();
            $table->string('link_format_data')->nullable();
            $table->text('detail_tujuan')->nullable();
            $table->text('detail_dokumen_tujuan')->nullable();
            $table->text('detail_pertanyaan')->nullable();
            $table->string('posisi_pengaju')->nullable();
            $table->string('sudah_koordinasi')->nullable();
            $table->text('alasan_setting')->nullable();
            $table->string('upload_link_persyaratan')->nullable();
            $table->date('batas_waktu')->nullable();
            
            // description can be nullable if custom forms are used, but we can make it nullable
            $table->text('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'detail_data',
                'link_format_data',
                'detail_tujuan',
                'detail_dokumen_tujuan',
                'detail_pertanyaan',
                'posisi_pengaju',
                'sudah_koordinasi',
                'alasan_setting',
                'upload_link_persyaratan',
                'batas_waktu',
            ]);
            
            $table->text('description')->nullable(false)->change();
        });
    }
};
