<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePromptTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('accessAdmin') ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('prompt_templates')],
            'system_prompt' => ['required', 'string', 'max:10000'],
            'user_prompt_placeholder' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category' => ['nullable', 'string', 'max:100'],
        ];
    }
}
