# Panduan Desain Antarmuka (UI Style Guide) - Crimson Ticketing System

Panduan ini mendokumentasikan nuansa, palet warna, tipografi, tata letak, dan komponen UI dari **Crimson Ticketing System (BPA)**. Gunakan dokumen ini sebagai referensi bagi AI agent untuk merancang halaman, komponen, atau fitur baru agar selaras dengan gaya visual aplikasi yang sudah ada.

---

## 🎨 Esensi Desain & Nuansa (*Design Theme*)
*   **Vibe**: Bersih, profesional, modern, minimalis, dan terstruktur. Mengutamakan keterbacaan tinggi dan navigasi intuitif.
*   **Branding**: Menggunakan nuansa warna merah tua/krimson Telkom University (Cardinal Red) sebagai warna identitas utama (*primary action*).
*   **Tema**: Mendukung **Light Mode** (default) dan **Dark Mode** melalui pendeteksian kelas `.dark`.

---

## 🛡️ Lambang & Filosofi Logo (*Official Logo Philosophy*)

Logo resmi **Crimson Ticketing System (BPA)** dirancang dengan pendekatan modern, geometris, dan minimalis yang menggabungkan esensi akademik dan pelayanan prima:

1.  🎓 **Bentuk Diamond Atas (Topi Toga)**: Melambangkan dunia akademik Telkom University. Merepresentasikan sivitas akademika (mahasiswa, dosen, dan pegawai) serta standar tinggi dalam pengembangan pendidikan.
2.  🛡️ **Bentuk Perisai Bawah (Shield & Chat Bubble)**: Melambangkan keandalan, perlindungan, dan sistem bantuan (Helpdesk) yang responsif. Menegaskan peran BPA sebagai wadah penampung aspirasi dan penyelesai kendala akademik.
3.  ✅ **Tanda Centang Putih (Checkmark)**: Melambangkan penyelesaian masalah (*resolution*), akurasi, efisiensi, serta komitmen dalam menuntaskan setiap tiket keluhan.
4.  🔴 **Gradasi Warna Crimson Telkom University (`#8c1515`)**: Menjaga keselarasan branding resmi kampus yang mencerminkan semangat profesionalisme, dedikasi, dan inovasi.

---

## 🎨 Sistem Warna (*Color System*)

Gunakan variabel CSS Tailwind v4 berikut untuk warna yang konsisten:

### 1. Warna Utama & Kontrol (Light & Dark Mode)
| Elemen | Light Mode | Dark Mode | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Primary (Crimson)** | `#8c1515` | `#8c1515` | Tombol utama, branding, status aktif, dan aksen penting. |
| **Primary Foreground**| `#ffffff` | `#ffffff` | Warna teks di atas warna Primary. |
| **Background** | `oklch(1 0 0)` (Putih) | `oklch(0.145 0 0)` (Hitam pekat) | Background halaman utama. |
| **Foreground** | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Teks utama halaman. |
| **Card / Surface** | `oklch(1 0 0)` (Putih) | `oklch(0.145 0 0)` | Latar belakang box kartu / form. |
| **Muted / Secondary** | `oklch(0.97 0 0)` (Abu terang) | `oklch(0.269 0 0)` (Abu gelap) | Background tombol sekunder, border, atau hover state. |
| **Muted Foreground** | `oklch(0.556 0 0)` (Abu redup) | `oklch(0.708 0 0)` | Teks keterangan, deskripsi sub-halaman, atau placeholder. |
| **Border / Input** | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` | Garis batas komponen, input field, pembatas tabel. |

> [!NOTE]
> Pada desain mockup statis (*stitch exports*), warna primer terkadang menggunakan `#af101a` dan latar belakang menggunakan krem lembut `#fbf9f8`. Namun, pastikan kode implementasi menggunakan variabel CSS atau nilai di atas agar serasi dengan kelas dasar sistem.

### 2. Warna Status Tiket (Badges)
Gunakan kombinasi warna berikut untuk menampilkan status tiket secara konsisten:
*   🟢 **Open**: Background hijau muda (`bg-green-100` / `text-green-800`).
*   🟠 **In Progress**: Background oranye/jingga muda (`bg-orange-100` / `text-orange-800`).
*   🔵 **Resolved**: Background biru muda (`bg-blue-100` / `text-blue-800`).
*   ⚪ **Closed**: Background abu-abu muda (`bg-gray-100` / `text-gray-800`).
*   🚨 **SLA Overdue**: Animasi detak merah (`bg-red-100` / `text-red-700` dengan kelas `animate-pulse`) sebagai peringatan tiket tertunda > 24 jam.

