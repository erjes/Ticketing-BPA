import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { store } from '@/routes/tickets';

const categories = [
    'Data Sertifikasi Dosen',
    'Data Mahasiswa',
    'Program Magang Berdampak',
    'Data Kerjasama'
];

export default function Create() {
    const { auth } = usePage().props as any;
    
    // Retrieve category from URL query param if present
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category') || '';

    const { data, setData, post, processing, errors } = useForm({
        category: initialCategory,
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    return (
        <>
            <Head title="Buat Ticket Baru" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
                <Link href={dashboard().url} className="text-sm text-muted-foreground hover:underline">
                    ← Kembali ke Dashboard
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle>Buat Ticket Baru</CardTitle>
                        <CardDescription>Pilih kategori dan jelaskan pertanyaan/masalah Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Nama</Label>
                                        <Input disabled value={auth.user.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>NIM/NIP</Label>
                                        <Input disabled value={auth.nim_nip} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">user
                                        <Label>Status</Label>
                                        <Input disabled value={auth.user.status} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Prodi / Unit</Label>
                                        <Input disabled value={auth.user.prodi_unit} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category">Kategori BPA</Label>
                                    <Select onValueChange={(value) => setData('category', value)} defaultValue={data.category} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Pertanyaan</Label>
                                    <Textarea
                                        id="description"
                                        required
                                        rows={6}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Tuliskan pertanyaan atau masalah Anda secara detail..."
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                <Button type="submit" className="w-full mt-2" disabled={processing}>
                                    Kirim Ticket
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Buat Ticket',
            href: '/tickets/create',
        },
    ],
};
