import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Language = { id: number; code: string; name: string };
type PageItem = { id: number; title: string; slug: string };
type PostItem = { id: number; title: string; slug: string };
type Props = { q: string; pages: PageItem[]; posts: PostItem[]; locale: string; languages: Language[] };

export default function PublicSearch({ q, pages, posts, locale, languages }: Props) {
    const form = useForm({ q, locale });

    return (
        <PublicLayout locale={locale} languages={languages}>
            <Head title="Ara" />
            <h1 className="mb-6 text-3xl font-bold">Ara</h1>
            <form onSubmit={(e) => { e.preventDefault(); form.get('/ara', { preserveState: true }); }} className="mb-8 flex gap-2">
                <Input value={form.data.q} onChange={(e) => form.setData('q', e.target.value)} placeholder="Ara..." className="max-w-md" />
                <Button type="submit">Ara</Button>
            </form>
            {pages.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold">Sayfalar</h2>
                    <ul className="mt-2 space-y-1">
                        {pages.map((p) => (
                            <li key={p.id}><Link href={`/sayfa/${p.slug}?locale=${locale}`} className="text-primary hover:underline">{p.title}</Link></li>
                        ))}
                    </ul>
                </section>
            )}
            {posts.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold">Yazilar</h2>
                    <ul className="mt-2 space-y-1">
                        {posts.map((p) => (
                            <li key={p.id}><Link href={`/blog/${p.slug}?locale=${locale}`} className="text-primary hover:underline">{p.title}</Link></li>
                        ))}
                    </ul>
                </section>
            )}
            {q && pages.length === 0 && posts.length === 0 && <p className="text-muted-foreground">Sonuc bulunamadi.</p>}
        </PublicLayout>
    );
}
