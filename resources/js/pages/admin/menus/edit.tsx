import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs = (menu: { id: number; name: string }): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Menuler', href: '/admin/menus' },
    { title: menu.name, href: `/admin/menus/${menu.id}/edit` },
];

type Language = { id: number; code: string; name: string };
type MenuData = { id: number; name: string; slug: string; items: unknown[]; language_id: number };
type Props = { menu: MenuData; languages: Language[] };

export default function AdminMenusEdit({ menu, languages }: Props) {
    const form = useForm({ name: menu.name, slug: menu.slug, items: menu.items ?? [], language_id: menu.language_id });

    const submit = (e: React.FormEvent) => { e.preventDefault(); form.put(`/admin/menus/${menu.id}`); };

    return (
        <AppLayout breadcrumbs={breadcrumbs(menu)}>
            <Head title={`Duzenle: ${menu.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Menu Duzenle</h1>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div><Label htmlFor="name">Ad</Label><Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="mt-1 w-full" /><InputError message={form.errors.name} /></div>
                    <div><Label htmlFor="slug">Slug</Label><Input id="slug" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className="mt-1 w-full" /><InputError message={form.errors.slug} /></div>
                    <div><Label htmlFor="language_id">Dil</Label><select id="language_id" value={form.data.language_id} onChange={(e) => form.setData('language_id', Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2">{languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                    <div className="flex gap-2"><Button type="submit" disabled={form.processing}>Guncelle</Button><Button type="button" variant="outline" asChild><Link href="/admin/menus">Geri</Link></Button></div>
                </form>
            </div>
        </AppLayout>
    );
}
