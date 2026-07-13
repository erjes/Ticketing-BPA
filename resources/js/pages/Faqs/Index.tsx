import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Index({ faqs, filters }: { faqs: any[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/faqs', { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const toggleFaq = (id: number) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <>
            <Head title="Pusat Bantuan & FAQ" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
                    ← Kembali ke Dashboard
                </Link>

                <div className="text-center py-6 flex flex-col items-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary">Pusat Bantuan & FAQ</h1>
                    <p className="text-muted-foreground mt-2 max-w-lg">Temukan jawaban atas pertanyaan umum seputar layanan BPA sebelum membuat tiket baru.</p>
                    
                    <form onSubmit={handleSearch} className="relative flex items-center bg-background rounded-full border shadow-md p-1 pl-4 mt-6 w-full max-w-md focus-within:border-primary transition-all">
                        <Search className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Cari solusi permasalahan Anda..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-0 outline-none ring-0 w-full placeholder:text-muted-foreground text-foreground h-9 text-sm focus:ring-0 focus-visible:ring-0"
                        />
                        <Button type="submit" size="sm" className="rounded-full px-5 bg-[#8b1a1a] hover:bg-[#7a1212] text-white">
                            Cari
                        </Button>
                    </form>
                </div>

                <div className="flex flex-col gap-4">
                    {faqs && faqs.length > 0 ? faqs.map((faq) => {
                        const isOpen = openFaqId === faq.id;
                        return (
                            <Card key={faq.id} className="overflow-hidden border border-gray-200/80 shadow-sm hover:shadow transition-shadow">
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full text-left px-6 py-4 flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col gap-1 pr-4">
                                        <span className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 rounded w-fit">
                                            {faq.category || 'Umum'}
                                        </span>
                                        <h3 className="font-bold text-gray-900 mt-1">{faq.question}</h3>
                                    </div>
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>
                                {isOpen && (
                                    <CardContent className="px-6 py-4 bg-white border-t border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {faq.answer}
                                    </CardContent>
                                )}
                            </Card>
                        );
                    }) : (
                        <div className="text-center py-16 bg-muted/20 border rounded-2xl">
                            <p className="font-semibold text-gray-800">Tidak ada FAQ yang cocok</p>
                            <p className="text-sm text-muted-foreground mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                            {filters.search && (
                                <Button variant="link" onClick={() => { setSearch(''); router.get('/faqs'); }} className="text-[#8b1a1a] mt-3">
                                    Lihat semua FAQ
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'FAQ',
            href: '/faqs',
        },
    ],
};
