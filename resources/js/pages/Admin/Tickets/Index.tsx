import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const isSlaOverdue = (ticket: any) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') return false;
    const createdAt = new Date(ticket.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours > 24;
};

export default function Index({ tickets, currentStatus }: { tickets: any[], currentStatus?: string }) {
    return (
        <>
            <Head title="Daftar Ticket - Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Daftar Ticket</h1>
                        {currentStatus && (
                            <p className="text-muted-foreground mt-1">
                                Filter: <span className="font-semibold text-primary">{currentStatus}</span>
                                <Link href="/admin/tickets" className="ml-2 text-sm text-blue-500 hover:underline">
                                    (Hapus Filter)
                                </Link>
                            </p>
                        )}
                    </div>
                    <Link href="/admin/dashboard" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto">Kembali ke Dashboard</Button>
                    </Link>
                </div>

                <div className="rounded-md border bg-white overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-700">No Ticket</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Pengirim</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Kategori</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tickets && tickets.length > 0 ? tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span>{ticket.ticket_number}</span>
                                            {isSlaOverdue(ticket) && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse border border-red-200" title="SLA Overdue (>24 jam)">
                                                    ⚠️ SLA OVERDUE (&gt;24j)
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{ticket.user?.name}</td>
                                    <td className="px-4 py-3">{ticket.category}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                            ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/tickets/${ticket.ticket_number}`}>
                                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">Lihat detail →</Button>
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
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
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Daftar Ticket',
            href: '/admin/tickets',
        },
    ],
};
