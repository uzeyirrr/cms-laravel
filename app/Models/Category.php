<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'language_id', 'source_id'];

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    public function source(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'source_id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(Category::class, 'source_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
