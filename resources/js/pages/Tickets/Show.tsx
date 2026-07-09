import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { create, reply } from '@/routes/tickets';

export default function Show({ ticket }: { ticket: any }) {
    const { auth } = usePage().props as any;
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(reply({ ticket: ticket.ticket_number }).url, {
            onSuccess: () => reset('message'),
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
                                <div className="mt-4 p-4 bg-muted rounded-md whitespace-pre-wrap">
                                    {ticket.description}
                                </div>
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
                                <CardTitle>Kirim Balasan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="flex flex-col gap-4">
                                    <Textarea
                                        required
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        placeholder="Tulis pesan..."
                                        rows={4}
                                    />
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
