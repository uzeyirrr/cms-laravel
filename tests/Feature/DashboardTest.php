<?php

use App\Models\Role;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users without admin role cannot visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertForbidden();
});

test('authenticated users with admin role can visit the dashboard', function () {
    $user = User::factory()->create();
    $admin = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $user->roles()->attach($admin);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});