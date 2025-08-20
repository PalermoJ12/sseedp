<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\InventorySummary;
use App\Models\Sport;
use App\Models\SportItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $search = request('search');

        $sports = Sport::all();
        $items = SportItem::all();

        $inventoryQuery = Inventory::with(['sport', 'item'])
            ->where('school_id', $user->school_id)
            ->when($search, function ($query, $search) {
                $query->whereHas('sport', function ($q) use ($search) {
                    $q->where('sport_name', 'like', "%{$search}%");
                })
                    ->orWhereHas('item', function ($q) use ($search) {
                        $q->where('item_name', 'like', "%{$search}%");
                    });
            });

        // Join sports table to order by sport_name
        $inventory = $inventoryQuery
            ->join('sports', 'inventories.sport_id', '=', 'sports.id')
            ->select('inventories.*') // Keep inventory columns
            ->orderBy('sports.sport_name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('inventory', [
            'sports' => $sports,
            'items' => $items,
            'inventory' => $inventory,
            'user' => $user,
            'filters' => ['search' => $search],
        ]);
    }



    public function store(Request $request)
    {
        $request->validate([
            'school_id' => 'required',
            'entries' => 'required|array',
            'entries.*.sport_id' => 'required|exists:sports,id',
            'entries.*.item_id' => 'required|exists:sport_items,id',
            'entries.*.quantity' => 'required|integer|min:1',
        ]);

        foreach ($request->entries as $entry) {
            // Check if inventory already exists
            $inventory = Inventory::where('user_id', $request->user_id)
                ->where('school_id', $request->school_id)
                ->where('sport_id', $entry['sport_id'])
                ->where('item_id', $entry['item_id'])
                ->first();

            if ($inventory) {
                // Increment quantity
                $inventory->increment('quantity', $entry['quantity']);
            } else {
                // Create new inventory entry
                Inventory::create([
                    'user_id' => $request->user_id,
                    'school_id' => $request->school_id,
                    'sport_id' => $entry['sport_id'],
                    'item_id' => $entry['item_id'],
                    'quantity' => $entry['quantity'],
                    'isShow' => 1
                ]);
            }
        }

        return redirect()->back()->with('success', 'Inventory updated successfully!');
    }


    public function update(Request $request, Inventory $inventory)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $inventory->update([
            'quantity' => $request->quantity
        ]);

        return redirect()->back()->with('success', 'Inventory quantity updated!');
    }

    public function destroy(Inventory $inventory)
    {
        $inventory->delete();
        return redirect()->back()->with('success', 'Inventory entry deleted!');
    }


    public function finalize(Request $request)
    {
        $request->validate([
            'downloaded_psf_per_sub' => 'required|numeric|min:0',
            'disbursed_amount' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();

        $totalQuantity = Inventory::where('school_id', $user->school_id)->sum('quantity');

        InventorySummary::updateOrCreate(
            [
                'school_id' => $user->school_id, // condition (if this exists, update it)
            ],
            [
                'user_id' => $user->id,
                'total_quantity' => (int) $totalQuantity,
                'downloaded_psf_per_sub' => $request->downloaded_psf_per_sub,
                'disbursed_amount' => $request->disbursed_amount,
            ]
        );

        return redirect()->back()->with('success', 'Inventory summary finalized successfully!');
    }

}
