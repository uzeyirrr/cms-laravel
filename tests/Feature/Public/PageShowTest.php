<?php

use App\Models\Language;
use App\Models\Page;

beforeEach(function () {
    $this->language = Language::factory()->create(['code' => 'tr', 'is_active' => true]);
});

test('published page is visible at sayfa slug', function () {
    $page = Page::factory()->create([
        'slug' => 'about',
        'title' => 'About',
        'status' => 'published',
        'language_id' => $this->language->id,
    ]);

    $response = $this->get(route('public.page', ['slug' => 'about']).'?locale=tr');
    $response->assertOk();
});

test('draft page returns 404', function () {
    Page::factory()->create([
        'slug' => 'draft-page',
        'status' => 'draft',
        'language_id' => $this->language->id,
    ]);

    $response = $this->get(route('public.page', ['slug' => 'draft-page']).'?locale=tr');
    $response->assertNotFound();
});
