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
                ['message' => ['content' => 'Bu konuda onemli noktalar su sekildedir.']],
            ],
        ], 200),
    ]);
    config(['ai.openai.api_key' => 'test-key']);
});

test('content paragraph endpoint returns generated content for authenticated admin', function () {
    $response = $this->actingAs($this->user)
        ->postJson(route('admin.ai.content.paragraph'), [
            'heading_or_context' => 'Saglikli yasam',
            'tone' => '',
        ]);

    $response->assertSuccessful();
    $response->assertJsonStructure(['content']);
    $this->assertSame('Bu konuda onemli noktalar su sekildedir.', $response->json('content'));
});

test('content paragraph requires authentication', function () {
    $response = $this->postJson(route('admin.ai.content.paragraph'), [
        'heading_or_context' => 'Test',
    ]);

    $response->assertUnauthorized();
});
