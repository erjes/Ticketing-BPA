import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Trash2, Eye } from 'lucide-react';

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
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full"></div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Daftar Ticket Masuk</h1>
                        </div>
                        {currentStatus ? (
                            <p className="text-xs text-muted-foreground mt-1">
                                Filter aktif: <span className="font-bold text-primary">{currentStatus}</span>
                                <Link href="/admin/tickets" className="ml-2 text-xs text-blue-600 hover:underline">
                                    (Hapus Filter)
                                </Link>
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground mt-1">Daftar seluruh laporan bantuan akademis mahasiswa & dosen yang masuk.</p>
                        )}
                    </div>
                    <Link href="/admin/dashboard" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto rounded-xl text-xs font-semibold px-4 h-9 shadow-sm border-border hover:bg-muted transition-colors">
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Table Container Card */}
                <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[700px]">
                            <thead className="bg-muted/40 border-b border-border">
                                <tr>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">No Ticket</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Pengirim</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Kategori</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tickets && tickets.length > 0 ? tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="font-mono font-bold text-sm text-primary tracking-wide">{ticket.ticket_number}</span>
                                                {isSlaOverdue(ticket) && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/30 border border-rose-200/30 animate-pulse">
                                                        ⚠️ SLA OVERDUE (&gt;24j)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground text-xs">{ticket.user?.name}</span>
                                                <span className="text-[10px] text-muted-foreground mt-0.5 break-all">{ticket.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs font-semibold text-muted-foreground">{ticket.category}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                ticket.status === 'Open' ? 'bg-green-50 text-green-700 dark:bg-green-950/20 border border-green-200/30' :
                                                ticket.status === 'In Progress' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 border border-orange-200/30' :
                                                ticket.status === 'Resolved' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 border border-blue-200/30' :
                                                'bg-gray-50 text-gray-700 dark:bg-gray-800'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link href={`/admin/tickets/${ticket.ticket_number}`}>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="rounded-lg text-primary hover:bg-primary/5 hover:text-primary transition-all text-xs font-bold gap-1 px-3 py-1.5 h-auto"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Detail
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2 py-4">
                                                <div className="bg-muted p-3 rounded-full text-muted-foreground/60">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                </div>
                                                <p className="text-sm font-semibold">Tidak Ada Tiket Masuk</p>
                                                <p className="text-xs text-muted-foreground">Saat ini tidak ada tiket bantuan yang terdaftar pada filter ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
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
