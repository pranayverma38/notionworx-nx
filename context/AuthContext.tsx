"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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

function waitForCartHydration(): Promise<void> {
  if (useStore.persist.hasHydrated()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsubscribe = useStore.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pendingCartLoadUserId = useRef<string | null>(null);
  const supabase = createClient();

  const setIsLoggedIn = useStore((s) => s.setIsLoggedIn);
  const loadServerCart = useStore((s) => s.loadServerCart);
  const clearLocalCart = useStore((s) => s.clearLocalCart);

  const signOut = useCallback(async () => {
    setCurrentUserId(null);
    await supabase.auth.signOut();
    clearLocalCart();
  }, [supabase, clearLocalCart]);

  const scheduleCartLoad = useCallback(
    (userId: string) => {
      if (pendingCartLoadUserId.current === userId) {
        return;
      }

      pendingCartLoadUserId.current = userId;

      setTimeout(() => {
        void waitForCartHydration()
          .then(() => loadServerCart(userId))
          .finally(() => {
            if (pendingCartLoadUserId.current === userId) {
              pendingCartLoadUserId.current = null;
            }
          });
      }, 0);
    },
    [loadServerCart],
  );

  useEffect(() => {
    // Get initial session without calling getUser() — avoids GoTrue lock on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setCurrentUserId(session.user.id);
        setIsLoggedIn(true);
        // Defer until the persisted cart store is hydrated to avoid
        // reloading stale server rows before local removals are restored.
        scheduleCartLoad(session.user.id);
      } else {
        pendingCartLoadUserId.current = null;
        setCurrentUserId(null);
        setIsLoggedIn(false);
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
          // Defer until the persisted cart store is hydrated.
          scheduleCartLoad(session.user.id);
        } else {
          pendingCartLoadUserId.current = null;
          setCurrentUserId(null);
          setIsLoggedIn(false);

          // Preserve guest carts during the initial no-session startup path.
          // Only clear persisted cart state when a real sign-out occurs.
          if (_event === "SIGNED_OUT") {
            clearLocalCart();
          }
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [scheduleCartLoad, supabase.auth, clearLocalCart, setIsLoggedIn]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
