import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'AI', href: '/admin/ai-translate' },
    { title: 'Prompt Sablonlari', href: '/admin/ai/templates' },
];

type TemplateItem = { id: number; name: string; slug: string; category: string | null };
type Props = {
    templates: { data: TemplateItem[]; links: unknown[] };
    filters: { search?: string };
};

export default function AdminAiTemplatesIndex({ templates, filters }: Props) {
    const form = useForm({
        search: filters.search ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prompt Sablonlari" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Prompt Sablonlari</h1>
                    <Button asChild>
                        <Link href="/admin/ai/templates/create">Yeni Sablon</Link>
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Input
                        placeholder="Ara..."
                        value={form.data.search}
                        onChange={(e) => form.setData('search', e.target.value)}
                        className="max-w-xs"
                    />
                    <Button type="button" onClick={() => form.get('/admin/ai/templates', { preserveState: true })} variant="secondary">
                        Filtrele
                    </Button>
                </div>
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-2 text-left">Ad</th>
                                <th className="p-2 text-left">Slug</th>
                                <th className="p-2 text-left">Kategori</th>
                                <th className="p-2 text-right">Islem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {templates.data.map((t) => (
                                <tr key={t.id} className="border-b">
                                    <td className="p-2">{t.name}</td>
                                    <td className="p-2">{t.slug}</td>
                                    <td className="p-2">{t.category ?? '-'}</td>
                                    <td className="p-2 text-right">
                                        <Link href={`/admin/ai/templates/${t.id}/edit`} className="text-primary hover:underline">
                                            Duzenle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
