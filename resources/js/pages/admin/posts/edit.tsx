import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs = (post: { id: number; title: string }): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Yazilar', href: '/admin/posts' },
    { title: post.title, href: `/admin/posts/${post.id}/edit` },
];

type Language = { id: number; code: string; name: string };
type Category = { id: number; name: string; language: Language };
type Revision = { id: number; created_at: string; user?: { name: string } };
type PostData = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string | null;
    featured_image: string | null;
    published_at: string | null;
    category_id: number | null;
    language_id: number;
    meta_title: string | null;
    meta_description: string | null;
    status: string;
    related_posts?: { id: number }[];
    revisions?: Revision[];
};
type Props = { post: PostData; languages: Language[]; categories: Category[] };

export default function AdminPostsEdit({ post, languages, categories }: Props) {
    const form = useForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        body: post.body ?? '',
        featured_image: post.featured_image ?? '',
        published_at: post.published_at ?? '',
        category_id: post.category_id,
        language_id: post.language_id,
        source_id: null as number | null,
        meta_title: post.meta_title ?? '',
        meta_description: post.meta_description ?? '',
        status: post.status,
        related_post_ids: (post.related_posts ?? []).map((p) => p.id),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/admin/posts/${post.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(post)}>
            <Head title={`Duzenle: ${post.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Yazi Duzenle</h1>
                <form onSubmit={submit} className="max-w-2xl space-y-4">
                    <div>
                        <Label htmlFor="title">Baslik</Label>
                        <Input
                            id="title"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="mt-1 w-full"
                        />
                        <InputError message={form.errors.title} />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={form.data.slug}
                            onChange={(e) => form.setData('slug', e.target.value)}
                            className="mt-1 w-full"
                        />
                        <InputError message={form.errors.slug} />
                    </div>
                    <div>
                        <Label htmlFor="language_id">Dil</Label>
                        <select
                            id="language_id"
                            value={form.data.language_id}
                            onChange={(e) => form.setData('language_id', Number(e.target.value))}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            {languages.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.language_id} />
                    </div>
                    <div>
                        <Label htmlFor="category_id">Kategori</Label>
                        <select
                            id="category_id"
                            value={form.data.category_id ?? ''}
                            onChange={(e) => form.setData('category_id', e.target.value ? Number(e.target.value) : null)}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="">Seciniz</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="excerpt">Ozet</Label>
                        <textarea
                            id="excerpt"
                            value={form.data.excerpt}
                            onChange={(e) => form.setData('excerpt', e.target.value)}
                            rows={2}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="body">Icerik</Label>
                        <textarea
                            id="body"
                            value={form.data.body}
                            onChange={(e) => form.setData('body', e.target.value)}
                            rows={6}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                        <InputError message={form.errors.body} />
                    </div>
                    <div>
                        <Label htmlFor="status">Durum</Label>
                        <select
                            id="status"
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="draft">Taslak</option>
                            <option value="published">Yayinda</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Kaydediliyor...' : 'Guncelle'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/posts">Geri</Link>
                        </Button>
                    </div>
                </form>
                {post.revisions && post.revisions.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                        <h2 className="mb-2 text-sm font-semibold">Revizyonlar</h2>
                        <ul className="space-y-1 text-sm">
                            {post.revisions.map((rev) => (
                                <li key={rev.id} className="flex items-center justify-between gap-2">
                                    <span>{new Date(rev.created_at).toLocaleString()} {rev.user?.name && `- ${rev.user.name}`}</span>
                                    <Button type="button" variant="outline" size="sm" onClick={() => router.post(`/admin/posts/${post.id}/revisions/${rev.id}/restore`, {}, { preserveScroll: true })}>Onceki versiyona don</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
