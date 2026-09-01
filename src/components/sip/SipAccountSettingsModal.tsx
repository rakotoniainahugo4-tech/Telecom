import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Server, 
  ShieldCheck, 
  Key, 
  User, 
  Check, 
  Layers, 
  Wifi, 
  RefreshCw,
  Sliders
} from 'lucide-react';
import { SipAccountConfig, SipTransport, SipAudioCodec } from '../../types/sip';

interface SipAccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SipAccountConfig;
  onSaveConfig: (newConfig: SipAccountConfig) => void;
}

const PRESET_PBX_SERVERS = [
  {
    name: 'Linphone Free SIP (linphone.org)',
    domain: 'sip.linphone.org',
    proxy: 'sip.linphone.org',
    port: 5060,
    transport: 'TLS' as SipTransport,
    codec: 'Opus (HD 48kHz)' as SipAudioCodec
  },
  {
    name: 'Asterisk / FreePBX Lab (Local 192.168.1.200)',
    domain: '192.168.1.200',
    proxy: '192.168.1.200',
    port: 5060,
    transport: 'UDP' as SipTransport,
    codec: 'G.711a (PCMA 64k)' as SipAudioCodec
  },
  {
    name: 'Kamailio / OpenSIPS IMS Core Server',
    domain: 'ims.tendry-telecom.mg',
    proxy: 'ims.tendry-telecom.mg',
    port: 5060,
    transport: 'TCP' as SipTransport,
    codec: 'G.722 (Wideband 64k)' as SipAudioCodec
  },
  {
    name: 'Telma / Orange IMS SIP Trunk (VoLTE & Fixed)',
    domain: 'ims.orange.mg',
    proxy: '10.244.12.1',
    port: 5060,
    transport: 'UDP' as SipTransport,
    codec: 'Opus (HD 48kHz)' as SipAudioCodec
  }
];

export const SipAccountSettingsModal: React.FC<SipAccountSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [formData, setFormData] = useState<SipAccountConfig>({ ...config });

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_PBX_SERVERS[0]) => {
    setFormData(prev => ({
      ...prev,
      domain: preset.domain,
      proxyServer: preset.proxy,
      port: preset.port,
      transport: preset.transport,
      preferredCodec: preset.codec
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden text-white">
        {/* Glow Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 pb-3 flex items-center gap-3 border-b border-slate-800/80 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner shrink-0">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="pr-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              SIP ACCOUNT CONFIGURATION &bull; LINPHONE ENGINE
            </span>
            <h2 className="text-xl font-heading font-black text-white tracking-tight">
              Paramètres du Compte SIP / PBX
            </h2>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Quick PBX Presets */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-purple-400" />
              Modèles Rapides de Serveurs PBX / Registrar :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_PBX_SERVERS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-purple-900/40 border border-slate-700 hover:border-purple-500 text-left text-xs transition active:scale-98"
                >
                  <span className="font-semibold text-white block">{preset.name}</span>
                  <span className="font-mono text-[10px] text-purple-300">{preset.domain}:{preset.port} ({preset.transport})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Credentials */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-2">
              <User className="w-4 h-4" /> Identifiants du Poste Téléphonique
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Nom d'affichage (Display Name)</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Ex: Ingénieur NOC / Poste 1001"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Numéro d'Extension / Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Ex: 1001 ou alice"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Mot de passe SIP / Secret</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Auth ID (Optionnel)</label>
                <input
                  type="text"
                  value={formData.authId}
                  onChange={(e) => setFormData({ ...formData, authId: e.target.value })}
                  placeholder="Laisser vide si identique"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Network & SIP Server */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-2">
              <Server className="w-4 h-4" /> Domaine & Protocole de Transport
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Domaine / IP du Registrar SIP</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="sip.linphone.org ou 192.168.1.200"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Port SIP</label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value, 10) || 5060 })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Transport</label>
                <select
                  value={formData.transport}
                  onChange={(e) => setFormData({ ...formData, transport: e.target.value as SipTransport })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-purple-500 outline-none cursor-pointer"
                >
                  <option value="UDP">UDP (5060 Standard)</option>
                  <option value="TCP">TCP (5060)</option>
                  <option value="TLS">TLS (5061 Chiffré SIPS)</option>
                  <option value="WSS">WSS (WebSocket Secure)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Codec Audio Prioritaire</label>
                <select
                  value={formData.preferredCodec}
                  onChange={(e) => setFormData({ ...formData, preferredCodec: e.target.value as SipAudioCodec })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-purple-500 outline-none cursor-pointer"
                >
                  <option value="Opus (HD 48kHz)">Opus (HD Voice 48kHz / Adaptive - Recommandé)</option>
                  <option value="G.711a (PCMA 64k)">G.711 A-law (PCMA 64 kbps - Standard Europe/Afrique)</option>
                  <option value="G.711u (PCMU 64k)">G.711 u-law (PCMU 64 kbps - Standard US)</option>
                  <option value="G.722 (Wideband 64k)">G.722 (Wideband 64 kbps HD)</option>
                  <option value="G.729 (8kbps)">G.729 (CS-ACELP 8 kbps - Faible Bande Passante)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center gap-2 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer & S'enregistrer (SIP REGISTER)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
