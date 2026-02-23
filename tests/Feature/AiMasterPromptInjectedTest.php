<?php

use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->user->roles()->attach(Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']));
});

test('master prompt is included in AI request when calling ideas suggest', function () {
    Setting::setValue('ai_master_prompt', 'Test marka rehberi metni');

    $captured = null;
    Http::fake([
        'api.openai.com/*' => function ($request) use (&$captured) {
            $captured = $request;

            return Http::response([
                'choices' => [
                    ['message' => ['content' => "1. Konu bir\n2. Konu iki"]],
                ],
            ], 200);
        },
    ]);

    config(['ai.openai.api_key' => 'test-key']);

    $response = $this->actingAs($this->user)
        ->postJson(route('admin.ai.ideas.suggest'), [
            'category_or_keyword' => 'saglik',
            'locale' => 'tr',
            'limit' => 5,
        ]);

    $response->assertSuccessful();
    $this->assertNotNull($captured);
    $body = $captured->data();
    $this->assertArrayHasKey('messages', $body);
    $messages = $body['messages'];
    $systemContent = collect($messages)->firstWhere('role', 'system')['content'] ?? '';
    $this->assertStringContainsString('Test marka rehberi metni', $systemContent);
});
