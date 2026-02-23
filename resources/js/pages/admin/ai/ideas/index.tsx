import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'AI', href: '/admin/ai-translate' },
    { title: 'Fikir Uretici', href: '/admin/ai/ideas' },
];

type Language = { id: number; code: string; name: string };
type Props = { languages: Language[] };

export default function AdminAiIdeasIndex({ languages }: Props) {
    const [keyword, setKeyword] = useState('');
    const [locale, setLocale] = useState(languages[0]?.code ?? 'tr');
    const [limit] = useState(10);
    const [topics, setTopics] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const suggest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const csrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
            const res = await fetch('/admin/ai/ideas/suggest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': csrf ? decodeURIComponent(csrf) : '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    category_or_keyword: keyword,
                    locale,
                    limit,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                const msg = data.errors?.category_or_keyword?.[0] ?? data.message ?? 'Istek basarisiz.';
                setError(msg);
                setTopics([]);
                return;
            }
            setTopics(data.topics ?? []);
        } catch {
            setError('Baglanti hatasi.');
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    const openContentWithTopic = (topic: string) => {
        router.get('/admin/ai/content', { preset_title: topic });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fikir Uretici" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">AI Fikir Uretici</h1>
                <p className="text-muted-foreground text-sm">
                    Kategori veya anahtar kelime girerek konu basliklari onerisi alin. Dil secerek sonuclari o dilde uretebilirsiniz.
                </p>
                <form onSubmit={suggest} className="max-w-md space-y-4">
                    <div>
                        <Label htmlFor="keyword">Kategori / Anahtar kelime</Label>
                        <Input
                            id="keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="mt-1 w-full"
                            placeholder="Ornek: saglik, beslenme, spor"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="locale">Dil (locale)</Label>
                        <select
                            id="locale"
                            value={locale}
                            onChange={(e) => setLocale(e.target.value)}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            {languages.map((l) => (
                                <option key={l.id} value={l.code}>
                                    {l.name} ({l.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Oneriliyor...' : 'Konu oner'}
                    </Button>
                </form>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {topics.length > 0 && (
                    <div className="space-y-2">
                        <h2 className="font-medium">Onerilen konular</h2>
                        <ol className="list-inside list-decimal space-y-1 text-sm">
                            {topics.map((t, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span>{t}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openContentWithTopic(t)}
                                    >
                                        Icerik taslagi yap
                                    </Button>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