---

## 🔤 Tipografi (*Typography*)
*   **Font Utama (Sans-serif)**: `'Instrument Sans'` (atau `'Public Sans'` sebagai alternatif fallback). Digunakan untuk teks umum, judul, tombol, dan form.
*   **Font Monospace**: `'JetBrains Mono'`. Digunakan khusus untuk nomor tiket (contoh: `BPA-2026-001`), kode, atau data log.
*   **Gaya Judul**: Judul utama halaman menggunakan ukuran besar dengan ketebalan tebal (`font-bold` atau `font-extrabold`) untuk memperkuat hierarki visual.

---

## 📐 Tata Letak & Spacing (*Layout & Grid*)
1.  **Header Utama (TopNavBar)**:
    *   Tinggi tetap 64px (`h-16`).
    *   Brand di pojok kiri (teks `BPA Ticketing` warna krimson dengan ukuran judul menengah).
    *   Tautan navigasi di tengah (Dashboard, Support, Knowledge Base).
    *   Foto profil melingkar (`w-10 h-10 rounded-full`) dan tombol Logout di pojok kanan.
2.  **Sistem Grid Dashboard**:
    *   Grid bento responsif: 1 kolom di mobile, 2 di tablet, dan 4 kolom di desktop (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`).
3.  **Halaman Form/Detail**:
    *   Maksimal lebar kontainer form adalah 768px (`max-w-3xl mx-auto w-full`).
    *   Menggunakan padding standar 24px (`p-6`).

---

## 🧱 Panduan Komponen UI (*UI Components*)

### 1. Kartu (Cards)
Kartu memiliki sudut yang sedikit membulat (`rounded-lg` atau radius `0.625rem`), border abu-abu tipis, tanpa bayangan tebal (hanya `shadow-sm` atau `shadow-none`).
*   **Hover state**: Saat di-hover, kartu harus memiliki transisi warna border yang halus menuju merah utama (`hover:border-primary/50 transition-colors`).

### 2. Tombol (Buttons)
*   **Primary Button**: Latar belakang `#8c1515` dengan teks putih (`bg-[#8c1515] text-white hover:bg-[#7a1212]`).
*   **Secondary/Outline Button**: Border abu-abu dengan latar transparan, teks abu gelap (`border border-border bg-transparent hover:bg-muted`).
*   **Border Radius**: Tombol form menggunakan `rounded-md` or `0.625rem`. Tombol pencarian menggunakan bentuk penuh kapsul (`rounded-full`).

### 3. Kolom Input (Forms)
*   Desain minimalis: border abu-abu tipis (`border-gray-300` / `oklch(0.922 0 0)`), bayangan fokus yang halus, tanpa outline tebal.
*   Editor deskripsi menggunakan editor Markdown visual (**SimpleMDE**) dengan tampilan minimalis.

---

## 💻 Contoh Snippet Kode (Tailwind CSS)

Berikut adalah beberapa contoh kode UI untuk mereplikasi komponen utama:

### A. Tombol Utama (Primary Button)
```html
<button class="bg-[#8c1515] hover:bg-[#7a1212] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm">
    Kirim Tiket
</button>
```

### B. Badge Status Tiket
```html
<!-- Open Status -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
    Open
</span>

<!-- In Progress Status -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
    In Progress
</span>
```

### C. Kartu Menu / Layanan (Interactive Service Card)
```html
<div class="bg-card border border-border rounded-xl p-6 flex flex-col items-start gap-4 hover:border-[#8c1515]/50 transition-all cursor-pointer group">
    <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-[#8c1515] group-hover:bg-[#8c1515] group-hover:text-white transition-colors">
        <!-- Icon goes here -->
    </div>
    <div class="flex flex-col gap-1">
        <h3 class="font-bold text-lg text-foreground group-hover:text-[#8c1515] transition-colors">Dukungan IT</h3>
        <p class="text-sm text-muted-foreground">Laporan masalah jaringan, perangkat keras, atau perangkat lunak.</p>
    </div>
</div>
```
