import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs = (template: { id: number; name: string }): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'AI', href: '/admin/ai-translate' },
    { title: 'Prompt Sablonlari', href: '/admin/ai/templates' },
    { title: template.name, href: `/admin/ai/templates/${template.id}/edit` },
];

type TemplateData = {
    id: number;
    name: string;
    slug: string;
    system_prompt: string;
    user_prompt_placeholder: string | null;
    description: string | null;
    category: string | null;
};
type Props = { template: TemplateData };

export default function AdminAiTemplatesEdit({ template }: Props) {
    const form = useForm({
        name: template.name,
        slug: template.slug,
        system_prompt: template.system_prompt,
        user_prompt_placeholder: template.user_prompt_placeholder ?? '',
        description: template.description ?? '',
        category: template.category ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/admin/ai/templates/${template.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(template)}>
            <Head title={`Duzenle: ${template.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Prompt Sablonu Duzenle</h1>
                <form onSubmit={submit} className="max-w-2xl space-y-4">
                    <div>
                        <Label htmlFor="name">Ad</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="mt-1 w-full"
                        />
                        <InputError message={form.errors.name} />
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
                        <Label htmlFor="category">Kategori</Label>
                        <Input
                            id="category"
                            value={form.data.category}
                            onChange={(e) => form.setData('category', e.target.value)}
                            className="mt-1 w-full"
                        />
                        <InputError message={form.errors.category} />
                    </div>
                    <div>
                        <Label htmlFor="system_prompt">System prompt</Label>
                        <textarea
                            id="system_prompt"
                            value={form.data.system_prompt}
                            onChange={(e) => form.setData('system_prompt', e.target.value)}
                            rows={6}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                        <InputError message={form.errors.system_prompt} />
                    </div>
                    <div>
                        <Label htmlFor="user_prompt_placeholder">Kullanici prompt placeholder</Label>
                        <Input
                            id="user_prompt_placeholder"
                            value={form.data.user_prompt_placeholder}
                            onChange={(e) => form.setData('user_prompt_placeholder', e.target.value)}
                            className="mt-1 w-full"
                        />
                        <InputError message={form.errors.user_prompt_placeholder} />
                    </div>
                    <div>
                        <Label htmlFor="description">Aciklama</Label>
                        <textarea
                            id="description"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            rows={2}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                        <InputError message={form.errors.description} />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Kaydediliyor...' : 'Guncelle'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/ai/templates">Geri</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
