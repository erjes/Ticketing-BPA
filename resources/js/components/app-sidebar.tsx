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
            title: 'Dashboard Super Admin',
            href: superAdminDashboard().url,
            icon: LayoutGrid,
        });
        mainNavItems.push({
            title: 'Manajemen Pengguna',
            href: superAdminDashboard().url,
            icon: Users,
        });
    } else if (role === 'admin') {
        defaultDashboardUrl = adminDashboard().url;
        mainNavItems.push({
            title: 'Dashboard Admin',
            href: adminDashboard().url,
            icon: LayoutGrid,
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
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
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

