import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/superadmin';

export default function Index({ logs }: { logs: any[] }) {
    return (
        <>
            <Head title="Activity Logs - Super Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Semua Log Aktivitas (Tiket & User)</h1>
                    <Link href={dashboard().url}>
                        <Button variant="outline">Kembali ke Dashboard</Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-700">Waktu</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Pelaku</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Tipe Log</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Aksi</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs && logs.length > 0 ? logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-3">{log.user?.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{log.model_type?.split('\\').pop() || 'Unknown'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{log.description}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Belum ada log aktivitas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
