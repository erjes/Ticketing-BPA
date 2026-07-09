import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { create, show } from '@/routes/tickets';

const categories = [
    'Data Sertifikasi Dosen',
    'Data Mahasiswa',
    'Program Magang Berdampak',
    'Data Kerjasama'
];

export default function Dashboard({ tickets }: { tickets: any[] }) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Halo, {auth.user.name} 👋</h1>
                        <p className="text-muted-foreground">Silakan pilih kategori untuk mengirim pertanyaan ke BPA.</p>
                    </div>
                    <Link href={create().url}>
                        <Button>Buat Ticket</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <Card key={i} className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-primary text-lg">{cat}</CardTitle>
                                <CardDescription>Pilih kategori ini</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={create({ query: { category: cat } }).url}>
                                    <Button variant="outline" className="w-full">Buat Ticket</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Riwayat Ticket Anda</h2>
                    {tickets && tickets.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {tickets.map((ticket: any) => (
                                <Card key={ticket.id}>
                                    <div className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-semibold text-lg">{ticket.ticket_number}</p>
                                            <p className="text-sm text-muted-foreground">{ticket.category} &middot; {new Date(ticket.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                                ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                            <Link href={show({ ticket: ticket.ticket_number }).url}>
                                                <Button variant="ghost" size="sm">Lihat riwayat →</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center text-muted-foreground">
                            Belum ada ticket yang dibuat.
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
