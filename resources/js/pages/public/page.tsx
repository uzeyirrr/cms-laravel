import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

type Language = { id: number; code: string; name: string };
type PageData = { id: number; title: string; body: string | null; meta_title: string | null; meta_description: string | null };
type Props = { page: PageData; locale: string; languages: Language[] };

export default function PublicPage({ page, locale, languages }: Props) {
    return (
        <PublicLayout locale={locale} languages={languages}>
            <Head title={page.meta_title ?? page.title} />
            <article className="prose dark:prose-invert max-w-none">
                <h1>{page.title}</h1>
                {page.body && <div dangerouslySetInnerHTML={{ __html: page.body }} />}
            </article>
        </PublicLayout>
    );
}
