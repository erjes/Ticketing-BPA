import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function Index({ faqs, categories }: { faqs: any[], categories: string[] }) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editFaq, setEditFaq] = useState<any>(null);

    const { data: createData, setData: setCreateData, post: postCreate, processing: processingCreate, reset: resetCreate, errors: createErrors } = useForm({
        question: '',
        answer: '',
        category: '',
        is_published: true,
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: processingEdit, reset: resetEdit, errors: editErrors } = useForm({
        question: '',
        answer: '',
        category: '',
        is_published: true,
    });

    const { delete: destroyFaq, processing: processingDestroy } = useForm();

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        postCreate('/admin/faqs', {
            onSuccess: () => {
                setCreateOpen(false);
                resetCreate();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        putEdit(`/admin/faqs/${editFaq?.id}`, {
            onSuccess: () => {
                setEditFaq(null);
                resetEdit();
            },
        });
    };

    const openEdit = (faq: any) => {
        setEditFaq(faq);
        setEditData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category || '',
            is_published: faq.is_published,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
            destroyFaq(`/admin/faqs/${id}`);
        }
    };

    return (
        <>
            <Head title="Manajemen FAQ - Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen FAQ</h1>
                        <p className="text-muted-foreground mt-1">Kelola pertanyaan umum (FAQ) bantuan untuk User.</p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">Tambah FAQ</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Tambah FAQ Baru</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Pertanyaan</Label>
                                    <Input
                                        required
                                        value={createData.question}
                                        onChange={e => setCreateData('question', e.target.value)}
                                        placeholder="Contoh: Bagaimana cara reset password?"
                                    />
                                    {createErrors.question && <p className="text-sm text-red-500">{createErrors.question}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Kategori Tiket Terkait (Opsional)</Label>
                                    <Select value={createData.category} onValueChange={v => setCreateData('category', v)}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Pilih Kategori..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createErrors.category && <p className="text-sm text-red-500">{createErrors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Jawaban</Label>
                                    <Textarea
                                        required
                                        value={createData.answer}
                                        onChange={e => setCreateData('answer', e.target.value)}
                                        placeholder="Tuliskan jawaban penjelasan di sini..."
                                        rows={6}
                                    />
                                    {createErrors.answer && <p className="text-sm text-red-500">{createErrors.answer}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={createData.is_published}
                                        onChange={e => setCreateData('is_published', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="is_published" className="cursor-pointer">Terbitkan FAQ langsung</Label>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
                                    <Button type="submit" disabled={processingCreate}>Simpan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-700 w-16">No</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Pertanyaan & Jawaban</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Kategori</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 w-32">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 w-48 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {faqs && faqs.length > 0 ? faqs.map((faq, idx) => (
                                <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-gray-900">{faq.question}</div>
                                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{faq.answer}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                            {faq.category || 'Umum'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${faq.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {faq.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(faq)}>Edit</Button>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(faq.id)} disabled={processingDestroy}>Hapus</Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada FAQ.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>

                {/* Edit Dialog */}
                <Dialog open={!!editFaq} onOpenChange={(open) => !open && setEditFaq(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit FAQ</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Pertanyaan</Label>
                                <Input
                                    required
                                    value={editData.question}
                                    onChange={e => setEditData('question', e.target.value)}
                                />
                                {editErrors.question && <p className="text-sm text-red-500">{editErrors.question}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Kategori Tiket Terkait (Opsional)</Label>
                                <Select value={editData.category} onValueChange={v => setEditData('category', v)}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Pilih Kategori..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.category && <p className="text-sm text-red-500">{editErrors.category}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Jawaban</Label>
                                <Textarea
                                    required
                                    value={editData.answer}
                                    onChange={e => setEditData('answer', e.target.value)}
                                    rows={6}
                                />
                                {editErrors.answer && <p className="text-sm text-red-500">{editErrors.answer}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="edit_is_published"
                                    checked={editData.is_published}
                                    onChange={e => setEditData('is_published', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <Label htmlFor="edit_is_published" className="cursor-pointer">Terbitkan FAQ</Label>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditFaq(null)}>Batal</Button>
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
            title: 'Manajemen FAQ',
            href: '/admin/faqs',
        },
    ],
};
