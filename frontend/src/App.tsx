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

