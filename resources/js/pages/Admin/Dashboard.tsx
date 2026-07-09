import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { show } from '@/routes/admin/tickets';

export default function Dashboard({ tickets, stats }: { tickets: any[], stats: any }) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard Ticketing BPA (Admin)</h1>
                    <p className="text-muted-foreground">Kelola ticket yang masuk dari mahasiswa dan pegawai.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Open</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{stats.open}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">{stats.in_progress}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Resolved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">{stats.resolved}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4">Daftar Ticket Terbaru</h2>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">No Ticket</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Pengirim</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Kategori</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3 font-medium">{ticket.ticket_number}</td>
                                        <td className="px-4 py-3">{ticket.user?.name}</td>
                                        <td className="px-4 py-3">{ticket.category}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                                ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link href={show({ ticket: ticket.ticket_number }).url}>
                                                <Button variant="ghost" size="sm">Lihat detail →</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {tickets.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            Tidak ada ticket yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
