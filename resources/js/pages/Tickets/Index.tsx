import { Head, Link } from '@inertiajs/react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { show } from '@/routes/tickets';
import { dashboard } from '@/routes';

const isSlaOverdue = (ticket: any) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') return false;
    const createdAt = new Date(ticket.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours > 24;
};

export default function Index({ tickets }: { tickets: any[] }) {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!search.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        
        setIsSearching(true);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch(`/tickets/search-suggestions?query=${encodeURIComponent(search)}`);
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <>
            <Head title="Riwayat Ticket" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                
                {/* Header Title Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#8c1515] rounded-full"></div>
                            <h1 className="text-2xl font-bold text-foreground">Riwayat Ticket Anda</h1>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Pantau proses penyelesaian tiket dan histori percakapan Anda dengan tim BPA.</p>
                    </div>
                    <Link href={dashboard().url}>
                        <Button variant="outline" className="rounded-xl border-border hover:bg-muted text-xs font-semibold px-4 h-9">
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Autocomplete Search Box */}
                <div ref={searchContainerRef} className="relative w-full max-w-xl mb-2 z-30">
                    <div className="relative flex items-center bg-card rounded-xl border border-border shadow-sm p-1.5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/5 transition-all">
                        {isSearching ? (
                            <Loader2 className="w-4 h-4 text-muted-foreground ml-3 mr-2 flex-shrink-0 animate-spin" />
                        ) : (
                            <Search className="w-4 h-4 text-muted-foreground ml-3 mr-2 flex-shrink-0" />
                        )}
                        <input
                            type="text"
                            placeholder="Cari nomor tiket atau subjek permasalahan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                            className="bg-transparent border-0 outline-none ring-0 w-full placeholder:text-muted-foreground text-foreground focus:ring-0 focus-visible:ring-0 h-9 px-2 text-xs font-medium"
                        />
                    </div>
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && search.trim() !== '' && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50 text-left">
                            {suggestions.length > 0 ? (
                                <div className="flex flex-col py-1.5">
                                    <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground bg-muted/30 uppercase tracking-wider">Hasil Pencarian</div>
                                    {suggestions.map((ticket) => (
                                        <Link 
                                            key={ticket.ticket_number} 
                                            href={`/tickets/${ticket.ticket_number}`}
                                            className="flex flex-col px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-mono font-bold text-xs text-primary">{ticket.ticket_number}</span>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                                    ticket.status === 'Open' ? 'bg-green-50 text-green-700 dark:bg-green-950/20' :
                                                    ticket.status === 'In Progress' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20' :
                                                    ticket.status === 'Resolved' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20' :
                                                    'bg-gray-50 text-gray-700 dark:bg-gray-800'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold text-foreground line-clamp-1">{ticket.subject}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] text-muted-foreground font-medium">{ticket.category}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-xs text-muted-foreground">
                                    {isSearching ? 'Mencari...' : 'Tidak ada hasil yang cocok'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Ticket Cards List */}
                {tickets && tickets.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {tickets.map((ticket: any) => (
                            <Card 
                                key={ticket.id}
                                className="rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-300 overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                                    <div className="space-y-1">
                                         <div className="flex flex-wrap items-center gap-2.5">
                                             <p className="font-mono font-bold text-sm text-primary tracking-wide">{ticket.ticket_number}</p>
                                             <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                                                 ticket.status === 'Open' ? 'bg-green-50 text-green-700 dark:bg-green-950/20 border border-green-200/30' :
                                                 ticket.status === 'In Progress' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 border border-orange-200/30' :
                                                 ticket.status === 'Resolved' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 border border-blue-200/30' :
                                                 'bg-gray-50 text-gray-700 dark:bg-gray-800'
                                             }`}>
                                                 {ticket.status}
                                             </span>
                                             {isSlaOverdue(ticket) && (
                                                 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/30 border border-rose-200/30 animate-pulse">
                                                     ⚠️ SLA OVERDUE (&gt;24j)
                                                 </span>
                                             )}
                                         </div>
                                         <h3 className="text-sm font-bold text-foreground line-clamp-1 leading-snug">{ticket.subject}</h3>
                                         <p className="text-[11px] text-muted-foreground font-medium">
                                             {ticket.category} &middot; Dibuat pada {new Date(ticket.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                         </p>
                                    </div>
                                    <div className="flex items-center justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                                        <Link href={show({ ticket: ticket.ticket_number }).url}>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="rounded-lg text-primary hover:bg-primary/5 hover:text-primary transition-all text-xs font-bold gap-1 px-3 py-1.5 h-auto"
                                            >
                                                Lihat Riwayat
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-10 text-center text-muted-foreground rounded-2xl border border-border shadow-sm">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="bg-muted p-3 rounded-full text-muted-foreground/60">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                            <p className="text-sm font-semibold">Belum Ada Tiket Bantuan</p>
                            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Saat ini Anda tidak memiliki riwayat tiket bantuan. Klik tombol di bawah untuk membuat tiket pertama Anda.</p>
                            <Link href={create().url} className="mt-2">
                                <Button className="bg-[#8c1515] hover:bg-[#7a1212] rounded-xl text-xs font-semibold px-4 h-9">Buat Tiket Bantuan</Button>
                            </Link>
                        </div>
                    </Card>
                )}
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
            title: 'Riwayat Ticket',
            href: '/tickets',
        }
    ],
};
