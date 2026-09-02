import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Radio, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface LoginViewProps {
  onNavigate: (route: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Échec de la connexion. Vérifiez vos identifiants.');
    } else {
      setSuccessMsg('Connexion réussie ! Redirection vers votre tableau de bord...');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 700);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 border border-purple-400/40 text-white shadow-xl shadow-purple-950 mb-2">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            TELECOM LAB
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Connectez-vous à votre espace ingénieur & étudiant
          </p>
        </div>

        {/* Card Box */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel-glow border border-purple-500/30 space-y-6">
          {!isConfigured && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-sans flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold font-mono">Configuration requise : </span>
                Ajoutez <code className="text-purple-300">VITE_SUPABASE_URL</code> et <code className="text-purple-300">VITE_SUPABASE_PUBLISHABLE_KEY</code> dans vos variables d'environnement.
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-sans flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-sans flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                Adresse Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ingenieur@telecomlab.org"
                className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono text-xs transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  Mot de Passe
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('reset-password')}
                  className="text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono text-xs transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <span>Connexion Sécurisée</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 font-sans">
              Vous n'avez pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-purple-400 hover:text-purple-300 font-mono font-bold underline decoration-purple-500/50 underline-offset-4"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Authentification sécurisée & PostgreSQL Row-Level-Security (RLS)</span>
        </div>
      </div>
    </div>
  );
};
