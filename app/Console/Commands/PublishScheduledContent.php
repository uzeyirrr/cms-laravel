<?php

namespace App\Console\Commands;

use App\Models\Page;
use App\Models\Post;
use Illuminate\Console\Command;

class PublishScheduledContent extends Command
{
    protected $signature = 'cms:publish-scheduled';

    protected $description = 'Publish pages and posts where published_at is in the past';

    public function handle(): int
    {
        $now = now();

        $pages = Page::query()
            ->where('status', 'draft')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', $now)
            ->update(['status' => 'published']);

        $posts = Post::query()
            ->where('status', 'draft')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', $now)
            ->update(['status' => 'published']);

        $total = $pages + $posts;
        if ($total > 0) {
            $this->info("Published {$total} item(s).");
        }

        return self::SUCCESS;
    }
}
