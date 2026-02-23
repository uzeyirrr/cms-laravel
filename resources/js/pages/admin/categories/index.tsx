import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kategoriler', href: '/admin/categories' },
];

type Language = { id: number; code: string; name: string };
type CategoryItem = { id: number; name: string; slug: string; language: Language };
type Props = {
    categories: { data: CategoryItem[]; links: unknown[] };
    languages: Language[];
    filters: { search?: string; language_id?: string };
};

export default function AdminCategoriesIndex({ categories, languages, filters }: Props) {
    const form = useForm({
        search: filters.search ?? '',
        language_id: filters.language_id ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategoriler" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Kategoriler</h1>
                    <Button asChild>
                        <Link href="/admin/categories/create">Yeni Kategori</Link>
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Input
                        placeholder="Ara..."
                        value={form.data.search}
                        onChange={(e) => form.setData('search', e.target.value)}
                        className="max-w-xs"
                    />
                    <select
                        value={form.data.language_id}
                        onChange={(e) => form.setData('language_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Tum diller</option>
                        {languages.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                    <Button type="button" onClick={() => form.get('/admin/categories', { preserveState: true })} variant="secondary">
                        Filtrele
                    </Button>
                </div>
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-2 text-left">Ad</th>
                                <th className="p-2 text-left">Slug</th>
                                <th className="p-2 text-left">Dil</th>
                                <th className="p-2 text-right">Islem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.map((cat) => (
                                <tr key={cat.id} className="border-b">
                                    <td className="p-2">{cat.name}</td>
                                    <td className="p-2">{cat.slug}</td>
                                    <td className="p-2">{cat.language?.code}</td>
                                    <td className="p-2 text-right">
                                        <Link href={`/admin/categories/${cat.id}/edit`} className="text-primary hover:underline">
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
