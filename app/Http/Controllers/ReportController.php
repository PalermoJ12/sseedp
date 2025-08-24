<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Sport;
use App\Models\SportItem;
use App\Models\InventorySummary;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $region = $request->query('region');
        $division = $request->query('division');
        $sport = $request->query('sport');

        // Get all schools with optional filters
        $schoolsQuery = School::query()
            ->with([
                'summaries',
                'inventories' => function($query) use ($sport) {
                    // ✅ FIX: Pre-filter inventories at the relationship level
                    if ($sport) {
                        $query->where(function($subQuery) use ($sport) {
                            $subQuery->whereHas('item.sport', function ($sportQ) use ($sport) {
                                $sportQ->where('sport_name', 'like', "%$sport%");
                            })->orWhereHas('sport', function ($sportQ) use ($sport) {
                                $sportQ->where('sport_name', 'like', "%$sport%");
                            });
                        });
                    }
                },
                'inventories.item.sport',
                'inventories.sport'
            ])
            ->when($region, fn($q) => $q->where('region', 'like', "%$region%"))
            ->when($division, fn($q) => $q->where('division', 'like', "%$division%"));

        // ✅ FIX: Only include schools that have matching sport items when filtering
        if ($sport) {
            $schoolsQuery->whereHas('inventories', function ($subQ) use ($sport) {
                $subQ->whereHas('item.sport', function ($sportQ) use ($sport) {
                    $sportQ->where('sport_name', 'like', "%$sport%");
                })->orWhereHas('sport', function ($sportQ) use ($sport) {
                    $sportQ->where('sport_name', 'like', "%$sport%");
                });
            });
        }

        $schools = $schoolsQuery->orderBy('region')
            ->orderBy('division')
            ->orderBy('school_name')
            ->get();

        // Get ALL sports and items from database - ensure items are loaded
        $allSports = Sport::with('items')->orderBy('sport_name')->get();
        
        // Get all distinct regions from database (not just filtered results)
        $allRegions = School::distinct('region')
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->pluck('region')
            ->sort()
            ->values();

        // Build nested structure (region → division → schools)
        $report = [];

        foreach ($schools as $school) {
            $summary = $school->summaries;

            $regionKey = $school->region ?? 'Unknown Region';
            $divisionKey = $school->division ?? 'Unknown Division';

            if (!isset($report[$regionKey])) {
                $report[$regionKey] = [];
            }
            if (!isset($report[$regionKey][$divisionKey])) {
                $report[$regionKey][$divisionKey] = [
                    'schools' => [],
                    'total_quantity' => 0,
                    'total_psf' => 0,
                    'total_disbursed' => 0,
                    'school_count' => 0,
                    'submitted_schools' => 0,
                ];
            }

            $data = &$report[$regionKey][$divisionKey];

            // ✅ FIX: Since we pre-filtered at the relationship level, no need to filter again
            $filteredInventories = $school->inventories;

            // ✅ FIX: Calculate quantity and disbursed from the already filtered inventories
            $schoolQuantity = $filteredInventories->sum('quantity');
            $schoolDisbursed = $filteredInventories->sum('disbursed_amount');

            // For PSF, always use the summary since it's not item-specific
            $schoolPsf = $summary?->downloaded_psf_per_sub ?? 0;

            // Always increment school_count for every school in the filtered result
            $data['school_count']++;

            $data['schools'][] = [
                'school_id' => $school->school_id,
                'school_name' => $school->school_name,
                'quantity' => $schoolQuantity,
                'psf' => $schoolPsf,
                'disbursed' => $schoolDisbursed,
                'submitted' => $summary ? true : false,
                'items' => $filteredInventories->map(function ($inv) {
                    return [
                        'item_id' => $inv->item_id,
                        'item_name' => $inv->item?->item_name ?? 'General Item',
                        'sport' => $inv->item?->sport?->sport_name ?? $inv->sport?->sport_name ?? 'Unknown Sport',
                        'quantity' => $inv->quantity,
                        'disbursed' => $inv->disbursed_amount,
                    ];
                }),
            ];

            // ✅ FIX: Add to totals using the filtered values
            if ($summary) {
                $data['submitted_schools']++;
                $data['total_psf'] += $schoolPsf;
            }
            
            // Always add quantity and disbursed from filtered inventories
            $data['total_quantity'] += $schoolQuantity;
            $data['total_disbursed'] += $schoolDisbursed;
        }

        return Inertia::render('reports', [
            'report' => $report,
            'filters' => [
                'region' => $region,
                'division' => $division,
                'sport' => $sport,
            ],
            'allSports' => $allSports,
            'allRegions' => $allRegions,
            'analytics' => [],
        ]);
    }
}