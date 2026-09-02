import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContextType, UserProfile, UserRole } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'telecom_user_profile_';

const getLocalProfile = (userId: string): UserProfile | null => {
  try {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore JSON or localStorage access errors
  }
  return null;
};

const saveLocalProfile = (userId: string, profile: UserProfile) => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(profile));
  } catch {
    // ignore
  }
};

const isTableMissingError = (err: any): boolean => {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const code = err.code || '';
  return (
    code === 'PGRST205' ||
    code === 'PGRST204' ||
    code === '42P01' ||
    msg.includes('could not find the table') ||
    msg.includes('relation "public.profiles" does not exist') ||
    msg.includes('schema cache')
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch or initialize user profile from 'profiles' table or graceful fallback
  const fetchProfile = async (userId: string, userEmail?: string, userMeta?: any) => {
    if (!isSupabaseConfigured) return;

    // 1. Prepare baseline profile from cached local storage or user metadata
    const cached = getLocalProfile(userId);
    const baselineProfile: UserProfile = cached || {
      id: userId,
      full_name: userMeta?.full_name || userEmail?.split('@')[0] || 'Ingénieur Télécom',
      avatar_url: userMeta?.avatar_url || null,
      role: (userMeta?.role as UserRole) || 'STUDENT',
      speciality: userMeta?.speciality || 'Réseaux & Télécoms IP',
      bio: userMeta?.bio || 'Étudiant / Ingénieur en cours de spécialisation sur TELECOM LAB.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        if (isTableMissingError(profileError)) {
          // Table not created yet on Supabase - use baseline profile seamlessly
          setProfile(baselineProfile);
          saveLocalProfile(userId, baselineProfile);
          return;
        } else if (profileError.code !== 'PGRST116') {
          console.warn('Notice fetching profile from Supabase:', profileError.message);
        }
      }

      if (data) {
        const fullProf = { ...baselineProfile, ...data } as UserProfile;
        setProfile(fullProf);
        saveLocalProfile(userId, fullProf);
      } else {
        // Auto-provision initial profile row in Supabase if table exists
        const newProfile: UserProfile = {
          id: userId,
          full_name: userMeta?.full_name || baselineProfile.full_name,
          avatar_url: userMeta?.avatar_url || baselineProfile.avatar_url,
          role: (userMeta?.role as UserRole) || 'STUDENT',
          speciality: baselineProfile.speciality,
          bio: baselineProfile.bio,
        };

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .maybeSingle();

        if (insertError) {
          if (!isTableMissingError(insertError)) {
            console.warn('Profile auto-create notice:', insertError.message);
          }
          setProfile(newProfile);
          saveLocalProfile(userId, newProfile);
        } else if (inserted) {
          setProfile(inserted as UserProfile);
          saveLocalProfile(userId, inserted as UserProfile);
        } else {
          setProfile(newProfile);
          saveLocalProfile(userId, newProfile);
        }
      }
    } catch (err: any) {
      // Graceful fallback on network or schema error
      setProfile(baselineProfile);
      saveLocalProfile(userId, baselineProfile);
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
            speciality: 'Réseaux & Télécoms IP',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return { error: signUpError };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email, { full_name: fullName, role: 'STUDENT' });
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
    if (!user) {
      return { error: { message: 'Utilisateur non connecté' } };
    }

    const updatedData: UserProfile = {
      ...(profile || {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Ingénieur Télécom',
        avatar_url: null,
        role: 'STUDENT',
      }),
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Always update React state & local persistence immediately
    setProfile(updatedData);
    saveLocalProfile(user.id, updatedData);

    // Also update Supabase user metadata as fallback auth store
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: updatedData.full_name,
          avatar_url: updatedData.avatar_url,
          speciality: updatedData.speciality,
          bio: updatedData.bio,
        }
      });
    } catch {
      // non-fatal
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error: updateError } = await supabase
          .from('profiles')
          .update(updatedData)
          .eq('id', user.id)
          .select()
          .maybeSingle();

        if (updateError) {
          if (isTableMissingError(updateError)) {
            // Table doesn't exist yet on Supabase, but local storage and auth meta are updated
            return { error: null };
          }
          return { error: updateError };
        }

        if (data) {
          setProfile(data as UserProfile);
          saveLocalProfile(user.id, data as UserProfile);
        }
      } catch (err: any) {
        if (!isTableMissingError(err)) {
          console.warn('Profile sync notice:', err);
        }
      }
    }

    return { error: null };
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
