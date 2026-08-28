"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useStore, setCurrentUserId } from "./store";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const setIsLoggedIn = useStore((s) => s.setIsLoggedIn);
  const loadServerCart = useStore((s) => s.loadServerCart);
  const clearLocalCart = useStore((s) => s.clearLocalCart);

  const signOut = useCallback(async () => {
    setCurrentUserId(null);
    await supabase.auth.signOut();
    clearLocalCart();
  }, [supabase, clearLocalCart]);

  useEffect(() => {
    // Get initial session without calling getUser() — avoids GoTrue lock on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setCurrentUserId(session.user.id);
        setIsLoggedIn(true);
        // Defer cart load to next tick so GoTrue lock is fully released
        setTimeout(() => loadServerCart(session.user.id), 0);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          setCurrentUserId(session.user.id);
          setIsLoggedIn(true);
          // Defer cart load to next tick — never call Supabase inside this callback
          setTimeout(() => loadServerCart(session.user.id), 0);
        } else {
          setCurrentUserId(null);
          clearLocalCart();
        }
      },
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
