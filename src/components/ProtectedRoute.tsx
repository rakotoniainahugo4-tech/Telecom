import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Loader2, KeyRound } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate: (route: string) => void;
  requiredRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  onNavigate,
  requiredRole 
}) => {
  const { user, profile, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Vérification de la session Supabase...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-[60vh] max-w-xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6 pt-24">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <KeyRound className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-white">Supabase non configuré</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Pour activer l'authentification et les profils, veuillez renseigner <code className="text-purple-300 font-mono">VITE_SUPABASE_URL</code> et <code className="text-purple-300 font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code> dans vos variables d'environnement.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[65vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6 pt-24 pb-16">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-white">Authentification Requise</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Cette section (Tableau de bord, Profil & Progression) nécessite d'être connecté avec votre compte TELECOM LAB.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950"
          >
            Se Connecter
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-mono text-xs font-bold uppercase tracking-wider transition-all"
          >
            Créer un Compte
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6 pt-24">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-white">Accès Restreint</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Ce contenu requiert le rôle <span className="font-mono text-rose-300 font-bold">{requiredRole}</span>.
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold"
        >
          Retour au Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
