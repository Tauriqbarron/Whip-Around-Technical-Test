/**
 * =================================================================
 * INSPECTION LIST — components/InspectionList.tsx
 * =================================================================
 *
 * Displays all inspections in a table, with the car name shown
 * instead of just the carId.
 *
 * =================================================================
 * PROPS: InspectionListProps
 * =================================================================
 *   inspections: Inspection[]  — array of inspections from the parent
 *   cars:        Car[]         — array of cars, used to look up car
 *                                name by carId
 *
 * =================================================================
 * COMPONENT: InspectionList({ inspections, cars }: InspectionListProps)
 * =================================================================
 * Renders a table with columns:
 *   ID | Car | Wipers | Engine Sound | Headlights | Performed At
 *
 * - If inspections array is empty, show: "No inspections found."
 * - For the "Car" column: look up the car name from the cars array
 *   using inspection.carId. If not found, show "Unknown".
 *     const car = cars.find(c => c.id === inspection.carId)
 *     Display: car?.name ?? "Unknown"
 * - For boolean columns (wipers, engineSound, headlights):
 *   Display "Pass" (green text) if true, "Fail" (red text) if false
 * - For performedAt: format the datetime for display
 *   e.g., new Date(inspection.performedAt).toLocaleString()
 *
 * Tailwind styling:
 *   - Same table styling as CarList (w-full, border-collapse, etc.)
 *   - Pass text: text-green-600, font-medium
 *   - Fail text: text-red-600, font-medium
 *
 * =================================================================
 */

import type { Car, Inspection } from '../types';

interface InspectionListProps {
  inspections: Inspection[];
  cars: Car[];
}
export default function InspectionList({ inspections, cars }: InspectionListProps) {
    const tableHeaderStyle = "bg-gray-100 text-left p-3 font-semibold";
    const tableCellStyle = "p-3 border-b border-gray-200";
    const passStyle = "text-green-600 font-medium";
    const failStyle = "text-red-600 font-medium";
    const getPassFailStyle = (value: boolean) => value ? passStyle : failStyle;
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className={tableHeaderStyle}>ID</th>
                        <th className={tableHeaderStyle}>Car</th>
                        <th className={tableHeaderStyle}>Wipers</th>
                        <th className={tableHeaderStyle}>Engine Sound</th>
                        <th className={tableHeaderStyle}>Headlights</th>
                        <th className={tableHeaderStyle}>Performed At</th>
                    </tr>
                </thead>
                <tbody>
                    {inspections.length === 0 ? (
                        <tr>
                            <td colSpan={6} className={tableCellStyle}>
                                No inspections found.
                            </td>
                        </tr>
                    ) : (
                        inspections.map((inspection) => {
                            const car = cars.find(c => c.id === inspection.carId);
                            return (
                                <tr key={inspection.id} className="hover:bg-gray-50">
                                    <td className={tableCellStyle}>{inspection.id}</td>
                                    <td className={tableCellStyle}>{car?.name ?? "Unknown"}</td>
                                    <td className={`${tableCellStyle} ${getPassFailStyle(inspection.wipers)}`}>
                                        {inspection.wipers ? "Pass" : "Fail"}
                                    </td>
                                    <td className={`${tableCellStyle} ${getPassFailStyle(inspection.engineSound)}`}>
                                        {inspection.engineSound ? "Pass" : "Fail"}
                                    </td>
                                    <td className={`${tableCellStyle} ${getPassFailStyle(inspection.headlights)}`}>
                                        {inspection.headlights ? "Pass" : "Fail"}
                                    </td>
                                    <td className={tableCellStyle}>{new Date(inspection.performedAt).toLocaleString()}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
