import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard({ stats }: { stats: any }) {
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/tickets?status=Open" className="block hover:-translate-y-1 transition-transform">
                        <Card className="hover:border-primary/50 cursor-pointer h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Open</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">{stats.open}</div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/admin/tickets?status=In Progress" className="block hover:-translate-y-1 transition-transform">
                        <Card className="hover:border-primary/50 cursor-pointer h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-orange-600">{stats.in_progress}</div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/admin/tickets?status=Resolved" className="block hover:-translate-y-1 transition-transform">
                        <Card className="hover:border-primary/50 cursor-pointer h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Resolved</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600">{stats.resolved}</div>
                            </CardContent>
                        </Card>
                    </Link>
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

