import { create } from 'zustand';

interface UserState {
  skills: string[];
  experience: string;
  location: string;
  setSkills: (skills: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setExperience: (experience: string) => void;
  setLocation: (location: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  skills: [],
  experience: '',
  location: '',
  setSkills: (skills) => set({ skills }),
  addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
  removeSkill: (skill) => set((state) => ({
    skills: state.skills.filter((s) => s !== skill)
  })),
  setExperience: (experience) => set({ experience }),
  setLocation: (location) => set({ location }),
  reset: () => set({ skills: [], experience: '', location: '' }),
}));
