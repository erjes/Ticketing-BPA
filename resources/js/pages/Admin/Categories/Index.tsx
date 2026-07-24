import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { store, update, destroy } from '@/routes/admin/categories';

export default function Index({ categories }: { categories: any[] }) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<any>(null);

    const { data: createData, setData: setCreateData, post: postCreate, processing: processingCreate, reset: resetCreate, errors: createErrors } = useForm({
        name: '',
        description: '',
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: processingEdit, reset: resetEdit, errors: editErrors } = useForm({
        name: '',
        description: '',
    });

    const { delete: destroyCategory, processing: processingDestroy } = useForm();

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        postCreate(store().url, {
            onSuccess: () => {
                setCreateOpen(false);
                resetCreate();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        putEdit(update({ category: editCategory?.id }).url, {
            onSuccess: () => {
                setEditCategory(null);
                resetEdit();
            },
        });
    };

    const openEdit = (category: any) => {
        setEditCategory(category);
        setEditData({
            name: category.name,
            description: category.description || '',
        });
    };

    const handleDelete = (id: number, name: string) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Kategori "${name}" akan dihapus secara permanen beserta semua data tiket di dalamnya.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8c1515',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                destroyCategory(destroy({ category: id }).url, {
                    onStart: () => {
                        Swal.fire({
                            title: 'Menghapus Kategori',
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
                            text: `Kategori "${name}" telah berhasil dihapus.`,
                            icon: 'success',
                            confirmButtonColor: '#8c1515',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Gagal',
                            text: 'Gagal menghapus kategori.',
                            icon: 'error',
                            confirmButtonColor: '#8c1515',
                        });
                    }
                });
            }
        });
    };

    return (
        <>
            <Head title="Manajemen Kategori - Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full"></div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Kategori</h1>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Atur opsi kategori untuk sistem ticketing.</p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto rounded-xl px-6 font-bold shadow-md hover:shadow-lg transition-all bg-[#8c1515] hover:bg-[#7a1212] active:scale-[0.98]">
                                Tambah Kategori
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Tambah Kategori Baru</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-5 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nama Kategori</Label>
                                    <Input
                                        required
                                        value={createData.name}
                                        onChange={e => setCreateData('name', e.target.value)}
                                        placeholder="Contoh: IT Support"
                                        className="rounded-xl h-11"
                                    />
                                    {createErrors.name && <p className="text-sm text-destructive font-medium">{createErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deskripsi</Label>
                                    <Textarea
                                        value={createData.description}
                                        onChange={e => setCreateData('description', e.target.value)}
                                        placeholder="Penjelasan singkat kategori ini"
                                        rows={3}
                                        className="rounded-xl resize-none"
                                    />
                                    {createErrors.description && <p className="text-sm text-destructive font-medium">{createErrors.description}</p>}
                                </div>
                                <DialogFooter className="gap-2 pt-2">
                                    <Button type="button" variant="outline" className="rounded-xl" onClick={() => setCreateOpen(false)}>Batal</Button>
                                    <Button type="submit" disabled={processingCreate} className="rounded-xl bg-[#8c1515] hover:bg-[#7a1212]">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[600px]">
                            <thead className="bg-muted/40 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-16">No</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Nama Kategori & Deskripsi</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-48 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {categories && categories.length > 0 ? categories.map((cat, idx) => (
                                    <tr key={cat.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-muted-foreground">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground text-sm">{cat.name}</div>
                                            {cat.description && <div className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed max-w-lg">{cat.description}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold" onClick={() => openEdit(cat)}>Edit</Button>
                                                <Button variant="ghost" size="sm" className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors text-xs font-bold" onClick={() => handleDelete(cat.id, cat.name)} disabled={processingDestroy}>Hapus</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="bg-muted p-3 rounded-full text-muted-foreground/60">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
                                                </div>
                                                <p className="text-sm font-semibold mt-2">Tidak Ada Kategori</p>
                                                <p className="text-xs text-muted-foreground">Silakan tambah kategori baru untuk sistem tiket.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={!!editCategory} onOpenChange={(open) => !open && setEditCategory(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Kategori</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Kategori</Label>
                                <Input
                                    required
                                    value={editData.name}
                                    onChange={e => setEditData('name', e.target.value)}
                                />
                                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    value={editData.description}
                                    onChange={e => setEditData('description', e.target.value)}
                                    rows={3}
                                />
                                {editErrors.description && <p className="text-sm text-red-500">{editErrors.description}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditCategory(null)}>Batal</Button>
                                <Button type="submit" disabled={processingEdit}>Simpan Perubahan</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Manajemen Kategori',
            href: '/admin/categories',
        },
    ],
};
