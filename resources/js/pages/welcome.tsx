import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { 
    FileText, 
    BarChart3, 
    BookOpen, 
    Settings2, 
    ShieldAlert, 
    ArrowRight, 
    HelpCircle, 
    CheckCircle2, 
    Mail, 
    Phone, 
    MapPin 
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props as any;

    const services = [
        {
            title: 'Data & Informasi Kurikulum',
            desc: 'Layanan permintaan data kurikulum program studi, angkatan, serta tahun ajaran akademik di Telkom University.',
            icon: FileText,
            color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20'
        },
        {
            title: 'Monitoring & Evaluasi OBE',
            desc: 'Pemantauan serta evaluasi implementasi Outcome-Based Education (OBE) untuk menjamin standar kompetensi lulusan.',
            icon: BarChart3,
            color: 'text-red-600 bg-red-50 dark:bg-red-950/20'
        },
        {
            title: 'Pengelolaan Kurikulum & Mata Kuliah',
            desc: 'Administrasi penambahan, penyesuaian, serta integrasi silabus mata kuliah dalam struktur kurikulum prodi.',
            icon: BookOpen,
            color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20'
        },
        {
            title: 'Setting RPS & Komponennya',
            desc: 'Konfigurasi rencana pembelajaran semester, komponen penilaian, serta persetujuan koordinasi dosen pengampu.',
            icon: Settings2,
            color: 'text-crimson bg-red-50/50 dark:bg-red-950/10'
        },
        {
            title: 'Verifikasi & Dispensasi Akademik',
            desc: 'Permohonan verifikasi dokumen kelayakan akademik dan pengajuan dispensasi batas waktu administrasi.',
            icon: ShieldAlert,
            color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20'
        }
    ];

    const faqs = [
        {
            q: 'Bagaimana cara memantau status tiket bantuan saya?',
            a: 'Anda dapat masuk ke akun Anda menggunakan akun SSO Telkom University, lalu pilih menu "Riwayat Ticket" di bilah navigasi untuk melihat status terupdate dan tanggapan admin.'
        },
        {
            q: 'Berapa lama waktu penyelesaian tiket bantuan oleh BPA?',
            a: 'BPA berkomitmen untuk merespons dan menyelesaikan tiket bantuan akademis dalam jangka waktu maksimal 1x24 jam kerja sejak tiket dikirimkan.'
        },
        {
            q: 'Apakah saya wajib melampirkan berkas fisik?',
            a: 'Tergantung pada kategori layanan. Layanan seperti Setting RPS dan Dispensasi Akademik sangat dianjurkan menyertakan tautan Google Drive berisi berkas pendukung.'
        }
    ];

    return (
        <>
            <Head title="Pusat Layanan Akademik BPA" />
            <div className="min-h-screen bg-slate-50/50 dark:bg-[#09090b] text-[#1c1917] dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
                
                {/* Modern Navigation Header */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#09090b]/80 border-b border-border/40 transition-all">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary/5 p-1 border border-primary/10">
                                <AppLogoIcon className="size-8" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-sm leading-none text-foreground tracking-wide">Helpdesk BPA</span>
                                <span className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Telkom University</span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#8c1515] hover:bg-[#7a1212] px-5 py-2 text-xs font-bold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Dashboard
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login().url}
                                        className="inline-flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors px-4 py-2"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href={register().url}
                                        className="inline-flex items-center justify-center text-xs font-bold bg-[#8c1515] hover:bg-[#7a1212] text-white px-5 py-2 rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40 dark:opacity-20 z-0">
                        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-red-300 rounded-full blur-[120px]"></div>
                        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-rose-200 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[11px] font-semibold text-primary uppercase tracking-wider mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Sistem Tiket Bantuan Akademik Resmi
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.1]">
                            Solusi Cepat Kebutuhan Pengembangan Layanan <span className="text-[#8c1515]">Akademik Anda</span>
                        </h1>

                        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            Ajukan pertanyaan, keluhan, atau permintaan verifikasi terkait kurikulum, OBE, dan komponen RPS langsung ke Bagian Pengembangan Akademik Telkom University secara transparan.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
                            <Link
                                href={auth.user ? dashboard().url : login().url}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8c1515] hover:bg-[#7a1212] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
                            >
                                Kirim Tiket Sekarang
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#faq"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-[#18181b] border border-border px-8 py-3.5 text-sm font-bold text-foreground hover:bg-muted/50 transition-colors w-full sm:w-auto"
                            >
                                Pertanyaan Umum (FAQ)
                            </a>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-20 bg-white dark:bg-[#0c0c0e] border-y border-border/50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-foreground">Kategori Layanan Akademik</h2>
                            <p className="mt-3 text-muted-foreground">Kami memetakan formulir khusus sesuai jenis permohonan Anda untuk menjamin akurasi dan kecepatan proses verifikasi.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((srv, idx) => {
                                const IconComp = srv.icon;
                                return (
                                    <div 
                                        key={idx} 
                                        className="group relative flex flex-col p-6 rounded-2xl border border-border bg-slate-50/30 dark:bg-[#18181b]/20 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className={`p-3 rounded-xl w-fit ${srv.color} transition-colors group-hover:scale-105 duration-300`}>
                                            <IconComp className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-base text-foreground mt-5 leading-snug">{srv.title}</h3>
                                        <p className="text-muted-foreground text-xs leading-relaxed mt-2.5 flex-1">{srv.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20 bg-slate-50/30 dark:bg-[#09090b]">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                                <HelpCircle className="w-7 h-7 text-primary" />
                                Pertanyaan yang Sering Diajukan
                            </h2>
                            <p className="mt-3 text-muted-foreground">Temukan jawaban cepat atas pertanyaan mendasar mengenai layanan helpdesk BPA.</p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white dark:bg-[#18181b]/50 p-6 rounded-2xl border border-border shadow-sm">
                                    <h4 className="font-bold text-sm text-foreground flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        {faq.q}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed ml-6">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="mt-auto bg-white dark:bg-[#09090b] border-t border-border py-12 text-center text-xs text-muted-foreground transition-colors duration-300">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        
                        {/* Brand Info */}
                        <div className="flex items-center gap-3.5 text-left">
                            <img src="/logo/logo-bpa.webp" alt="Logo BPA Telkom University" className="h-10 w-auto object-contain dark:brightness-110" />
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground text-sm">Bagian Pengembangan Akademik</span>
                                <span className="text-[10px] text-muted-foreground">Gedung Tokong Nanas (GKU), Lantai 2, Telkom University</span>
                            </div>
                        </div>

                        {/* Contacts */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-left md:text-right">
                            <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-primary" />
                                <span>bpa@telkomuniversity.ac.id</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-primary" />
                                <span>+62 22 7565934</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="max-w-6xl mx-auto px-6 border-t border-border/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p>© {new Date().getFullYear()} Bagian Pengembangan Akademik Telkom University. All rights reserved.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary transition-colors">Panduan Pengguna</a>
                            <span>•</span>
                            <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
