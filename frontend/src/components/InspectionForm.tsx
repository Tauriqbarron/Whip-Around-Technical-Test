import { useState } from "react";
import type { Car, Inspection } from "../types";
import { createInspection } from "../api/api";

/**
 * =================================================================
 * INSPECTION FORM — components/InspectionForm.tsx
 * =================================================================
 *
 * Form to create a new inspection via POST /inspections.
 *
 * =================================================================
 * PROPS: InspectionFormProps
 * =================================================================
 *   cars: Car[]
 *     — list of cars to populate the dropdown selector
 *   onInspectionCreated: (inspection: Inspection) => void
 *     — callback invoked after successful creation so the parent
 *       can refresh the inspection list
 *
 * =================================================================
 * STATE
 * =================================================================
 *   carId:       string   (default: "")  — stored as string for <select> control
 *   wipers:      boolean  (default: false)
 *   engineSound: boolean  (default: false)
 *   headlights:  boolean  (default: false)
 *   errors:      string[] (default: [])
 *   loading:     boolean  (default: false)
 *
 * =================================================================
 * COMPONENT: InspectionForm({ cars, onInspectionCreated }: InspectionFormProps)
 * =================================================================
 * Renders a form with a car dropdown, three checkboxes, and a submit button.
 *
 * Form fields:
 *   - Car: <select> dropdown
 *     - Default option: "Select a car..." (value="", disabled)
 *     - One <option> per car: value={car.id}, label={car.name} ({car.make} {car.model})
 *   - Wipers:      <input type="checkbox">
 *   - Engine Sound: <input type="checkbox">
 *   - Headlights:  <input type="checkbox">
 *
 * =================================================================
 * FUNCTION: handleSubmit(e: FormEvent)
 * =================================================================
 * Called on form submission.
 *
 * - e.preventDefault()
 * - Clear previous errors
 * - Set loading to true
 * - Call createInspection({
 *     carId: parseInt(carId),
 *     wipers,
 *     engineSound,
 *     headlights
 *   })
 * - On success:
 *   - Call onInspectionCreated(createdInspection)
 *   - Reset form: carId to "", all checkboxes to false
 * - On error (catch):
 *   - If error has 'details' array, set errors to that array
 *   - If error has 'error' string, set errors to [error.error]
 * - Set loading to false in a finally block
 *
 * =================================================================
 * EDGE CASE
 * =================================================================
 * If cars array is empty, show a message instead of the form:
 *   "Add a car first before creating an inspection."
 *
 * =================================================================
 * ERROR DISPLAY
 * =================================================================
 * Same pattern as CarForm — show errors in a red container above the form.
 *
 * =================================================================
 * FORM STYLING (Tailwind)
 * =================================================================
 *   - Same card styling as CarForm (bg-white, rounded-lg, shadow, p-6)
 *   - Select: same input styling as CarForm text inputs
 *   - Checkboxes: inline with label, use flex items-center gap-2
 *     Checkbox group: flex gap-6
 *   - Submit button: same as CarForm
 *
 * =================================================================
 */
interface InspectionFormProps {
  cars: Car[];
  onInspectionCreated: (inspection: Inspection) => void;
}

export default function InspectionForm({ cars, onInspectionCreated }: InspectionFormProps) {
    const [carId, setCarId] = useState("");
    const [wipers, setWipers] = useState(false);
    const [engineSound, setEngineSound] = useState(false);
    const [headlights, setHeadlights] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const selectStyle = "w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const spanStyle = "text-sm text-gray-700";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
    const inputStyle = "form-checkbox h-5 w-5 text-blue-600";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);
        try {
            const createdInspection = await createInspection({
                carId: parseInt(carId),
                wipers,
                engineSound,
                headlights
            });
            onInspectionCreated(createdInspection);
            // Reset form
            setCarId("");
            setWipers(false);
            setEngineSound(false);
            setHeadlights(false);
        } catch (error: unknown) { 
            const err = error as { details?: string[]; error?: string };
            if (err.details) {
                setErrors(err.details);
            } else if (err.error) {
                setErrors([err.error]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {cars.length === 0 ? (
                <p className="text-gray-700">Add a car first before creating an inspection.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Error display */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4">
                            {errors.map((error, index) => (
                                <p key={index} className="text-sm">{error}</p>
                            ))}
                        </div>
                    )}
                    {/* Car selector */}
                    <div className="mb-4">
                        <label className={labelStyle}>Car</label>
                        <select
                            value={carId}
                            onChange={(e) => setCarId(e.target.value)}
                            className={selectStyle}
                            required
                        >
                            <option value="" disabled>Select a car...</option>
                            {cars.map((car) => (
                                <option key={car.id} value={car.id}>
                                    {car.name} ({car.make} {car.model})
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Checkboxes */}
                    <div className="mb-4 flex gap-6">
                        <label className={labelStyle}>
                            <input
                                type="checkbox"
                                checked={wipers}
                                onChange={(e) => setWipers(e.target.checked)}
                                className={inputStyle}
                            />
                            <span className={spanStyle}>Wipers</span>
                        </label>
                        <label className={labelStyle}>
                            <input
                                type="checkbox"
                                checked={engineSound}
                                onChange={(e) => setEngineSound(e.target.checked)}
                                className={inputStyle}
                            />
                            <span className={spanStyle}>Engine Sound</span>
                        </label>
                        <label className={labelStyle}>
                            <input
                                type="checkbox"
                                checked={headlights}
                                onChange={(e) => setHeadlights(e.target.checked)}
                                className={inputStyle}
                            />
                            <span className={spanStyle}>Headlights</span>
                        </label>
                    </div>
                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Creating..." : "Create Inspection"}
                    </button>
                </form>
            )}
        </div>  
    );
}