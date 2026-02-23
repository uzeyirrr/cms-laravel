import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'AI Ceviri', href: '/admin/ai-translate' },
];

type Language = { id: number; code: string; name: string };
type PageItem = { id: number; title: string; language: Language };
type PostItem = { id: number; title: string; language: Language };
type Props = { pages: PageItem[]; posts: PostItem[]; languages: Language[] };

export default function AdminAiTranslateIndex({ pages, posts, languages }: Props) {
    const form = useForm({ model_type: 'page' as 'page' | 'post', model_id: 0, target_language_id: languages[0]?.id ?? 0 });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/ai-translate');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Ceviri" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">AI ile Toplu Ceviri</h1>
                <p className="text-muted-foreground text-sm">Icerik secin ve hedef dil secerek ceviri job kuyruga ekleyin. OPENAI_API_KEY yapilandirildiginda ceviri yapilir.</p>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div>
                        <label className="text-sm font-medium">Icerik tipi</label>
                        <select
                            value={form.data.model_type}
                            onChange={(e) => form.setData('model_type', e.target.value as 'page' | 'post')}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="page">Sayfa</option>
                            <option value="post">Yazi</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Icerik</label>
                        <select
                            value={form.data.model_id}
                            onChange={(e) => form.setData('model_id', Number(e.target.value))}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value={0}>Seciniz</option>
                            {(form.data.model_type === 'page' ? pages : posts).map((item) => (
                                <option key={item.id} value={item.id}>{item.title} ({item.language?.code})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Hedef dil</label>
                        <select
                            value={form.data.target_language_id}
                            onChange={(e) => form.setData('target_language_id', Number(e.target.value))}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            {languages.map((l) => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" disabled={form.processing || !form.data.model_id}>
                        {form.processing ? 'Kuyruga ekleniyor...' : 'Ceviri kuyruga ekle'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
