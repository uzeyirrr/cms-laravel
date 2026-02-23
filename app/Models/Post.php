<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'body', 'featured_image',
        'published_at', 'user_id', 'category_id', 'language_id', 'source_id',
        'meta_title', 'meta_description', 'status',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    public function source(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'source_id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(Post::class, 'source_id');
    }

    public function relatedPosts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'post_related', 'post_id', 'related_post_id')->withTimestamps();
    }

    public function revisions(): MorphMany
    {
        return $this->morphMany(ContentRevision::class, 'subject')->latest();
    }
}
