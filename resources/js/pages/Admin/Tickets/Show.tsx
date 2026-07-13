import { Head, useForm, Link, usePage, router } from '@inertiajs/react';
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
        if (confirm('Apakah Anda yakin ingin menghapus ticket ini? Tindakan ini tidak dapat dibatalkan.')) {
            destroyTicket(`/admin/tickets/${ticket.ticket_number}`);
        }
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail pertanyaan</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <p><span className="text-muted-foreground">Kategori:</span> {ticket.category}</p>
                                <p><span className="text-muted-foreground">Subject:</span> <span className="font-semibold">{ticket.subject}</span></p>
                                <p><span className="text-muted-foreground">Dibuat:</span> {new Date(ticket.created_at).toLocaleString()}</p>
                                <div className="mt-4 p-4 bg-muted rounded-md text-base prose prose-sm max-w-none">
                                    <ReactMarkdown>{ticket.description}</ReactMarkdown>
                                </div>
                                {ticket.attachments && ticket.attachments.filter((f: any) => !f.ticket_reply_id).length > 0 && (
                                    <div className="mt-4 border-t pt-4">
                                        <h4 className="text-sm font-semibold mb-2">Lampiran Tiket:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {ticket.attachments.filter((f: any) => !f.ticket_reply_id).map((file: any) => (
                                                <button 
                                                    key={file.id} 
                                                    onClick={() => setPreviewFile(file)}
                                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-3 py-2 text-sm text-blue-600 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                    {file.file_name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {ticket.replies && ticket.replies.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-semibold">Riwayat Percakapan</h3>
                                {ticket.replies.map((reply: any) => (
                                    <Card key={reply.id} className={
                                        reply.is_internal ? 'border-yellow-200 bg-yellow-50/50' :
                                            (reply.user_id === ticket.user_id ? 'border-primary/20 bg-primary/5' : '')
                                    }>
                                        <CardContent className="p-4 flex flex-col gap-2">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span className="font-semibold text-foreground">
                                                    {reply.user?.name} {reply.is_internal ? '(Catatan Internal)' : (reply.user?.is_admin ? '(Admin)' : '')}
                                                </span>
                                                <span>{new Date(reply.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="mt-2 prose prose-sm max-w-none">
                                                <ReactMarkdown>{reply.message}</ReactMarkdown>
                                            </div>
                                            {reply.attachments && reply.attachments.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200/50">
                                                    <h5 className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-wider">Lampiran:</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {reply.attachments.map((file: any) => (
                                                            <button 
                                                                key={file.id} 
                                                                onClick={() => setPreviewFile(file)}
                                                                className="flex items-center gap-1.5 bg-white/60 hover:bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-blue-600 transition-colors shadow-sm"
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Kirim Balasan / Catatan Internal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={sendReply} className="flex flex-col gap-4">
                                    <div className="grid gap-2">
                                        <SimpleMdeReact 
                                            value={replyData.message} 
                                            onChange={(val) => setReplyData('message', val)}
                                            options={{
                                                spellChecker: false,
                                                status: ['lines', 'words'],
                                                placeholder: "Ketik pesan balasan...",
                                            }}
                                        />
                                        {replyErrors.message && <p className="text-sm text-destructive">{replyErrors.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="flex items-center gap-2 border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                            <span className="text-sm text-gray-600 font-medium">Tambahkan Lampiran...</span>
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
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {replyData.attachments.map((file, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                                                        {file.name}
                                                    </span>
                                                ))}
                                                <button 
                                                    type="button" 
                                                    onClick={() => setReplyData('attachments', [])}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Hapus Semua
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={replyData.is_internal}
                                                onChange={e => setReplyData('is_internal', e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                            <span className="text-sm font-medium">Tandai sebagai Catatan Internal (User tidak bisa melihat ini)</span>
                                        </label>
                                        <Button type="submit" disabled={processingReply}>Kirim Pesan</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        {ticket.rating !== null && (
                            <Card className="mb-4 border-yellow-200 bg-yellow-50/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold text-yellow-800">Ulasan Kepuasan Pengguna</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3 text-sm">
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
                                        <span className="ml-2 font-semibold text-muted-foreground">{ticket.rating} / 5</span>
                                    </div>
                                    {ticket.feedback && (
                                        <div className="p-3 bg-white rounded border text-xs text-gray-700 italic">
                                            "{ticket.feedback}"
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pengirim</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Nama Lengkap</span>
                                    <span className="font-medium">{ticket.user?.name}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Email</span>
                                    <span className="font-medium">{ticket.user?.email}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">NIM/NIP</span>
                                    <span className="font-medium">{ticket.user?.nim_nip}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Status</span>
                                    <span className="font-medium">{ticket.user?.status}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Prodi/Unit</span>
                                    <span className="font-medium">{ticket.user?.prodi_unit}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Penanggung Jawab</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 text-sm">
                                {ticket.admin ? (
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Ditugaskan Kepada</span>
                                        <span className="font-semibold text-foreground">{ticket.admin.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-muted-foreground italic text-xs">Belum ada admin yang ditugaskan.</span>
                                        <Button
                                            onClick={() => router.post(`/admin/tickets/${ticket.ticket_number}/claim`, {}, { preserveScroll: true })}
                                            className="w-full bg-[#8b1a1a] hover:bg-[#7a1212] text-white text-xs font-semibold py-1.5"
                                            size="sm"
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
