import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { create } from '@/routes/tickets';
import { 
    GraduationCap, 
    Activity, 
    BookOpen, 
    Sliders, 
    Award, 
    PlusCircle, 
    ArrowRight 
} from 'lucide-react';

export default function Dashboard({ categories }: { categories: string[] }) {
    const { auth } = usePage().props as any;

    // Helper to get category details like description and icon
    const getCategoryConfig = (name: string) => {
        switch (name) {
            case 'Data & Informasi Kurikulum':
                return {
                    icon: GraduationCap,
                    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30',
                    desc: 'Ajukan permintaan data kurikulum program studi, angkatan, dan tahun ajaran.'
                };
            case 'Monitoring & Evaluasi OBE':
                return {
                    icon: Activity,
                    color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
                    desc: 'Laporkan kendala asesmen OBE atau minta bantuan monitoring kurikulum.'
                };
            case 'Pengelolaan Kurikulum & Mata Kuliah':
                return {
                    icon: BookOpen,
                    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
                    desc: 'Kelola administrasi silabus prodi dan integrasi mata kuliah kurikulum.'
                };
            case 'Setting RPS & Komponennya':
                return {
                    icon: Sliders,
                    color: 'text-primary bg-red-50/50 dark:bg-red-950/10 border-red-100/50 dark:border-red-900/20',
                    desc: 'Lakukan setting rencana pembelajaran semester, dosen pengampu, dan kelas.'
                };
            case 'Verifikasi & Dispensasi Akademik':
                return {
                    icon: Award,
                    color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30',
                    desc: 'Ajukan dispensasi batas waktu akademik atau verifikasi kelayakan berkas.'
                };
            default:
                return {
                    icon: PlusCircle,
                    color: 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700',
                    desc: 'Kirimkan tiket pertanyaan umum atau bantuan akademis lainnya.'
                };
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
                
                {/* Greeting Card with Crimson Red Gradient Banner */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#8c1515] to-[#b31d1d] text-white p-6 md:p-8 shadow-md border border-red-700/30">
                    {/* Visual Highlights/Gradients */}
                    <div className="absolute right-0 top-0 w-[300px] h-full pointer-events-none opacity-20 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-200 via-rose-400 to-transparent"></div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">
                            Helpdesk BPA Telkom University
                        </span>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Halo, {auth.user.name} 👋
                        </h1>
                        <p className="text-white/80 text-sm md:text-base mt-2.5 leading-relaxed">
                            Selamat datang di portal bantuan Bagian Pengembangan Akademik. Pilih salah satu kategori layanan di bawah untuk mengirimkan tiket kendala atau permintaan layanan Anda secara cepat.
                        </p>
                    </div>
                </div>

                {/* Subtitle Section */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-[#8c1515] rounded-full"></div>
                        <h2 className="text-lg font-bold text-foreground">Kategori Tiket Bantuan</h2>
                    </div>
                    <Link href={create().url}>
                        <Button className="bg-[#8c1515] hover:bg-[#7a1212] rounded-xl flex items-center gap-1.5 shadow-sm text-xs font-semibold px-4 py-2.5 h-auto hover:scale-[1.01] active:scale-[0.99] transition-all">
                            <PlusCircle className="w-4 h-4" />
                            Buat Tiket Umum
                        </Button>
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, i) => {
                        const config = getCategoryConfig(cat);
                        const IconComponent = config.icon;
                        
                        return (
                            <Card 
                                key={i} 
                                className="group rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                            >
                                <CardHeader className="p-6 pb-2">
                                    <div className={`p-3 rounded-xl border w-fit ${config.color} transition-colors group-hover:scale-105 duration-300`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <CardTitle className="text-foreground text-base font-bold mt-4 leading-snug tracking-tight">
                                        {cat}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        {config.desc}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 pt-4 mt-auto">
                                    <Link href={create({ query: { category: cat } }).url} className="block w-full">
                                        <Button 
                                            variant="outline" 
                                            className="w-full rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all text-xs font-semibold h-10 flex items-center justify-center gap-1.5"
                                        >
                                            Pilih Kategori
                                            <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
