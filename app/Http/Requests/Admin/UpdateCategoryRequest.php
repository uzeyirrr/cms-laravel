<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('category')) ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required', 'string', 'max:255',
                Rule::unique('categories')->where('language_id', $this->input('language_id', $category->language_id))->ignore($category->id),
            ],
            'description' => ['nullable', 'string'],
            'language_id' => ['required', 'exists:languages,id'],
            'source_id' => ['nullable', 'exists:categories,id'],
        ];
    }
}
