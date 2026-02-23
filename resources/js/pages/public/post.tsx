import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

type Language = { id: number; code: string; name: string };
type RelatedPost = { id: number; title: string; slug: string };
type PostData = {
    id: number; title: string; slug: string; body: string | null; excerpt: string | null;
    published_at: string | null; related_posts?: RelatedPost[];
};
type Props = { post: PostData; locale: string; languages: Language[] };

export default function PublicPost({ post, locale, languages }: Props) {
    return (
        <PublicLayout locale={locale} languages={languages}>
            <Head title={post.title} />
            <article className="prose dark:prose-invert max-w-none">
                <h1>{post.title}</h1>
                {post.excerpt && <p className="lead">{post.excerpt}</p>}
                {post.body && <div dangerouslySetInnerHTML={{ __html: post.body }} />}
            </article>
            {post.related_posts && post.related_posts.length > 0 && (
                <aside className="mt-8 border-t pt-6">
                    <h2 className="text-lg font-semibold">Ilgili yazilar</h2>
                    <ul className="mt-2 space-y-1">
                        {post.related_posts.map((p) => (
                            <li key={p.id}>
                                <Link href={`/blog/${p.slug}?locale=${locale}`} className="text-primary hover:underline">{p.title}</Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </PublicLayout>
    );
}
