import { Course, Chapter, Lesson } from '../../types/learning';

export const MOBILE_CELLULAR_COURSE: Course = {
  id: 'c4000000-0000-4000-8000-000000000004',
  title: 'Réseaux Mobiles & Cellulaires',
  slug: 'reseaux-mobiles-cellulaires',
  description: 'Comprendre l\'évolution des réseaux mobiles de la 2G à la 5G.',
  full_description: `Cette formation d'excellence couvre l'intégralité de l'évolution des télécommunications cellulaires :
- **Les Fondations 2G/3G** : principes du cellulaire, réutilisation de fréquences, handover et commutation de circuits vs paquets (GPRS/UMTS).
- **L'Architecture 4G LTE & EPC** : architecture tout-IP E-UTRAN, eNodeB, MME (Mobility Management Entity), SGW, PGW et HSS. Gestion des bearers EPS et QoS (QCI).
- **La Révolution 5G NR (New Radio)** : bandes FR1 (sub-6GHz) et FR2 (ondes millimétriques), Massive MIMO, Beamforming et architectures NSA (Option 3x) vs SA (Option 2).
- **Le Cœur 5G SBA (Service-Based Architecture)** : virtualisation cloud-native, microservices HTTP/2 REST, fonctions AMF, SMF, UPF, NRF, PCF et Network Slicing bout en bout.
- **Protocoles de Signalisation & Procédures Radio** : RRC, NAS, attachement, handovers inter-technologies (IRAT), VoLTE et VoNR.`,
  category: 'Téléphonie mobile',
  difficulty: 'Intermédiaire',
  badge: 'CELLULAIRE & 5G',
  published: true,
  estimated_hours: 28,
  total_hours: 28,
  chapters_count: 3,
  lessons_count: 9,
  rating: 4.9,
  reviews_count: 114,
  thumbnail_url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Connaissance des bases des réseaux IP (routage, adressage, couches OSI).',
    'Notions de base en propagation électromagnétique et fréquences radio (MHz/GHz).'
  ],
  objectives: [
    'Comprendre l\'architecture globale des réseaux cellulaires 2G à 5G.',
    'Maîtriser les procédures de signalisation RRC et NAS lors de l\'attachement d\'un mobile.',
    'Comprendre le routage des données dans le cœur EPC 4G et le cœur 5G SBA (UPF).',
    'Concevoir et dimensionner des tranches de réseau (Network Slicing) adaptées à l\'eMBB, l\'URLLC et le mMTC.'
  ],
  skills_acquired: [
    'Ingénierie des réseaux d\'accès radio RAN (eNodeB 4G, gNodeB 5G)',
    'Architecture de cœur de réseau paquet (EPC & 5GC SBA)',
    'Mécanismes de mobilité, handovers et attachement radio',
    'Voix sur LTE (VoLTE) et Voix sur New Radio (VoNR)',
    'Gestion de la Qualité de Service (QoS Flows, 5QI, QCI)'
  ],
  created_at: '2026-01-20T10:00:00Z',
  updated_at: '2026-01-20T10:00:00Z',
};

export const MOBILE_CELLULAR_CHAPTERS: Chapter[] = [
  {
    id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    chapter_number: 1,
    title: 'Chapitre 1 — Principes Cellulaires & Évolution de la 2G à la 4G LTE',
    description: 'Structure cellulaire, réutilisation de fréquences, accès multiple OFDMA et architecture E-UTRAN / EPC.',
    objectives: [
      'Différencier GSM, UMTS et LTE dans la gestion de la voix et de la data.',
      'Comprendre le rôle des entités 4G : eNodeB, MME, S-GW, P-GW et HSS.',
      'Suivre l\'attachement initial d\'un équipement utilisateur (UE) au réseau.'
    ],
    duration_minutes: 90,
    lessons_count: 3,
    position: 1,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000002',
    chapter_number: 2,
    title: 'Chapitre 2 — 5G New Radio (NR) & Architecture Radio Avancée',
    description: 'Bandes de fréquences FR1 & FR2, Massive MIMO, formation de faisceaux (Beamforming) et déploiement NSA vs SA.',
    objectives: [
      'Analyser les caractéristiques physiques de la 5G NR (Subcarrier Spacing, OFDM flexible).',
      'Comprendre le fonctionnement du Massive MIMO et du Beamforming dynamique.',
      'Comparer les options 3GPP : Option 3x (Non-Standalone) et Option 2 (Standalone).'
    ],
    duration_minutes: 105,
    lessons_count: 3,
    position: 2,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'ch400000-0000-4000-8000-000000000003',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    chapter_number: 3,
    title: 'Chapitre 3 — Cœur de Réseau 5GC (SBA) & Network Slicing',
    description: 'Architecture orientée services (SBA), fonctions AMF, SMF, UPF, protocole HTTP/2 et découpage réseau.',
    objectives: [
      'Identifier les rôles respectifs des fonctions réseau 5GC : AMF, SMF, UPF, NRF, UDM.',
      'Comprendre la transmission des plans de contrôle en requêtes RESTful HTTP/2 JSON.',
      'Mettre en œuvre le Network Slicing pour isoler les services critiques (URLLC).'
    ],
    duration_minutes: 90,
    lessons_count: 3,
    position: 3,
    created_at: '2026-01-20T10:00:00Z',
  },
];

