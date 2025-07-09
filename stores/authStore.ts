import { create } from "zustand";

interface AuthState {
  user: { uid: string; email: string | null } | null;
  setUser: (user: { uid: string; email: string | null } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
