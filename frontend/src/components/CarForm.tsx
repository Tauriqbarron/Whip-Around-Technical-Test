import { useState } from "react";
import type { Car } from "../types";

/**
 * =================================================================
 * CAR FORM — components/CarForm.tsx
 * =================================================================
 *
 * Form to create a new car via POST /cars.
 *
 * =================================================================
 * PROPS: CarFormProps
 * =================================================================
 *   onCarCreated: (car: Car) => void
 *     — callback invoked after successful creation so the parent
 *       can refresh the car list without a full re-fetch
 *
 * =================================================================
 * STATE
 * =================================================================
 *   name:     string  (default: "")
 *   make:     string  (default: "")
 *   model:    string  (default: "")
 *   year:     string  (default: "")  — stored as string for input control
 *   errors:   string[]  (default: [])  — validation errors from API
 *   loading:  boolean   (default: false)
 *
 * =================================================================
 * COMPONENT: CarForm({ onCarCreated }: CarFormProps)
 * =================================================================
 * Renders a form with four input fields and a submit button.
 *
 * Form fields:
 *   - Name:  <input type="text">
 *   - Make:  <input type="text">
 *   - Model: <input type="text">
 *   - Year:  <input type="number">
 *
 * =================================================================
 * FUNCTION: handleSubmit(e: FormEvent)
 * =================================================================
 * Called on form submission.
 *
 * - e.preventDefault()
 * - Clear previous errors
 * - Set loading to true
 * - Call createCar({ name, make, model, year: parseInt(year) })
 * - On success:
 *   - Call onCarCreated(createdCar)
 *   - Reset all form fields to defaults
 * - On error (catch):
 *   - If error has 'details' array, set errors to that array
 *   - If error has 'error' string, set errors to [error.error]
 * - Set loading to false in a finally block
 *
 * =================================================================
 * ERROR DISPLAY
 * =================================================================
 * If errors array is not empty, render a div above the form
 * with each error as a list item.
 *
 * Tailwind:
 *   - Error container: bg-red-50, border border-red-200, text-red-700,
 *     rounded, p-3, mb-4
 *   - Each error: text-sm
 *
 * =================================================================
 * FORM STYLING (Tailwind)
 * =================================================================
 *   - Form wrapper: bg-white, rounded-lg, shadow, p-6
 *   - Labels: block, text-sm, font-medium, text-gray-700, mb-1
 *   - Inputs: w-full, border border-gray-300, rounded, p-2,
 *     focus:outline-none, focus:ring-2, focus:ring-blue-500
 *   - Submit button: bg-blue-600, text-white, px-4, py-2, rounded,
 *     hover:bg-blue-700, disabled:opacity-50
 *   - Field spacing: mb-4 on each field group
 *
 * =================================================================
 */
export interface CarFormProps {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);
        try {
            const response = await fetch("/cars", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, make, model, year: parseInt(year) }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.details) {
                    setErrors(errorData.details);
                } else if (errorData.error) {
                    setErrors([errorData.error]);
                }
            } else {
                const createdCar = await response.json();
                onCarCreated(createdCar);
                setName("");
                setMake("");
                setModel("");
                setYear("");
            }
        } catch (error) {
            console.error("Error creating car:", error);
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