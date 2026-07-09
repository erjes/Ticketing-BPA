import { Head, Link, router, usePage } from '@inertiajs/react';
import { Award, Briefcase, GraduationCap, Handshake, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CATEGORIES_CONFIG = [
    {
        name: 'Data Sertifikasi Dosen',
        description: 'Pengajuan dan verifikasi sertifikasi dosen BPA.',
        icon: Award,
    },
    {
        name: 'Data Mahasiswa',
        description: 'Kelola data akademik dan status mahasiswa.',
        icon: GraduationCap,
    },
    {
        name: 'Program Magang Berdampak',
        description: 'Layanan magang industri dan program berdampak.',
        icon: Briefcase,
    },
    {
        name: 'Data Kerjasama',
        description: 'Administrasi dan dokumen kerjasama institusi.',
        icon: Handshake,
    },
];

export default function Dashboard({ stats, categoryCounts, searchResults, filters }: { stats: any, categoryCounts: Record<string, number>, searchResults: any[] | null, filters: { search: string } }) {
    const { auth } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/dashboard',
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-8 p-6">
                {/* Red Welcome Banner with Search */}
                <div className="bg-gradient-to-r from-[#8b1a1a] via-[#7a1212] to-[#6b0b0b] text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
                    <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2">
                            Halo, {auth.user?.name || 'Staff Baru'} <span className="animate-bounce">👋</span>
                        </h1>
                        <p className="text-white/80 text-sm mt-2 md:text-base font-medium">
                            Mau cari ticket apa hari ini?
                        </p>

                        <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-background rounded-full border border-transparent shadow-xl w-full max-w-xl mx-auto p-1.5 pl-5 mt-8 hover:shadow-2xl transition-shadow group">
                            <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0 group-hover:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari nomor ticket, kategori, atau deskripsi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-0 outline-none ring-0 w-full placeholder:text-muted-foreground text-foreground focus:ring-0 focus-visible:ring-0 h-10 pr-4 text-sm"
                            />
                            <Button type="submit" className="rounded-full px-6 bg-[#8b1a1a] hover:bg-[#7a1212] text-white font-semibold transition-colors duration-200">
                                Cari
                            </Button>
                        </form>
                    </div>
                </div>

                {/* 3 Offset Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full -mt-14 px-4 relative z-20">
                    <Card className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-extrabold text-rose-600 mb-2">
                            {stats.open + stats.in_progress}
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                            Total Tiket Aktif
                        </div>
                    </Card>
                    <Card className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-extrabold text-rose-600 mb-2">
                            4
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                            Kategori Tiket
                        </div>
                    </Card>
                    <Card className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-extrabold text-rose-600 mb-2">
                            {stats.open}
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                            Admin Pending
                        </div>
                    </Card>
                </div>

                {/* Search Results Table (Conditional) */}
                {searchResults !== null && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Hasil Pencarian untuk "{filters.search}"</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearch('');
                                    router.get('/admin/dashboard');
                                }}
                            >
                                Bersihkan Pencarian
                            </Button>
                        </div>
                        <Card className="border-muted shadow-sm rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 border-b border-muted">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">No Ticket</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Pengirim</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Kategori</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Tanggal Dibuat</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted">
                                        {searchResults.map((ticket: any) => (
                                            <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 font-bold text-foreground">{ticket.ticket_number}</td>
                                                <td className="px-6 py-4 font-medium text-foreground">{ticket.user?.name}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{ticket.category}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ticket.status === 'Open' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900/30' :
                                                        ticket.status === 'In Progress' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border-orange-200 dark:border-orange-900/30' :
                                                            ticket.status === 'Resolved' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/30' :
                                                                'bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400 border-gray-200 dark:border-gray-900/30'
                                                        }`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={`/admin/tickets/${ticket.ticket_number}`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                                            Lihat detail →
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {searchResults.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <Search className="w-10 h-10 text-muted-foreground/40" />
                                                        <div className="flex flex-col gap-1">
                                                            <p className="font-semibold text-base text-foreground">Tidak ada ticket ditemukan</p>
                                                            <p className="text-sm">Tidak ada ticket yang cocok dengan kata kunci pencarian Anda.</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Categories Cards */}
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-6">Kategori Tiket</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CATEGORIES_CONFIG.map((category) => {
                            const IconComponent = category.icon;
                            const count = categoryCounts[category.name] ?? 0;

                            return (
                                <Link
                                    href={`/admin/tickets/category?category=${encodeURIComponent(category.name)}`}
                                    key={category.name}
                                    className="group flex flex-col justify-between bg-card hover:bg-muted/30 border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                            {count} Tiket
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
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
