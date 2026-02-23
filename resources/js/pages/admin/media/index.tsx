import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Medya', href: '/admin/media' },
];

type MediaItem = { id: number; name: string; path: string; mime_type: string | null };
type Props = { media: { data: MediaItem[] }; filters: { search?: string } };

export default function AdminMediaIndex({ media, filters }: Props) {
    const form = useForm({ search: filters.search ?? '' });
    const uploadForm = useForm({ file: null as File | null });

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        if (uploadForm.data.file) formData.append('file', uploadForm.data.file);
        router.post('/admin/media', formData, { forceFormData: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Silmek istediginize emin misiniz?')) {
            router.delete(`/admin/media/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medya" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Medya Kutuphanesi</h1>
                <form onSubmit={(e) => { e.preventDefault(); form.get('/admin/media', { preserveState: true }); }} className="flex gap-2">
                    <Input
                        placeholder="Ara..."
                        value={form.data.search}
                        onChange={(e) => form.setData('search', e.target.value)}
                        className="max-w-xs"
                    />
                    <Button type="submit" variant="secondary">Filtrele</Button>
                </form>
                <form onSubmit={handleUpload} className="flex items-center gap-2">
                    <input
                        type="file"
                        onChange={(e) => uploadForm.setData('file', e.target.files?.[0] ?? null)}
                        className="text-sm"
                    />
                    <Button type="submit" disabled={!uploadForm.data.file}>Yukle</Button>
                </form>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
                    {media.data.map((item) => (
                        <div key={item.id} className="rounded border p-2">
                            {item.mime_type?.startsWith('image/') ? (
                                <img src={`/storage/${item.path}`} alt={item.name} className="h-24 w-full object-cover" />
                            ) : (
                                <div className="flex h-24 items-center justify-center bg-muted text-xs">{item.name}</div>
                            )}
                            <p className="mt-1 truncate text-xs">{item.name}</p>
                            <Button type="button" variant="destructive" size="sm" className="mt-1 w-full" onClick={() => handleDelete(item.id)}>
                                Sil
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
