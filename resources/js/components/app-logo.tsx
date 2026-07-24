import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#8c1515]/5 p-1 border border-[#8c1515]/10 shadow-xs transition-transform duration-300 hover:scale-105 shrink-0">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden transition-all duration-200">
                <span className="text-sm font-extrabold text-foreground tracking-tight leading-none mb-1">
                    Helpdesk BPA
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold tracking-wide leading-none">
                    Telkom University
                </span>
            </div>
        </div>
    );
}
