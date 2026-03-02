import type { Car } from '../types';

interface CarListProps {
  cars: Car[];
}

const tableHeaderStyle = "bg-gray-100 text-left p-3 font-semibold";
const tableCellStyle = "p-3 border-b border-gray-200";

export default function CarList({ cars }: CarListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={tableHeaderStyle}>ID</th>
              <th className={tableHeaderStyle}>Name</th>
              <th className={tableHeaderStyle}>Make</th>
              <th className={tableHeaderStyle}>Model</th>
              <th className={tableHeaderStyle}>Year</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan={5} className={tableCellStyle}>
                  No cars found.
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className={tableCellStyle}>{car.id}</td>
                  <td className={tableCellStyle}>{car.name}</td>
                  <td className={tableCellStyle}>{car.make}</td>
                  <td className={tableCellStyle}>{car.model}</td>
                  <td className={tableCellStyle}>{car.year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
    </div>
  );
}
