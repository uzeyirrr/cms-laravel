import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs = (r: { id: number }): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Yonlendirmeler', href: '/admin/redirects' },
    { title: 'Duzenle', href: `/admin/redirects/${r.id}/edit` },
];

type Redirect = { id: number; from_path: string; to_path: string; status_code: number; is_active: boolean };
type Props = { redirect: Redirect };

export default function AdminRedirectsEdit({ redirect }: Props) {
    const form = useForm({ from_path: redirect.from_path, to_path: redirect.to_path, status_code: redirect.status_code, is_active: redirect.is_active });

    const submit = (e: React.FormEvent) => { e.preventDefault(); form.put(`/admin/redirects/${redirect.id}`); };

    return (
        <AppLayout breadcrumbs={breadcrumbs(redirect)}>
            <Head title="Yonlendirme Duzenle" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Yonlendirme Duzenle</h1>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div><Label>Kaynak yol</Label><Input value={form.data.from_path} onChange={(e) => form.setData('from_path', e.target.value)} className="mt-1 w-full" /></div>
                    <div><Label>Hedef yol</Label><Input value={form.data.to_path} onChange={(e) => form.setData('to_path', e.target.value)} className="mt-1 w-full" /></div>
                    <div><Label>HTTP kodu</Label><select value={form.data.status_code} onChange={(e) => form.setData('status_code', Number(e.target.value))} className="mt-1 w-full rounded-md border px-3 py-2"><option value={301}>301</option><option value={302}>302</option></select></div>
                    <div className="flex gap-2"><Button type="submit" disabled={form.processing}>Guncelle</Button><Button type="button" variant="outline" asChild><Link href="/admin/redirects">Geri</Link></Button></div>
                </form>
            </div>
        </AppLayout>
    );
}
