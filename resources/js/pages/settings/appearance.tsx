import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Tampilan Tema" />

            <h1 className="sr-only">Tampilan Tema</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Tampilan Tema"
                    description="Sesuaikan tema visual antarmuka sistem helpdesk untuk kenyamanan penggunaan Anda."
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Tampilan Tema',
            href: editAppearance(),
        },
    ],
};
