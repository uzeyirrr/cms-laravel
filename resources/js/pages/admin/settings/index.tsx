import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Ayarlar', href: '/admin/settings' },
];

type Props = { settings: Record<string, string> };

export default function AdminSettingsIndex({ settings }: Props) {
    const form = useForm({
        settings: {
            site_title: settings.site_title ?? '',
            site_description: settings.site_description ?? '',
            ...settings,
        },
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/admin/settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ayarlar" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Site Ayarlari</h1>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div><Label htmlFor="site_title">Site Basligi</Label><Input id="site_title" value={form.data.settings.site_title ?? ''} onChange={(e) => form.setData('settings', { ...form.data.settings, site_title: e.target.value })} className="mt-1 w-full" /></div>
                    <div><Label htmlFor="site_description">Site Aciklamasi</Label><textarea id="site_description" value={form.data.settings.site_description ?? ''} onChange={(e) => form.setData('settings', { ...form.data.settings, site_description: e.target.value })} rows={2} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" /></div>
                    <Button type="submit" disabled={form.processing}>{form.processing ? 'Kaydediliyor...' : 'Kaydet'}</Button>
                </form>
            </div>
        </AppLayout>
    );
}
