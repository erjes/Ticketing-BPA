import { Head, useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { logout } from '@/routes';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SuperAdminDashboard({ users }: { users: any[] }) {
    const { auth } = usePage().props as any;

    const UserRow = ({ user }: { user: any }) => {
        const [editOpen, setEditOpen] = useState(false);
        const { data, setData, put, processing, errors } = useForm({
            name: user.name || '',
            email: user.email || '',
            nim_nip: user.nim_nip || '',
            status: user.status || 'Mahasiswa',
            prodi_unit: user.prodi_unit || '',
            role: user.role || 'user',
        });
        const { delete: destroyUser, processing: processingDelete } = useForm();

        const handleUpdate = (e: React.FormEvent) => {
            e.preventDefault();
            put(`/super-admin/users/${user.id}`, {
                preserveScroll: true,
                onSuccess: () => setEditOpen(false),
            });
        };

        const handleDelete = () => {
            if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}? Tindakan ini tidak dapat dibatalkan.`)) {
                // @ts-ignore
                destroyUser(`/super-admin/users/${user.id}`, { preserveScroll: true });
            }
        }

        return (
            <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.nim_nip || '-'}</td>
                <td className="px-4 py-3 capitalize">{user.status || '-'}</td>
                <td className="px-4 py-3">{user.prodi_unit || '-'}</td>
                <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {user.role.replace('_', ' ')}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Edit Pengguna: {user.name}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Nama</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="nim_nip">NIM/NIP</Label>
                                        <Input
                                            id="nim_nip"
                                            value={data.nim_nip}
                                            onChange={e => setData('nim_nip', e.target.value)}
                                        />
                                        {errors.nim_nip && <p className="text-xs text-destructive">{errors.nim_nip}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={v => setData('status', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                                                <SelectItem value="Dosen">Dosen</SelectItem>
                                                <SelectItem value="Pegawai">Pegawai</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="prodi_unit">Prodi/Unit</Label>
                                        <Input
                                            id="prodi_unit"
                                            value={data.prodi_unit}
                                            onChange={e => setData('prodi_unit', e.target.value)}
                                        />
                                        {errors.prodi_unit && <p className="text-xs text-destructive">{errors.prodi_unit}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="role">Role</Label>
                                        <Select value={data.role} onValueChange={v => setData('role', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                                    </div>
                                    <DialogFooter className="mt-6">
                                        <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            Simpan Perubahan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            disabled={processingDelete || auth.user.id === user.id} 
                            onClick={handleDelete}
                        >
                            Hapus
                        </Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Head title="Super Admin Dashboard" />
            
            <header className="border-b bg-card">
                <div className="flex h-16 items-center px-6 justify-between max-w-6xl mx-auto w-full">
                    <h1 className="text-xl font-bold text-primary">Super Admin Center</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{auth.user.name}</span>
                        <Link href={logout().url} method="post" as="button">
                            <Button variant="ghost" size="icon">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
                        <p className="text-muted-foreground">Kelola informasi dan tingkat akses pengguna.</p>
                    </div>
                    <Link href="/super-admin/activity-logs">
                        <Button variant="outline">Log Aktivitas</Button>
                    </Link>
                </div>

                <Card>
                    <div className="rounded-md border overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Nama</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Email</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">NIM/NIP</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Prodi/Unit</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Role</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => (
                                    <UserRow key={user.id} user={user} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
}

SuperAdminDashboard.layout = (page: any) => page;
