import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const themes: { value: Appearance; icon: LucideIcon; label: string; description: string; previewClass: string }[] = [
        {
            value: 'light',
            icon: Sun,
            label: 'Mode Terang (Light)',
            description: 'Tampilan bersih dengan warna terang, optimal untuk lingkungan dengan cahaya berlimpah.',
            previewClass: 'bg-slate-50 border-slate-200 text-slate-800',
        },
        {
            value: 'dark',
            icon: Moon,
            label: 'Mode Gelap (Dark)',
            description: 'Tampilan redup untuk mengurangi beban ketegangan mata di ruangan minim cahaya.',
            previewClass: 'bg-zinc-950 border-zinc-800 text-zinc-100 dark',
        },
        {
            value: 'system',
            icon: Monitor,
            label: 'Mode Sistem (System)',
            description: 'Otomatis menyelaraskan tema visual dengan pengaturan sistem operasi perangkat Anda.',
            previewClass: 'bg-linear-to-br from-slate-50 to-zinc-950 border-slate-300 text-foreground',
        },
    ];

    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4', className)} {...props}>
            {themes.map(({ value, icon: Icon, label, description, previewClass }) => {
                const isActive = appearance === value;
                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => updateAppearance(value)}
                        className={cn(
                            'group flex flex-col items-start text-left rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden',
                            isActive
                                ? 'border-[#8c1515] bg-[#8c1515]/5 shadow-xs ring-1 ring-[#8c1515]'
                                : 'border-border bg-card hover:border-foreground/20 hover:bg-muted/30'
                        )}
                    >
                        {/* Selected indicator check badge */}
                        {isActive && (
                            <div className="absolute top-0 right-0 bg-[#8c1515] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                Aktif
                            </div>
                        )}

                        {/* Theme Mockup Preview Box */}
                        <div className={cn('w-full h-24 rounded-lg border p-3 mb-4 flex flex-col justify-between overflow-hidden shadow-xs transition-transform duration-300 group-hover:scale-[1.02]', previewClass)}>
                            <div className="flex items-center gap-1.5">
                                <div className="size-2 rounded-full bg-red-400" />
                                <div className="size-2 rounded-full bg-yellow-400" />
                                <div className="size-2 rounded-full bg-green-400" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-2 w-2/3 rounded-sm bg-current opacity-20" />
                                <div className="h-1.5 w-1/2 rounded-sm bg-current opacity-10" />
                            </div>
                        </div>

                        {/* Theme Info */}
                        <div className="flex items-center gap-2 mb-1.5">
                            <Icon className={cn('h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-12', isActive ? 'text-[#8c1515]' : 'text-muted-foreground')} />
                            <span className="font-bold text-sm text-foreground">{label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-normal font-medium">
                            {description}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}
