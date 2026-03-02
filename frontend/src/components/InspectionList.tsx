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
