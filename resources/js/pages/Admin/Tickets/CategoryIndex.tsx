import { Head, Link, router } from '@inertiajs/react';
import { Award, GraduationCap, Briefcase, Handshake, Search, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CATEGORY_CONFIG = {
    'Data Sertifikasi Dosen': {
        description: 'Pengajuan dan verifikasi sertifikasi dosen BPA.',
        icon: Award,
    },
    'Data Mahasiswa': {
        description: 'Kelola data akademik dan status mahasiswa.',
        icon: GraduationCap,
    },
    'Program Magang Berdampak': {
        description: 'Layanan magang industri dan program berdampak.',
        icon: Briefcase,
    },
    'Data Kerjasama': {
        description: 'Administrasi dan dokumen kerjasama institusi.',
        icon: Handshake,
    },
};

export default function CategoryIndex({ category, tickets, filters }: { category: string, tickets: any[], filters: { search: string } }) {
    const [search, setSearch] = useState(filters.search || '');
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;

            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                '/admin/tickets/category',
                { category, search },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, category]);

    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || {
        description: 'Daftar ticket untuk kategori ini.',
        icon: Award,
    };
    const IconComponent = config.icon;

    return (
        <>
            <Head title={`Kategori: ${category}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-2xl w-14 h-14 flex items-center justify-center shadow-sm">
                                <IconComponent className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{category}</h1>
                                <p className="text-muted-foreground text-sm mt-1">{config.description}</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari ticket..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-10 w-full"
                            />
                        </div>
                    </div>
                </div>

                <Card className="border-muted shadow-sm rounded-2xl overflow-hidden mt-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-muted">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">No Ticket</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Pengirim</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">NIM/NIP</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Tanggal Dibuat</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-foreground">{ticket.ticket_number}</td>
                                        <td className="px-6 py-4 font-medium text-foreground">{ticket.user?.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{ticket.user?.nim_nip}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                ticket.status === 'Open' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900/30' :
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
                                {tickets.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <Search className="w-10 h-10 text-muted-foreground/40" />
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-semibold text-base text-foreground">Tidak ada ticket ditemukan</p>
                                                    <p className="text-sm">Tidak ada data ticket pada kategori ini {search && 'yang cocok dengan pencarian Anda'}.</p>
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
        </>
    );
}

CategoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Kategori Tiket',
            href: '#',
        },
    ],
};
