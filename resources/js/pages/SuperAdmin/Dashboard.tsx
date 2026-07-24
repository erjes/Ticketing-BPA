import { Head, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Link } from '@inertiajs/react';
import { LogOut, Shield, Users, FileText, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: `Akun user "${user.name}" akan dihapus secara permanen beserta semua riwayat aktivitasnya.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#8c1515',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    // @ts-ignore
                    destroyUser(`/super-admin/users/${user.id}`, {
                        preserveScroll: true,
                        onStart: () => {
                            Swal.fire({
                                title: 'Menghapus User',
                                text: 'Mohon tunggu sebentar...',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                }
                            });
                        },
                        onSuccess: () => {
                            Swal.fire({
                                title: 'Berhasil!',
                                text: `User "${user.name}" telah berhasil dihapus.`,
                                icon: 'success',
                                confirmButtonColor: '#8c1515',
                            });
                        },
                        onError: () => {
                            Swal.fire({
                                title: 'Gagal',
                                text: 'Gagal menghapus user.',
                                icon: 'error',
                                confirmButtonColor: '#8c1515',
                            });
                        }
                    });
                }
            });
        };

        return (
            <tr className="hover:bg-muted/40 transition-colors border-b border-border last:border-0">
                <td className="px-5 py-4 font-bold text-foreground text-sm">{user.name}</td>
                <td className="px-5 py-4 text-muted-foreground text-xs font-medium break-all">{user.email}</td>
                <td className="px-5 py-4 text-foreground text-xs font-mono font-medium">{user.nim_nip || '-'}</td>
                <td className="px-5 py-4 text-foreground text-xs font-semibold capitalize">{user.status || '-'}</td>
                <td className="px-5 py-4 text-muted-foreground text-xs font-medium">{user.prodi_unit || '-'}</td>
                <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'super_admin' ? 'bg-red-50 text-red-700 dark:bg-red-950/20 border border-red-200/30' :
                        user.role === 'admin' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 border border-blue-200/30' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800'
                    }`}>
                        <Shield className="w-3 h-3" />
                        {user.role.replace('_', ' ')}
                    </span>
                </td>
                <td className="px-5 py-4">
                    <div className="flex gap-2 items-center">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="rounded-xl border-border hover:bg-primary/5 hover:text-primary transition-colors text-xs font-bold h-8 px-3"
                                >
                                    Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-2xl border border-border shadow-2xl p-6">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold text-foreground">Edit Pengguna: {user.name}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpdate} className="space-y-5 mt-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="name" className="text-xs font-bold text-foreground/80">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                            className="border-border rounded-lg h-10 focus:ring-primary/20 bg-white"
                                        />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="email" className="text-xs font-bold text-foreground/80">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                            className="border-border rounded-lg h-10 focus:ring-primary/20 bg-white"
                                        />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="nim_nip" className="text-xs font-bold text-foreground/80">NIM / NIP</Label>
                                        <Input
                                            id="nim_nip"
                                            value={data.nim_nip}
                                            onChange={e => setData('nim_nip', e.target.value)}
                                            className="border-border rounded-lg h-10 focus:ring-primary/20 bg-white"
                                        />
                                        {errors.nim_nip && <p className="text-xs text-destructive">{errors.nim_nip}</p>}
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="role" className="text-xs font-bold text-foreground/80">Hak Akses (Role)</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={val => setData('role', val)}
                                        >
                                            <SelectTrigger id="role" className="border-border rounded-lg h-10 bg-white">
                                                <SelectValue placeholder="Pilih Role" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg shadow-md">
                                                <SelectItem value="user" className="cursor-pointer">User / Dosen / Mahasiswa</SelectItem>
                                                <SelectItem value="admin" className="cursor-pointer">Admin BPA</SelectItem>
                                                <SelectItem value="super_admin" className="cursor-pointer">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                                    </div>
                                    <DialogFooter className="mt-6 gap-2">
                                        <Button type="button" variant="outline" className="rounded-lg h-10" onClick={() => setEditOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={processing} className="bg-primary hover:bg-[#7a1212] text-white rounded-lg h-10 px-6">
                                            Simpan Perubahan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={processingDelete || auth.user.id === user.id} 
                            onClick={handleDelete}
                            className="bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 border border-rose-200/30 rounded-xl text-xs font-bold h-8 px-3 transition-colors"
                        >
                            Hapus
                        </Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/30 dark:bg-[#09090b]">
            <Head title="Super Admin Dashboard" />
            
            {/* Elegant Header */}
            <header className="border-b border-border bg-white dark:bg-card shadow-sm">
                <div className="flex h-16 items-center px-6 justify-between max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 p-1 flex items-center justify-center border border-primary/10">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-sm tracking-wide text-foreground">Super Admin Center</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border">{auth.user.name}</span>
                        <Link href={logout().url} method="post" as="button">
                            <Button variant="ghost" size="icon" className="hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
                
                {/* Greeting / Page Title */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full"></div>
                            <h2 className="text-2xl font-extrabold tracking-tight">Manajemen Pengguna</h2>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Kelola data pengguna, hak akses, dan monitoring tingkat aktivitas.</p>
                    </div>
                    <Link href="/super-admin/activity-logs">
                        <Button variant="outline" className="rounded-xl text-xs font-semibold px-4 h-10 flex items-center gap-1.5 shadow-sm border-border hover:bg-muted transition-colors">
                            <FileText className="w-4 h-4 opacity-70" />
                            Log Aktivitas Sistem
                            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                        </Button>
                    </Link>
                </div>

                {/* Users Table Card */}
                <Card className="rounded-2xl shadow-sm border border-border overflow-hidden bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-muted/40 border-b border-border">
                                <tr>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Nama</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Email</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">NIM/NIP</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Prodi/Unit</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Role</th>
                                    <th className="px-5 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
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
