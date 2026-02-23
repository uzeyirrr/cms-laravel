import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Menuler', href: '/admin/menus' },
];

type Language = { id: number; code: string; name: string };
type MenuItem = { id: number; name: string; slug: string; language: Language };
type Props = { menus: { data: MenuItem[] }; languages: Language[]; filters: { language_id?: string } };

export default function AdminMenusIndex({ menus, languages, filters }: Props) {
    const form = useForm({ language_id: filters.language_id ?? '' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menuler" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between">
                    <h1 className="text-xl font-semibold">Menuler</h1>
                    <Button asChild><Link href="/admin/menus/create">Yeni Menu</Link></Button>
                </div>
                <div className="flex gap-2">
                    <select
                        value={form.data.language_id}
                        onChange={(e) => form.setData('language_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Tum diller</option>
                        {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                    <Button type="button" onClick={() => form.get('/admin/menus', { preserveState: true })} variant="secondary">Filtrele</Button>
                </div>
                <table className="w-full border text-sm">
                    <thead><tr className="border-b bg-muted/50"><th className="p-2 text-left">Ad</th><th className="p-2 text-left">Slug</th><th className="p-2 text-left">Dil</th><th className="p-2 text-right">Islem</th></tr></thead>
                    <tbody>
                        {menus.data.map((m) => (
                            <tr key={m.id} className="border-b">
                                <td className="p-2">{m.name}</td>
                                <td className="p-2">{m.slug}</td>
                                <td className="p-2">{m.language?.code}</td>
                                <td className="p-2 text-right"><Link href={`/admin/menus/${m.id}/edit`} className="text-primary hover:underline">Duzenle</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
