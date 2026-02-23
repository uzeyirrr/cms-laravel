import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Yonlendirmeler', href: '/admin/redirects' },
];

type RedirectItem = { id: number; from_path: string; to_path: string; status_code: number; is_active: boolean };
type Props = { redirects: { data: RedirectItem[] } };

export default function AdminRedirectsIndex({ redirects }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yonlendirmeler" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between">
                    <h1 className="text-xl font-semibold">Yonlendirmeler</h1>
                    <Button asChild><Link href="/admin/redirects/create">Yeni</Link></Button>
                </div>
                <table className="w-full border text-sm">
                    <thead><tr className="border-b bg-muted/50"><th className="p-2 text-left">Kaynak</th><th className="p-2 text-left">Hedef</th><th className="p-2 text-left">Kod</th><th className="p-2 text-left">Aktif</th><th className="p-2 text-right">Islem</th></tr></thead>
                    <tbody>
                        {redirects.data.map((r) => (
                            <tr key={r.id} className="border-b">
                                <td className="p-2">{r.from_path}</td>
                                <td className="p-2">{r.to_path}</td>
                                <td className="p-2">{r.status_code}</td>
                                <td className="p-2">{r.is_active ? 'Evet' : 'Hayir'}</td>
                                <td className="p-2 text-right"><Link href={`/admin/redirects/${r.id}/edit`} className="text-primary hover:underline">Duzenle</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
