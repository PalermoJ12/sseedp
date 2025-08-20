<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\SportItemController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ReportController;
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    // All users (admin + user) can access inventory
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventories.index');
    Route::post('/inventory', [InventoryController::class, 'store'])->name('inventories.store');
    Route::put('/inventory/{inventory}', [InventoryController::class, 'update'])->name('inventories.update');
    Route::delete('/inventory/{inventory}', [InventoryController::class, 'destroy'])->name('inventories.destroy');
    // Finalize submission -> inventory_summaries
    Route::post('/inventories/finalize', [InventoryController::class, 'finalize'])->name('inventories.finalize');
    // Only admins (role = 1)
    Route::middleware('role:1')->group(function () {
        // Route::get('dashboard', fn() => Inertia::render('dashboard'))
        //     ->name('dashboard');

        Route::resource('schools', SchoolController::class);

        // ITEMS CRUD
        Route::get('items', [SportItemController::class, 'index'])->name('items.index');
        Route::post('items', [SportItemController::class, 'store'])->name('items.store');
        Route::put('items/{item}', [SportItemController::class, 'update'])->name('items.update');
        Route::delete('items/{item}', [SportItemController::class, 'destroy'])->name('items.destroy');


        //REPORTS

        // routes/web.php
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    });
});


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');


//     Route::get('inventory', function () {
//         return Inertia::render('inventory');
//     })->name('inventory');

//     Route::get('schools', function () {
//         return Inertia::render('schools');
//     })->name('schools');


//     //ITEMS CRUD
//     Route::get('items', [SportItemController::class, 'index'])->name('items.index');
//     Route::get('/items', [SportItemController::class, 'index'])->name('items.index');
//     Route::post('/items', [SportItemController::class, 'store'])->name('items.store');
//     Route::put('/items/{item}', [SportItemController::class, 'update'])->name('items.update');
//     Route::delete('/items/{item}', [SportItemController::class, 'destroy'])->name('items.destroy');

// });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