export const MOBILE_CELLULAR_LESSONS: Lesson[] = [
  {
    id: 'l4000001-0000-4000-8000-000000000001',
    chapter_id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '1. Principes des réseaux cellulaires & Handover',
    slug: 'cellulaire-principes-handover',
    description: 'Topologie en nid d\'abeille, motif de réutilisation des fréquences, bilan de liaison et transition continue d\'une cellule à l\'autre.',
    duration_minutes: 25,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'Le concept cellulaire permet de réutiliser les mêmes fréquences radio à distance sans brouillage mutuel.',
      'Le handover (ou transfert intercellulaire) permet de maintenir la communication en déplacement.',
      'Hard Handover ("break-before-make" en LTE/5G) vs Soft Handover ("make-before-break" en 3G WCDMA).'
    ],
    summary: 'Les fondements des réseaux cellulaires reposent sur le découpage géographique en cellules et la gestion fine des handovers lors des déplacements.',
    has_exercise: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000002',
    chapter_id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '2. Architecture 4G LTE : eNodeB & Evolved Packet Core (EPC)',
    slug: 'lte-architecture-epc',
    description: 'Détail des rôles de l\'eNodeB, du MME (gestion de mobilité), du SGW (ancrage local), du PGW (passerelle Internet) et du serveur d\'abonnés HSS.',
    duration_minutes: 30,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'La 4G LTE est la première génération entièrement basée sur le protocole IP (All-IP Network).',
      'Le MME gère la signalisation du plan de contrôle (attachement, paging, tracking areas).',
      'Le tunnel GTP-U (GPRS Tunnelling Protocol User Plane) encapsule les paquets IP des utilisateurs entre l\'eNodeB et le PGW.'
    ],
    summary: 'L\'architecture 4G sépare nettement le plan de contrôle (MME) du plan utilisateur (SGW/PGW).',
    has_lab: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000003',
    chapter_id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '3. Procédures d\'attachement LTE & Gestion des Bearers EPS',
    slug: 'lte-attachement-eps-bearers',
    description: 'Chronologie des échanges RRC (Radio Resource Control) et NAS (Non-Access Stratum) pour établir un bearer par défaut et un bearer dédié.',
    duration_minutes: 35,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'L\'attachement active obligatoirement un default bearer fournissant une connectivité IP continue.',
      'Les dedicated bearers garantissent un débit et une latence prioritaires (ex: VoLTE QCI 1).',
      'Les identifiants mobiles majeurs : IMSI, IMEI, GUTI, MSISDN.'
    ],
    summary: 'Chaque service de communication requiert un bearer EPS avec un profil de Qualité de Service (QCI) adapté.',
    has_quiz: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000004',
    chapter_id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '4. 5G New Radio : Bandes FR1/FR2 & Numérologie OFDM',
    slug: '5g-nr-frequences-numerologie',
    description: 'Spectre radio 5G : Sub-6GHz vs Ondes Millimétriques (mmWave), espacement des sous-porteuses flexible (15, 30, 60, 120 kHz).',
    duration_minutes: 35,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'La bande FR1 (410 MHz - 7125 MHz) offre une couverture étendue avec des débits multi-centaines de Mbps.',
      'La bande FR2 (24.25 GHz - 52.6 GHz) offre des bandes passantes gigantesques (jusqu\'à 400 MHz par porteuse).',
      'La numérologie $\\mu$ adapte la durée du slot pour réduire drastiquement la latence radio (jusqu\'à 125 $\\mu$s).'
    ],
    summary: 'La flexibilité physique de la 5G NR répond simultanément au très haut débit (eMBB) et à l\'ultra faible latence (URLLC).',
    has_exercise: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000005',
    chapter_id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '5. Massive MIMO & Formation de Faisceaux (Beamforming)',
    slug: 'massive-mimo-beamforming',
    description: 'Matrice de 64T64R antennes actives, focalisation spatiale de l\'énergie radio vers chaque utilisateur individuel.',
    duration_minutes: 35,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Le Massive MIMO multiplie la capacité par cellule en servant plusieurs utilisateurs sur la même fréquence au même instant (MU-MIMO).',
      'Le Beamforming numérique et hybride oriente un faisceau radio directif qui suit l\'utilisateur en mouvement.',
      'Gain d\'antenne élevé et réduction considérable des interférences intercellulaires.'
    ],
    summary: 'Le Massive MIMO 64T64R est le pilier des débits gigabit en environnement urbain dense.',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000006',
    chapter_id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '6. Déploiement 5G : Non-Standalone (NSA) vs Standalone (SA)',
    slug: '5g-nsa-vs-sa',
    description: 'Architecture hybride EN-DC (E-UTRA NR Dual Connectivity) avec cœur EPC 4G vs architecture cible 5G SA avec cœur 5GC.',
    duration_minutes: 35,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Option 3x (NSA) : l\'accès radio combine 4G et 5G tout en conservant le cœur de réseau 4G EPC existant.',
      'Option 2 (SA) : réseau 100% 5G, gNodeB connecté directement au cœur 5GC cloud-native.',
      'Seule la 5G Standalone permet d\'activer le véritable Network Slicing et l\'ultra faible latence (<5ms).'
    ],
    summary: 'La transition vers la 5G Standalone libère le plein potentiel des services industriels et des communications critiques.',
    has_quiz: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000007',
    chapter_id: 'ch400000-0000-4000-8000-000000000003',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '7. Architecture 5GC Service-Based Architecture (SBA)',
    slug: '5gc-sba-fonctions',
    description: 'Les microservices du cœur 5G : AMF (mobilité), SMF (gestion de sessions), UPF (routage utilisateur), NRF (découverte de services) et UDM.',
    duration_minutes: 30,
    position: 1,
    published: true,
    technical_level: 'Expert',
    key_points: [
      'Le plan de contrôle 5G abandonne les protocoles télécoms propriétaires au profit de HTTP/2 avec payload JSON.',
      'L\'UPF (User Plane Function) est le seul nœud traversé par les paquets IP des utilisateurs (routage à très haute vitesse).',
      'L\'UPF peut être déporté en périphérie du réseau (Multi-access Edge Computing - MEC).'
    ],
    summary: 'La Service-Based Architecture transforme le cœur télécom en une plateforme logicielle cloud-native conteneurisée.',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000008',
    chapter_id: 'ch400000-0000-4000-8000-000000000003',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '8. Network Slicing bout en bout (eMBB, URLLC, mMTC)',
    slug: 'network-slicing-end-to-end',
    description: 'Création de tranches de réseau logiques indépendantes sur une même infrastructure physique via S-NSSAI (SST et SD).',
    duration_minutes: 30,
    position: 2,
    published: true,
    technical_level: 'Expert',
    key_points: [
      'S-NSSAI (Single Network Slice Selection Assistance Information) identifie chaque tranche réseau.',
      'SST 1 = eMBB (Très haut débit), SST 2 = URLLC (Temps réel critique), SST 3 = MIoT (Objets connectés massifs).',
      'L\'isolation est garantie du RAN (ordonnancement des PRB) jusqu\'au transport IP/MPLS et à l\'UPF dédié.'
    ],
    summary: 'Le Network Slicing permet aux opérateurs de commercialiser des garanties SLA strictes aux entreprises et aux services d\'urgence.',
    has_lab: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'l4000001-0000-4000-8000-000000000009',
    chapter_id: 'ch400000-0000-4000-8000-000000000003',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: '9. VoLTE & VoNR : La Voix Télécom sur Réseaux 4G/5G',
    slug: 'volte-vonr-telecom',
    description: 'Mécanismes de transport de la voix haute fidélité (HD Voice, EVS codec) via le sous-système multimédia IP (IMS) interconnecté à l\'EPC et au 5GC.',
    duration_minutes: 30,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'En LTE et 5G SA, il n\'y a plus de réseau téléphonique commuté : la voix transite impérativement via le réseau IMS.',
      'QoS prioritaire QCI 1 / 5QI 1 pour garantir un délai paquet inférieur à 100ms et aucune perte d\'échantillons vocaux.',
      'Le codec EVS (Enhanced Voice Services) délivre un son cristallin de 50 Hz à 20 kHz.'
    ],
    summary: 'VoLTE et VoNR intègrent la voix directement dans l\'infrastructure tout-IP avec un niveau de priorité radio maximal.',
    has_quiz: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  }
];
