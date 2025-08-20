import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Schools', href: '/schools' },
];

export default function Reports() {
    const { report, filters, analytics } = usePage().props as any;
    const [region, setRegion] = useState(filters.region || "");
    const [division, setDivision] = useState(filters.division || "");
    const [activeTab, setActiveTab] = useState('detailed'); // 'detailed' or 'summary'
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

        // Create Summary Sheet
        const summarySheet = workbook.addWorksheet("Regional Summary");
        const detailSheet = workbook.addWorksheet("Detailed Report");

        // Styling helpers
        const titleStyle = {
            font: { bold: true, size: 14 },
            alignment: { horizontal: "center" as const },
            fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFE6F3FF' } }
        };
        const headerStyle = {
            font: { bold: true },
            alignment: { horizontal: "center" as const },
            fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFF0F0F0' } }
        };

        // Summary Sheet
        summarySheet.columns = [
            { header: "Region/Division", key: "name", width: 30 },
            { header: "Total Schools", key: "total", width: 15 },
            { header: "Submitted", key: "submitted", width: 15 },
            { header: "Pending", key: "pending", width: 15 },
            { header: "Completion %", key: "completion", width: 15 },
            { header: "Total Quantity", key: "quantity", width: 15 },
            { header: "Total PSF", key: "psf", width: 18 },
            { header: "Total Disbursed", key: "disbursed", width: 20 },
        ];

        // Add overall summary
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
        summarySheet.addRow([]); // Blank row

        Object.entries(report).forEach(([region, divisions]: any) => {
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

            // Add region summary
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

            // Add division details
            Object.entries(divisions).forEach(([division, data]: any) => {
                const divisionCompletion = data.school_count > 0 ? ((data.submitted_schools / data.school_count) * 100).toFixed(1) : '0';
                summarySheet.addRow({
                    name: `  → ${division}`,
                    total: data.school_count,
                    submitted: data.submitted_schools,
                    pending: data.school_count - data.submitted_schools,
                    completion: divisionCompletion + '%',
                    quantity: data.total_quantity,
                    psf: data.total_psf,
                    disbursed: data.total_disbursed
                });
            });
        });

        // Detailed Sheet (existing logic)
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

        Object.entries(report).forEach(([region, divisions]: any) => {
            Object.entries(divisions).forEach(([division, data]: any) => {
                data.schools.forEach((s: any) => {
                    const hasSubmission = s.quantity > 0 || s.psf > 0 || s.disbursed > 0;
                    detailSheet.addRow({
                        region: region,
                        division: division,
                        school_id: s.school_id,
                        school: s.school_name,
                        status: hasSubmission ? 'Submitted' : 'Pending',
                        quantity: s.quantity,
                        psf: s.psf,
                        disbursed: s.disbursed,
                    });
                });
            });
        });

        const buf = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buf]), "comprehensive_report.xlsx");
    };

    const toggleExpand = (schoolId: string) => {
        setExpandedSchools((prev) => ({
            ...prev,
            [schoolId]: !prev[schoolId]
        }));
    };

    console.log(report)
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

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Filter by Region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Filter by Division"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() =>
                            window.location.href = `/reports?region=${region}&division=${division}`
                        }
                    >
                        Apply Filter
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={exportToExcel}
                    >
                        Export Excel
                    </button>
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