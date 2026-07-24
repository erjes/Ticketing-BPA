import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { store } from '@/routes/tickets';

export default function Create({ categories }: { categories: string[] }) {
    const { auth } = usePage().props as any;
    
    // Retrieve category from URL query param if present
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category') || '';

    const { data, setData, post, processing, errors } = useForm({
        category: initialCategory,
        subject: '',
        description: '',
        attachments: [] as File[],
        
        // Custom fields (BPA Academic categories)
        detail_data: '',
        link_format_data: '',
        detail_tujuan: '',
        detail_dokumen_tujuan: '',
        detail_pertanyaan: '',
        posisi_pengaju: '',
        sudah_koordinasi: '',
        alasan_setting: '',
        upload_link_persyaratan: '',
        batas_waktu: '',
    });

    const isCustomCategory = [
        'Data & Informasi Kurikulum',
        'Monitoring & Evaluasi OBE',
        'Pengelolaan Kurikulum & Mata Kuliah',
        'Setting RPS & Komponennya',
        'Verifikasi & Dispensasi Akademik'
    ].includes(data.category);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(store().url, {
            forceFormData: true,
            onStart: () => {
                Swal.fire({
                    title: 'Mengirim Tiket Bantuan',
                    text: 'Mohon tunggu sebentar...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
            },
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Tiket bantuan Anda telah sukses dibuat.',
                    icon: 'success',
                    confirmButtonColor: '#8c1515',
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal Mengirim',
                    text: 'Silakan periksa kembali isian formulir Anda.',
                    icon: 'error',
                    confirmButtonColor: '#8c1515',
                });
            }
        });
    };

    return (
        <>
            <Head title="Buat Ticket Baru" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
                <Link 
                    href={dashboard().url} 
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Kembali ke Dashboard
                </Link>

                <Card className="rounded-2xl shadow-sm border border-border hover:border-primary/20 transition-all duration-300">
                    <CardHeader className="border-b border-border p-6 bg-muted/20">
                        <CardTitle className="text-xl font-bold text-foreground">Detail Tiket Baru</CardTitle>
                        <CardDescription>Lengkapi formulir di bawah ini untuk mengirimkan pertanyaan atau permintaan bantuan ke BPA.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            
                            {/* Category field */}
                            <div className="grid gap-2">
                                <Label htmlFor="category" className="text-sm font-semibold text-foreground/80">Kategori Layanan</Label>
                                <Select 
                                    value={data.category} 
                                    onValueChange={(val) => setData('category', val)}
                                >
                                    <SelectTrigger id="category" className="border-border focus:ring-primary/20 bg-white dark:bg-card h-10 rounded-lg">
                                        <SelectValue placeholder="Pilih Kategori Layanan" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg shadow-md">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="cursor-pointer">
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                            </div>
                            
                            {/* Subject field */}
                            <div className="grid gap-2">
                                <Label htmlFor="subject" className="text-sm font-semibold text-foreground/80">Subjek Tiket</Label>
                                <Input 
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    required 
                                    placeholder="Contoh: Kesalahan input nama matakuliah pada kurikulum 2026"
                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card h-10 rounded-lg"
                                />
                                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
                            </div>

                            {/* Render Custom Forms Dynamically based on selected Category */}
                            {isCustomCategory ? (
                                <div className="space-y-6 border-t pt-6 border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-5 bg-primary rounded-full"></div>
                                        <h3 className="font-bold text-foreground text-sm tracking-wide">Formulir Spesifik Kategori</h3>
                                    </div>
                                    
                                    {data.category === 'Data & Informasi Kurikulum' && (
                                        <div className="flex flex-col gap-5">
                                            <div className="grid gap-2">
                                                <Label htmlFor="detail_data" className="text-sm font-semibold text-foreground/80">
                                                    Detail Data (misal Prodi, Angkatan, Tahun Ajaran) <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="detail_data"
                                                    value={data.detail_data}
                                                    onChange={(e) => setData('detail_data', e.target.value)}
                                                    placeholder="Contoh: S1 Sistem Informasi, Angkatan 2023, Tahun Ajaran 2026/2027"
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card rounded-lg"
                                                    rows={4}
                                                />
                                                {errors.detail_data && <p className="text-xs text-destructive">{errors.detail_data}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="link_format_data" className="text-sm font-semibold text-foreground/80">
                                                    Link Format Data (berisi judul kolom dan contoh isian data) <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="link_format_data"
                                                    type="url"
                                                    value={data.link_format_data}
                                                    onChange={(e) => setData('link_format_data', e.target.value)}
                                                    placeholder="https://docs.google.com/spreadsheets/d/..."
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card h-10 rounded-lg"
                                                />
                                                {errors.link_format_data && <p className="text-xs text-destructive">{errors.link_format_data}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {data.category === 'Monitoring & Evaluasi OBE' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="detail_tujuan" className="text-sm font-semibold text-foreground/80">
                                                    Detail Pertanyaan/Permintaan/Kendala & Latar Belakang/Tujuan Keperluan <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="detail_tujuan"
                                                    value={data.detail_tujuan}
                                                    onChange={(e) => setData('detail_tujuan', e.target.value)}
                                                    placeholder="Jelaskan secara detail pertanyaan, permintaan, atau kendala Anda beserta latar belakang dan tujuannya."
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card rounded-lg"
                                                    rows={6}
                                                />
                                                {errors.detail_tujuan && <p className="text-xs text-destructive">{errors.detail_tujuan}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {data.category === 'Pengelolaan Kurikulum & Mata Kuliah' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="detail_dokumen_tujuan" className="text-sm font-semibold text-foreground/80">
                                                    Detail Pertanyaan/Permintaan/Kendala, Dokumen & Latar Belakang/Tujuan Keperluan <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="detail_dokumen_tujuan"
                                                    value={data.detail_dokumen_tujuan}
                                                    onChange={(e) => setData('detail_dokumen_tujuan', e.target.value)}
                                                    placeholder="Tuliskan pertanyaan, detail permintaan, dokumen yang dilampirkan, serta latar belakang dan tujuan keperluan."
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card rounded-lg"
                                                    rows={6}
                                                />
                                                {errors.detail_dokumen_tujuan && <p className="text-xs text-destructive">{errors.detail_dokumen_tujuan}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {data.category === 'Setting RPS & Komponennya' && (
                                        <div className="flex flex-col gap-5">
                                            {/* Info Banner */}
                                            <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 text-amber-950 dark:text-amber-300 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                                                <div className="bg-amber-100 dark:bg-amber-900/40 p-1.5 rounded-lg text-amber-600 dark:text-amber-400 mt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                </div>
                                                <div className="text-xs leading-relaxed">
                                                    <p className="font-bold text-amber-950 dark:text-amber-200 text-sm">Ketentuan Penting:</p>
                                                    <p className="mt-1 text-amber-900/80 dark:text-amber-300/85">Wajib menyertakan **daftar kode**, **nama MK**, dan **kelas MK** pada kolom detail pertanyaan atau sebagai berkas lampiran di bawah.</p>
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="posisi_pengaju" className="text-sm font-semibold text-foreground/80">
                                                    Posisi yang Mengajukan <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={data.posisi_pengaju}
                                                    onValueChange={(val) => setData('posisi_pengaju', val)}
                                                >
                                                    <SelectTrigger id="posisi_pengaju" className="border-border focus:ring-primary/20 bg-white dark:bg-card h-10 rounded-lg">
                                                        <SelectValue placeholder="Pilih Posisi Anda" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-lg shadow-md">
                                                        <SelectItem value="Kaprodi" className="cursor-pointer">Kaprodi</SelectItem>
                                                        <SelectItem value="Koordinator MK" className="cursor-pointer">Koordinator MK</SelectItem>
                                                        <SelectItem value="Dosen Pengampu" className="cursor-pointer">Dosen Pengampu</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.posisi_pengaju && <p className="text-xs text-destructive">{errors.posisi_pengaju}</p>}
                                            </div>

                                            {(data.posisi_pengaju === 'Dosen Pengampu' || data.posisi_pengaju === 'Kaprodi') && (
                                                <div className="grid gap-3 p-4 bg-muted/30 rounded-xl border border-border/80">
                                                    <Label className="text-sm font-semibold text-foreground/80">
                                                        Apakah Anda sudah berkoordinasi dengan Koordinator MK? <span className="text-destructive">*</span>
                                                    </Label>
                                                    <div className="flex gap-6 mt-1">
                                                        <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="sudah_koordinasi"
                                                                value="Ya"
                                                                checked={data.sudah_koordinasi === 'Ya'}
                                                                onChange={(e) => setData('sudah_koordinasi', e.target.value)}
                                                                className="w-4 h-4 text-primary focus:ring-primary/20 border-border"
                                                            />
                                                            Ya, sudah koordinasi
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="sudah_koordinasi"
                                                                value="Tidak"
                                                                checked={data.sudah_koordinasi === 'Tidak'}
                                                                onChange={(e) => setData('sudah_koordinasi', e.target.value)}
                                                                className="w-4 h-4 text-primary focus:ring-primary/20 border-border"
                                                            />
                                                            Belum koordinasi
                                                        </label>
                                                    </div>
                                                    {errors.sudah_koordinasi && <p className="text-xs text-destructive">{errors.sudah_koordinasi}</p>}
                                                </div>
                                            )}

                                            <div className="grid gap-2">
                                                <Label htmlFor="detail_pertanyaan" className="text-sm font-semibold text-foreground/80">
                                                    Detail Pertanyaan <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="detail_pertanyaan"
                                                    value={data.detail_pertanyaan}
                                                    onChange={(e) => setData('detail_pertanyaan', e.target.value)}
                                                    placeholder="Jelaskan detail pertanyaan atau komponen RPS yang ingin di-setting."
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card rounded-lg"
                                                    rows={4}
                                                />
                                                {errors.detail_pertanyaan && <p className="text-xs text-destructive">{errors.detail_pertanyaan}</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="alasan_setting" className="text-sm font-semibold text-foreground/80">
                                                    Alasan Mengajukan Setting <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="alasan_setting"
                                                    value={data.alasan_setting}
                                                    onChange={(e) => setData('alasan_setting', e.target.value)}
                                                    placeholder="Contoh: Perubahan kurikulum, pergantian koordinator MK, atau penyesuaian komponen."
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card rounded-lg"
                                                    rows={3}
                                                />
                                                {errors.alasan_setting && <p className="text-xs text-destructive">{errors.alasan_setting}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {data.category === 'Verifikasi & Dispensasi Akademik' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="detail_pertanyaan" className="text-sm font-semibold text-foreground/80">
                                                    Detail Pertanyaan <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="detail_pertanyaan"
                                                    value={data.detail_pertanyaan}
                                                    onChange={(e) => setData('detail_pertanyaan', e.target.value)}
                                                    placeholder="Jelaskan pengajuan verifikasi atau permohonan dispensasi akademik Anda secara rinci."
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card rounded-lg"
                                                    rows={4}
                                                />
                                                {errors.detail_pertanyaan && <p className="text-xs text-destructive">{errors.detail_pertanyaan}</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="upload_link_persyaratan" className="text-sm font-semibold text-foreground/80">
                                                    Link/Upload Daftar Data Sesuai Persyaratan <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="upload_link_persyaratan"
                                                    type="text"
                                                    value={data.upload_link_persyaratan}
                                                    onChange={(e) => setData('upload_link_persyaratan', e.target.value)}
                                                    placeholder="Tuliskan link berkas persyaratan (Drive/Dropbox/dll.) atau sebutkan nama berkas lampiran di bawah."
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card h-10 rounded-lg"
                                                />
                                                {errors.upload_link_persyaratan && <p className="text-xs text-destructive">{errors.upload_link_persyaratan}</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="batas_waktu" className="text-sm font-semibold text-foreground/80">
                                                    Batas Waktu Permintaan <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="batas_waktu"
                                                    type="date"
                                                    value={data.batas_waktu}
                                                    onChange={(e) => setData('batas_waktu', e.target.value)}
                                                    required
                                                    className="border-border focus-visible:ring-primary/20 bg-white dark:bg-card h-10 rounded-lg px-3"
                                                />
                                                {errors.batas_waktu && <p className="text-xs text-destructive">{errors.batas_waktu}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Default Textarea (SimpleMDE Editor) for general categories */
                                <div className="grid gap-2 border-t pt-6 border-border">
                                    <Label htmlFor="description" className="text-sm font-semibold text-foreground/80">Pesan Deskripsi</Label>
                                    <div className="border border-border rounded-xl overflow-hidden bg-white dark:bg-card">
                                        <SimpleMdeReact 
                                            value={data.description} 
                                            onChange={(val) => setData('description', val)}
                                            options={{
                                                spellChecker: false,
                                                status: ['lines', 'words'],
                                            }}
                                        />
                                    </div>
                                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                                </div>
                            )}

                            {/* Attachments Upload field */}
                            <div className="grid gap-2 border-t pt-6 border-border">
                                <Label className="text-sm font-semibold text-foreground/80">Lampiran Berkas (Opsional)</Label>
                                <label className="flex items-center gap-3 border border-dashed border-border rounded-xl p-4 cursor-pointer hover:bg-muted/30 hover:border-primary/40 transition-all bg-white dark:bg-card group">
                                    <div className="bg-muted p-2 rounded-lg text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm text-foreground font-semibold group-hover:text-primary transition-colors">Pilih dokumen untuk diunggah</span>
                                        <span className="text-xs text-muted-foreground mt-0.5">Mendukung multi-upload (Maks: 2GB per berkas)</span>
                                    </div>
                                    <input 
                                        type="file" 
                                        multiple 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setData('attachments', Array.from(e.target.files));
                                            }
                                        }}
                                        accept=".jpg,.gif,.jpeg,.png,.pdf,.doc,.docx,.zip"
                                    />
                                </label>
                                {data.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {data.attachments.map((file, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                {file.name}
                                                <span className="text-[10px] text-muted-foreground">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 bg-muted/40 p-2.5 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                    <span>Ekstensi yang diizinkan: `.jpg`, `.gif`, `.jpeg`, `.png`, `.pdf`, `.doc`, `.docx`, `.zip`</span>
                                </div>
                                {errors['attachments'] && <p className="text-xs text-destructive">{errors['attachments']}</p>}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Submit / Cancel Buttons */}
                <Card className="rounded-2xl shadow-sm border border-border">
                    <CardContent className="p-5 flex items-center justify-between">
                        <Link href={dashboard().url}>
                            <Button type="button" variant="outline" className="rounded-lg px-6 h-10 hover:bg-muted transition-colors">
                                Batalkan
                            </Button>
                        </Link>
                        <Button 
                            onClick={submit} 
                            disabled={processing}
                            className="bg-[#8c1515] hover:bg-[#7a1212] text-white rounded-lg px-8 h-10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Tiket'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Buat Ticket',
            href: '/tickets/create',
        },
    ],
};
