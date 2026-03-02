import type { Car, Inspection, CarFormData, InspectionFormData } from "../types";

const API_BASE = "http://localhost:8000";

export async function getCars(): Promise<Car[]> { 
    const res = await fetch(`${API_BASE}/cars`);
    return res.json();
}

export async function createCar(data: CarFormData): Promise<Car> { 
    const res = await fetch(`${API_BASE}/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorBody = await res.json();
        throw errorBody;
    }
    return res.json();
}

export async function getInspections(): Promise<Inspection[]> { 
    const res = await fetch(`${API_BASE}/inspections`);
    return res.json();
}

export async function createInspection(data: InspectionFormData): Promise<Inspection> { 
    const res = await fetch(`${API_BASE}/inspections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorBody = await res.json();
        throw errorBody;
    }
    return res.json();
}   
/**
 * =================================================================
 * API SERVICE — api/api.ts
 * =================================================================
 *
 * All fetch() calls to the PHP backend.
 * Base URL: "http://localhost:8000"
 *
 * Store the base URL in a const at the top of the file:
 *   const API_BASE = "http://localhost:8000";
 *
 * All functions are async, return typed promises,
 * and throw on non-OK responses.
 *
 * =================================================================
 * FUNCTION: getCars(): Promise<Car[]>
 * =================================================================
 * - GET {API_BASE}/cars
 * - Returns: array of Car objects
 *
 * =================================================================
 * FUNCTION: createCar(data: CarFormData): Promise<Car>
 * =================================================================
 * - POST {API_BASE}/cars
 * - Headers: { "Content-Type": "application/json" }
 * - Body: JSON.stringify(data)
 * - Returns: the created Car object
 * - On non-OK response: parse the JSON error body and throw it
 *   so the calling component can display validation errors
 *
 * =================================================================
 * FUNCTION: getInspections(): Promise<Inspection[]>
 * =================================================================
 * - GET {API_BASE}/inspections
 * - Returns: array of Inspection objects
 *
 * =================================================================
 * FUNCTION: createInspection(data: InspectionFormData): Promise<Inspection>
 * =================================================================
 * - POST {API_BASE}/inspections
 * - Headers: { "Content-Type": "application/json" }
 * - Body: JSON.stringify(data)
 * - Returns: the created Inspection object
 * - On non-OK response: parse the JSON error body and throw it
 *   so the calling component can display validation errors
 *
 * =================================================================
 * ERROR HANDLING PATTERN
 * =================================================================
 * For POST functions, handle errors like this:
 *
 *   const res = await fetch(url, options);
 *   if (!res.ok) {
 *     const errorBody = await res.json();
 *     throw errorBody;  // { error: "...", details?: [...] }
 *   }
 *   return res.json();
 *
 * This lets components catch and display the error/details
 * from the API validation response.
 *
 * =================================================================
 */
