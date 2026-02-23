<?php

namespace App\Services;

use App\Models\Setting;

class AiPromptBuilder
{
    public static function buildSystemPrompt(array $extra = []): string
    {
        $parts = [];

        $master = Setting::getValue('ai_master_prompt', '');
        if ($master !== '') {
            $parts[] = 'Marka rehberi: '.trim($master);
        }

        $tone = Setting::getValue('ai_tone', '');
        if ($tone !== '') {
            $parts[] = 'Ton: '.trim($tone);
        }

        $forbidden = Setting::getValue('ai_forbidden_words', '');
        if ($forbidden !== '') {
            $decoded = is_string($forbidden) && (str_starts_with($forbidden, '[') || str_starts_with($forbidden, '{'))
                ? json_decode($forbidden, true) : null;
            $words = is_array($decoded) ? implode(', ', $decoded) : $forbidden;
            $parts[] = 'Kullanilmayacak kelimeler: '.$words;
        }

        $preferred = Setting::getValue('ai_preferred_words', '');
        if ($preferred !== '') {
            $decoded = is_string($preferred) && (str_starts_with($preferred, '[') || str_starts_with($preferred, '{'))
                ? json_decode($preferred, true) : null;
            $words = is_array($decoded) ? implode(', ', $decoded) : $preferred;
            $parts[] = 'Tercih edilen ifadeler: '.$words;
        }

        foreach ($extra as $label => $value) {
            if ((string) $value !== '') {
                $parts[] = $label.': '.$value;
            }
        }

        return implode("\n\n", $parts);
    }
}
