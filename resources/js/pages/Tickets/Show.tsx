import { Head, useForm, Link, usePage } from '@inertiajs/react';
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

export default function Show({ ticket }: { ticket: any }) {
    const { auth } = usePage().props as any;
    const [previewFile, setPreviewFile] = useState<any>(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        attachments: [] as File[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(reply({ ticket: ticket.ticket_number }).url, {
            forceFormData: true,
            onSuccess: () => reset('message', 'attachments'),
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
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl text-primary mb-2">Ticket berhasil dibuat</CardTitle>
                                        <CardDescription className="text-base text-foreground">
                                            Nomor ticket: <span className="font-semibold">{ticket.ticket_number}</span>
                                        </CardDescription>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                        ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                        ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            </CardHeader>
                            {ticket.status === 'Open' && (
                                <CardContent>
                                    <p className="text-muted-foreground">Admin BPA akan meninjau pertanyaan Anda.</p>
                                </CardContent>
                            )}
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Detail pertanyaan</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <p><span className="text-muted-foreground">Kategori:</span> {ticket.category}</p>
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
                                <h3 className="text-lg font-semibold">Balasan</h3>
                                {ticket.replies.map((reply: any) => (
                                    <Card key={reply.id} className={reply.user_id !== auth.user.id ? 'border-primary/20 bg-primary/5' : ''}>
                                        <CardContent className="p-4 flex flex-col gap-2">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span className="font-semibold text-foreground">{reply.user?.name} {reply.user?.is_admin ? '(Admin BPA)' : ''}</span>
                                                <span>{new Date(reply.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="prose prose-sm max-w-none mt-2">
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
                                <CardTitle>Kirim Balasan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="flex flex-col gap-4">
                                    <div className="grid gap-2">
                                        <SimpleMdeReact 
                                            value={data.message} 
                                            onChange={(val) => setData('message', val)}
                                            options={{
                                                spellChecker: false,
                                                status: ['lines', 'words'],
                                                placeholder: "Tulis pesan balasan...",
                                            }}
                                        />
                                        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
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
                                                        setData('attachments', Array.from(e.target.files));
                                                    }
                                                }}
                                                accept=".jpg,.gif,.jpeg,.png,.pdf,.doc,.docx,.zip"
                                            />
                                        </label>
                                        {data.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {data.attachments.map((file, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                                                        {file.name}
                                                    </span>
                                                ))}
                                                <button 
                                                    type="button" 
                                                    onClick={() => setData('attachments', [])}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Hapus Semua
                                                </button>
                                            </div>
                                        )}
                                        {errors.attachments && <p className="text-sm text-destructive">{errors.attachments}</p>}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>Kirim Pesan</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Riwayat status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                                            {new Date(ticket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="text-sm">Ticket dibuat</div>
                                    </div>
                                    {/* Simplified history logic: if open, show waiting admin. */}
                                    {ticket.status === 'Open' && (
                                        <div className="flex gap-4">
                                            <div className="text-sm text-muted-foreground">--:--</div>
                                            <div className="text-sm text-muted-foreground">Menunggu admin</div>
                                        </div>
                                    )}
                                    {ticket.status !== 'Open' && (
                                        <div className="flex gap-4">
                                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                                                {new Date(ticket.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                            <div className="text-sm">Status: {ticket.status}</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="mt-6 flex justify-center">
                            <Link href={create().url}>
                                <Button variant="outline" className="w-full">Buat Ticket Baru</Button>
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
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Detail Ticket',
            href: '#',
        },
    ],
};
