import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Index({ tickets, currentStatus }: { tickets: any[], currentStatus?: string }) {
    return (
        <>
            <Head title="Daftar Ticket - Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center mb-4">
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
                    <Link href="/admin/dashboard">
                        <Button variant="outline">Kembali ke Dashboard</Button>
                    </Link>
                </div>

                <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
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
                                    <td className="px-4 py-3 font-medium">{ticket.ticket_number}</td>
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
