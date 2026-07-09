import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { store } from '@/routes/onboarding';

export default function Onboarding() {
    const { data, setData, post, processing, errors } = useForm({
        nim_nip: '',
        status: '',
        prodi_unit: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    return (
        <div className="flex flex-col gap-6">
            <Head title="Lengkapi Data Diri" />

            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Lengkapi Data Diri</h1>
                <p className="text-sm text-muted-foreground">Silakan lengkapi identitas Anda sebelum membuat ticket.</p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nim_nip">NIM / NIP</Label>
                        <Input
                            id="nim_nip"
                            type="text"
                            required
                            autoFocus
                            value={data.nim_nip}
                            onChange={(e) => setData('nim_nip', e.target.value)}
                        />
                        {errors.nim_nip && <p className="text-sm text-destructive">{errors.nim_nip}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={(value) => setData('status', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                                <SelectItem value="Dosen">Dosen</SelectItem>
                                <SelectItem value="Pegawai">Pegawai</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="prodi_unit">Prodi / Unit</Label>
                        <Input
                            id="prodi_unit"
                            type="text"
                            required
                            value={data.prodi_unit}
                            onChange={(e) => setData('prodi_unit', e.target.value)}
                        />
                        {errors.prodi_unit && <p className="text-sm text-destructive">{errors.prodi_unit}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        Simpan & Lanjut
                    </Button>
                </div>
            </form>
        </div>
    );
}
