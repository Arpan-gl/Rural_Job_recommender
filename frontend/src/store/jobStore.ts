import { create } from 'zustand';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  matchScore: number;
  skills: string[];
  description: string;
  distance?: number;
}

interface JobFilters {
  keyword: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  distance: number;
}

interface JobState {
  jobs: Job[];
  filters: JobFilters;
  setJobs: (jobs: Job[]) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: JobFilters = {
  keyword: '',
  location: '',
  salaryMin: 0,
  salaryMax: 100000,
  distance: 50,
};

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  filters: defaultFilters,
  setJobs: (jobs) => set({ jobs }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
