import { Head, useForm, Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ReactMarkdown from 'react-markdown';

const isSlaOverdue = (ticket: any) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') return false;
    const createdAt = new Date(ticket.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours > 24;
};

export default function Show({ ticket, categories }: { ticket: any, categories: string[] }) {
    const { auth } = usePage().props as any;
    const { data: statusData, setData: setStatusData, post: postStatus, processing: processingStatus } = useForm({
        status: ticket.status,
    });

    const { data: replyData, setData: setReplyData, post: postReply, processing: processingReply, reset: resetReply, errors: replyErrors } = useForm({
        message: '',
        is_internal: false,
        attachments: [] as File[],
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: processingEdit } = useForm({
        category: ticket.category,
        message: ticket.description,
    });

    const { delete: destroyTicket, processing: processingDestroy } = useForm();
    const [editOpen, setEditOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<any>(null);

    const updateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        postStatus(`/admin/tickets/${ticket.ticket_number}/status`);
    };

    const sendReply = (e: React.FormEvent) => {
        e.preventDefault();
        postReply(`/admin/tickets/${ticket.ticket_number}/reply`, {
            forceFormData: true,
            onSuccess: () => resetReply('message', 'attachments'),
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        putEdit(`/admin/tickets/${ticket.ticket_number}`, {
            onSuccess: () => setEditOpen(false),
        });
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Tiket ini akan dihapus secara permanen dari sistem beserta seluruh lampiran dan riwayat komentar.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8c1515',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                destroyTicket(`/admin/tickets/${ticket.ticket_number}`, {
                    onStart: () => {
                        Swal.fire({
                            title: 'Menghapus Tiket',
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
                            text: 'Tiket bantuan telah berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#8c1515',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Gagal',
                            text: 'Gagal menghapus tiket bantuan.',
                            icon: 'error',
                            confirmButtonColor: '#8c1515',
                        });
                    }
                });
            }
        });
    };

    return (
        <>
            <Head title={`Admin Ticket ${ticket.ticket_number}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:underline">
                    ← Kembali ke Dashboard
                </Link>

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold">Ticket: {ticket.ticket_number}</h1>
                            {isSlaOverdue(ticket) && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-700 animate-pulse border border-red-200 shadow-sm" title="SLA Overdue (>24 jam)">
                                    <span>⚠️ SLA OVERDUE (&gt;24j)</span>
                                </span>
                            )}
                        </div>
                        <p className="text-muted-foreground">Oleh: {ticket.user?.name} ({ticket.user?.nim_nip})</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center w-full xl:w-auto">
                        <form onSubmit={updateStatus} className="flex gap-2 items-center w-full sm:w-auto mr-0 xl:mr-4">
                            <Select value={statusData.status} onValueChange={(v) => setStatusData('status', v)}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="outline" disabled={processingStatus}>Update Status</Button>
                        </form>

                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary">Edit Ticket</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Ticket</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submitEdit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Kategori</Label>
                                        <Select value={editData.category} onValueChange={(v) => setEditData('category', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories && categories.map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Deskripsi</Label>
                                        <Textarea
                                            required
                                            value={editData.message}
                                            onChange={e => setEditData('message', e.target.value)}
                                            rows={6}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                                        <Button type="submit" disabled={processingEdit}>Simpan Perubahan</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button variant="destructive" onClick={handleDelete} disabled={processingDestroy}>Hapus Ticket</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
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
                                <h3 className="text-lg font-bold text-foreground">Riwayat Percakapan</h3>
                                {ticket.replies.map((reply: any) => (
                                    <Card key={reply.id} className={`rounded-2xl transition-colors ${
                                        reply.is_internal ? 'border-amber-200 bg-amber-50/50 shadow-sm' :
                                            (reply.user_id === ticket.user_id ? 'border-primary/20 bg-primary/5 shadow-sm' : 'border-border bg-card shadow-xs')
                                    }`}>
                                        <CardContent className="p-5 flex flex-col gap-3">
                                            <div className="flex justify-between items-center text-sm text-muted-foreground border-b border-border/50 pb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                                        reply.is_internal ? 'bg-amber-600 text-white' : 
                                                        (reply.user_id === ticket.user_id ? 'bg-muted text-foreground' : 'bg-[#8c1515] text-white')
                                                    }`}>
                                                        {reply.user?.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-foreground">
                                                        {reply.user?.name} {reply.is_internal ? <span className="ml-1 text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">Catatan Internal</span> : (reply.user?.is_admin ? <span className="ml-1 text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Admin</span> : '')}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-medium bg-muted/50 px-2 py-1 rounded-md">{new Date(reply.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            </div>
                                            <div className="mt-1 prose prose-sm dark:prose-invert max-w-none text-foreground/90 font-medium">
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
                                <CardTitle className="text-lg font-bold text-foreground">Kirim Balasan / Catatan Internal</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={sendReply} className="flex flex-col gap-5">
                                    <div className="grid gap-2">
                                        <div className="rounded-xl overflow-hidden border border-border bg-card">
                                            <SimpleMdeReact 
                                                value={replyData.message} 
                                                onChange={(val) => setReplyData('message', val)}
                                                options={{
                                                    spellChecker: false,
                                                    status: ['lines', 'words'],
                                                    placeholder: "Ketik pesan balasan...",
                                                }}
                                            />
                                        </div>
                                        {replyErrors.message && <p className="text-sm text-destructive font-medium mt-1">{replyErrors.message}</p>}
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
                                                        setReplyData('attachments', Array.from(e.target.files));
                                                    }
                                                }}
                                                accept=".jpg,.gif,.jpeg,.png,.pdf,.doc,.docx,.zip"
                                            />
                                        </label>
                                        {replyData.attachments.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {replyData.attachments.map((file, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/10">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                        {file.name}
                                                    </span>
                                                ))}
                                                <button 
                                                    type="button" 
                                                    onClick={() => setReplyData('attachments', [])}
                                                    className="text-xs font-bold text-destructive hover:underline ml-2"
                                                >
                                                    Hapus Semua
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2 p-3 bg-muted/40 rounded-xl border border-border">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={replyData.is_internal}
                                                onChange={e => setReplyData('is_internal', e.target.checked)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                            />
                                            <span className="text-sm font-semibold text-foreground">Tandai sebagai Catatan Internal <span className="text-muted-foreground font-normal">(User tidak bisa melihat ini)</span></span>
                                        </label>
                                        <Button type="submit" disabled={processingReply} className="bg-[#8c1515] hover:bg-[#7a1212] text-white rounded-xl h-10 px-6 font-bold shadow-md transition-all active:scale-[0.98]">
                                            Kirim Pesan
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        {ticket.rating !== null && (
                            <Card className="mb-4 border-amber-200 bg-amber-50/50 rounded-2xl shadow-sm">
                                <CardHeader className="pb-3 bg-amber-100/50 border-b border-amber-200/50 rounded-t-2xl">
                                    <CardTitle className="text-base font-bold text-amber-900">Ulasan Kepuasan Pengguna</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3 p-5">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={ticket.rating >= star ? '#f59e0b' : 'none'}
                                                stroke="#f59e0b"
                                                strokeWidth="2.5"
                                                className="w-5 h-5 drop-shadow-sm"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                        <span className="ml-2 font-bold text-amber-900 bg-amber-200/50 px-2 py-0.5 rounded-md text-xs">{ticket.rating} / 5</span>
                                    </div>
                                    {ticket.feedback && (
                                        <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 text-sm text-amber-950 font-medium">
                                            "{ticket.feedback}"
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Card className="rounded-2xl shadow-sm border border-border">
                            <CardHeader className="bg-muted/10 border-b border-border p-5 rounded-t-2xl">
                                <CardTitle className="text-base font-bold text-foreground">Informasi Pengirim</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 p-5">
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Nama Lengkap</span>
                                    <span className="font-semibold text-sm text-foreground">{ticket.user?.name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Email</span>
                                    <span className="font-semibold text-sm text-foreground break-all">{ticket.user?.email}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">NIM/NIP</span>
                                    <span className="font-semibold text-sm text-foreground">{ticket.user?.nim_nip}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Status</span>
                                    <span className="font-semibold text-sm text-foreground">{ticket.user?.status}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Prodi/Unit</span>
                                    <span className="font-semibold text-sm text-foreground">{ticket.user?.prodi_unit}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-4 rounded-2xl shadow-sm border border-border sticky top-24">
                            <CardHeader className="bg-muted/10 border-b border-border p-5 rounded-t-2xl">
                                <CardTitle className="text-base font-bold text-foreground">Penanggung Jawab</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 p-5">
                                {ticket.admin ? (
                                    <div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Ditugaskan Kepada</span>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                                {ticket.admin.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-sm text-foreground">{ticket.admin.name}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <span className="text-muted-foreground font-medium text-xs bg-muted/50 p-2.5 rounded-lg border border-border">Belum ada admin yang ditugaskan.</span>
                                        <Button
                                            onClick={() => router.post(`/admin/tickets/${ticket.ticket_number}/claim`, {}, { preserveScroll: true })}
                                            className="w-full bg-[#8c1515] hover:bg-[#7a1212] text-white text-sm font-bold py-2 h-10 rounded-xl transition-all shadow-md active:scale-[0.98]"
                                        >
                                            Klaim Tiket Ini
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
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
                                    <a href={`/storage/${previewFile.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#8b1a1a] hover:bg-[#7a1212] transition-colors text-white rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm">
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
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Detail Ticket',
            href: '#',
        },
    ],
};
