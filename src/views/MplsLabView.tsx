import React, { useState } from 'react';
import { 
  Layers, 
  Network, 
  Activity, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Terminal, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle,
  Info,
  Check,
  Zap,
  Boxes
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

interface MplsNodeInfo {
  id: string;
  name: string;
  role: 'CE' | 'PE' | 'P';
  roleTitle: string;
  ip: string;
  asNumber: number;
  vrfName?: string;
  ldpId: string;
  inLabel?: number | string;
  outLabel?: number | string;
  action: 'IP FORWARD' | 'PUSH' | 'SWAP' | 'PHP' | 'POP';
  actionExplanation: string;
  x: number;
  y: number;
  routes: Array<{ prefix: string; nextHop: string; label: string }>;
  explanationFr: string;
}

const NODES_DATA: MplsNodeInfo[] = [
  {
    id: 'CE1',
    name: 'CE1-Agence-Antananarivo',
    role: 'CE',
    roleTitle: 'Customer Edge (Routeur Client Source)',
    ip: '192.168.10.1',
    asNumber: 65001,
    ldpId: 'Aucun (Routage IP standard)',
    action: 'IP FORWARD',
    actionExplanation: "Envoi du paquet IP pur non taggué vers la passerelle opérateur PE1.",
    x: 60,
    y: 100,
    routes: [{ prefix: '192.168.20.0/24', nextHop: '10.0.1.2 (PE1)', label: 'Paquet IP Pur (Non taggué)' }],
    explanationFr: "Le routeur CE1 est situé chez le client. Il n'a aucune connaissance de MPLS. Il consulte sa table de routage IP standard et transmet le paquet destiné à l'agence distante (192.168.20.0/24) à son routeur d'accès opérateur (PE1)."
  },
  {
    id: 'PE1',
    name: 'PE1-Nokia-7750-Ingress',
    role: 'PE',
    roleTitle: "Provider Edge Ingress (Routeur d'Entrée Opérateur)",
    ip: '10.255.0.1',
    asNumber: 37000,
    vrfName: 'VRF_ENTREPRISE_VPN (RD: 37000:100)',
    ldpId: '10.255.0.1:0',
    inLabel: '0 (IP)',
    outLabel: 'Transport: 10024 | VPN: 2001',
    action: 'PUSH',
    actionExplanation: "Empilage d'une double étiquette : Étiquette VPN (2001) + Étiquette Transport LDP (10024).",
    x: 200,
    y: 100,
    routes: [
      { prefix: '192.168.20.0/24', nextHop: '10.255.0.4 (PE2 via P1)', label: 'Push [Transport: 10024, VPN: 2001]' }
    ],
    explanationFr: "Le routeur PE1 reçoit le paquet IP sur une interface associée à la VRF du client. Il consulte sa table de routage VRF et ajoute (PUSH) deux étiquettes : l'étiquette interne VPN (2001, apprise via MP-BGP) et l'étiquette externe de transport (10024, apprise via LDP pour atteindre PE2)."
  },
  {
    id: 'P1',
    name: 'P1-Cisco-ASR9000-Core',
    role: 'P',
    roleTitle: 'Provider Core (Routeur de Transit Cœur P1)',
    ip: '10.255.0.2',
    asNumber: 37000,
    ldpId: '10.255.0.2:0',
    inLabel: 10024,
    outLabel: 20038,
    action: 'SWAP',
    actionExplanation: "Échange de l'étiquette de transport externe : 10024 remplacée par 20038.",
    x: 350,
    y: 100,
    routes: [
      { prefix: '10.255.0.4/32', nextHop: '10.1.2.2 (P2)', label: 'Swap 10024 -> 20038' }
    ],
    explanationFr: "Le routeur de cœur P1 ne lit JAMAIS l'adresse IP du client ni l'étiquette VPN interne. Il consulte uniquement sa table LFIB (Label Forwarding Information Base), remplace l'étiquette de transport externe 10024 par 20038 (SWAP) et transmet le paquet vers P2."
  },
  {
    id: 'P2',
    name: 'P2-Huawei-NE40E-PHP',
    role: 'P',
    roleTitle: 'Provider Core PHP (Avant-dernier Saut)',
    ip: '10.255.0.3',
    asNumber: 37000,
    ldpId: '10.255.0.3:0',
    inLabel: 20038,
    outLabel: 'Label 3 (Implicit Null - Dépilé)',
    action: 'PHP',
    actionExplanation: "Penultimate Hop Popping : Dépilage de l'étiquette de transport avant envoi à PE2.",
    x: 500,
    y: 100,
    routes: [
      { prefix: '10.255.0.4/32', nextHop: '10.1.3.2 (PE2)', label: 'PHP (Dépilage du Transport Label 20038)' }
    ],
    explanationFr: "P2 est le voisin immédiat du PE de destination (PE2). Comme PE2 lui a annoncé l'étiquette spéciale 'Implicit Null' (Label 3), P2 retire complètement l'étiquette externe (mécanisme PHP). Le paquet arrive à PE2 avec seulement l'étiquette VPN 2001."
  },
  {
    id: 'PE2',
    name: 'PE2-Nokia-7750-Egress',
    role: 'PE',
    roleTitle: "Provider Edge Egress (Routeur de Sortie Opérateur)",
    ip: '10.255.0.4',
    asNumber: 37000,
    vrfName: 'VRF_ENTREPRISE_VPN (RD: 37000:100)',
    ldpId: '10.255.0.4:0',
    inLabel: 2001,
    outLabel: '0 (IP Pur)',
    action: 'POP',
    actionExplanation: "Dépilage de l'étiquette VPN (2001), identification de la VRF et routage IP pur vers CE2.",
    x: 640,
    y: 100,
    routes: [
      { prefix: '192.168.20.0/24', nextHop: '10.0.2.1 (CE2)', label: 'Pop VPN Label 2001 -> IP Pur' }
    ],
    explanationFr: "PE2 reçoit le paquet avec l'étiquette VPN 2001. Cette étiquette lui indique exactement dans quelle VRF de client injecter le paquet. Il dépile (POP) cette étiquette et transmet le paquet IP natif vers le routeur CE2 du client."
  },
  {
    id: 'CE2',
    name: 'CE2-Agence-Tamatave',
    role: 'CE',
    roleTitle: 'Customer Edge (Routeur Client Destination)',
    ip: '192.168.20.1',
    asNumber: 65002,
    ldpId: 'Aucun (Réseau Local Client)',
    action: 'IP FORWARD',
    actionExplanation: "Réception du paquet IP et livraison au serveur ou PC du réseau local.",
    x: 760,
    y: 100,
    routes: [{ prefix: '192.168.20.0/24', nextHop: 'Directement Connecté', label: 'LAN Local' }],
    explanationFr: "Le routeur de l'agence de destination CE2 reçoit le paquet IP standard comme s'il était directement relié à l'agence CE1 par un câble dédié. L'infrastructure MPLS a été totalement transparente."
  }
];

const MPLS_QUIZ = [
  {
    id: 'mpls-q1',
    question: "Quelle est la principale différence entre le plan de contrôle (Control Plane) et le plan de données (Data Plane) en MPLS ?",
    options: [
      "Le plan de contrôle gère l'alimentation électrique, le plan de données les câbles",
      "Le plan de contrôle échange les tables de routage et d'étiquettes (LDP, OSPF, BGP), tandis que le plan de données commute les paquets par étiquettes à la vitesse du silicium (ASIC)",
      "Le plan de contrôle est payant et le plan de données gratuit",
      "Le plan de contrôle ne fonctionne qu'en Wi-Fi"
    ],
    correctIndex: 1,
    explanation: "Le plan de contrôle (Control Plane) calcule les tables de correspondances via LDP/BGP, tandis que le plan de données (Data Plane) applique la commutation ultra-rapide en utilisant la LFIB programmée dans le matériel."
  },
  {
    id: 'mpls-q2',
    question: "À quoi sert le mécanisme PHP (Penultimate Hop Popping) ?",
    options: [
      "À doubler la taille des étiquettes",
      "À retirer l'étiquette de transport sur l'avant-dernier routeur pour soulager le routeur PE de sortie d'une double recherche de table",
      "À redémarrer le routeur en cas de plantage",
      "À bloquer les attaques DDoS"
    ],
    correctIndex: 1,
    explanation: "Le PHP permet au routeur PE de sortie de ne pas avoir à lire l'étiquette de transport puis ensuite l'étiquette VPN : l'étiquette externe est retirée un saut plus tôt par le routeur P avant-dernier."
  },
  {
    id: 'mpls-q3',
    question: "Dans un VPN MPLS de niveau 3 (L3VPN RFC 4364), quelle est la fonction du Route Distinguisher (RD) ?",
    options: [
      "Mesurer la vitesse de la fibre",
      "Rendre unique un préfixe IPv4 privé (création d'une route VPNv4 96 bits) pour éviter les conflits d'adresses entre différents clients",
      "Crypter le mot de passe BGP",
      "Changer le nom du routeur"
    ],
    correctIndex: 1,
    explanation: "Si deux clients utilisent la même plage privée (ex: 192.168.1.0/24), l'ajout du RD (ex: 65000:100) crée un préfixe VPNv4 unique au monde (65000:100:192.168.1.0/24)."
  }
];

export const MplsLabView: React.FC = () => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(1);
  const [activeLessonTab, setActiveLessonTab] = useState<'THEORY' | 'FLOW' | 'SHIM' | 'L3VPN' | 'CLI' | 'QUIZ'>('FLOW');
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<Record<string, boolean>>({});

  const selectedNode = NODES_DATA[selectedNodeIndex];

  const handleStartTrace = () => {
    setIsTracing(true);
    let step = 0;
    setSelectedNodeIndex(0);
    const timer = setInterval(() => {
      step++;
      if (step >= NODES_DATA.length) {
        clearInterval(timer);
        setIsTracing(false);
      } else {
        setSelectedNodeIndex(step);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1">
            <span>// FORMATION AVANCÉE ARCHITECTURE RÉSEAU</span>
            <span>&bull;</span>
            <Badge type="COURS / LEÇON" size="sm" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            ARCHITECTURE IP/MPLS & SERVICES L3VPN OPÉRATEUR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-4xl">
            Cours théorique et pratique complet : maîtrisez le fonctionnement de la commutation par étiquettes, 
            la séparation des plans de contrôle et de données, le cycle de vie du paquet (Push, Swap, PHP, Pop) 
            et l'isolation des réseaux d'entreprises par VRF et MP-BGP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartTrace}
            disabled={isTracing}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-lg"
          >
            <Play className="w-4 h-4" />
            {isTracing ? 'Suivi en cours...' : 'Lancer le Parcours Didactique'}
          </button>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'FLOW', label: '1. Parcours Interactif du Paquet', icon: Network },
          { id: 'THEORY', label: '2. Principes & Plans MPLS', icon: BookOpen },
          { id: 'SHIM', label: '3. En-tête MPLS (Shim 32-bit)', icon: Layers },
          { id: 'L3VPN', label: '4. VPN Niveau 3 (VRF, RD, RT)', icon: ShieldCheck },
          { id: 'CLI', label: '5. Commandes de Vérification CLI', icon: Terminal },
          { id: 'QUIZ', label: `6. Quiz d'Auto-Évaluation`, icon: HelpCircle }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isSelected = activeLessonTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLessonTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE PACKET FLOW DIAGRAM */}
      {activeLessonTab === 'FLOW' && (
        <div className="space-y-6">
          {/* Topology Visualizer */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                  TOPOLOGIE DE RÉFÉRENCE MPLS L3VPN (AS 37000)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300 font-semibold">
                NŒUD ACTIF : {selectedNode.name} ({selectedNode.role})
              </span>
            </div>

            {/* SVG Visual Scheme */}
            <div className="relative w-full h-56 bg-[#05050a] border border-white/10 rounded-xl overflow-x-auto p-4 flex items-center justify-center">
              <svg viewBox="0 0 840 200" className="w-full h-full min-w-[750px]">
                {/* Connection lines */}
                <line x1="90" y1="100" x2="200" y2="100" stroke="#64748b" strokeWidth="3" />
                <line x1="200" y1="100" x2="350" y2="100" stroke="#06b6d4" strokeWidth="4" strokeDasharray="6 3" />
                <line x1="350" y1="100" x2="500" y2="100" stroke="#06b6d4" strokeWidth="4" strokeDasharray="6 3" />
                <line x1="500" y1="100" x2="640" y2="100" stroke="#06b6d4" strokeWidth="4" strokeDasharray="6 3" />
                <line x1="640" y1="100" x2="760" y2="100" stroke="#64748b" strokeWidth="3" />

                {/* Nodes */}
                {NODES_DATA.map((n, idx) => {
                  const isCur = idx === selectedNodeIndex;
                  return (
                    <g 
                      key={n.id} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedNodeIndex(idx)}
                    >
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={isCur ? 32 : 24}
                        fill={isCur ? '#083344' : '#0f172a'}
                        stroke={isCur ? '#22d3ee' : '#475569'}
                        strokeWidth={isCur ? 3 : 2}
                        className="transition-all duration-300"
                      />
                      <text
                        x={n.x}
                        y={n.y + 4}
                        fill={isCur ? '#ffffff' : '#94a3b8'}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {n.id}
                      </text>
                      <text
                        x={n.x}
                        y={n.y + 46}
                        fill="#cbd5e1"
                        fontSize="9"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {n.role}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">
                Cliquez sur un routeur ou utilisez les flèches pour lire l'analyse pédagogique.
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={selectedNodeIndex === 0}
                  onClick={() => setSelectedNodeIndex(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40 text-xs font-mono text-slate-300"
                >
                  &larr; Précédent
                </button>
                <button
                  disabled={selectedNodeIndex === NODES_DATA.length - 1}
                  onClick={() => setSelectedNodeIndex(prev => Math.min(NODES_DATA.length - 1, prev + 1))}
                  className="px-3 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 disabled:opacity-40 text-xs font-mono"
                >
                  Suivant &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Node Detailed Lesson Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 rounded-2xl glass-panel p-6 border border-cyan-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                    Nœud {selectedNodeIndex + 1} / {NODES_DATA.length} &bull; Rôle {selectedNode.role}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-white">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {selectedNode.roleTitle}
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300">
                  Action : {selectedNode.action}
                </div>
              </div>

              {/* Detailed pedagogical description */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400">
                  Explication Pédagogique du Traitement :
                </h4>
                <p className="text-sm text-slate-200 font-sans leading-relaxed">
                  {selectedNode.explanationFr}
                </p>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-cyan-200 font-mono">
                  <span className="font-bold text-white">Opération Appliquée : </span>
                  {selectedNode.actionExplanation}
                </div>
              </div>

              {/* Route Table / Label Stack */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400">
                  Entrée de Table de Commutation (LFIB / FIB) :
                </h4>
                <div className="rounded-xl bg-[#090910] border border-white/10 p-3.5 font-mono text-xs text-slate-300 space-y-1">
                  {selectedNode.routes.map((r, i) => (
                    <div key={i} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-cyan-400 font-bold">{r.prefix}</span>
                      <span className="text-slate-400">Next-Hop: {r.nextHop}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Card: Label State */}
            <div className="lg:col-span-4 rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-400">
                État de la Pile d'Étiquettes (Label Stack) :
              </h4>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono space-y-1">
                  <span className="text-slate-500 uppercase text-[10px]">Label Entrant (In-Label)</span>
                  <div className="text-sm font-bold text-white">
                    {String(selectedNode.inLabel || 'N/A')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono space-y-1">
                  <span className="text-cyan-400 uppercase text-[10px]">Label Sortant (Out-Label)</span>
                  <div className="text-sm font-bold text-cyan-200">
                    {String(selectedNode.outLabel || 'N/A')}
                  </div>
                </div>

                {selectedNode.vrfName && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono space-y-1">
                    <span className="text-purple-400 uppercase text-[10px]">Table VRF Associée</span>
                    <div className="text-xs font-bold text-purple-200">
                      {selectedNode.vrfName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRINCIPLES & THEORY */}
      {activeLessonTab === 'THEORY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">
                1. Pourquoi le MPLS a-t-il été Inventé ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Dans le routage IP classique, chaque routeur intermédiaire doit analyser l'en-tête IP complet (32 ou 128 bits), 
                consulter sa table de routage complète et calculer le plus long préfixe correspondant (Longest Prefix Match - LPM). 
                À l'échelle des dorsales mondiales, ce processus était lent et gourmand en calcul CPU.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Le MPLS (Multi-Protocol Label Switching) résout ce problème en ajoutant une courte étiquette de 32 bits. 
                Les routeurs de cœur commutent les paquets par simple indexation en mémoire matérielle (ASIC), sans jamais regarder l'adresse IP.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">
                2. Séparation du Plan de Contrôle et du Plan de Données
              </h3>
              <div className="space-y-3 text-xs font-sans">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="font-bold text-cyan-300 font-mono">Plan de Contrôle (Control Plane) :</span>
                  <p className="text-slate-300">
                    Les protocoles de routage (OSPF, IS-IS) découvrent la topologie, et les protocoles de signalisation 
                    (LDP, MP-BGP) attribuent et échangent les étiquettes pour construire la table LIB (Label Information Base).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="font-bold text-purple-300 font-mono">Plan de Données (Data Plane) :</span>
                  <p className="text-slate-300">
                    Les puces de commutation matérielle appliquent les opérations (Push, Swap, Pop) sur la LFIB (Label Forwarding Information Base) à la vitesse maximale du support optique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHIM HEADER ANATOMY */}
      {activeLessonTab === 'SHIM' && (
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
            <div>
              <h3 className="font-heading font-bold text-2xl text-white">
                Anatomie de l'En-tête MPLS (Shim Header 32 bits / 4 octets)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
                L'en-tête MPLS est inséré entre la couche liaison de données (Ethernet) et la couche réseau (IP), d'où son appellation de protocole de couche 2.5.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 space-y-2">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Bits 0 à 19 &bull; 20 Bits</span>
                <h4 className="font-heading font-bold text-lg text-white">Label Value</h4>
                <p className="text-xs text-slate-300 font-sans">
                  Valeur de l'étiquette (de 0 à 1 048 575). Les labels 0 à 15 sont réservés (ex: Label 0 = IPv4 Explicit Null, Label 3 = Implicit Null pour le PHP).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-2">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Bits 20 à 22 &bull; 3 Bits</span>
                <h4 className="font-heading font-bold text-lg text-white">Traffic Class (EXP)</h4>
                <p className="text-xs text-slate-300 font-sans">
                  Champ de Qualité de Service (QoS / CoS). Permet de prioriser les flux voix VoIP ou vidéo en cas de congestion sur le lien.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-950/50 border border-amber-500/40 space-y-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Bit 23 &bull; 1 Bit</span>
                <h4 className="font-heading font-bold text-lg text-white">Bottom of Stack (S)</h4>
                <p className="text-xs text-slate-300 font-sans">
                  Indicateur de fin de pile. Vaut 1 si cette étiquette est la dernière avant le paquet IP, et 0 s'il y a d'autres étiquettes en dessous.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Bits 24 à 31 &bull; 8 Bits</span>
                <h4 className="font-heading font-bold text-lg text-white">Time to Live (TTL)</h4>
                <p className="text-xs text-slate-300 font-sans">
                  Décrémenté de 1 à chaque saut de routeur pour éviter que des paquets tournent indéfiniment en cas de boucle réseau.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: L3VPN (VRF, RD, RT) */}
      {activeLessonTab === 'L3VPN' && (
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-xl text-white">
              Les Piliers du MPLS L3VPN (RFC 4364 / 2547)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Le service L3VPN permet à un opérateur d'héberger des milliers d'entreprises différentes sur la même infrastructure physique, 
              en garantissant une étanchéité totale et en permettant à chaque entreprise d'utiliser son propre plan d'adressage IP privé.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400">1. VRF (Virtual Routing & Forwarding)</span>
                <p className="text-xs text-slate-300 font-sans">
                  Table de routage virtuelle indépendante créée sur le routeur PE. Chaque client possède sa propre VRF isolée.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400">2. Route Distinguisher (RD)</span>
                <p className="text-xs text-slate-300 font-sans">
                  Nombre de 64 bits préfixé à l'adresse IPv4 pour transformer une route 10.0.0.0/24 en une route VPNv4 96 bits unique au monde.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">3. Route Target (RT)</span>
                <p className="text-xs text-slate-300 font-sans">
                  Attribut BGP Extended Community définissant les règles d'importation et d'exportation de routes entre VRF.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CLI COMMANDS */}
      {activeLessonTab === 'CLI' && (
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-xl text-white">
              Commandes de Vérification sur Routeurs Nokia & Cisco
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#090910] border border-white/10 space-y-2">
                <span className="text-cyan-400 font-bold block"># Cisco IOS-XR : Vérifier la table de commutation LFIB</span>
                <pre className="text-slate-300">RP/0/RSP0/CPU0:P1# show mpls forwarding</pre>
                <p className="text-[11px] text-slate-500 font-sans">Affiche la liste des In-Labels, opérations (Swap/Pop/Push), Out-Labels et Next-Hops.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090910] border border-white/10 space-y-2">
                <span className="text-purple-400 font-bold block"># Nokia SR OS : Vérifier les liaisons d'étiquettes LDP</span>
                <pre className="text-slate-300">A:PE1# show router ldp bindings</pre>
                <p className="text-[11px] text-slate-500 font-sans">Affiche la table LIB associant les préfixes IP appris aux étiquettes distribuées par les voisins.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: QUIZ */}
      {activeLessonTab === 'QUIZ' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <h3 className="font-heading font-bold text-xl text-white">
              Quiz d'Auto-Évaluation sur l'Architecture IP/MPLS
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Validez vos connaissances sur la commutation par étiquettes, le PHP et les VRF.
            </p>
          </div>

          <div className="space-y-6">
            {MPLS_QUIZ.map((q, idx) => {
              const selected = selectedQuizAnswers[q.id];
              const isSub = submittedQuiz[q.id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={q.id} className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                    {idx + 1}. {q.question}
                  </h4>

                  <div className="space-y-2 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isSel = selected === oIdx;
                      let cls = 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200';
                      if (isSub) {
                        if (oIdx === q.correctIndex) cls = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-bold';
                        else if (isSel) cls = 'bg-rose-950/60 border-rose-500/60 text-rose-200 line-through';
                        else cls = 'opacity-40 border-white/5 text-slate-500';
                      } else if (isSel) {
                        cls = 'bg-cyan-600/30 border-cyan-500 text-white font-semibold ring-2 ring-cyan-500/40';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isSub}
                          onClick={() => setSelectedQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between transition-all ${cls}`}
                        >
                          <span>{opt}</span>
                          {isSub && oIdx === q.correctIndex && <Check className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {!isSub ? (
                    <button
                      onClick={() => setSubmittedQuiz(prev => ({ ...prev, [q.id]: true }))}
                      disabled={selected === undefined}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors"
                    >
                      Valider ma réponse
                    </button>
                  ) : (
                    <div className={`p-3.5 rounded-xl text-xs font-sans space-y-1 ${isCorrect ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200' : 'bg-rose-950/40 border border-rose-500/30 text-rose-200'}`}>
                      <span className="font-bold font-mono uppercase">{isCorrect ? '✓ Excellente réponse !' : '✗ Réponse inexacte :'}</span>
                      <p className="text-slate-300 font-normal">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
