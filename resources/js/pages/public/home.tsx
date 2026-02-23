import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';

type Language = { id: number; code: string; name: string };
type Props = { locale: string; languages: Language[] };

export default function PublicHome({ locale, languages }: Props) {
    return (
        <PublicLayout locale={locale} languages={languages}>
            <Head title="Anasayfa" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Anasayfa</h1>
                <p className="text-muted-foreground">Icerik yonetim sistemine hos geldiniz.</p>
                <div className="flex gap-4">
                    <Link href="/blog" className="text-primary hover:underline">Bloga git</Link>
                    <Link href="/ara" className="text-primary hover:underline">Ara</Link>
                </div>
            </div>
        </PublicLayout>
    );
}
