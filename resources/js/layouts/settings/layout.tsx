import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';
import { User, Lock, Palette } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil Pengguna',
        href: edit(),
        icon: User,
    },
    {
        title: 'Keamanan Akun',
        href: editSecurity(),
        icon: Lock,
    },
    {
        title: 'Tampilan Tema',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-8 max-w-6xl mx-auto space-y-6">
            <Heading
                title="Pengaturan Akun"
                description="Kelola informasi profil, preferensi tampilan, dan keamanan autentikasi Anda."
            />

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <aside className="w-full lg:w-60 shrink-0">
                    <nav
                        className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = isCurrentOrParentUrl(item.href);
                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'justify-start gap-3 h-10 px-4 transition-all duration-200 shrink-0',
                                        isActive
                                            ? 'bg-[#8c1515]/5 text-[#8c1515] hover:bg-[#8c1515]/10 hover:text-[#8c1515] font-bold border-l-2 border-[#8c1515] rounded-r-lg rounded-l-none'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg'
                                    )}
                                >
                                    <Link href={item.href} className="flex items-center gap-3">
                                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                                        <span className="text-sm">{item.title}</span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="lg:hidden my-2" />

                <div className="flex-1 w-full">
                    <div className="bg-white dark:bg-zinc-900 border border-border/80 shadow-xs rounded-2xl p-6 md:p-8 text-left">
                        <div className="space-y-10">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
