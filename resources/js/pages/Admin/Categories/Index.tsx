import { Head, useForm } from '@inertiajs/react';
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
        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
            destroyCategory(destroy({ category: id }).url);
        }
    };

    return (
        <>
            <Head title="Manajemen Kategori - Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
                        <p className="text-muted-foreground mt-1">Atur opsi kategori untuk sistem ticketing.</p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">Tambah Kategori</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Kategori Baru</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nama Kategori</Label>
                                    <Input
                                        required
                                        value={createData.name}
                                        onChange={e => setCreateData('name', e.target.value)}
                                        placeholder="Contoh: IT Support"
                                    />
                                    {createErrors.name && <p className="text-sm text-red-500">{createErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Deskripsi</Label>
                                    <Textarea
                                        value={createData.description}
                                        onChange={e => setCreateData('description', e.target.value)}
                                        placeholder="Penjelasan singkat kategori ini"
                                        rows={3}
                                    />
                                    {createErrors.description && <p className="text-sm text-red-500">{createErrors.description}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
                                    <Button type="submit" disabled={processingCreate}>Simpan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-md border bg-white overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[500px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-700 w-16">No</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Nama Kategori</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 w-48 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {categories && categories.length > 0 ? categories.map((cat, idx) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium">
                                        <div>{cat.name}</div>
                                        {cat.description && <div className="text-xs text-muted-foreground mt-1 font-normal">{cat.description}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>Edit</Button>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(cat.id, cat.name)} disabled={processingDestroy}>Hapus</Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada kategori.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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
