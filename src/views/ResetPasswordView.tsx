import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Radio, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft
} from 'lucide-react';

interface ResetPasswordViewProps {
  onNavigate: (route: string) => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onNavigate }) => {
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Veuillez renseigner votre adresse email.');
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Erreur lors de la demande de réinitialisation.');
    } else {
      setSuccessMsg('Un lien de réinitialisation sécurisé a été envoyé à votre adresse email.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 border border-cyan-300/50 text-slate-950 shadow-xl shadow-cyan-950/60 mb-2">
            <Radio className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-heading font-black text-white tracking-tight">
            RÉINITIALISER LE MOT DE PASSE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Recevez un lien par email pour définir un nouveau mot de passe
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl glass-panel-glow border border-cyan-500/30 space-y-6">
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
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Votre Adresse Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ingenieur@telecomlab.org"
                className="w-full px-4 py-3 rounded-xl bg-[#09111e] border border-cyan-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-xs transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 cursor-pointer border border-cyan-300/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span>Envoyer le lien de récupération</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-cyan-500/15 text-center">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour à la page de connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
