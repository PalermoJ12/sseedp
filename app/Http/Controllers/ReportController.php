<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\School;
use App\Models\InventorySummary;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $region = $request->query('region');
        $division = $request->query('division');

        // Get all schools with optional filters
        $schoolsQuery = School::query()
            ->with([
                'summaries',
                'inventories.item',
                'inventories.sport'
            ])
            ->when($region, fn($q) => $q->where('region', 'like', "%$region%"))
            ->when($division, fn($q) => $q->where('division', 'like', "%$division%"))
            ->orderBy('region')
            ->orderBy('division')
            ->orderBy('school_name');

        $schools = $schoolsQuery->get();

        // Build nested structure (region → division → schools)
        $report = [];

        foreach ($schools as $school) {
            $summary = $school->summaries;
            if ($summary) {
                \Log::info("School {$school->school_name} has summary: " . json_encode([
                    'quantity' => $summary->total_quantity,
                    'psf' => $summary->downloaded_psf_per_sub,
                    'disbursed' => $summary->disbursed_amount
                ]));
            } else {
                \Log::info("School {$school->school_name} has NO summary");
            }

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
            \Log::info("School Inv:{$school->inventories} ");
            $data['schools'][] = [
                'school_id' => $school->school_id,
                'school_name' => $school->school_name,
                'quantity' => $summary?->total_quantity ?? 0,
                'psf' => $summary?->downloaded_psf_per_sub ?? 0,
                'disbursed' => $summary?->disbursed_amount ?? 0,
                'items' => $school->inventories->map(function ($inv) {
                    return [
                        'item_id' => $inv->item_id,
                        'item_name' => $inv->item?->item_name,
                        'sport' => $inv->sport?->sport_name,
                        'quantity' => $inv->quantity,
                        'disbursed' => $inv->disbursed_amount,
                    ];
                }),
            ];


            $data['school_count']++;
            if ($summary) {
                $data['submitted_schools']++;
                $data['total_quantity'] += $summary->total_quantity;
                $data['total_psf'] += $summary->downloaded_psf_per_sub;
                $data['total_disbursed'] += $summary->disbursed_amount;
            }
        }

        return Inertia::render('reports', [
            'report' => $report,
            'filters' => [
                'region' => $region,
                'division' => $division,
            ],
        ]);
    }
}
