import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'AI', href: '/admin/ai-translate' },
    { title: 'Marka Rehberi', href: '/admin/ai/brand' },
];

type Props = {
    ai_master_prompt: string;
    ai_tone: string;
    ai_forbidden_words: string;
    ai_preferred_words: string;
};

export default function AdminAiBrandIndex({
    ai_master_prompt,
    ai_tone,
    ai_forbidden_words,
    ai_preferred_words,
}: Props) {
    const form = useForm({
        ai_master_prompt: ai_master_prompt ?? '',
        ai_tone: ai_tone ?? '',
        ai_forbidden_words: ai_forbidden_words ?? '',
        ai_preferred_words: ai_preferred_words ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/admin/ai/brand');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marka Rehberi / Master Prompt" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">Marka Rehberi / Master Prompt</h1>
                <p className="text-muted-foreground text-sm">
                    Tum AI cagrilarinda kullanilacak sabit metin, ton ve kelime tercihleri. Fikir uretici, icerik uretici ve ceviri bu ayarlari kullanir.
                </p>
                <form onSubmit={submit} className="max-w-2xl space-y-4">
                    <div>
                        <Label htmlFor="ai_master_prompt">Master Prompt (sirket adi, hedef kitle, genel yon)</Label>
                        <textarea
                            id="ai_master_prompt"
                            value={form.data.ai_master_prompt}
                            onChange={(e) => form.setData('ai_master_prompt', e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                        {form.errors.ai_master_prompt && (
                            <p className="mt-1 text-sm text-destructive">{form.errors.ai_master_prompt}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="ai_tone">Ton (resmi, samimi, teknik vb.)</Label>
                        <Input
                            id="ai_tone"
                            value={form.data.ai_tone}
                            onChange={(e) => form.setData('ai_tone', e.target.value)}
                            className="mt-1 w-full"
                            placeholder="Ornek: samimi, bilgilendirici"
                        />
                        {form.errors.ai_tone && <p className="mt-1 text-sm text-destructive">{form.errors.ai_tone}</p>}
                    </div>
                    <div>
                        <Label htmlFor="ai_forbidden_words">Kullanilmayacak kelimeler (virgul veya satir ile ayirin, JSON dizi de olabilir)</Label>
                        <textarea
                            id="ai_forbidden_words"
                            value={form.data.ai_forbidden_words}
                            onChange={(e) => form.setData('ai_forbidden_words', e.target.value)}
                            rows={2}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                        {form.errors.ai_forbidden_words && (
                            <p className="mt-1 text-sm text-destructive">{form.errors.ai_forbidden_words}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="ai_preferred_words">Tercih edilen ifadeler (virgul veya satir ile ayirin, JSON dizi de olabilir)</Label>
                        <textarea
                            id="ai_preferred_words"
                            value={form.data.ai_preferred_words}
                            onChange={(e) => form.setData('ai_preferred_words', e.target.value)}
                            rows={2}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                        {form.errors.ai_preferred_words && (
                            <p className="mt-1 text-sm text-destructive">{form.errors.ai_preferred_words}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
