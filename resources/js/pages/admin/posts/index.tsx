import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Yazilar', href: '/admin/posts' },
];

type Language = { id: number; code: string; name: string };
type Category = { id: number; name: string; language: Language };
type PostItem = {
    id: number;
    title: string;
    slug: string;
    status: string;
    language: Language;
    category: Category | null;
};
type Props = {
    posts: { data: PostItem[]; links: unknown[] };
    languages: Language[];
    categories: Category[];
    filters: { search?: string; status?: string; language_id?: string; category_id?: string };
};

export default function AdminPostsIndex({ posts, languages, categories, filters }: Props) {
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
        language_id: filters.language_id ?? '',
        category_id: filters.category_id ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yazilar" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Yazilar</h1>
                    <Button asChild>
                        <Link href="/admin/posts/create">Yeni Yazi</Link>
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
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Tum durumlar</option>
                        <option value="draft">Taslak</option>
                        <option value="published">Yayinda</option>
                    </select>
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
                    <select
                        value={form.data.category_id}
                        onChange={(e) => form.setData('category_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Tum kategoriler</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <Button type="button" onClick={() => form.get('/admin/posts', { preserveState: true })} variant="secondary">
                        Filtrele
                    </Button>
                </div>
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-2 text-left">Baslik</th>
                                <th className="p-2 text-left">Slug</th>
                                <th className="p-2 text-left">Dil</th>
                                <th className="p-2 text-left">Kategori</th>
                                <th className="p-2 text-left">Durum</th>
                                <th className="p-2 text-right">Islem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.data.map((post) => (
                                <tr key={post.id} className="border-b">
                                    <td className="p-2">{post.title}</td>
                                    <td className="p-2">{post.slug}</td>
                                    <td className="p-2">{post.language?.code}</td>
                                    <td className="p-2">{post.category?.name ?? '-'}</td>
                                    <td className="p-2">{post.status}</td>
                                    <td className="p-2 text-right">
                                        <Link href={`/admin/posts/${post.id}/edit`} className="text-primary hover:underline">
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
