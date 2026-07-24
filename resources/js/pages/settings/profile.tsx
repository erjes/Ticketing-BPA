import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Pengaturan Profil" />

            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profil Pengguna"
                    description="Perbarui nama lengkap dan alamat email Anda."
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs font-bold text-foreground/80">Nama Lengkap</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full rounded-xl h-11 border-border"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap Anda"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold text-foreground/80">Alamat Email SSO</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full rounded-xl h-11 border-border"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="email@telkomuniversity.ac.id"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/20 dark:bg-amber-950/20">
                                        <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                            Alamat email Anda belum terverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="font-bold underline text-amber-900 hover:text-amber-950 dark:text-amber-200 dark:hover:text-white transition-colors"
                                            >
                                                Klik di sini untuk mengirim ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                                Link verifikasi baru telah sukses dikirim ke alamat email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    disabled={processing}
                                    className="bg-[#8c1515] hover:bg-[#7a1212] text-white font-bold px-6 h-11 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                                    data-test="update-profile-button"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <div className="border-t border-border/60 my-6"></div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
