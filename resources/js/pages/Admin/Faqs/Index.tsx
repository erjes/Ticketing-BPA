import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
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
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'FAQ ini akan dihapus secara permanen dari daftar tanya-jawab umum.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8c1515',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                destroyFaq(`/admin/faqs/${id}`, {
                    onStart: () => {
                        Swal.fire({
                            title: 'Menghapus FAQ',
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
                            text: 'FAQ telah berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#8c1515',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Gagal',
                            text: 'Gagal menghapus FAQ.',
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
            <Head title="Manajemen FAQ - Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full"></div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manajemen FAQ</h1>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Kelola pertanyaan umum (FAQ) bantuan untuk User.</p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto rounded-xl px-6 font-bold shadow-md hover:shadow-lg transition-all bg-[#8c1515] hover:bg-[#7a1212] active:scale-[0.98]">
                                Tambah FAQ
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Tambah FAQ Baru</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-5 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pertanyaan</Label>
                                    <Input
                                        required
                                        value={createData.question}
                                        onChange={e => setCreateData('question', e.target.value)}
                                        placeholder="Contoh: Bagaimana cara reset password?"
                                        className="rounded-xl h-11"
                                    />
                                    {createErrors.question && <p className="text-sm text-destructive font-medium">{createErrors.question}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategori Tiket Terkait (Opsional)</Label>
                                    <Select value={createData.category} onValueChange={v => setCreateData('category', v)}>
                                        <SelectTrigger className="bg-card rounded-xl h-11">
                                            <SelectValue placeholder="Pilih Kategori..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {categories.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createErrors.category && <p className="text-sm text-destructive font-medium">{createErrors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jawaban</Label>
                                    <Textarea
                                        required
                                        value={createData.answer}
                                        onChange={e => setCreateData('answer', e.target.value)}
                                        placeholder="Tuliskan jawaban penjelasan di sini..."
                                        rows={6}
                                        className="rounded-xl resize-none"
                                    />
                                    {createErrors.answer && <p className="text-sm text-destructive font-medium">{createErrors.answer}</p>}
                                </div>
                                <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={createData.is_published}
                                        onChange={e => setCreateData('is_published', e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                    />
                                    <Label htmlFor="is_published" className="cursor-pointer text-sm font-semibold text-foreground">Terbitkan FAQ langsung</Label>
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
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-muted/40 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-16">No</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Pertanyaan & Jawaban</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-48">Kategori</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-32">Status</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-40 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {faqs && faqs.length > 0 ? faqs.map((faq, idx) => (
                                <tr key={faq.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-muted-foreground">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-foreground text-sm">{faq.question}</div>
                                        <div className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed max-w-xl font-medium">{faq.answer}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2.5 py-1 bg-muted/50 border border-border rounded-lg text-xs font-semibold text-foreground">
                                            {faq.category || 'Umum'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${faq.is_published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                            {faq.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold" onClick={() => openEdit(faq)}>Edit</Button>
                                            <Button variant="ghost" size="sm" className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors text-xs font-bold" onClick={() => handleDelete(faq.id)} disabled={processingDestroy}>Hapus</Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="bg-muted p-3 rounded-full text-muted-foreground/60">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                            </div>
                                            <p className="text-sm font-semibold mt-2">Tidak Ada FAQ</p>
                                            <p className="text-xs text-muted-foreground">Silakan tambah FAQ baru untuk membantu pengguna.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </Card>

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
