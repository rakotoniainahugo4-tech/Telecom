import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  User, 
  Mail, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Award,
  Upload,
  Camera,
  Trash2,
  Sparkles,
  ImageIcon
} from 'lucide-react';

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

/**
 * Redimensionne et compresse l'image sélectionnée au format carré JPEG optimisé.
 * Garantit une excellente fluidité, une persistance Base64 légère et une compatibilité maximale.
 */
const compressImageToSquareDataUrl = (file: File, targetDimension = 400): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Fichier image invalide ou non pris en charge.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;

          // Recadrage centré carré
          const minDim = Math.min(width, height);
          const sourceX = (width - minDim) / 2;
          const sourceY = (height - minDim) / 2;

          const outputDim = Math.min(minDim, targetDimension);
          canvas.width = outputDim;
          canvas.height = outputDim;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, sourceX, sourceY, minDim, minDim, 0, 0, outputDim, outputDim);

          const resultDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(resultDataUrl);
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Téléversement facultatif dans le bucket Supabase Storage 'avatars'
 */
const uploadAvatarToSupabaseStorage = async (file: File, userId: string): Promise<string | null> => {
  if (!isSupabaseConfigured) return null;
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanExt = ['png', 'jpg', 'jpeg', 'webp'].includes(fileExt) ? fileExt : 'jpg';
    const filePath = `${userId}/${Date.now()}.${cleanExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      // Fallback gracieux vers Base64
      console.info('Supabase Storage notice (persistance Base64 active) :', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (err: any) {
    console.info('Supabase Storage exception :', err?.message || err);
    return null;
  }
};

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [speciality, setSpeciality] = useState(profile?.speciality || SPECIALITIES[0]);
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  // Gestion du téléversement de photo
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setSpeciality(profile.speciality || SPECIALITIES[0]);
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
      setPreviewUrl(null);
      setSelectedFile(null);
      setAvatarRemoved(false);
    }
  }, [profile]);

  const processFile = (file: File) => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Format non supporté. Veuillez sélectionner une image (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('L\'image dépasse la taille maximale autorisée (10 Mo).');
      return;
    }

    setSelectedFile(file);
    setAvatarRemoved(false);

    // Aperçu dynamique instantané
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAvatarUrl('');
    setAvatarRemoved(true);
    setFileError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);

    let finalAvatarUrl: string | null = avatarRemoved ? null : (avatarUrl.trim() || null);

    // Si une nouvelle photo a été sélectionnée par l'utilisateur
    if (selectedFile) {
      try {
        // 1. Conversion Base64 haute performance
        const base64Data = await compressImageToSquareDataUrl(selectedFile);
        finalAvatarUrl = base64Data;

        // 2. Tentative de téléversement dans le bucket Supabase 'avatars'
        if (user?.id && isSupabaseConfigured) {
          const storageUrl = await uploadAvatarToSupabaseStorage(selectedFile, user.id);
          if (storageUrl) {
            finalAvatarUrl = storageUrl;
          }
        }
      } catch (err: any) {
        setSaving(false);
        setSaveError(err.message || 'Erreur lors du traitement de l\'image.');
        return;
      }
    }

    const { error } = await updateProfile({
      full_name: fullName.trim(),
      speciality: speciality,
      bio: bio.trim(),
      avatar_url: finalAvatarUrl,
    });

    setSaving(false);

    if (error) {
      setSaveError(error.message || 'Erreur lors de la mise à jour du profil.');
    } else {
      setAvatarUrl(finalAvatarUrl || '');
      setPreviewUrl(null);
      setSelectedFile(null);
      setAvatarRemoved(false);
      setSaveSuccess(true);
      await refreshProfile();
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const role = profile?.role || 'STUDENT';
  const displayAvatar = avatarRemoved ? '' : (previewUrl || avatarUrl);
  const hasCustomPhoto = Boolean(displayAvatar);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1">
            <span>// ESPACE MEMBRE TELECOM LAB</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[10px]">
              ROLE: {role}
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            PROFIL INGÉNIEUR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Gérez vos informations de compte, votre parcours de formation et votre photo de profil.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-300 border border-cyan-500/20 text-xs font-mono transition-all"
          >
            Accéder au Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Photo Uploader */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl glass-panel-glow border border-cyan-500/30 p-6 flex flex-col items-center text-center space-y-4">
            {/* Avatar container with interactive change trigger */}
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-500/50 bg-[#09111e] flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-950/60 cursor-pointer relative transition-all group-hover:border-cyan-400"
              >
                {displayAvatar ? (
                  <img 
                    src={displayAvatar} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (!previewUrl) setAvatarUrl('');
                    }}
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}

                {/* Hover overlay with camera icon */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                  <Camera className="w-5 h-5 text-cyan-300" />
                  <span className="text-[10px] font-mono font-bold text-cyan-200">
                    {hasCustomPhoto ? 'Changer' : 'Ajouter'}
                  </span>
                </div>
              </div>

              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-emerald-500 text-black font-mono font-bold text-[10px] uppercase shadow-md">
                Actif
              </span>
            </div>

            {previewUrl && (
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Aperçu (non enregistré)</span>
              </span>
            )}

            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {fullName || user?.email?.split('@')[0] || 'Ingénieur Télécom'}
              </h3>
              <p className="text-xs font-mono text-cyan-300 mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Role Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Statut : {role}</span>
            </div>

            {/* Meta info table */}
            <div className="w-full pt-4 border-t border-cyan-500/15 space-y-2 text-left text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Spécialité :</span>
                <span className="text-slate-200 text-right truncate max-w-[150px]">{speciality.split('(')[0]}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ID Utilisateur :</span>
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

          {/* Photo Management Card */}
          <div className="rounded-2xl glass-panel border border-cyan-500/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>Photo de Profil</span>
              </span>
              {hasCustomPhoto && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Personnalisée
                </span>
              )}
            </div>

            {/* Hidden Input for local photo selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Drag & Drop interactive zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center text-center gap-2.5 ${
                isDragging 
                  ? 'border-cyan-400 bg-cyan-950/40 scale-[1.02]' 
                  : 'border-cyan-500/30 bg-[#09111e]/70 hover:bg-cyan-950/25 hover:border-cyan-400/60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-white">
                  {hasCustomPhoto ? 'Changer de photo' : 'Téléverser une photo'}
                </p>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Glissez-déposez ou parcourez depuis votre appareil (PNG, JPG, WebP)
                </p>
              </div>
            </div>

            {fileError && (
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-[11px] font-sans flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span>{fileError}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-sky-950/80 hover:from-cyan-900/80 hover:to-sky-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-950/40 hover:border-cyan-300"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{hasCustomPhoto ? 'Changer de photo' : 'Téléverser une photo'}</span>
              </button>

              {hasCustomPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  title="Supprimer la photo"
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl glass-panel border border-cyan-500/15 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
              <h2 className="font-heading font-bold text-lg text-white">
                Modifier mes Informations Personnelles
              </h2>
              <span className="text-xs font-mono text-cyan-400">
                Synchronisation Instantanée
              </span>
            </div>

            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Votre profil et vos informations ont été enregistrés avec succès !</span>
              </div>
            )}

            {saveError && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs font-sans flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
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
                    className="w-full px-4 py-3 rounded-xl bg-[#09111e] border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl bg-[#09111e] border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer"
                >
                  {SPECIALITIES.map((spec, i) => (
                    <option key={i} value={spec} className="bg-[#0b1424] text-white">
                      {spec}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-4 py-3 rounded-xl bg-[#09111e] border border-cyan-500/20 text-white font-sans text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Dernière mise à jour : {profile?.updated_at ? new Date(profile.updated_at).toLocaleString('fr-FR') : 'Jamais'}
                </span>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 flex items-center gap-2 cursor-pointer border border-cyan-300/40"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-slate-950 stroke-[2.5]" />
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
