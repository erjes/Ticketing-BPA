import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/superadmin';

export default function Index({ logs }: { logs: any[] }) {
    return (
        <>
            <Head title="Activity Logs - Super Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full"></div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Semua Log Aktivitas</h1>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Log aktivitas sistem keseluruhan termasuk tiket dan manajemen pengguna.</p>
                    </div>
                    <Link href={dashboard().url} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto rounded-xl text-xs font-semibold px-4 h-9 shadow-sm border-border hover:bg-muted transition-colors">
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>

                <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-muted/40 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-40">Waktu</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-48">Pelaku</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-32">Tipe Log</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-32">Aksi</th>
                                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs && logs.length > 0 ? logs.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-6 py-4 font-medium text-xs text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                        <td className="px-6 py-4 font-bold text-foreground text-sm">{log.user?.name}</td>
                                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{log.model_type?.split('\\').pop() || 'Unknown'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium leading-relaxed max-w-lg">{log.description}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="bg-muted p-3 rounded-full text-muted-foreground/60">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                                </div>
                                                <p className="text-sm font-semibold mt-2">Belum Ada Log Aktivitas</p>
                                                <p className="text-xs text-muted-foreground">Sistem belum merekam aktivitas apa pun.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard Super Admin', href: '/super-admin/dashboard' },
        { title: 'Activity Logs', href: '/super-admin/activity-logs' },
    ],
};
