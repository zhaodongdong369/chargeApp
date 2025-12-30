
export interface ChargingRecord {
  id: string;
  date: string; // ISO format
  energyKwh: number;
  durationMinutes: number;
  cost: number;
  balance: number;
  location?: string;
  notes?: string;
}

export type ViewType = 'history' | 'add' | 'stats';

export interface StatsSummary {
  totalCost: number;
  totalEnergy: number;
  avgCostPerKwh: number;
  sessionCount: number;
}
