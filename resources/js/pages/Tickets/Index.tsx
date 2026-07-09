import { Head, Link } from '@inertiajs/react';
import { Search, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { show } from '@/routes/tickets';
import { dashboard } from '@/routes';

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
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold">Riwayat Ticket Anda</h1>
                    <Link href={dashboard().url}>
                        <Button variant="outline">Kembali ke Dashboard</Button>
                    </Link>
                </div>

                <div ref={searchContainerRef} className="relative w-full max-w-xl mb-6">
                    <div className="relative flex items-center bg-card rounded-xl border shadow-sm p-1">
                        {isSearching ? (
                            <Loader2 className="w-5 h-5 text-muted-foreground ml-3 mr-2 flex-shrink-0 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5 text-muted-foreground ml-3 mr-2 flex-shrink-0" />
                        )}
                        <input
                            type="text"
                            placeholder="Cari dari riwayat ticket Anda..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                            className="bg-transparent border-0 outline-none ring-0 w-full placeholder:text-muted-foreground text-foreground focus:ring-0 focus-visible:ring-0 h-10 px-2 text-sm"
                        />
                    </div>
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && search.trim() !== '' && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border overflow-hidden z-50 text-left">
                            {suggestions.length > 0 ? (
                                <div className="flex flex-col py-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">Hasil Pencarian</div>
                                    {suggestions.map((ticket) => (
                                        <Link 
                                            key={ticket.ticket_number} 
                                            href={`/tickets/${ticket.ticket_number}`}
                                            className="flex flex-col px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-sm text-foreground">{ticket.ticket_number}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                    ticket.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                    ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                                                    ticket.status === 'Resolved' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-foreground line-clamp-1">{ticket.subject}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-muted-foreground">{ticket.category}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    {isSearching ? 'Mencari...' : 'Tidak ada hasil yang cocok'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {tickets && tickets.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {tickets.map((ticket: any) => (
                            <Card key={ticket.id}>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-semibold text-lg">{ticket.ticket_number}</p>
                                        <p className="text-sm text-muted-foreground">{ticket.category} &middot; {new Date(ticket.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                            ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                        <Link href={show({ ticket: ticket.ticket_number }).url}>
                                            <Button variant="ghost" size="sm">Lihat riwayat →</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center text-muted-foreground">
                        Belum ada ticket yang dibuat.
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
