import React, { useState } from 'react';
import { 
  Users, 
  PhoneCall, 
  Search, 
  Plus, 
  Star, 
  Building2, 
  Radio, 
  Activity,
  X
} from 'lucide-react';
import { SipContact } from '../../types/sip';

interface SipContactsProps {
  contacts: SipContact[];
  onCallNumber: (num: string) => void;
  onAddContact: (contact: SipContact) => void;
}

export const SipContacts: React.FC<SipContactsProps> = ({
  contacts,
  onCallNumber,
  onAddContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newExt, setNewExt] = useState('');
  const [newDept, setNewDept] = useState('NOC / Réseau');

  const filteredContacts = contacts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.extension.includes(q) || c.department.toLowerCase().includes(q);
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newExt.trim()) return;

    const colors = ['from-purple-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-cyan-500 to-blue-600', 'from-amber-500 to-orange-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddContact({
      id: `contact-${Date.now()}`,
      name: newName.trim(),
      extension: newExt.trim(),
      department: newDept,
      status: 'ONLINE',
      avatarColor: randomColor
    });

    setNewName('');
    setNewExt('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header with Search & Add Contact */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher contact, poste ou service..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 font-mono"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-purple-900/40 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[340px] max-h-[460px]">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-2">
            <Users className="w-8 h-8 text-slate-600" />
            <p className="text-xs font-mono">Aucun contact trouvé</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition group"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with Presence Indicator */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center text-white font-bold font-mono text-sm shadow-md`}>
                    {contact.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    contact.status === 'ONLINE' ? 'bg-emerald-400' : contact.status === 'BUSY' ? 'bg-amber-400' : 'bg-slate-500'
                  }`} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">{contact.name}</span>
                    {contact.favorite && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-purple-300 font-bold">Poste {contact.extension}</span>
                    <span>&bull;</span>
                    <span className="text-slate-500">{contact.department}</span>
                  </div>
                </div>
              </div>

              {/* Instant Call Button */}
              <button
                onClick={() => onCallNumber(contact.extension)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 text-xs font-mono font-semibold transition flex items-center gap-1.5 active:scale-95 opacity-90 group-hover:opacity-100 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-300 group-hover:text-white" />
                <span>Appeler</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-heading font-bold text-sm text-white">Nouveau Contact SIP</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Nom / Rôle</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Astreinte Fibre Optique"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Numéro d'Extension / SIP URI</label>
                <input
                  type="text"
                  value={newExt}
                  onChange={(e) => setNewExt(e.target.value)}
                  placeholder="Ex: 1005 ou sip:radio@pbx.local"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Département / Équipe</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-500 font-sans"
                >
                  <option value="NOC / Réseau">NOC / Réseau</option>
                  <option value="Ingénierie Radio / RF">Ingénierie Radio / RF</option>
                  <option value="Fibre & Transmission">Fibre & Transmission</option>
                  <option value="Énergie & Pylônes">Énergie & Pylônes</option>
                  <option value="Support & Direction">Support & Direction</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-mono"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition shadow"
                >
                  Ajouter Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
