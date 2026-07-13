import { Head, Link, router, usePage } from '@inertiajs/react';
import { Folder, Search, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const isSlaOverdue = (ticket: any) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') return false;
    const createdAt = new Date(ticket.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours > 24;
};

function SVGLineChart({ data }: { data: { date: string, count: number }[] }) {
    if (!data || data.length === 0) return null;
    const maxVal = Math.max(...data.map(d => d.count), 5);
    const width = 600;
    const height = 220;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = data.map((d, index) => {
        const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
        const y = height - paddingBottom - (d.count / maxVal) * chartHeight;
        return { x, y, val: d.count, date: d.date };
    });

    const pathData = points.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaData = `${pathData} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto overflow-visible select-none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b1a1a" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8b1a1a" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                    const y = paddingTop + ratio * chartHeight;
                    const val = Math.round(maxVal * (1 - ratio));
                    return (
                        <g key={idx} className="opacity-40">
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke="currentColor"
                                strokeDasharray="3 3"
                                className="text-muted-foreground/30"
                            />
                            <text
                                x={paddingLeft - 10}
                                y={y + 4}
                                textAnchor="end"
                                className="text-[10px] fill-muted-foreground font-medium"
                            >
                                {val}
                            </text>
                        </g>
                    );
                })}

                <path d={areaData} fill="url(#chartGradient)" />

                <path
                    d={pathData}
                    fill="none"
                    stroke="#8b1a1a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_4px_6px_rgba(139,26,26,0.3)]"
                />

                {points.map((p, idx) => (
                    <g key={idx} className="group/point cursor-pointer">
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            fill="#8b1a1a"
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-200 group-hover/point:r-7"
                        />
                        <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <rect
                                x={p.x - 30}
                                y={p.y - 35}
                                width="60"
                                height="24"
                                rx="4"
                                fill="#1f2937"
                                className="shadow-lg"
                            />
                            <text
                                x={p.x}
                                y={p.y - 19}
                                textAnchor="middle"
                                fill="white"
                                className="text-[10px] font-bold"
                            >
                                {p.val} Tiket
                            </text>
                        </g>
                    </g>
                ))}

                {points.map((p, idx) => (
                    <text
                        key={idx}
                        x={p.x}
                        y={height - 15}
                        textAnchor="middle"
                        className="text-[10px] fill-muted-foreground font-medium"
                    >
                        {p.date}
                    </text>
                ))}
            </svg>
        </div>
    );
}

export default function Dashboard({ stats, categories, searchResults, trend = [], csatStats = { average: 0, total: 0, breakdown: [] }, filters }: { stats: any, categories: any[], searchResults: any[] | null, trend?: any[], csatStats?: any, filters: { search: string } }) {
    const { auth } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
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
                const response = await fetch(`/admin/tickets/search-suggestions?query=${encodeURIComponent(search)}`);
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/dashboard',
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-8 p-6">
                {/* Red Welcome Banner with Search */}
                <div className="bg-gradient-to-r from-[#8b1a1a] via-[#7a1212] to-[#6b0b0b] text-white rounded-3xl p-8 md:p-12 text-center relative shadow-lg">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)] rounded-3xl overflow-hidden" />
                    <div className="relative flex flex-col items-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2">
                            Halo, {auth.user?.name || 'Staff Baru'} <span className="animate-bounce">👋</span>
                        </h1>
                        <p className="text-white/80 text-sm mt-2 md:text-base font-medium">
                            Mau cari ticket apa hari ini?
                        </p>

                        <div ref={searchContainerRef} className="relative w-full max-w-xl mx-auto mt-8">
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-background rounded-full border border-transparent shadow-xl p-1.5 pl-5 hover:shadow-2xl transition-shadow group">
                                {isSearching ? (
                                    <Loader2 className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0 animate-spin" />
                                ) : (
                                    <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0 group-hover:text-primary transition-colors" />
                                )}
                                <input
                                    type="text"
                                    placeholder="Cari nomor ticket, kategori, atau deskripsi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                                    className="bg-transparent border-0 outline-none ring-0 w-full placeholder:text-muted-foreground text-foreground focus:ring-0 focus-visible:ring-0 h-10 pr-4 text-sm"
                                />
                                <Button type="submit" className="rounded-full px-6 bg-[#8b1a1a] hover:bg-[#7a1212] text-white font-semibold transition-colors duration-200">
                                    Cari
                                </Button>
                            </form>
                            
                            {/* Autocomplete Dropdown */}
                            {showSuggestions && search.trim() !== '' && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border overflow-hidden z-50 text-left">
                                    {suggestions.length > 0 ? (
                                        <div className="flex flex-col py-2">
                                            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">Rekomendasi</div>
                                            {suggestions.map((ticket) => (
                                                <Link 
                                                    key={ticket.id} 
                                                    href={`/admin/tickets/${ticket.ticket_number}`}
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
                                                        <span className="text-[10px] text-muted-foreground">&bull;</span>
                                                        <span className="text-[10px] text-muted-foreground">{ticket.user?.name}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                            <button 
                                                onClick={handleSearchSubmit}
                                                className="w-full text-center py-3 text-sm text-primary hover:bg-muted/30 font-semibold mt-1 transition-colors"
                                            >
                                                Lihat semua hasil
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            {isSearching ? 'Mencari...' : 'Tidak ada hasil yang cocok'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3 Offset Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full -mt-14 px-4 relative z-20">
                    <Card className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-extrabold text-rose-600 mb-2">
                            {stats.open + stats.in_progress}
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                            Total Tiket Aktif
                        </div>
                    </Card>
                    <Card className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-extrabold text-rose-600 mb-2">
                            {categories.length}
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                            Kategori Tiket
                        </div>
                    </Card>
                    <Card className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-extrabold text-rose-600 mb-2">
                            {stats.open}
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                            Admin Pending
                        </div>
                    </Card>
                </div>

                {/* Analytics & Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-4">
                    <Card className="lg:col-span-2 p-6 shadow-sm border">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Tren Tiket Masuk</h3>
                                <p className="text-xs text-muted-foreground">Statistik jumlah tiket masuk selama 7 hari terakhir.</p>
                            </div>
                        </div>
                        <SVGLineChart data={trend} />
                    </Card>

                    <Card className="p-6 shadow-sm border flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-1">Kepuasan Pengguna (CSAT)</h3>
                            <p className="text-xs text-muted-foreground mb-6">Rata-rata kepuasan layanan berdasarkan ulasan.</p>
                            
                            <div className="flex flex-col items-center justify-center py-4 bg-yellow-50/20 border border-yellow-100 rounded-xl mb-4 text-center">
                                <div className="text-4xl font-black text-yellow-600 mb-1 flex items-baseline gap-1">
                                    <span>{csatStats.average}</span>
                                    <span className="text-xs text-muted-foreground font-normal">/ 5.0</span>
                                </div>
                                <div className="flex items-center gap-0.5 mb-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill={Math.round(csatStats.average) >= star ? '#eab308' : 'none'}
                                            stroke="#eab308"
                                            strokeWidth="2"
                                            className="w-5 h-5"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">Dari {csatStats.total} Ulasan Tiket</div>
                            </div>

                            <div className="space-y-2">
                                {csatStats.breakdown.map((row: any) => {
                                    const percent = csatStats.total > 0 ? (row.count / csatStats.total) * 100 : 0;
                                    return (
                                        <div key={row.stars} className="flex items-center gap-2 text-xs font-medium">
                                            <span className="w-12 text-muted-foreground flex items-center gap-1 font-semibold">
                                                <span>{row.stars}</span>
                                                <span className="text-yellow-500 text-[10px]">★</span>
                                            </span>
                                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-yellow-500 h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <span className="w-8 text-right text-muted-foreground">{row.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Kategori Distribusi Row */}
                <div className="max-w-5xl mx-auto w-full px-4">
                    <Card className="p-6 shadow-sm border">
                        <h3 className="text-lg font-bold mb-1">Distribusi Kategori</h3>
                        <p className="text-xs text-muted-foreground mb-6">Persentase dan jumlah tiket berdasarkan kategori layanan.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {categories.map((category) => {
                                const totalTickets = categories.reduce((sum, c) => sum + (c.count || 0), 0);
                                const percent = totalTickets > 0 ? ((category.count ?? 0) / totalTickets) * 100 : 0;
                                return (
                                    <div key={category.name} className="p-4 bg-muted/30 border rounded-xl flex flex-col justify-between gap-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-foreground truncate max-w-[150px]">{category.name}</span>
                                            <span className="text-xs text-muted-foreground font-bold">{category.count ?? 0} Tiket</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className="bg-[#8b1a1a] h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <div className="text-[10px] text-muted-foreground text-right font-medium">{percent.toFixed(0)}% dari total</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Search Results Table (Conditional) */}
                {searchResults !== null && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Hasil Pencarian untuk "{filters.search}"</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearch('');
                                    router.get('/admin/dashboard');
                                }}
                            >
                                Bersihkan Pencarian
                            </Button>
                        </div>
                        <Card className="border-muted shadow-sm rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 border-b border-muted">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">No Ticket</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Pengirim</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Kategori</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground">Tanggal Dibuat</th>
                                            <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted">
                                        {searchResults.map((ticket: any) => (
                                            <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 font-bold text-foreground">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span>{ticket.ticket_number}</span>
                                                        {isSlaOverdue(ticket) && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse border border-red-200" title="SLA Overdue (>24 jam)">
                                                                ⚠️ SLA OVERDUE (&gt;24j)
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-foreground">{ticket.user?.name}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{ticket.category}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ticket.status === 'Open' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900/30' :
                                                        ticket.status === 'In Progress' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border-orange-200 dark:border-orange-900/30' :
                                                            ticket.status === 'Resolved' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/30' :
                                                                'bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400 border-gray-200 dark:border-gray-900/30'
                                                        }`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={`/admin/tickets/${ticket.ticket_number}`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                                            Lihat detail →
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {searchResults.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <Search className="w-10 h-10 text-muted-foreground/40" />
                                                        <div className="flex flex-col gap-1">
                                                            <p className="font-semibold text-base text-foreground">Tidak ada ticket ditemukan</p>
                                                            <p className="text-sm">Tidak ada ticket yang cocok dengan kata kunci pencarian Anda.</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Categories Cards */}
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-6">Kategori Tiket</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => {
                            const count = category.count ?? 0;

                            return (
                                <Link
                                    href={`/admin/tickets/category?category=${encodeURIComponent(category.name)}`}
                                    key={category.name}
                                    className="group flex flex-col justify-between bg-card hover:bg-muted/30 border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                                {category.description || 'Tidak ada deskripsi.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                            {count} Tiket
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
