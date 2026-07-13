import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { create, show } from '@/routes/tickets';

export default function Dashboard({ categories }: { categories: string[] }) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Halo, {auth.user.name} 👋</h1>
                        <p className="text-muted-foreground mt-1">Silakan pilih kategori untuk mengirim pertanyaan ke BPA.</p>
                    </div>
                    <Link href={create().url} className="w-full md:w-auto">
                        <Button className="w-full md:w-auto">Buat Ticket</Button>
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
