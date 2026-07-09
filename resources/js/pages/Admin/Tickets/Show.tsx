import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes/admin';
import { status, reply } from '@/routes/admin/tickets';

export default function Show({ ticket }: { ticket: any }) {
    
    const { data: statusData, setData: setStatusData, post: postStatus, processing: processingStatus } = useForm({
        status: ticket.status,
    });

    const { data: replyData, setData: setReplyData, post: postReply, processing: processingReply, reset: resetReply } = useForm({
        message: '',
        is_internal: false,
    });

    const updateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        postStatus(status({ ticket: ticket.ticket_number }).url);
    };

    const sendReply = (e: React.FormEvent) => {
        e.preventDefault();
        postReply(reply({ ticket: ticket.ticket_number }).url, {
            onSuccess: () => resetReply('message'),
        });
    };

    return (
        <>
            <Head title={`Admin Ticket ${ticket.ticket_number}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <Link href={dashboard().url} className="text-sm text-muted-foreground hover:underline">
                    ← Kembali ke Dashboard
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">Ticket: {ticket.ticket_number}</h1>
                        <p className="text-muted-foreground">Oleh: {ticket.user?.name} ({ticket.user?.nim_nip})</p>
                    </div>
                    
                    <form onSubmit={updateStatus} className="flex gap-2 items-center">
                        <Select value={statusData.status} onValueChange={(v) => setStatusData('status', v)}>
                            <SelectTrigger className="w-37.5">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail pertanyaan</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <p><span className="text-muted-foreground">Kategori:</span> {ticket.category}</p>
                                <p><span className="text-muted-foreground">Dibuat:</span> {new Date(ticket.created_at).toLocaleString()}</p>
                                <div className="mt-4 p-4 bg-muted rounded-md whitespace-pre-wrap text-base">
                                    {ticket.description}
                                </div>
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
                                            <div className="whitespace-pre-wrap mt-2">
                                                {reply.message}
                                            </div>
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
                                    <Textarea
                                        required
                                        value={replyData.message}
                                        onChange={e => setReplyData('message', e.target.value)}
                                        placeholder="Ketik pesan..."
                                        rows={4}
                                    />
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
                    </div>
                </div>
            </div>
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
