import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#8c1515] via-[#7a1212] to-[#5a0d0d] p-10 md:p-14 text-white shadow-xl flex flex-col items-center justify-center text-center">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-white/20 blur-[120px] rounded-full mix-blend-overlay rotate-12" />
                        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[150%] bg-black/40 blur-[130px] rounded-full mix-blend-overlay -rotate-12" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center max-w-2xl">
                        <div className="mb-6 p-4 rounded-full bg-white/10 backdrop-blur-md shadow-inner ring-1 ring-white/20">
                            <LifeBuoy className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                            Pusat Bantuan & FAQ
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl font-medium mb-10 drop-shadow-sm max-w-xl leading-relaxed">
                            Temukan jawaban atas pertanyaan umum seputar layanan Sistem Ticketing BPA sebelum Anda membuat tiket baru.
                        </p>

                        <form onSubmit={handleSearch} className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-1.5 pl-5 rounded-full w-full max-w-lg transition-all focus-within:bg-white/15 focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/10">
                            <Search className="w-5 h-5 text-white/70 mr-2 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Ketik kata kunci atau permasalahan Anda..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-0 outline-none ring-0 w-full placeholder:text-white/60 text-white h-11 text-base font-medium focus:ring-0 focus-visible:ring-0"
                            />
                            <Button type="submit" size="sm" className="rounded-full px-6 h-11 bg-white text-[#8c1515] hover:bg-white/90 font-bold shadow-md transition-all active:scale-[0.98]">
                                Cari Solusi
                            </Button>
                        </form>
                    </div>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-5 mt-4">
                    {faqs && faqs.length > 0 ? faqs.map((faq) => {
                        const isOpen = openFaqId === faq.id;
                        return (
                            <Card 
                                key={faq.id} 
                                className={cn(
                                    "overflow-hidden border border-border/80 shadow-xs transition-all duration-300 rounded-2xl group",
                                    isOpen ? "ring-2 ring-[#8c1515]/20 shadow-md bg-card" : "hover:border-[#8c1515]/30 hover:shadow-md bg-card"
                                )}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className={cn(
                                        "w-full text-left px-6 py-5 flex justify-between items-center transition-colors duration-300",
                                        isOpen ? "bg-[#8c1515]/5" : "bg-transparent hover:bg-muted/30"
                                    )}
                                >
                                    <div className="flex flex-col gap-2 pr-6">
                                        <span className="text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider bg-[#8c1515]/10 text-[#8c1515] rounded-md w-fit">
                                            {faq.category || 'Umum'}
                                        </span>
                                        <h3 className={cn(
                                            "text-lg font-bold transition-colors duration-300",
                                            isOpen ? "text-[#8c1515]" : "text-foreground group-hover:text-[#8c1515]"
                                        )}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className={cn(
                                        "flex-shrink-0 p-2 rounded-full transition-all duration-300",
                                        isOpen ? "bg-[#8c1515] text-white rotate-180 shadow-md" : "bg-muted text-muted-foreground group-hover:bg-[#8c1515]/10 group-hover:text-[#8c1515]"
                                    )}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </button>
                                
                                <div 
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-6 pb-6 pt-2 bg-transparent">
                                            <div className="border-t border-border/50 pt-5">
                                                <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed font-medium">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    }) : (
                        <div className="text-center py-20 px-6 bg-card border border-border shadow-xs rounded-3xl flex flex-col items-center">
                            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">Tidak ada FAQ yang cocok</h3>
                            <p className="text-base text-muted-foreground max-w-md mx-auto">
                                Kami tidak dapat menemukan jawaban yang cocok dengan kata kunci "{filters.search}". Coba gunakan kata kunci lain atau periksa ejaan Anda.
                            </p>
                            {filters.search && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => { setSearch(''); router.get('/faqs'); }} 
                                    className="mt-8 border-[#8c1515] text-[#8c1515] hover:bg-[#8c1515] hover:text-white rounded-xl h-11 px-6 transition-all duration-300"
                                >
                                    Lihat Semua FAQ
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="mt-6 flex justify-center pb-8">
                    <p className="text-center text-sm text-muted-foreground bg-muted/50 py-3 px-6 rounded-full inline-flex border border-border/50">
                        Tidak menemukan jawaban? <Link href="/tickets/create" className="text-[#8c1515] font-bold hover:underline ml-1">Buat tiket baru</Link>
                    </p>
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

