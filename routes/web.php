<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Onboarding
    Route::get('onboarding', [\App\Http\Controllers\Auth\OnboardingController::class, 'show'])->name('onboarding');
    Route::post('onboarding', [\App\Http\Controllers\Auth\OnboardingController::class, 'store'])->name('onboarding.store');

    // User Routes
    Route::middleware(['role:user', 'profile.complete'])->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\TicketController::class, 'index'])->name('dashboard');
        Route::get('tickets', [\App\Http\Controllers\TicketController::class, 'tickets'])->name('tickets.index');
        Route::get('tickets/create', [\App\Http\Controllers\TicketController::class, 'create'])->name('tickets.create');
        Route::post('tickets', [\App\Http\Controllers\TicketController::class, 'store'])->name('tickets.store');
        Route::get('tickets/{ticket:ticket_number}', [\App\Http\Controllers\TicketController::class, 'show'])->name('tickets.show');
        Route::post('tickets/{ticket:ticket_number}/reply', [\App\Http\Controllers\TicketController::class, 'reply'])->name('tickets.reply');
    });

    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Admin\TicketController::class, 'index'])->name('dashboard');
        Route::get('tickets', [\App\Http\Controllers\Admin\TicketController::class, 'tickets'])->name('tickets.index');
        Route::get('tickets/{ticket:ticket_number}', [\App\Http\Controllers\Admin\TicketController::class, 'show'])->name('tickets.show');
        Route::put('tickets/{ticket:ticket_number}', [\App\Http\Controllers\Admin\TicketController::class, 'update'])->name('tickets.update');
        Route::delete('tickets/{ticket:ticket_number}', [\App\Http\Controllers\Admin\TicketController::class, 'destroy'])->name('tickets.destroy');
        Route::post('tickets/{ticket:ticket_number}/status', [\App\Http\Controllers\Admin\TicketController::class, 'updateStatus'])->name('tickets.status');
        Route::post('tickets/{ticket:ticket_number}/reply', [\App\Http\Controllers\Admin\TicketController::class, 'reply'])->name('tickets.reply');
        
        Route::get('activity-logs', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity-logs.index');
        
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->except(['create', 'show', 'edit']);
    });

    // Super Admin Routes
    Route::middleware(['role:super_admin'])->prefix('super-admin')->name('superadmin.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\SuperAdmin\UserController::class, 'index'])->name('dashboard');
        Route::post('users/{user}/role', [\App\Http\Controllers\SuperAdmin\UserController::class, 'updateRole'])->name('users.role');
        Route::delete('users/{user}', [\App\Http\Controllers\SuperAdmin\UserController::class, 'destroy'])->name('users.destroy');
        
        Route::get('activity-logs', [\App\Http\Controllers\SuperAdmin\ActivityLogController::class, 'index'])->name('activity-logs.index');
    });

});

require __DIR__.'/settings.php';

