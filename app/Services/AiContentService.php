<?php

namespace App\Services;

class AiContentService
{
    public function __construct(
        protected OpenAiClient $client
    ) {}

    public function generateParagraph(string $headingOrContext, ?string $tone = null): string
    {
        if (! $this->client->isConfigured()) {
            return '';
        }

        $extra = ['Gorev' => 'Verdigim baslik/konuya gore tek bir paragraf yaz. Sadece paragrafi dondur.'];
        if ($tone !== null && $tone !== '') {
            $extra['Ek ton'] = $tone;
        }
        $system = AiPromptBuilder::buildSystemPrompt($extra);
        $user = 'Baslik/konu: '.$headingOrContext;

        return $this->client->chat($system, $user);
    }

    public function generateBlogDraft(string $title, array $bulletPoints, ?string $locale = null): string
    {
        if (! $this->client->isConfigured()) {
            return '';
        }

        $extra = [
            'Gorev' => 'Verdigim baslik ve maddelere gore blog yazisi taslagi yaz. Uygun H2 basliklari ve paragraflar uret. Sadece icerigi dondur.',
        ];
        if ($locale !== null && $locale !== '') {
            $extra['Dil'] = $locale;
        }
        $system = AiPromptBuilder::buildSystemPrompt($extra);
        $bullets = implode("\n", array_map(fn ($p) => '- '.$p, $bulletPoints));
        $user = "Baslik: {$title}\n\nMaddeler:\n{$bullets}";

        return $this->client->chat($system, $user);
    }

    public function rewrite(string $text, string $instruction): string
    {
        if (! $this->client->isConfigured() || trim($text) === '') {
            return $text;
        }

        $system = AiPromptBuilder::buildSystemPrompt([
            'Gorev' => 'Verdigim metni kullanici talimatina gore yeniden yaz. Sadece yeni metni dondur.',
        ]);
        $user = "Talimat: {$instruction}\n\nMetin:\n{$text}";

        $result = $this->client->chat($system, $user);

        return $result !== '' ? $result : $text;
    }

    /**
     * @return array<int, string>
     */
    public function generateHeadings(string $titleOrKeyword, int $count = 6): array
    {
        if (! $this->client->isConfigured()) {
            return [];
        }

        $system = AiPromptBuilder::buildSystemPrompt([
            'Gorev' => 'Verdigim baslik/anahtar kelimeye gore bir makale icin H1 (tek) ve H2 basliklari uret. Sadece numarali liste olarak basliklari dondur. Ilk satir H1, digerleri H2 olsun. Baska aciklama ekleme.',
        ]);
        $user = "Baslik/anahtar kelime: {$titleOrKeyword}\n\nToplam {$count} baslik uret (1 H1, ".(string) ($count - 1).' H2). Sadece basliklari numarali liste seklinde yaz.';

        $result = $this->client->chat($system, $user);
        if ($result === '') {
            return [];
        }

        $lines = preg_split('/\r\n|\r|\n/', $result);
        $headings = [];
        foreach ($lines as $line) {
            $line = trim(preg_replace('/^\d+[\.\)]\s*/', '', $line));
            if ($line !== '') {
                $headings[] = $line;
            }
        }

        return $headings;
    }
}
