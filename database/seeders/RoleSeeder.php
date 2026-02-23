<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Admin']
        );
        Role::firstOrCreate(
            ['slug' => 'editor'],
            ['name' => 'Editor']
        );

        $user = User::first();
        if ($user && ! $user->roles()->where('slug', 'admin')->exists()) {
            $user->roles()->attach($admin->id);
        }
    }
}
