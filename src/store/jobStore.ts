import { create } from 'zustand';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  payRange: string;
  skillMatch: number;
  description: string;
  requiredSkills: string[];
  category: string;
  distance?: string;
}

interface JobState {
  jobs: Job[];
  filteredJobs: Job[];
  filters: {
    keyword: string;
    location: string;
    minSalary: number;
    maxSalary: number;
    category: string;
    maxDistance: number;
  };
  savedJobs: string[];
  setJobs: (jobs: Job[]) => void;
  setFilters: (filters: Partial<JobState['filters']>) => void;
  applyFilters: () => void;
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  reset: () => void;
}

const defaultFilters = {
  keyword: '',
  location: '',
  minSalary: 0,
  maxSalary: 100000,
  category: '',
  maxDistance: 50,
};

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  filteredJobs: [],
  filters: defaultFilters,
  savedJobs: [],
  setJobs: (jobs) => {
    set({ jobs, filteredJobs: jobs });
    get().applyFilters();
  },
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().applyFilters();
  },
  applyFilters: () => {
    const { jobs, filters } = get();
    let filtered = [...jobs];

    if (filters.keyword) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((job) => job.category === filters.category);
    }

    set({ filteredJobs: filtered });
  },
  saveJob: (jobId) => set((state) => ({
    savedJobs: [...state.savedJobs, jobId]
  })),
  unsaveJob: (jobId) => set((state) => ({
    savedJobs: state.savedJobs.filter((id) => id !== jobId)
  })),
  reset: () => set({ jobs: [], filteredJobs: [], filters: defaultFilters, savedJobs: [] }),
}));
