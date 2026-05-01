import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuthProvider(): AuthContextType {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Refresh token when app comes to foreground
    const appStateListener = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
      appState.current = nextState;
    });

    return () => {
      subscription.unsubscribe();
      appStateListener.remove();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user: session?.user ?? null, loading, signOut };
}

export const useAuth = () => useContext(AuthContext);
