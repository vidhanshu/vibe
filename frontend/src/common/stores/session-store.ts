import { NSAuth } from "@/src/auth/types";
import { create } from "zustand";

interface SessionStore {
  user: NSAuth.User | null;
  isLoading: boolean;
  setSession: (user: NSAuth.User | null) => void;
}

const useSessionStore = create<SessionStore>()((set) => ({
  isLoading: true,
  user: null,
  setSession(user) {
    set({ user, isLoading: false });
  },
}));

export default useSessionStore;
