<?php

namespace App\Jobs;

use App\Models\Language;
use App\Models\Page;
use App\Models\Post;
use App\Services\AiTranslationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class TranslateContentJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $modelType,
        protected int $modelId,
        protected int $targetLanguageId
    ) {}

    public function handle(AiTranslationService $service): void
    {
        $targetLanguage = Language::find($this->targetLanguageId);
        if (! $targetLanguage) {
            return;
        }

        if ($this->modelType === Page::class) {
            $source = Page::find($this->modelId);
            if (! $source) {
                return;
            }
            $existing = Page::where('source_id', $source->id)->where('language_id', $this->targetLanguageId)->first();
            $title = $service->translate($source->title, $targetLanguage->code);
            $body = $service->translate($source->body ?? '', $targetLanguage->code);
            $slug = \Illuminate\Support\Str::slug($title);
            if ($existing) {
                $existing->update(compact('title', 'body', 'slug'));
            } else {
                Page::create([
                    'title' => $title,
                    'slug' => $slug,
                    'body' => $body,
                    'status' => $source->status,
                    'language_id' => $this->targetLanguageId,
                    'source_id' => $source->id,
                    'user_id' => $source->user_id,
                ]);
            }
        }

        if ($this->modelType === Post::class) {
            $source = Post::find($this->modelId);
            if (! $source) {
                return;
            }
            $existing = Post::where('source_id', $source->id)->where('language_id', $this->targetLanguageId)->first();
            $title = $service->translate($source->title, $targetLanguage->code);
            $body = $service->translate($source->body ?? '', $targetLanguage->code);
            $excerpt = $service->translate($source->excerpt ?? '', $targetLanguage->code);
            $slug = \Illuminate\Support\Str::slug($title);
            $data = [
                'title' => $title,
                'slug' => $slug,
                'body' => $body,
                'excerpt' => $excerpt,
                'status' => $source->status,
                'language_id' => $this->targetLanguageId,
                'source_id' => $source->id,
                'user_id' => $source->user_id,
                'category_id' => $source->category_id,
            ];
            if ($existing) {
                $existing->update($data);
            } else {
                Post::create($data);
            }
        }
    }
}
