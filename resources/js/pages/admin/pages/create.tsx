import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Sayfalar', href: '/admin/pages' },
    { title: 'Yeni Sayfa', href: '/admin/pages/create' },
];

type Language = { id: number; code: string; name: string };
type Props = { languages: Language[] };

export default function AdminPagesCreate({ languages }: Props) {
    const form = useForm({
        title: '',
        slug: '',
        body: '',
        meta_title: '',
        meta_description: '',
        status: 'draft',
        language_id: languages[0]?.id ?? '',
        source_id: null as number | null,
        published_at: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/pages');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yeni Sayfa" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Yeni Sayfa</h1>
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
                            {form.processing ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/pages">Iptal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
