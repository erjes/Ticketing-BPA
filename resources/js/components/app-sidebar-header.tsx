import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';

interface NotificationData {
    id: string;
    data: {
        title: string;
        message: string;
        ticket_number?: string;
    };
    read_at: string | null;
    created_at: string;
}

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!auth?.user) return;
            try {
                const response = await fetch('/notifications');
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 10000); // 10 seconds

        return () => clearInterval(intervalId);
    }, [auth?.user]);

    const handleRead = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await fetch(`/notifications/${id}/read`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Content-Type': 'application/json'
                }
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleReadAll = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await fetch('/notifications/read-all', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Content-Type': 'application/json'
                }
            });
            setNotifications([]);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 w-full">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-4">
                {auth?.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background animate-pulse" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                            <div className="flex items-center justify-between px-2 py-1.5">
                                <DropdownMenuLabel className="p-0">Notifikasi</DropdownMenuLabel>
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={handleReadAll}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Tandai Semua Dibaca
                                    </button>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    Belum ada notifikasi baru
                                </div>
                            ) : (
                                notifications.map((notification) => {
                                    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';
                                    const ticketUrl = notification.data.ticket_number 
                                        ? (isAdmin ? `/admin/tickets/${notification.data.ticket_number}` : `/tickets/${notification.data.ticket_number}`)
                                        : '#';
                                        
                                    return (
                                        <DropdownMenuItem key={notification.id} className="p-3 focus:bg-gray-50 flex flex-col items-start gap-1 cursor-pointer" asChild>
                                            <Link href={ticketUrl} className="w-full">
                                                <div className="flex justify-between w-full items-start gap-2">
                                                    <span className="font-semibold text-sm">{notification.data.title}</span>
                                                    <button 
                                                        onClick={(e) => handleRead(notification.id, e)}
                                                        className="text-gray-400 hover:text-green-600"
                                                        title="Tandai sudah dibaca"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <span className="text-xs text-muted-foreground line-clamp-2">{notification.data.message}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
