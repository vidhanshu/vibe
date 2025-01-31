import { NSUser } from "@/src/users/types";
import { create } from "zustand";

interface SessionStore {
  user: NSUser.User | null;
  isLoading: boolean;
  setSession: (user: NSUser.User | null) => void;
}

const useSessionStore = create<SessionStore>()((set) => ({
  isLoading: true,
  user: null,
  setSession(user) {
    set({ user, isLoading: false });
  },
}));

export default useSessionStore;
