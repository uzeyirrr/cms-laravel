import { Head } from '@inertiajs/react';
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
    { title: 'Icerik Uretici', href: '/admin/ai/content' },
];

const REWRITE_OPTIONS = [
    { value: 'Daha kisa yaz.', label: 'Daha kisa' },
    { value: 'Daha resmi bir dille yaz.', label: 'Daha resmi' },
    { value: 'SEO odakli, anahtar kelime vurgulu yaz.', label: 'SEO odakli' },
    { value: 'Daha samimi ve konuskan yaz.', label: 'Daha samimi' },
];

type Language = { id: number; code: string; name: string };
type Props = { preset_title: string; languages: Language[] };

function getCsrf(): string {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

async function postJson(url: string, body: object): Promise<{ content?: string; message?: string; errors?: Record<string, string[]> }> {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrf(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });
    return res.json().catch(() => ({}));
}

export default function AdminAiContentIndex({ preset_title, languages }: Props) {
    const [heading, setHeading] = useState(preset_title);
    const [tone, setTone] = useState('');
    const [paragraphResult, setParagraphResult] = useState('');
    const [paragraphLoading, setParagraphLoading] = useState(false);

    const [blogTitle, setBlogTitle] = useState(preset_title);
    const [bulletPoints, setBulletPoints] = useState('');
    const [blogLocale, setBlogLocale] = useState(languages[0]?.code ?? 'tr');
    const [blogResult, setBlogResult] = useState('');
    const [blogLoading, setBlogLoading] = useState(false);

    const [rewriteText, setRewriteText] = useState('');
    const [rewriteInstruction, setRewriteInstruction] = useState(REWRITE_OPTIONS[0].value);
    const [rewriteResult, setRewriteResult] = useState('');
    const [rewriteLoading, setRewriteLoading] = useState(false);

    const onParagraph = async (e: React.FormEvent) => {
        e.preventDefault();
        setParagraphLoading(true);
        setParagraphResult('');
        const data = await postJson('/admin/ai/content/paragraph', {
            heading_or_context: heading,
            tone: tone || undefined,
        });
        setParagraphResult(data.content ?? '');
        setParagraphLoading(false);
    };

    const onBlogDraft = async (e: React.FormEvent) => {
        e.preventDefault();
        const points = bulletPoints.split('\n').map((s) => s.trim()).filter(Boolean);
        setBlogLoading(true);
        setBlogResult('');
        const data = await postJson('/admin/ai/content/blog-draft', {
            title: blogTitle,
            bullet_points: points,
            locale: blogLocale || undefined,
        });
        setBlogResult(data.content ?? '');
        setBlogLoading(false);
    };

    const onRewrite = async (e: React.FormEvent) => {
        e.preventDefault();
        setRewriteLoading(true);
        setRewriteResult('');
        const data = await postJson('/admin/ai/content/rewrite', {
            text: rewriteText,
            instruction: rewriteInstruction,
        });
        setRewriteResult(data.content ?? '');
        setRewriteLoading(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Icerik Uretici" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4">
                <h1 className="text-xl font-semibold">AI Icerik Uretici</h1>
                <p className="text-muted-foreground text-sm">
                    Paragraf uret, blog taslagi olustur veya mevcut metni talimata gore yeniden yaz.
                </p>

                <section className="space-y-3">
                    <h2 className="font-medium">Paragraf uret</h2>
                    <form onSubmit={onParagraph} className="max-w-xl space-y-2">
                        <div>
                            <Label htmlFor="heading">Baslik / Konu</Label>
                            <Input
                                id="heading"
                                value={heading}
                                onChange={(e) => setHeading(e.target.value)}
                                className="mt-1 w-full"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="tone">Ton (opsiyonel)</Label>
                            <Input
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="mt-1 w-full"
                                placeholder="Ornek: samimi, teknik"
                            />
                        </div>
                        <Button type="submit" disabled={paragraphLoading}>
                            {paragraphLoading ? 'Uretiliyor...' : 'Paragraf uret'}
                        </Button>
                    </form>
                    {paragraphResult && (
                        <div className="rounded-md border bg-muted/30 p-3 text-sm">
                            <p className="whitespace-pre-wrap">{paragraphResult}</p>
                        </div>
                    )}
                </section>

                <section className="space-y-3">
                    <h2 className="font-medium">Blog taslagi uret</h2>
                    <form onSubmit={onBlogDraft} className="max-w-xl space-y-2">
                        <div>
                            <Label htmlFor="blog_title">Baslik</Label>
                            <Input
                                id="blog_title"
                                value={blogTitle}
                                onChange={(e) => setBlogTitle(e.target.value)}
                                className="mt-1 w-full"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="bullets">Maddeler (her satira bir madde)</Label>
                            <textarea
                                id="bullets"
                                value={bulletPoints}
                                onChange={(e) => setBulletPoints(e.target.value)}
                                rows={4}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="blog_locale">Dil</Label>
                            <select
                                id="blog_locale"
                                value={blogLocale}
                                onChange={(e) => setBlogLocale(e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                                {languages.map((l) => (
                                    <option key={l.id} value={l.code}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button type="submit" disabled={blogLoading}>
                            {blogLoading ? 'Uretiliyor...' : 'Taslak uret'}
                        </Button>
                    </form>
                    {blogResult && (
                        <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap">{blogResult}</div>
                    )}
                </section>

                <section className="space-y-3">
                    <h2 className="font-medium">Yeniden yaz</h2>
                    <form onSubmit={onRewrite} className="max-w-xl space-y-2">
                        <div>
                            <Label htmlFor="rewrite_text">Metin</Label>
                            <textarea
                                id="rewrite_text"
                                value={rewriteText}
                                onChange={(e) => setRewriteText(e.target.value)}
                                rows={4}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="rewrite_instruction">Talimat</Label>
                            <select
                                id="rewrite_instruction"
                                value={rewriteInstruction}
                                onChange={(e) => setRewriteInstruction(e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                                {REWRITE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button type="submit" disabled={rewriteLoading}>
                            {rewriteLoading ? 'Yaziliyor...' : 'Yeniden yaz'}
                        </Button>
                    </form>
                    {rewriteResult && (
                        <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap">{rewriteResult}</div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
