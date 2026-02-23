<?php

use App\Models\Language;
use App\Models\Page;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->language = Language::factory()->create(['code' => 'tr', 'is_active' => true]);
});

test('admin can access pages index', function () {
    $user = User::factory()->create();
    $user->roles()->attach(Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']));
    $this->actingAs($user);

    $response = $this->get(route('admin.pages.index'));
    $response->assertOk();
});

test('admin can create a page', function () {
    $user = User::factory()->create();
    $user->roles()->attach(Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']));
    $this->actingAs($user);

    $response = $this->post(route('admin.pages.store'), [
        'title' => 'Test Page',
        'slug' => 'test-page',
        'body' => 'Content',
        'status' => 'draft',
        'language_id' => $this->language->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('pages', ['slug' => 'test-page', 'title' => 'Test Page']);
});
