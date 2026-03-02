import { useState, type SubmitEvent } from "react";
import type { Car } from "../types";
import { createCar } from "../api/api";

interface CarFormProps {
  onCarCreated: (car: Car) => void;
}

export default function CarForm({ onCarCreated }: CarFormProps) {
    const [name, setName] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const inputStyle = "w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);
        try {
            const createdCar = await createCar({
                name,
                make,
                model,
                year: parseInt(year),
            });
            onCarCreated(createdCar);
            setName("");
            setMake("");
            setModel("");
            setYear("");
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
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4">
            <ul>
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-gray-500">(e.g., "Van 1")</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={inputStyle}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Car"}
        </button>
    </form>  
    </div>  
  );
}