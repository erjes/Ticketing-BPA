import { Head, useForm, Link, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { dashboard } from '@/routes';
import { create, reply } from '@/routes/tickets';
import { Label } from '@/components/ui/label';

const isSlaOverdue = (ticket: any) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') return false;
    const createdAt = new Date(ticket.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours > 24;
};

export default function Show({ ticket }: { ticket: any }) {
    const { auth } = usePage().props as any;
    const [previewFile, setPreviewFile] = useState<any>(null);
    const [hoveredStar, setHoveredStar] = useState(0);

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        attachments: [] as File[],
    });

    const { data: rateData, setData: setRateData, post: postRate, processing: processingRate } = useForm({
        rating: 0,
        feedback: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(reply({ ticket: ticket.ticket_number }).url, {
            forceFormData: true,
            onStart: () => {
                Swal.fire({
                    title: 'Mengirim Tanggapan',
                    text: 'Mohon tunggu sebentar...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
            },
            onSuccess: () => {
                reset('message', 'attachments');
                Swal.fire({
                    title: 'Terkirim!',
                    text: 'Tanggapan Anda berhasil ditambahkan.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengirim tanggapan.',
                    icon: 'error',
                    confirmButtonColor: '#8c1515',
                });
            }
        });
    };

    const handleRateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rateData.rating === 0) {
            Swal.fire({
                title: 'Rating Belum Dipilih',
                text: 'Silakan pilih rating bintang terlebih dahulu.',
                icon: 'warning',
                confirmButtonColor: '#8c1515',
            });
            return;
        }
        postRate(`/tickets/${ticket.ticket_number}/rate`, {
            onStart: () => {
                Swal.fire({
                    title: 'Mengirim Ulasan',
                    text: 'Mohon tunggu sebentar...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
            },
            onSuccess: () => {
                Swal.fire({
                    title: 'Terima Kasih!',
                    text: 'Ulasan Anda sangat berarti bagi peningkatan layanan kami.',
                    icon: 'success',
                    confirmButtonColor: '#8c1515',
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Gagal mengirimkan ulasan Anda.',
                    icon: 'error',
                    confirmButtonColor: '#8c1515',
                });
            }
        });
    };

    return (
        <>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <Link href={dashboard().url} className="text-sm text-muted-foreground hover:underline">
                    ← Kembali ke Dashboard
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card className={ticket.status === 'Open' ? 'border-green-200 bg-green-50/50' : ''}>
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div>
                                        <CardTitle className="text-2xl text-primary mb-2">Ticket berhasil dibuat</CardTitle>
                                        <CardDescription className="text-base text-foreground">
                                            Nomor ticket: <span className="font-semibold">{ticket.ticket_number}</span>
                                        </CardDescription>
                                    </div>
                                     <div className="flex flex-wrap gap-2 items-center">
                                         <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                             ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                             ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                                             'bg-gray-100 text-gray-800'
                                         }`}>
                                             {ticket.status}
                                         </span>
                                         {isSlaOverdue(ticket) && (
                                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-700 animate-pulse border border-red-200 shadow-sm" title="SLA Overdue (>24 jam)">
                                                 <span>⚠️ SLA OVERDUE (&gt;24j)</span>
                                             </span>
                                         )}
                                     </div>
                                 </div>
                             </CardHeader>
                            {ticket.status === 'Open' && (
                                <CardContent>
                                    <p className="text-muted-foreground">Admin BPA akan meninjau pertanyaan Anda.</p>
                                </CardContent>
                            )}
                        </Card>

                        {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                             ticket.rating === null ? (
                                 <Card className="border-yellow-200 bg-yellow-50/30">
                                     <CardHeader className="pb-2">
                                         <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                                             <span>⭐ Ulasan Kepuasan Layanan (CSAT)</span>
                                         </CardTitle>
                                         <CardDescription>Bagaimana penilaian Anda terhadap penanganan tiket ini?</CardDescription>
                                     </CardHeader>
                                     <CardContent className="pt-2">
                                         <form onSubmit={handleRateSubmit} className="space-y-4">
                                             <div className="flex items-center gap-2">
                                                 {[1, 2, 3, 4, 5].map((star) => (
                                                     <button
                                                         key={star}
                                                         type="button"
                                                         onClick={() => setRateData('rating', star)}
                                                         onMouseEnter={() => setHoveredStar(star)}
                                                         onMouseLeave={() => setHoveredStar(0)}
                                                         className="transition-transform duration-100 hover:scale-125 focus:outline-none"
                                                     >
                                                         <svg
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             viewBox="0 0 24 24"
                                                             fill={(hoveredStar || rateData.rating) >= star ? '#eab308' : 'none'}
                                                             stroke="#eab308"
                                                             strokeWidth="2"
                                                             className="w-8 h-8"
                                                         >
                                                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                         </svg>
                                                     </button>
                                                 ))}
                                             </div>
                                             <div className="space-y-1">
                                                 <Label htmlFor="feedback">Masukan / Kritik & Saran (Opsional)</Label>
                                                 <Textarea
                                                     id="feedback"
                                                     value={rateData.feedback}
                                                     onChange={e => setRateData('feedback', e.target.value)}
                                                     placeholder="Tulis masukan Anda di sini..."
                                                     className="bg-white border-yellow-200 focus-visible:ring-yellow-400"
                                                 />
                                             </div>
                                             <Button type="submit" disabled={processingRate} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                                 Kirim Ulasan
                                             </Button>
                                         </form>
                                     </CardContent>
                                 </Card>
                             ) : (
                                 <Card className="border-emerald-200 bg-emerald-50/20">
                                     <CardHeader className="pb-2">
                                         <CardTitle className="text-lg text-emerald-800">Ulasan Anda</CardTitle>
                                     </CardHeader>
                                     <CardContent className="space-y-2">
                                         <div className="flex items-center gap-1">
                                             {[1, 2, 3, 4, 5].map((star) => (
                                                 <svg
                                                     key={star}
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     viewBox="0 0 24 24"
                                                     fill={ticket.rating >= star ? '#eab308' : 'none'}
                                                     stroke="#eab308"
                                                     strokeWidth="2"
                                                     className="w-5 h-5"
                                                 >
                                                     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                 </svg>
                                             ))}
                                             <span className="ml-2 font-medium text-sm text-muted-foreground">{ticket.rating} dari 5 bintang</span>
                                         </div>
                                         {ticket.feedback && (
                                             <div className="p-3 bg-white rounded border border-emerald-100 text-sm">
                                                 <p className="font-semibold text-xs text-muted-foreground mb-1">Masukan:</p>
                                                 <p className="text-gray-700 italic">"{ticket.feedback}"</p>
                                             </div>
                                         )}
                                     </CardContent>
                                 </Card>
                             )
                         )}

                        <Card className="rounded-2xl shadow-sm border border-border hover:border-primary/10 transition-all duration-300">
                            <CardHeader className="bg-muted/10 border-b border-border p-6 rounded-t-2xl">
                                <CardTitle className="text-lg font-bold text-foreground">Detail Pertanyaan & Informasi Tiket</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 flex flex-col gap-6">
                                
                                {/* Structured Grid for Metadata */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-muted/30 p-5 rounded-2xl border border-border/80 shadow-xs">
                                    <div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kategori Layanan</span>
                                        <p className="font-semibold text-sm text-foreground mt-1.5">{ticket.category}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nomor Tiket</span>
                                        <p className="font-mono font-bold text-sm text-primary mt-1.5">{ticket.ticket_number}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Waktu Pembuatan</span>
                                        <p className="font-semibold text-sm text-foreground mt-1.5">
                                            {new Date(ticket.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Custom Form Display / General Description */}
                                <div className="space-y-4">
                                    {ticket.category === 'Data & Informasi Kurikulum' ? (
                                        <div className="space-y-5">
                                            <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Detail Data (Prodi, Angkatan, Tahun Ajaran)</h4>
                                                <p className="mt-2.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">{ticket.detail_data}</p>
                                            </div>
                                            {ticket.link_format_data && (
                                                <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Link Format Data</h4>
                                                    <p className="mt-2.5 text-sm">
                                                        <a href={ticket.link_format_data} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline font-semibold break-all">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                                            Buka Dokumen Format Data
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : ticket.category === 'Monitoring & Evaluasi OBE' ? (
                                        <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Detail Pertanyaan, Kendala & Tujuan Keperluan</h4>
                                            <p className="mt-2.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">{ticket.detail_tujuan}</p>
                                        </div>
                                    ) : ticket.category === 'Pengelolaan Kurikulum & Mata Kuliah' ? (
                                        <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Detail Pertanyaan, Dokumen & Latar Belakang/Tujuan Keperluan</h4>
                                            <p className="mt-2.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">{ticket.detail_dokumen_tujuan}</p>
                                        </div>
                                    ) : ticket.category === 'Setting RPS & Komponennya' ? (
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Posisi yang Mengajukan</h4>
                                                    <p className="mt-2.5 text-sm text-foreground font-semibold">{ticket.posisi_pengaju}</p>
                                                </div>
                                                {ticket.sudah_koordinasi && (
                                                    <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Koordinasi dengan Koordinator MK</h4>
                                                        <p className="mt-2.5 text-sm text-foreground font-semibold">
                                                            {ticket.sudah_koordinasi === 'Ya' ? '✅ Sudah Koordinasi' : '❌ Belum Koordinasi'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Detail Pertanyaan</h4>
                                                <p className="mt-2.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">{ticket.detail_pertanyaan}</p>
                                            </div>
                                            <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Alasan Mengajukan Setting</h4>
                                                <p className="mt-2.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">{ticket.alasan_setting}</p>
                                            </div>
                                        </div>
                                    ) : ticket.category === 'Verifikasi & Dispensasi Akademik' ? (
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Batas Waktu Permintaan</h4>
                                                    <p className="mt-2.5 text-sm text-foreground font-semibold">
                                                        {new Date(ticket.batas_waktu).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                                    </p>
                                                </div>
                                                {ticket.upload_link_persyaratan && (
                                                    <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Link/Daftar Data Sesuai Persyaratan</h4>
                                                        <p className="mt-2.5 text-sm">
                                                            {ticket.upload_link_persyaratan.startsWith('http') ? (
                                                                <a href={ticket.upload_link_persyaratan} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline font-semibold break-all">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                                                    Buka Tautan Persyaratan
                                                                </a>
                                                            ) : (
                                                                <span className="text-foreground font-semibold">{ticket.upload_link_persyaratan}</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Detail Pertanyaan</h4>
                                                <p className="mt-2.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">{ticket.detail_pertanyaan}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-5 bg-muted/30 rounded-2xl border border-border prose dark:prose-invert max-w-none">
                                            <ReactMarkdown>{ticket.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {/* Attachments */}
                                {ticket.attachments && ticket.attachments.filter((f: any) => !f.ticket_reply_id).length > 0 && (
                                    <div className="mt-2 border-t pt-6 border-border">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Lampiran Dokumen Utama</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {ticket.attachments.filter((f: any) => !f.ticket_reply_id).map((file: any) => (
                                                <button 
                                                    key={file.id} 
                                                    onClick={() => setPreviewFile(file)}
                                                    className="inline-flex items-center gap-2 bg-white dark:bg-card hover:bg-muted border border-border rounded-xl px-4 py-2.5 text-sm font-semibold text-primary transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                    {file.file_name}
                                                    <span className="text-[10px] text-muted-foreground">({(file.file_size / (1024 * 1024)).toFixed(2)} MB)</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {ticket.replies && ticket.replies.length > 0 && (
                            <div className="flex flex-col gap-4 mt-2">
                                <h3 className="text-lg font-bold text-foreground">Riwayat Tanggapan</h3>
                                {ticket.replies.map((reply: any) => (
                                    <Card key={reply.id} className={`rounded-2xl transition-colors ${reply.user_id !== auth.user.id ? 'border-primary/20 bg-primary/5 shadow-sm' : 'border-border bg-card shadow-xs'}`}>
                                        <CardContent className="p-5 flex flex-col gap-3">
                                            <div className="flex justify-between items-center text-sm text-muted-foreground border-b border-border/50 pb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${reply.user_id !== auth.user.id ? 'bg-[#8c1515] text-white' : 'bg-muted text-foreground'}`}>
                                                        {reply.user?.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-foreground">{reply.user?.name} {reply.user?.is_admin ? <span className="ml-1 text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Admin</span> : ''}</span>
                                                </div>
                                                <span className="text-xs font-medium bg-muted/50 px-2 py-1 rounded-md">{new Date(reply.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            </div>
                                            <div className="prose prose-sm dark:prose-invert max-w-none mt-1 text-foreground/90 font-medium">
                                                <ReactMarkdown>{reply.message}</ReactMarkdown>
                                            </div>
                                            {reply.attachments && reply.attachments.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-border/50">
                                                    <h5 className="text-xs font-bold mb-2 text-muted-foreground uppercase tracking-wider">Lampiran:</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {reply.attachments.map((file: any) => (
                                                            <button 
                                                                key={file.id} 
                                                                onClick={() => setPreviewFile(file)}
                                                                className="flex items-center gap-1.5 bg-white/80 dark:bg-card hover:bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-primary transition-all shadow-xs hover:scale-[1.02]"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                                {file.file_name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        <Card className="rounded-2xl shadow-sm border border-border mt-2">
                            <CardHeader className="bg-muted/10 border-b border-border p-6 rounded-t-2xl">
                                <CardTitle className="text-lg font-bold text-foreground">Kirim Balasan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    <div className="grid gap-2">
                                        <div className="rounded-xl overflow-hidden border border-border bg-card">
                                            <SimpleMdeReact 
                                                value={data.message} 
                                                onChange={(val) => setData('message', val)}
                                                options={{
                                                    spellChecker: false,
                                                    status: ['lines', 'words'],
                                                    placeholder: "Tulis pesan balasan Anda di sini...",
                                                }}
                                            />
                                        </div>
                                        {errors.message && <p className="text-sm text-destructive font-medium mt-1">{errors.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="flex items-center gap-3 border border-dashed border-border rounded-xl p-4 cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-all bg-card group">
                                            <div className="bg-muted p-2 rounded-lg text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-sm text-foreground font-semibold group-hover:text-primary transition-colors">Tambahkan Dokumen Lampiran</span>
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
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {data.attachments.map((file, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/10">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                        {file.name}
                                                    </span>
                                                ))}
                                                <button 
                                                    type="button" 
                                                    onClick={() => setData('attachments', [])}
                                                    className="text-xs font-bold text-destructive hover:underline ml-2"
                                                >
                                                    Hapus Semua
                                                </button>
                                            </div>
                                        )}
                                        {errors.attachments && <p className="text-sm text-destructive font-medium">{errors.attachments}</p>}
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <Button type="submit" disabled={processing} className="bg-[#8c1515] hover:bg-[#7a1212] text-white rounded-xl h-11 px-8 font-bold shadow-md transition-all active:scale-[0.98]">
                                            Kirim Tanggapan
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="rounded-2xl shadow-sm border border-border sticky top-24">
                            <CardHeader className="bg-muted/10 border-b border-border p-5 rounded-t-2xl">
                                <CardTitle className="text-base font-bold text-foreground">Riwayat Status</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="flex flex-col gap-6">
                                    <div className="flex gap-4 relative">
                                        <div className="absolute left-1.5 top-5 w-0.5 h-full bg-border -z-10"></div>
                                        <div className="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-card mt-1 shrink-0"></div>
                                        <div className="flex flex-col">
                                            <div className="text-xs font-bold text-foreground">Tiket Dibuat</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(ticket.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Simplified history logic: if open, show waiting admin. */}
                                    {ticket.status === 'Open' && (
                                        <div className="flex gap-4 relative">
                                            <div className="w-3.5 h-3.5 rounded-full bg-muted border-2 border-muted-foreground/30 ring-4 ring-card mt-1 shrink-0"></div>
                                            <div className="flex flex-col">
                                                <div className="text-xs font-bold text-muted-foreground">Menunggu Peninjauan Admin</div>
                                                <div className="text-xs text-muted-foreground/60 mt-0.5">Sedang dalam antrean...</div>
                                            </div>
                                        </div>
                                    )}
                                    {ticket.status !== 'Open' && (
                                        <div className="flex gap-4 relative">
                                            <div className={`w-3.5 h-3.5 rounded-full ring-4 ring-card mt-1 shrink-0 ${ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                            <div className="flex flex-col">
                                                <div className="text-xs font-bold text-foreground">Status: <span className={ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'text-emerald-600' : 'text-orange-600'}>{ticket.status}</span></div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    Pembaruan Terakhir: {new Date(ticket.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="mt-6">
                            <Link href={create().url} className="block">
                                <Button variant="outline" className="w-full rounded-xl h-11 font-bold border-border shadow-xs hover:bg-muted/50 transition-all text-foreground hover:text-primary">
                                    Buat Tiket Baru
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Dialog */}
            <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
                <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Preview Lampiran: {previewFile?.file_name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden relative bg-gray-100/50 rounded-md flex items-center justify-center p-2">
                        {previewFile && (
                            previewFile.file_path.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                <img src={`/storage/${previewFile.file_path}`} alt={previewFile.file_name} className="max-w-full max-h-full object-contain rounded" />
                            ) : previewFile.file_path.match(/\.(pdf)$/i) ? (
                                <iframe src={`/storage/${previewFile.file_path}`} className="w-full h-full border-0 rounded" title={previewFile.file_name} />
                            ) : (
                                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                    </div>
                                    <p className="text-muted-foreground font-medium mb-6">Preview langsung tidak tersedia untuk format file ini.</p>
                                    <a href={`/storage/${previewFile.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#8c1515] hover:bg-[#7a1212] transition-colors text-white rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm">
                                        Download / Buka File
                                    </a>
                                </div>
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Detail Ticket',
            href: '#',
        },
    ],
};
