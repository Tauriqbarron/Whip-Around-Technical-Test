import { useState, type SubmitEvent } from "react";
import type { Car, Inspection } from "../types";
import { createInspection } from "../api/api";

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
    const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
    const checkboxLabelStyle = "flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer";

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
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
                        <label className={checkboxLabelStyle}>
                            <input
                                type="checkbox"
                                checked={wipers}
                                onChange={(e) => setWipers(e.target.checked)}
                            />
                            Wipers
                        </label>
                        <label className={checkboxLabelStyle}>
                            <input
                                type="checkbox"
                                checked={engineSound}
                                onChange={(e) => setEngineSound(e.target.checked)}
                            />
                            Engine Sound
                        </label>
                        <label className={checkboxLabelStyle}>
                            <input
                                type="checkbox"
                                checked={headlights}
                                onChange={(e) => setHeadlights(e.target.checked)}
                            />
                            Headlights
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