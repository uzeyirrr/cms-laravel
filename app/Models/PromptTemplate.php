<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PromptTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'system_prompt',
        'user_prompt_placeholder',
        'description',
        'category',
    ];

    protected static function booted(): void
    {
        static::creating(function (PromptTemplate $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }
}
