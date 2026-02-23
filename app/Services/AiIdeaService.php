<?php

namespace App\Services;

class AiIdeaService
{
    public function __construct(
        protected OpenAiClient $client
    ) {}

    /**
     * @return array<int, string>
     */
    public function suggestTopics(string $categoryOrKeyword, string $locale, int $limit = 10): array
    {
        if (! $this->client->isConfigured()) {
            return [];
        }

        $system = AiPromptBuilder::buildSystemPrompt([
            'Gorev' => 'Verdigim kategori veya anahtar kelimeye gore blog/icerik konu basliklari oner. Sadece numarali liste olarak basliklari dondur, baska aciklama ekleme. Her satir tek bir baslik olsun.',
            'Dil' => $locale,
        ]);
        $user = "Kategori/anahtar kelime: {$categoryOrKeyword}\n\n{$limit} adet konu basligi oner. Sadece basliklari numarali liste seklinde yaz.";

        $result = $this->client->chat($system, $user);
        if ($result === '') {
            return [];
        }

        $lines = preg_split('/\r\n|\r|\n/', $result);
        $topics = [];
        foreach ($lines as $line) {
            $line = trim(preg_replace('/^\d+[\.\)]\s*/', '', $line));
            if ($line !== '') {
                $topics[] = $line;
                if (count($topics) >= $limit) {
                    break;
                }
            }
        }

        return $topics;
    }
}
