<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->user->roles()->attach(Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']));

    Http::fake([
        'api.openai.com/*' => Http::response([
            'choices' => [
                ['message' => ['content' => "1. Saglikli beslenme\n2. Spor ve hareket\n3. Uyku duzeni"]],
            ],
        ], 200),
    ]);
    config(['ai.openai.api_key' => 'test-key']);
});

test('ideas suggest returns topics for authenticated admin', function () {
    $response = $this->actingAs($this->user)
        ->postJson(route('admin.ai.ideas.suggest'), [
            'category_or_keyword' => 'saglik',
            'locale' => 'tr',
            'limit' => 10,
        ]);

    $response->assertSuccessful();
    $response->assertJsonStructure(['topics']);
    $data = $response->json();
    $this->assertIsArray($data['topics']);
    $this->assertGreaterThan(0, count($data['topics']));
});

test('ideas suggest requires authentication', function () {
    $response = $this->postJson(route('admin.ai.ideas.suggest'), [
        'category_or_keyword' => 'test',
        'locale' => 'tr',
    ]);

    $response->assertUnauthorized();
});
