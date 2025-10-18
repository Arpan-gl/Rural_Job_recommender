import { create } from 'zustand';

interface UserProfile {
  name?: string;
  location?: string;
  skills: string[];
}

interface UserState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setSkills: (skills: string[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    skills: [],
  },
  setProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
    })),
  addSkill: (skill) =>
    set((state) => ({
      profile: {
        ...state.profile,
        skills: [...state.profile.skills, skill],
      },
    })),
  removeSkill: (skill) =>
    set((state) => ({
      profile: {
        ...state.profile,
        skills: state.profile.skills.filter((s) => s !== skill),
      },
    })),
  setSkills: (skills) =>
    set((state) => ({
      profile: { ...state.profile, skills },
    })),
}));
