export interface Car {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
}

export interface Inspection {
  id: number;
  carId: number;
  wipers: boolean;
  engineSound: boolean;
  headlights: boolean;
  performedAt: string;
}

export type CarFormData = Omit<Car, 'id'>;
export type InspectionFormData = Omit<Inspection, 'id' | 'performedAt'>;