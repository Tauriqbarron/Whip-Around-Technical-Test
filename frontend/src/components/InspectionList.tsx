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
