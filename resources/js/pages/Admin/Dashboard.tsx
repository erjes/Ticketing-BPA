import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard({ stats }: { stats: any }) {
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

