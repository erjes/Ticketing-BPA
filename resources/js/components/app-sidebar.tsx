import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, TicketPlus, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard as userDashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { dashboard as superAdminDashboard } from '@/routes/superadmin';
import { create as createTicket } from '@/routes/tickets';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role || 'user';

    const mainNavItems: NavItem[] = [];
    let defaultDashboardUrl = userDashboard().url;

    if (role === 'super_admin') {
        defaultDashboardUrl = superAdminDashboard().url;
        mainNavItems.push({
            title: 'Manajemen Pengguna',
            href: superAdminDashboard().url,
            icon: Users,
        });
        mainNavItems.push({
            title: 'Activity Logs',
            href: '/super-admin/activity-logs',
            icon: BookOpen,
        });
    } else if (role === 'admin') {
        defaultDashboardUrl = adminDashboard().url;
        mainNavItems.push({
            title: 'Dashboard Admin',
            href: adminDashboard().url,
            icon: LayoutGrid,
        });
        mainNavItems.push({
            title: 'Daftar Tiket',
            href: '/admin/tickets',
            icon: TicketPlus,
        });
        mainNavItems.push({
            title: 'Kategori Tiket',
            href: '/admin/categories',
            icon: LayoutGrid,
        });
        mainNavItems.push({
            title: 'Manajemen FAQ',
            href: '/admin/faqs',
            icon: BookOpen,
        });
        mainNavItems.push({
            title: 'Activity Logs',
            href: '/admin/activity-logs',
            icon: BookOpen,
        });
    } else {
        defaultDashboardUrl = userDashboard().url;
        mainNavItems.push({
            title: 'Dashboard',
            href: userDashboard().url,
            icon: LayoutGrid,
        });
        mainNavItems.push({
            title: 'Buat Ticket',
            href: createTicket().url,
            icon: TicketPlus,
        });
        mainNavItems.push({
            title: 'Riwayat Ticket',
            href: '/tickets',
            icon: BookOpen,
        });
        mainNavItems.push({
            title: 'FAQ / Pusat Bantuan',
            href: '/faqs',
            icon: BookOpen,
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Panduan Ticketing',
            href: '#',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-border/50 py-4.5 px-4 transition-all duration-200 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:py-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:scale-100!">
                            <Link href={defaultDashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

