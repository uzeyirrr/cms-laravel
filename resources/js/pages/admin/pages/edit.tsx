import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs = (page: { id: number; title: string }): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Sayfalar', href: '/admin/pages' },
    { title: page.title, href: `/admin/pages/${page.id}/edit` },
];

type Language = { id: number; code: string; name: string };
type Revision = { id: number; created_at: string; user?: { name: string } };
type PageData = {
    id: number;
    title: string;
    slug: string;
    body: string | null;
    meta_title: string | null;
    meta_description: string | null;
    status: string;
    language_id: number;
    published_at: string | null;
    revisions?: Revision[];
};
type Props = { page: PageData; languages: Language[] };

export default function AdminPagesEdit({ page, languages }: Props) {
    const form = useForm({
        title: page.title,
        slug: page.slug,
        body: page.body ?? '',
        meta_title: page.meta_title ?? '',
        meta_description: page.meta_description ?? '',
        status: page.status,
        language_id: page.language_id,
        source_id: null as number | null,
        published_at: page.published_at ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/admin/pages/${page.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(page)}>
            <Head title={`Duzenle: ${page.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Sayfa Duzenle</h1>
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
                            <Link href="/admin/pages">Geri</Link>
                        </Button>
                    </div>
                </form>
                {page.revisions && page.revisions.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                        <h2 className="mb-2 text-sm font-semibold">Revizyonlar</h2>
                        <ul className="space-y-1 text-sm">
                            {page.revisions.map((rev) => (
                                <li key={rev.id} className="flex items-center justify-between gap-2">
                                    <span>{new Date(rev.created_at).toLocaleString()} {rev.user?.name && `- ${rev.user.name}`}</span>
                                    <Button type="button" variant="outline" size="sm" onClick={() => router.post(`/admin/pages/${page.id}/revisions/${rev.id}/restore`, {}, { preserveScroll: true })}>Onceki versiyona don</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
