
import { ChargingRecord } from '../types';

const STORAGE_KEY = 'ev_charge_master_records';

export const saveRecords = (records: ChargingRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const loadRecords = (): ChargingRecord[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};
