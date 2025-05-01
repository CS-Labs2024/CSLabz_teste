import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  setupMFA: () => Promise<{ qr: string; secret: string }>;
  verifyMFA: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle session expiration and other auth events
      switch (event) {
        case 'SIGNED_OUT':
        case 'USER_DELETED':
          navigate('/auth/login');
          break;
        case 'TOKEN_REFRESHED':
          if (!session) {
            navigate('/auth/login');
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Refresh token periodically
  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;

    const setupRefreshTimer = () => {
      if (session?.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        const refreshTime = Math.max(0, timeUntilExpiry - 60000); // Refresh 1 minute before expiry

        refreshTimer = setTimeout(async () => {
          try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) {
              console.error('Error refreshing session:', error);
              await signOut();
            } else if (data.session) {
              setSession(data.session);
              setUser(data.session.user);
              setupRefreshTimer(); // Setup next refresh
            }
          } catch (err) {
            console.error('Failed to refresh session:', err);
            await signOut();
          }
        }, refreshTime);
      }
    };

    if (session) {
      setupRefreshTimer();
    }

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [session]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`,
        data: {
          email_confirmed: false,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Navigate after state is cleared
      navigate('/auth/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force navigation to login even if there's an error
      navigate('/auth/login');
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  const verifyEmail = async (token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });
    if (error) throw error;
  };

  const setupMFA = async () => {
    const { data, error } = await supabase.rpc('setup_mfa');
    if (error) throw error;
    return data;
  };

  const verifyMFA = async (token: string) => {
    const { data, error } = await supabase.rpc('verify_mfa', { token });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        verifyEmail,
        setupMFA,
        verifyMFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}