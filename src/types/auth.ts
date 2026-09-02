export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  speciality?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any | null }>;
  refreshProfile: () => Promise<void>;
}
