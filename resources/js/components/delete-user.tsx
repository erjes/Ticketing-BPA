import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Hapus Akun"
                description="Hapus akun Anda secara permanen beserta seluruh data di dalamnya."
            />
            <div className="space-y-4 rounded-xl border border-red-100 bg-red-50 p-5 dark:border-red-950/20 dark:bg-red-950/10">
                <div className="relative space-y-1 text-red-700 dark:text-red-300">
                    <p className="font-bold text-sm tracking-wide uppercase">Peringatan Penting</p>
                    <p className="text-xs font-semibold leading-relaxed">
                        Harap berhati-hati, tindakan ini bersifat permanen dan tidak dapat dibatalkan. Seluruh data tiket dan riwayat Anda akan dihapus selamanya.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="rounded-xl font-bold transition-all px-5 shadow-xs active:scale-[0.98]"
                            data-test="delete-user-button"
                        >
                            Hapus Akun Saya
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl border border-border">
                        <DialogTitle className="text-lg font-bold">
                            Apakah Anda yakin ingin menghapus akun?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                            Setelah akun Anda dihapus, semua riwayat tiket pengaduan, balasan, dan rating Anda akan hilang dari sistem secara permanen. Masukkan kata sandi Anda untuk memverifikasi tindakan ini.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Kata Sandi
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Masukkan kata sandi untuk mengonfirmasi"
                                            autoComplete="current-password"
                                            className="rounded-xl h-11 border-border"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                className="rounded-xl font-bold"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Batal
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            className="rounded-xl font-bold active:scale-[0.98]"
                                            disabled={processing}
                                        >
                                            Hapus Permanen
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
