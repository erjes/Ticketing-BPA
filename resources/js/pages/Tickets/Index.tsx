import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { show } from '@/routes/tickets';
import { dashboard } from '@/routes';

export default function Index({ tickets }: { tickets: any[] }) {
    return (
        <>
            <Head title="Riwayat Ticket" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Riwayat Ticket Anda</h1>
                    <Link href={dashboard().url}>
                        <Button variant="outline">Kembali ke Dashboard</Button>
                    </Link>
                </div>

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
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Riwayat Ticket',
            href: '/tickets',
        }
    ],
};
