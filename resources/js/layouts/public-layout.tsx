import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

type Language = { id: number; code: string; name: string };
type Props = { children: ReactNode; locale: string; languages: Language[] };

export default function PublicLayout({ children, locale, languages }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b">
                <div className="container mx-auto flex h-14 items-center justify-between px-4">
                    <Link href="/" className="font-semibold">CMS</Link>
                    <nav className="flex gap-4">
                        <Link href="/" className="text-sm hover:underline">Anasayfa</Link>
                        <Link href="/blog" className="text-sm hover:underline">Blog</Link>
                        <Link href="/ara" className="text-sm hover:underline">Ara</Link>
                        {languages.length > 1 && (
                            <select
                                defaultValue={locale}
                                onChange={(e) => { const u = new URL(window.location.href); u.searchParams.set('locale', e.target.value); window.location.href = u.toString(); }}
                                className="rounded border bg-transparent text-sm"
                            >
                                {languages.map((l) => <option key={l.id} value={l.code}>{l.name}</option>)}
                            </select>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                CMS
            </footer>
        </div>
    );
}
