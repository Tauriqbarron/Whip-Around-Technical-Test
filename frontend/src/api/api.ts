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
