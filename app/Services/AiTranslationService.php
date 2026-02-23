<?php

namespace App\Services;

class AiTranslationService
{
    public function __construct(
        protected OpenAiClient $client
    ) {}

    public function translate(string $text, string $targetLanguageCode): string
    {
        if (empty($text)) {
            return '';
        }
        if (! $this->client->isConfigured()) {
            return $text;
        }

        $system = AiPromptBuilder::buildSystemPrompt([
            'Gorev' => 'Verdigim metni hedef dile cevir. Sadece ceviri metnini dondur, aciklama ekleme.',
            'Hedef dil kodu' => $targetLanguageCode,
        ]);
        $user = "Asagidaki metni {$targetLanguageCode} diline cevir:\n\n".$text;

        $result = $this->client->chat($system, $user);

        return $result !== '' ? $result : $text;
    }

    public function generateMetaTitle(string $content): string
    {
        if (! $this->client->isConfigured()) {
            return substr(strip_tags($content), 0, 60);
        }

        $system = AiPromptBuilder::buildSystemPrompt([
            'Gorev' => 'Verdigim icerikten SEO uyumlu, 50-60 karakter araliginda tek bir meta baslik uret. Sadece basligi dondur, tirak veya aciklama ekleme.',
        ]);
        $user = 'Icerik: '."\n\n".strip_tags($content);

        $result = $this->client->chat($system, $user);
        $trimmed = preg_replace('/^["\']|["\']$/u', '', trim($result));

        return $trimmed !== '' ? mb_substr($trimmed, 0, 60) : mb_substr(strip_tags($content), 0, 60);
    }

    public function generateMetaDescription(string $content): string
    {
        if (! $this->client->isConfigured()) {
            return substr(strip_tags($content), 0, 160);
        }

        $system = AiPromptBuilder::buildSystemPrompt([
            'Gorev' => 'Verdigim icerikten SEO uyumlu, 150-160 karakter araliginda tek bir meta aciklama uret. Sadece aciklamayi dondur, tirak veya aciklama ekleme.',
        ]);
        $user = 'Icerik: '."\n\n".strip_tags($content);

        $result = $this->client->chat($system, $user);
        $trimmed = preg_replace('/^["\']|["\']$/u', '', trim($result));

        return $trimmed !== '' ? mb_substr($trimmed, 0, 160) : mb_substr(strip_tags($content), 0, 160);
    }

    public function generateExcerpt(string $content): string
    {
        if (! $this->client->isConfigured()) {
            return substr(strip_tags($content), 0, 200);
        }

        $system = AiPromptBuilder::buildSystemPrompt([
            'Gorev' => 'Verdigim icerikten 1-2 cumlelik, en fazla 200 karakter ozet uret. Sadece ozeti dondur.',
        ]);
        $user = 'Icerik: '."\n\n".strip_tags($content);

        $result = $this->client->chat($system, $user);
        $trimmed = preg_replace('/^["\']|["\']$/u', '', trim($result));

        return $trimmed !== '' ? mb_substr($trimmed, 0, 200) : mb_substr(strip_tags($content), 0, 200);
    }
}
