import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

function getCsrf(): string {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

async function postJson(url: string, body: object): Promise<Record<string, unknown>> {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf(), 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });
    return res.json().catch(() => ({}));
}

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
    const [headings, setHeadings] = useState<string[]>([]);
    const [headingsLoading, setHeadingsLoading] = useState(false);
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
                        <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={headingsLoading}
                                onClick={async () => {
                                    setHeadingsLoading(true);
                                    setHeadings([]);
                                    const data = await postJson('/admin/ai/content/headings', {
                                        title_or_keyword: form.data.title || form.data.body.slice(0, 200),
                                        count: 6,
                                    });
                                    setHeadings((data.headings as string[]) ?? []);
                                    setHeadingsLoading(false);
                                }}
                            >
                                {headingsLoading ? '...' : 'H2 oner'}
                            </Button>
                        </div>
                        {headings.length > 0 && (
                            <ul className="mt-2 list-inside list-decimal text-sm text-muted-foreground">
                                {headings.map((h, i) => (
                                    <li key={i}>{h}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="meta_title">Meta baslik</Label>
                        <div className="flex gap-2">
                            <Input
                                id="meta_title"
                                value={form.data.meta_title}
                                onChange={(e) => form.setData('meta_title', e.target.value)}
                                className="mt-1 flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 shrink-0"
                                onClick={async () => {
                                    const data = await postJson('/admin/ai/content/meta-title', {
                                        content: form.data.body || form.data.title,
                                    });
                                    if (data.meta_title) form.setData('meta_title', String(data.meta_title));
                                }}
                            >
                                Meta uret
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="meta_description">Meta aciklama</Label>
                        <div className="flex gap-2">
                            <textarea
                                id="meta_description"
                                value={form.data.meta_description}
                                onChange={(e) => form.setData('meta_description', e.target.value)}
                                rows={2}
                                className="mt-1 flex-1 rounded-md border border-input bg-background px-3 py-2"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 shrink-0"
                                onClick={async () => {
                                    const data = await postJson('/admin/ai/content/meta-description', {
                                        content: form.data.body || form.data.title,
                                    });
                                    if (data.meta_description) form.setData('meta_description', String(data.meta_description));
                                }}
                            >
                                Meta uret
                            </Button>
                        </div>
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
