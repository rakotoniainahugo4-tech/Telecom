import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Layers, 
  Radio, 
  Calendar, 
  Cpu, 
  KeyRound,
  Sparkles,
  Award
} from 'lucide-react';
import { Badge } from '../components/Badge';

interface ProfileViewProps {
  onNavigate: (route: string) => void;
}

const SPECIALITIES = [
  'Réseaux IP & Routage Avancé (BGP, OSPF, IS-IS)',
  'Architecture IP/MPLS & Services L3VPN',
  'Transmission Optique & Réseaux FTTH / GPON',
  'Ingénierie Radiofréquence & Mobile LTE / 5G',
  'VoIP & Téléphonie d\'Entreprise (SIP, Asterisk)',
  'Supervision & Exploitation NOC Télécom',
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [speciality, setSpeciality] = useState(profile?.speciality || SPECIALITIES[0]);
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setSpeciality(profile.speciality || SPECIALITIES[0]);
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);

    const { error } = await updateProfile({
      full_name: fullName.trim(),
      speciality: speciality,
      bio: bio.trim(),
      avatar_url: avatarUrl.trim() || null,
    });

    setSaving(false);

    if (error) {
      setSaveError(error.message || 'Erreur lors de la mise à jour du profil.');
    } else {
      setSaveSuccess(true);
      await refreshProfile();
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const role = profile?.role || 'STUDENT';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// ESPACE MEMBRE TELECOM LAB</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
              ROLE: {role}
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            PROFIL INGÉNIEUR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Gérez vos informations de compte, votre parcours de formation et votre spécialité télécom.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono transition-all"
          >
            Accéder au Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl glass-panel-glow border border-purple-500/30 p-6 flex flex-col items-center text-center space-y-4">
            {/* Avatar container */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-[#090912] flex items-center justify-center text-purple-300 shadow-xl shadow-purple-950/60">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={() => setAvatarUrl('')}
                  />
                ) : (
                  <User className="w-10 h-10" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-emerald-500 text-black font-mono font-bold text-[10px] uppercase">
                Actif
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {fullName || user?.email?.split('@')[0] || 'Ingénieur Télécom'}
              </h3>
              <p className="text-xs font-mono text-purple-300 mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Role Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>Statut : {role}</span>
            </div>

            {/* Meta info table */}
            <div className="w-full pt-4 border-t border-white/10 space-y-2 text-left text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Spécialité :</span>
                <span className="text-slate-200 text-right truncate max-w-[150px]">{speciality.split('(')[0]}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ID Supabase :</span>
                <span className="text-slate-200 font-mono text-[10px] truncate max-w-[140px]">{user?.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Membre depuis :</span>
                <span className="text-slate-200">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'Récent'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick preset avatars */}
          <div className="rounded-2xl glass-panel border border-white/10 p-5 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-300 block">
              Sélectionner un avatar rapide :
            </span>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border transition-all ${
                    avatarUrl === url ? 'border-purple-400 ring-2 ring-purple-500/50 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl glass-panel border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="font-heading font-bold text-lg text-white">
                Modifier mes Informations Personnelles
              </h2>
              <span className="text-xs font-mono text-purple-400">
                Persistance PostgreSQL Supabase
              </span>
            </div>

            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Votre profil a été synchronisé et enregistré avec succès dans la base Supabase !</span>
              </div>
            )}

            {saveError && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs font-sans flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    Nom Complet ou Pseudo d'Ingénieur
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    Adresse Email (Auth)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 text-slate-400 font-mono text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Parcours & Spécialisation Télécom Principale
                </label>
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  {SPECIALITIES.map((spec, i) => (
                    <option key={i} value={spec} className="bg-[#0e0e17] text-white">
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  URL personnalisée d'Avatar (optionnel)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/mon-avatar.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Bio / Objectifs professionnels Télécom
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Décrivez vos compétences actuelles, vos certifications visées (CCNA, CCNP, JNCIA, Nokia NRS) ou vos projets en cours..."
                  className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-purple-500 transition-colors leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Dernière mise à jour : {profile?.updated_at ? new Date(profile.updated_at).toLocaleString('fr-FR') : 'Jamais'}
                </span>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950 flex items-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Sauvegarder le Profil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
