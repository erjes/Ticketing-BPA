import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950 p-6 overflow-hidden">
            {/* Visual background accents */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle,rgba(140,21,21,0.06),transparent_70%)] blur-3xl pointer-events-none -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle,rgba(140,21,21,0.03),transparent_70%)] blur-3xl pointer-events-none -ml-30 -mb-30" />
            
            <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
                {/* Logo Header */}
                <div className="flex justify-center mb-8">
                    <Link href={home()} className="hover:opacity-90 transition-opacity">
                        <AppLogo />
                    </Link>
                </div>

                {/* Floating Glass Card */}
                <div className="bg-white/95 dark:bg-zinc-900/90 border border-border/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 flex flex-col gap-6">
                    <div className="space-y-1.5 text-center">
                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
                        <p className="text-xs text-muted-foreground font-medium px-4">
                            {description}
                        </p>
                    </div>

                    <div className="border-t border-border/40 my-1"></div>

                    {children}
                </div>
            </div>
        </div>
    );
}
