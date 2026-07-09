import { Head, useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { logout } from '@/routes';
import { role } from '@/routes/superadmin/users';

export default function SuperAdminDashboard({ users }: { users: any[] }) {
    const { auth } = usePage().props as any;

    const UserRow = ({ user }: { user: any }) => {
        const { data, setData, post, processing } = useForm({
            role: user.role,
        });

        const updateRole = (e: React.FormEvent) => {
            e.preventDefault();
            post(role({ user: user.id }).url, { preserveScroll: true });
        };

        return (
            <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.nim_nip || '-'}</td>
                <td className="px-4 py-3">
                    <form onSubmit={updateRole} className="flex gap-2 items-center">
                        <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" variant="outline" size="sm" disabled={processing || data.role === user.role}>
                            Simpan
                        </Button>
                    </form>
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
                <div>
                    <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
                    <p className="text-muted-foreground">Ubah role pengguna (User, Admin, Super Admin).</p>
                </div>

                <Card>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Nama</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Email</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">NIM/NIP</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground">Role</th>
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
