import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContextType, UserProfile, UserRole } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch or initialize user profile from 'profiles' table in Supabase
  const fetchProfile = async (userId: string, userEmail?: string, userMeta?: any) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile from Supabase:', profileError.message);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Auto-provision initial profile row if missing
        const newProfile: UserProfile = {
          id: userId,
          full_name: userMeta?.full_name || userEmail?.split('@')[0] || 'Ingénieur Télécom',
          avatar_url: userMeta?.avatar_url || null,
          role: 'STUDENT' as UserRole,
          speciality: 'Réseaux & Télécoms IP',
          bio: 'Étudiant / Ingénieur en cours de spécialisation sur TELECOM LAB.',
        };

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .maybeSingle();

        if (insertError) {
          console.warn('Profile auto-create notice:', insertError.message);
          setProfile(newProfile);
        } else if (inserted) {
          setProfile(inserted as UserProfile);
        }
      }
    } catch (err: any) {
      console.error('Unexpected error in profile fetch:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Initial session retrieval
    supabase.auth.getSession().then(({ data: { session: initialSession }, error: sessionError }) => {
      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id, initialSession.user.email, initialSession.user.user_metadata);
      }
      setIsLoading(false);
    });

    // Listen to Auth State Changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id, currentSession.user.email, currentSession.user.user_metadata);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase n\'est pas encore configuré. Veuillez renseigner VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.' } };
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'STUDENT',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return { error: signUpError };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email, { full_name: fullName });
      }

      return { error: null };
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue');
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase n\'est pas encore configuré. Veuillez renseigner VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.' } };
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return { error: signInError };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
      }

      return { error: null };
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue');
      return { error: err };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase n\'est pas configuré.' } };
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
        return { error: resetError };
      }
      return { error: null };
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réinitialisation');
      return { error: err };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !isSupabaseConfigured) {
      return { error: { message: 'Utilisateur non connecté ou Supabase non configuré' } };
    }

    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        return { error: updateError };
      }

      if (data) {
        setProfile(data as UserProfile);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
