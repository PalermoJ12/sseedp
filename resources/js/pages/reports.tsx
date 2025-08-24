import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '/reports' },
];

export default function Reports() {
    const { report, filters, analytics, allSports, allRegions } = usePage().props as any;
    const [region, setRegion] = useState(filters.region || "");
    const [division, setDivision] = useState(filters.division || "");
    const [sport, setSport] = useState(filters.sport || "");
    const [activeTab, setActiveTab] = useState('detailed');
    const [expandedSchools, setExpandedSchools] = useState<{ [key: string]: boolean }>({});

    // Calculate overall statistics
    const calculateOverallStats = () => {
        let totalSchools = 0;
        let totalSubmitted = 0;
        let totalQuantity = 0;
        let totalPsf = 0;
        let totalDisbursed = 0;

        Object.values(report).forEach((divisions: any) => {
            Object.values(divisions).forEach((data: any) => {
                totalSchools += data.school_count;
                totalSubmitted += data.submitted_schools;
                totalQuantity += data.total_quantity;
                totalPsf += data.total_psf;
                totalDisbursed += data.total_disbursed;
            });
        });

        return {
            totalSchools,
            totalSubmitted,
            totalPending: totalSchools - totalSubmitted,
            completionRate: totalSchools > 0 ? ((totalSubmitted / totalSchools) * 100).toFixed(1) : '0',
            totalQuantity,
            totalPsf,
            totalDisbursed
        };
    };

    const overallStats = calculateOverallStats();

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();

        // Create Sheets
        const summarySheet = workbook.addWorksheet("Regional Summary");
        const detailSheet = workbook.addWorksheet("Detailed Report");
        const sportSheet = workbook.addWorksheet("Sport Items by Region");

        // Enhanced styling
        const titleStyle = {
            font: { bold: true, size: 16, color: { argb: 'FFFFFF' } },
            alignment: { horizontal: "center" as const, vertical: "middle" as const },
            fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF4472C4' } },
            border: {
                top: { style: 'thin' as const },
                left: { style: 'thin' as const },
                bottom: { style: 'thin' as const },
                right: { style: 'thin' as const }
            }
        };

        const headerStyle = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "center" as const, vertical: "middle" as const },
            fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFE2EFDA' } },
            border: {
                top: { style: 'thin' as const },
                left: { style: 'thin' as const },
                bottom: { style: 'thin' as const },
                right: { style: 'thin' as const }
            }
        };

        const dataStyle = {
            alignment: { horizontal: "center" as const, vertical: "middle" as const },
            border: {
                top: { style: 'thin' as const },
                left: { style: 'thin' as const },
                bottom: { style: 'thin' as const },
                right: { style: 'thin' as const }
            }
        };

        // ========================
        // Summary Sheet
        // ========================
        summarySheet.columns = [
            { header: "Region/Division", key: "name", width: 30 },
            { header: "Total Schools", key: "total", width: 15, style: { numFmt: '#,##0' } },
            { header: "Submitted", key: "submitted", width: 15, style: { numFmt: '#,##0' } },
            { header: "Pending", key: "pending", width: 15, style: { numFmt: '#,##0' } },
            { header: "Completion %", key: "completion", width: 15 },
            { header: "Total Quantity", key: "quantity", width: 15, style: { numFmt: '#,##0' } },
            { header: "Total PSF", key: "psf", width: 18, style: { numFmt: '#,##0.00' } },
            { header: "Total Disbursed", key: "disbursed", width: 20, style: { numFmt: '#,##0.00' } },
        ];

        const overallRow = summarySheet.addRow({
            name: "OVERALL SUMMARY",
            total: overallStats.totalSchools,
            submitted: overallStats.totalSubmitted,
            pending: overallStats.totalPending,
            completion: overallStats.completionRate + '%',
            quantity: overallStats.totalQuantity,
            psf: overallStats.totalPsf,
            disbursed: overallStats.totalDisbursed
        });
        overallRow.eachCell((cell) => Object.assign(cell, titleStyle));
        summarySheet.addRow([]);

        Object.entries(report).forEach(([region, divisions]: any) => {
            let regionSchools = 0, regionSubmitted = 0, regionQuantity = 0, regionPsf = 0, regionDisbursed = 0;

            Object.values(divisions).forEach((data: any) => {
                regionSchools += data.school_count;
                regionSubmitted += data.submitted_schools;
                regionQuantity += data.total_quantity;
                regionPsf += data.total_psf;
                regionDisbursed += data.total_disbursed;
            });

            const regionCompletion = regionSchools > 0 ? ((regionSubmitted / regionSchools) * 100).toFixed(1) : '0';

            const regionRow = summarySheet.addRow({
                name: region,
                total: regionSchools,
                submitted: regionSubmitted,
                pending: regionSchools - regionSubmitted,
                completion: regionCompletion + '%',
                quantity: regionQuantity,
                psf: regionPsf,
                disbursed: regionDisbursed
            });
            regionRow.eachCell((cell) => Object.assign(cell, headerStyle));

            Object.entries(divisions).forEach(([division, data]: any) => {
                const divisionCompletion = data.school_count > 0 ? ((data.submitted_schools / data.school_count) * 100).toFixed(1) : '0';
                const divRow = summarySheet.addRow({
                    name: `  → ${division}`,
                    total: data.school_count,
                    submitted: data.submitted_schools,
                    pending: data.school_count - data.submitted_schools,
                    completion: divisionCompletion + '%',
                    quantity: data.total_quantity,
                    psf: data.total_psf,
                    disbursed: data.total_disbursed
                });
                divRow.eachCell((cell) => Object.assign(cell, dataStyle));
            });
        });

        // ========================
        // Detailed Report
        // ========================
        detailSheet.columns = [
            { header: "Region", key: "region", width: 20 },
            { header: "Division", key: "division", width: 25 },
            { header: "School ID", key: "school_id", width: 15 },
            { header: "School", key: "school", width: 35 },
            { header: "Status", key: "status", width: 15 },
            { header: "Quantity", key: "quantity", width: 15 },
            { header: "PSF", key: "psf", width: 18 },
            { header: "Disbursed", key: "disbursed", width: 20 },
        ];

        // Apply header style to detailed sheet
        detailSheet.getRow(1).eachCell((cell) => Object.assign(cell, headerStyle));

        Object.entries(report).forEach(([region, divisions]: any) => {
            Object.entries(divisions).forEach(([division, data]: any) => {
                data.schools.forEach((s: any) => {
                    const row = detailSheet.addRow({
                        region: region,
                        division: division,
                        school_id: s.school_id,
                        school: s.school_name,
                        status: s.submitted ? 'Submitted' : 'Pending',
                        quantity: s.quantity,
                        psf: s.psf,
                        disbursed: s.disbursed,
                    });
                    row.eachCell((cell) => Object.assign(cell, dataStyle));
                });
            });
        });

        // ========================
        // ✅ UPDATED: Sport Items by Region Sheet (Filtered Based on Sport Selection)
        // ========================

        // ✅ Use regions from the filtered report data (only regions with sport inventory)
        const regionsList = Object.keys(report).sort();

        // ✅ Initialize sport item data structure based on filter
        const sportItemData: Record<string, Record<string, number>> = {};
        const allSportItemsList: string[] = [];

        // ✅ If sport filter is applied, only include items from that sport
        if (filters.sport) {
            // Get items from the filtered report data
            Object.entries(report).forEach(([region, divisions]: any) => {
                Object.values(divisions).forEach((data: any) => {
                    data.schools.forEach((school: any) => {
                        school.items.forEach((item: any) => {
                            const sportName = item.sport || "Unknown Sport";
                            const itemName = item.item_name || "General Items";
                            const sportItemKey = `${sportName} - ${itemName}`;

                            // Initialize if not exists
                            if (!sportItemData[sportItemKey]) {
                                allSportItemsList.push(sportItemKey);
                                sportItemData[sportItemKey] = {};
                                regionsList.forEach(r => {
                                    sportItemData[sportItemKey][r] = 0;
                                });
                            }

                            // Add quantity
                            sportItemData[sportItemKey][region] += item.quantity || 0;
                        });
                    });
                });
            });
        } else {
            // ✅ If NO sport filter, show ALL sports and items from database (original behavior)
            if (allSports && allSports.length > 0) {
                allSports.forEach((sport: any) => {
                    const sportName = sport.sport_name || "Unknown Sport";

                    if (sport.items && sport.items.length > 0) {
                        // Sport has specific items
                        sport.items.forEach((item: any) => {
                            const itemName = item.item_name || "General Items";
                            const sportItemKey = `${sportName} - ${itemName}`;

                            if (!allSportItemsList.includes(sportItemKey)) {
                                allSportItemsList.push(sportItemKey);
                                sportItemData[sportItemKey] = {};
                                regionsList.forEach(r => {
                                    sportItemData[sportItemKey][r] = 0;
                                });
                            }
                        });
                    } else {
                        // Sport without specific items - create general entry
                        const sportItemKey = `${sportName} - General Items`;
                        if (!allSportItemsList.includes(sportItemKey)) {
                            allSportItemsList.push(sportItemKey);
                            sportItemData[sportItemKey] = {};
                            regionsList.forEach(r => {
                                sportItemData[sportItemKey][r] = 0;
                            });
                        }
                    }
                });
            }

            // Populate actual data from report
            Object.entries(report).forEach(([region, divisions]: any) => {
                Object.values(divisions).forEach((data: any) => {
                    data.schools.forEach((school: any) => {
                        school.items.forEach((item: any) => {
                            const sportName = item.sport || "Unknown Sport";
                            const itemName = item.item_name || "General Items";
                            const sportItemKey = `${sportName} - ${itemName}`;

                            // Add to existing entry or create new if not in database
                            if (!sportItemData[sportItemKey]) {
                                allSportItemsList.push(sportItemKey);
                                sportItemData[sportItemKey] = {};
                                regionsList.forEach(r => {
                                    sportItemData[sportItemKey][r] = 0;
                                });
                            }

                            sportItemData[sportItemKey][region] += item.quantity || 0;
                        });
                    });
                });
            });
        }

        // Sort the sport-item list
        allSportItemsList.sort();

        // Setup columns for sport sheet
        const sportColumns = [
            { header: "Sport - Item", key: "sportItem", width: 35 }
        ];
        regionsList.forEach(region => {
            sportColumns.push({
                header: region,
                key: `region_${region.replace(/\s+/g, '_')}`,
                width: 15
            });
        });
        sportColumns.push({ header: "Total", key: "total", width: 15 });

        sportSheet.columns = sportColumns;

        // ✅ UPDATED: Add dynamic title row based on filter
        let titleText = filters.sport
            ? `SPORT ITEMS DISTRIBUTION BY REGION - ${filters.sport.toUpperCase()}`
            : 'COMPLETE SPORT ITEMS DISTRIBUTION BY REGION (All Available Items)';

        if (filters.region) titleText += ` - Region: ${filters.region}`;
        if (filters.division) titleText += ` - Division: ${filters.division}`;

        const titleRow = sportSheet.insertRow(1, [titleText]);
        titleRow.getCell(1).value = titleText;
        sportSheet.mergeCells(1, 1, 1, sportColumns.length);
        titleRow.getCell(1).style = titleStyle;
        titleRow.height = 25;

        // Add header row
        const headerRow = sportSheet.addRow(sportColumns.map(col => col.header));
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows for sport-item combinations
        allSportItemsList.forEach(sportItem => {
            const rowData: any = { sportItem };
            let total = 0;

            regionsList.forEach(region => {
                const quantity = sportItemData[sportItem] && sportItemData[sportItem][region] ?
                    sportItemData[sportItem][region] : 0;
                rowData[`region_${region.replace(/\s+/g, '_')}`] = quantity;
                total += quantity;
            });

            rowData.total = total;
            const row = sportSheet.addRow(rowData);
            row.eachCell((cell, colNumber) => {
                Object.assign(cell, dataStyle);
                if (colNumber > 1) cell.numFmt = '#,##0';   // apply to numeric cols
            });

            const totalCell = row.getCell(sportColumns.length);
            totalCell.font = { bold: true };
            totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } };
        });

        // Add totals row at bottom
        const totalsRowData: any = { sportItem: 'GRAND TOTAL' };
        let grandTotal = 0;

        regionsList.forEach(region => {
            const regionTotal = allSportItemsList.reduce((sum, sportItem) => {
                return sum + (sportItemData[sportItem] && sportItemData[sportItem][region] ?
                    sportItemData[sportItem][region] : 0);
            }, 0);
            totalsRowData[`region_${region.replace(/\s+/g, '_')}`] = regionTotal;
            grandTotal += regionTotal;
        });
        totalsRowData.total = grandTotal;

        const totalsRow = sportSheet.addRow(totalsRowData);
        totalsRow.eachCell((cell, colNumber) => {
            Object.assign(cell, titleStyle);
            if (colNumber > 1) cell.numFmt = '#,##0';
        });

        // Auto-fit columns
        [summarySheet, detailSheet, sportSheet].forEach(sheet => {
            sheet.columns.forEach(column => {
                if (column.header) {
                    let maxLength = column.header.length;
                    column.eachCell?.({ includeEmpty: false }, (cell) => {
                        const cellLength = cell.value ? cell.value.toString().length : 0;
                        if (cellLength > maxLength) {
                            maxLength = cellLength;
                        }
                    });
                    column.width = Math.min(maxLength + 2, 50);
                }
            });
        });

        // ✅ Generate filename based on filters
        let filename = "sports_report";
        if (filters.sport) filename += `_${filters.sport.replace(/\s+/g, '_')}`;
        if (filters.region) filename += `_${filters.region.replace(/\s+/g, '_')}`;
        if (filters.division) filename += `_${filters.division.replace(/\s+/g, '_')}`;
        filename += ".xlsx";

        // Save Excel
        const buf = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buf]), filename);
    };

    const toggleExpand = (schoolId: string) => {
        setExpandedSchools((prev) => ({
            ...prev,
            [schoolId]: !prev[schoolId]
        }));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">Comprehensive School Reports</h1>

                {/* Overall Statistics Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Overall Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-2xl font-bold text-blue-600">{overallStats.totalSchools}</div>
                            <div className="text-sm text-gray-600">Total Schools</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-2xl font-bold text-green-600">{overallStats.totalSubmitted}</div>
                            <div className="text-sm text-gray-600">Submitted</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-2xl font-bold text-orange-600">{overallStats.totalPending}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-2xl font-bold text-purple-600">{overallStats.completionRate}%</div>
                            <div className="text-sm text-gray-600">Completion Rate</div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h3 className="text-md font-semibold mb-4">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                            <input
                                type="text"
                                placeholder="Filter by Region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                            <input
                                type="text"
                                placeholder="Filter by Division"
                                value={division}
                                onChange={(e) => setDivision(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                            <select
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Sports</option>
                                {allSports && allSports.map((s: any) => (
                                    <option key={s.id} value={s.sport_name || s.name}>{s.sport_name || s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                onClick={() =>
                                    window.location.href = `/reports?region=${region}&division=${division}&sport=${sport}`
                                }
                            >
                                Apply Filter
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                onClick={exportToExcel}
                            >
                                Export Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'summary'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Regional Summary
                            </button>
                            <button
                                onClick={() => setActiveTab('detailed')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'detailed'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Detailed View
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'summary' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Regional Completion Summary</h2>
                        {Object.entries(report).map(([region, divisions]: any) => {
                            // Calculate region totals
                            let regionSchools = 0;
                            let regionSubmitted = 0;
                            let regionQuantity = 0;
                            let regionPsf = 0;
                            let regionDisbursed = 0;

                            Object.values(divisions).forEach((data: any) => {
                                regionSchools += data.school_count;
                                regionSubmitted += data.submitted_schools;
                                regionQuantity += data.total_quantity;
                                regionPsf += data.total_psf;
                                regionDisbursed += data.total_disbursed;
                            });

                            const regionCompletion = regionSchools > 0 ? ((regionSubmitted / regionSchools) * 100).toFixed(1) : '0';
                            const regionPending = regionSchools - regionSubmitted;

                            return (
                                <div key={region} className="border rounded-lg shadow">
                                    <div className="bg-gray-50 px-4 py-3 border-b">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">{region}</h3>
                                            <div className="flex space-x-4 text-sm">
                                                <span className="bg-blue-100 px-2 py-1 rounded">
                                                    {regionSchools} Total
                                                </span>
                                                <span className="bg-green-100 px-2 py-1 rounded">
                                                    {regionSubmitted} Submitted
                                                </span>
                                                <span className="bg-orange-100 px-2 py-1 rounded">
                                                    {regionPending} Pending
                                                </span>
                                                <span className="bg-purple-100 px-2 py-1 rounded font-semibold">
                                                    {regionCompletion}% Complete
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <div className="bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${regionCompletion}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="text-left p-2">Division</th>
                                                    <th className="text-center p-2">Total</th>
                                                    <th className="text-center p-2">Submitted</th>
                                                    <th className="text-center p-2">Pending</th>
                                                    <th className="text-center p-2">Completion</th>
                                                    <th className="text-right p-2">Total Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(divisions).map(([division, data]: any) => {
                                                    const divisionCompletion = data.school_count > 0 ? ((data.submitted_schools / data.school_count) * 100).toFixed(1) : '0';
                                                    const divisionPending = data.school_count - data.submitted_schools;

                                                    return (
                                                        <tr key={division} className="border-b hover:bg-gray-50">
                                                            <td className="p-2 font-medium">{division}</td>
                                                            <td className="text-center p-2">{data.school_count}</td>
                                                            <td className="text-center p-2 text-green-600">{data.submitted_schools}</td>
                                                            <td className="text-center p-2 text-orange-600">{divisionPending}</td>
                                                            <td className="text-center p-2">
                                                                <span className={`px-2 py-1 rounded text-xs ${parseFloat(divisionCompletion) >= 80 ? 'bg-green-100 text-green-800' :
                                                                    parseFloat(divisionCompletion) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    {divisionCompletion}%
                                                                </span>
                                                            </td>
                                                            <td className="text-right p-2">
                                                                ₱{data.total_disbursed.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Detailed View (existing content) */}
                {activeTab === 'detailed' && (
                    <div className="space-y-6">
                        {Object.entries(report).map(([region, divisions]: any) => (
                            <div key={region} className="mb-6 border rounded-lg shadow">
                                <h2 className="text-xl font-bold bg-gray-100 px-4 py-2">{region}</h2>
                                {Object.entries(divisions).map(([division, data]: any) => (
                                    <div key={division} className="ml-4 mb-4 p-4 border-t">
                                        {/* Division Header (unchanged) */}

                                        <table className="w-full border text-sm">
                                            <thead className="bg-gray-200 text-left">
                                                <tr>
                                                    <th className="p-2"></th>
                                                    <th className="p-2">School ID</th>
                                                    <th className="p-2">School</th>
                                                    <th className="p-2">Status</th>
                                                    <th className="p-2">Quantity</th>
                                                    <th className="p-2">PSF</th>
                                                    <th className="p-2">Disbursed</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.schools.map((s: any) => {
                                                    const hasSubmission = s.quantity > 0 || s.psf > 0 || s.disbursed > 0;
                                                    const isExpanded = expandedSchools[s.school_id] || false;

                                                    return (
                                                        <React.Fragment key={s.school_id}>
                                                            <tr
                                                                className="border-b hover:bg-gray-50 cursor-pointer"
                                                                onClick={() => toggleExpand(s.school_id)}
                                                            >
                                                                <td className="p-2 text-gray-500">
                                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                                </td>
                                                                <td className="p-2">{s.school_id}</td>
                                                                <td className="p-2">{s.school_name}</td>
                                                                <td className="p-2">
                                                                    <span className={`px-2 py-1 rounded text-xs ${hasSubmission
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {hasSubmission ? 'Submitted' : 'Pending'}
                                                                    </span>
                                                                </td>
                                                                <td className="p-2">{s.quantity}</td>
                                                                <td className="p-2">₱{s.psf.toLocaleString()}</td>
                                                                <td className="p-2">₱{s.disbursed.toLocaleString()}</td>
                                                            </tr>

                                                            {/* Expanded Item List */}
                                                            {isExpanded && (
                                                                <tr className="bg-gray-50">
                                                                    <td colSpan={7} className="p-0"> {/* remove extra padding so child table aligns */}
                                                                        {s.items && s.items.length > 0 ? (
                                                                            <table className="w-full text-xs border-t table-fixed">
                                                                                <thead className="bg-gray-100">
                                                                                    <tr>
                                                                                        <th className="p-2 w-1/3 text-left">Item</th>
                                                                                        <th className="p-2 w-1/3 text-left">Sport</th>
                                                                                        <th className="p-2 w-1/3 text-left">Quantity</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {s.items.map((item: any, idx: number) => (
                                                                                        <tr key={idx} className="border-t">
                                                                                            <td className="p-2">{item.item_name}</td>
                                                                                            <td className="p-2">{item.sport}</td>
                                                                                            <td className="p-2">{item.quantity}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        ) : (
                                                                            <div className="p-2 text-gray-500 text-sm">No items submitted</div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )}

                                                        </React.Fragment>
                                                    );
                                                })}
                                                <tr className="font-bold bg-gray-100">
                                                    <td colSpan={4} className="p-2">{division} TOTAL</td>
                                                    <td className="p-2">{data.total_quantity}</td>
                                                    <td className="p-2">₱{data.total_psf.toLocaleString()}</td>
                                                    <td className="p-2">₱{data.total_disbursed.toLocaleString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}