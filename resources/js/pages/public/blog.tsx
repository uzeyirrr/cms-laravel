import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

type Language = { id: number; code: string; name: string };
type PostItem = { id: number; title: string; slug: string; excerpt: string | null; published_at: string | null };
type Props = { posts: { data: PostItem[] }; locale: string; languages: Language[] };

export default function PublicBlog({ posts, locale, languages }: Props) {
    return (
        <PublicLayout locale={locale} languages={languages}>
            <Head title="Blog" />
            <h1 className="mb-6 text-3xl font-bold">Blog</h1>
            <ul className="space-y-4">
                {posts.data.map((post) => (
                    <li key={post.id} className="border-b pb-4">
                        <Link href={`/blog/${post.slug}?locale=${locale}`} className="text-lg font-medium hover:underline">
                            {post.title}
                        </Link>
                        {post.excerpt && <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>}
                    </li>
                ))}
            </ul>
        </PublicLayout>
    );
}
