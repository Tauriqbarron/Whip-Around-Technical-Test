/**
 * =================================================================
 * APP — App.tsx
 * =================================================================
 *
 * Main application component with two-tab layout: Cars and Inspections.
 *
 * =================================================================
 * IMPORTS
 * =================================================================
 *   - useState, useEffect from 'react'
 *   - Car, Inspection from './types'
 *   - getCars, getInspections from './api/api'
 *   - CarList from './components/CarList'
 *   - CarForm from './components/CarForm'
 *   - InspectionList from './components/InspectionList'
 *   - InspectionForm from './components/InspectionForm'
 *
 * =================================================================
 * STATE
 * =================================================================
 *   activeTab:    'cars' | 'inspections'  (default: 'cars')
 *   cars:         Car[]                   (default: [])
 *   inspections:  Inspection[]            (default: [])
 *
 * =================================================================
 * FUNCTION: fetchCars(): Promise<void>
 * =================================================================
 * Calls getCars() and sets the cars state.
 * Called on mount and when a new car is created.
 *
 * =================================================================
 * FUNCTION: fetchInspections(): Promise<void>
 * =================================================================
 * Calls getInspections() and sets the inspections state.
 * Called on mount and when a new inspection is created.
 *
 * =================================================================
 * EFFECT: useEffect on mount
 * =================================================================
 * Call fetchCars() and fetchInspections() on initial render.
 * Both are needed regardless of active tab because:
 *   - InspectionForm needs cars for the dropdown
 *   - InspectionList needs cars to display car names
 *
 * =================================================================
 * FUNCTION: handleCarCreated(car: Car)
 * =================================================================
 * Callback passed to CarForm.
 * - Adds the new car to the cars array:
 *     setCars(prev => [car, ...prev])
 *   (prepend so newest appears first, matching ORDER BY id DESC)
 *
 * =================================================================
 * FUNCTION: handleInspectionCreated(inspection: Inspection)
 * =================================================================
 * Callback passed to InspectionForm.
 * - Adds the new inspection to the inspections array:
 *     setInspections(prev => [inspection, ...prev])
 *
 * =================================================================
 * COMPONENT LAYOUT
 * =================================================================
 * Structure:
 *
 *   <div>  — full page container, min-h-screen, bg-gray-50
 *
 *     <header>  — app header
 *       Title: "Fleet Maintenance"
 *       Tailwind: bg-white, shadow, p-4
 *
 *     <nav>  — tab navigation
 *       Two buttons: "Cars" and "Inspections"
 *       Active tab: bg-blue-600, text-white
 *       Inactive tab: bg-gray-200, text-gray-700, hover:bg-gray-300
 *       Tailwind: flex, gap-2, p-4
 *
 *     <main>  — content area, p-4, max-w-6xl, mx-auto
 *
 *       If activeTab === 'cars':
 *         <CarForm onCarCreated={handleCarCreated} />
 *         <CarList cars={cars} />
 *
 *       If activeTab === 'inspections':
 *         <InspectionForm cars={cars} onInspectionCreated={handleInspectionCreated} />
 *         <InspectionList inspections={inspections} cars={cars} />
 *
 *       Form always renders above the list.
 *       Add spacing between form and list: mb-6 on the form wrapper.
 *
 *   </div>
 *
 * =================================================================
 */

import { useEffect, useState } from "react";
import type { Car, Inspection } from "./types";
import { getCars, getInspections } from "./api/api";
import InspectionList from "./components/InspectionList";
import InspectionForm from "./components/InspectionForm";
import CarList from "./components/CarList";
import CarForm from "./components/CarForm";

export default function App() {
  const [activeTab, setActiveTab] = useState<'cars' | 'inspections'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);

  const onCarCreated = (car: Car) => {
    setCars(prev => [car, ...prev]);
  };

  const onInspectionCreated = (inspection: Inspection) => {
    setInspections(prev => [inspection, ...prev]);
  };

  useEffect(() => {
    let ignore = false;

    getCars().then(data => { if (!ignore) setCars(data); });
    getInspections().then(data => { if (!ignore) setInspections(data); });

    return () => { ignore = true; };
  }, []);


  return <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow p-4">
      <h1 className="text-2xl font-bold text-gray-800">Fleet Maintenance</h1>
    </header>
    <nav className="flex gap-2 p-4">
      <button
        onClick={() => setActiveTab('cars')}
        className={`px-4 py-2 rounded ${activeTab === 'cars' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        Cars
      </button>
      <button
        onClick={() => setActiveTab('inspections')}
        className={`px-4 py-2 rounded ${activeTab === 'inspections' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        Inspections
      </button>
    </nav>
    <main className="p-4 max-w-6xl mx-auto">
      {activeTab === 'cars' ? (
        <>
          <CarForm onCarCreated={onCarCreated} />
          <div className="mb-6" />
          <CarList cars={cars} />
        </>
      ) : (
        <>
          <InspectionForm cars={cars} onInspectionCreated={onInspectionCreated} />
          <div className="mb-6" />
          <InspectionList inspections={inspections} cars={cars} />
        </>
      )}
    </main>
  </div>;
}

