<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class OpenAiClient
{
    private const BASE_URL = 'https://api.openai.com/v1';

    public function __construct(
        protected ?string $apiKey = null,
        protected string $model = 'gpt-4o-mini',
        protected int $timeout = 60
    ) {
        $this->apiKey = $apiKey ?? config('ai.openai.api_key') ?? config('services.openai.api_key');
        $this->model = config('ai.openai.model', $this->model);
        $this->timeout = config('ai.openai.timeout', $this->timeout);
    }

    public function chat(string $systemPrompt, string $userMessage): string
    {
        if (! $this->apiKey) {
            return '';
        }

        $response = Http::withToken($this->apiKey)
            ->timeout($this->timeout)
            ->retry(2, 500, function (\Throwable $e) {
                return $e instanceof ConnectionException || $e instanceof RequestException;
            })
            ->post(self::BASE_URL.'/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userMessage],
                ],
            ]);

        if ($response->failed()) {
            return '';
        }

        $body = $response->json();
        $content = $body['choices'][0]['message']['content'] ?? null;

        return $content !== null ? trim((string) $content) : '';
    }

    public function isConfigured(): bool
    {
        return ! empty($this->apiKey);
    }
}
