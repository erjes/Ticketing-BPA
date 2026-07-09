import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { store } from '@/routes/tickets';

export default function Create({ categories }: { categories: string[] }) {
    const { auth } = usePage().props as any;
    
    // Retrieve category from URL query param if present
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category') || '';

    const { data, setData, post, processing, errors } = useForm({
        category: initialCategory,
        subject: '',
        description: '',
        attachments: [] as File[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Buat Ticket Baru" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
                <Link href={dashboard().url} className="text-sm text-muted-foreground hover:underline">
                    ← Kembali ke Dashboard
                </Link>

                <Card className="rounded-none shadow-sm border-gray-200">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 p-4">
                        <CardTitle className="text-xl font-normal text-gray-800">Ticket Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            {/* Hidden category but visual indicator */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Kategori yang dipilih:</span>
                                <span className="px-2 py-1 bg-gray-100 rounded-md font-medium">{data.category || 'Belum dipilih'}</span>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</Label>
                                <Input 
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    required 
                                    className="border-gray-300 focus-visible:ring-gray-300"
                                />
                                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Message</Label>
                                <SimpleMdeReact 
                                    value={data.description} 
                                    onChange={(val) => setData('description', val)}
                                    options={{
                                        spellChecker: false,
                                        status: ['lines', 'words'],
                                    }}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="flex items-center gap-2 border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                    <span className="text-sm text-gray-600 font-medium">Add Attachments...</span>
                                    <input 
                                        type="file" 
                                        multiple 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setData('attachments', Array.from(e.target.files));
                                            }
                                        }}
                                        accept=".jpg,.gif,.jpeg,.png,.pdf,.doc,.docx,.zip"
                                    />
                                </label>
                                {data.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {data.attachments.map((file, i) => (
                                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                                                {file.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                    <span>Allowed File Extensions: .jpg, .gif, .jpeg, .png, .pdf, .doc, .docx, .zip (Max file size: 2048MB)</span>
                                </div>
                                {errors['attachments'] && <p className="text-sm text-destructive">{errors['attachments']}</p>}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="rounded-none shadow-sm border-gray-200 mt-4">
                    <CardContent className="p-6 flex items-center gap-4">
                        <Button 
                            onClick={submit} 
                            disabled={processing} 
                        >
                            Kirim Tiket
                        </Button>
                        <Link href={dashboard().url}>
                            <Button type="button" variant="outline" className="rounded-md px-6">
                                Cancel
                            </Button>
                        </Link>
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
