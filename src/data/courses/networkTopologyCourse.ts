import { Course, Chapter, Lesson } from '../../types/learning';

export const NETWORK_TOPOLOGY_COURSE: Course = {
  id: 'c4000000-0000-4000-8000-000000000004',
  title: 'Topologie du Transport Télécom de Bout en Bout',
  slug: 'network-topology',
  description: 'Parcours complet en 7 étapes : de l\'accès FTTH/PON et radio mobile 4G/5G, jusqu\'au Datacenter Cloud via l\'agrégation métropolitaine, le cœur MPLS et le transit BGP.',
  full_description: `Cette formation panoramique et concrète vous fait voyager tout au long de la chaîne de transport des télécommunications :
- **L\'Accès Abonnés** : la boucle locale optique FTTH (GPON, XGS-PON) et l'accès radio mobile 4G/5G (eNodeB, gNodeB).
- **La Collecte & l'Agrégation Métropolitaine** : anneaux optiques CWDM/DWDM et commutateurs d'agrégation IP/MPLS.
- **La Passerelle Opérateur (BNG / Broadband Network Gateway)** : terminaison des sessions abonnés (PPPoE, IPoE, DHCP Option 82) et contrôle de débit (Shaping/Policing).
- **Le Cœur de Réseau National (Backbone)** : autoroutes optiques cohérentes à 400G/800G et routage IP/MPLS.
- **L\'Interconnexion Mondiale** : Points d'Échange Internet (IXP), câbles sous-marins intercontinentaux et transitaires Tier-1.
- **L\'Arrivée au Datacenter Cloud** : architecture Spine & Leaf, virtualisation réseau VXLAN/EVPN et serveurs applicatifs.`,
  category: 'NETWORK OPERATIONS',
  difficulty: 'Intermédiaire',
  badge: 'INFRASTRUCTURE',
  published: true,
  estimated_hours: 15,
  total_hours: 15,
  chapters_count: 2,
  lessons_count: 5,
  rating: 4.8,
  reviews_count: 52,
  thumbnail_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Notions de base sur les réseaux informatiques et les télécommunications.',
    'Curiosité pour les infrastructures physiques réelles (fibres optiques, antennes, répartiteurs).'
  ],
  objectives: [
    'Suivre le trajet physique et logique complet d\'un paquet IP depuis une Box résidentielle ou un smartphone 5G jusqu\'à un serveur Cloud.',
    'Comprendre l\'architecture PON optique (OLT, Splitters, ONT) et le multiplexage de longueurs d\'onde WDM.',
    'Identifier le rôle du BNG dans la gestion des abonnés grand public et entreprise.',
    'Comprendre l\'organisation physique des Datacenters modernes avec topologie Spine-Leaf.'
  ],
  skills_acquired: [
    'Vision globale de l\'ingénierie des infrastructures télécoms d\'opérateurs',
    'Technologies d\'accès très haut débit FTTH (GPON / XGS-PON) et Mobile RAN',
    'Multiplexage optique métropolitain CWDM/DWDM',
    'Architectures de Datacenters Cloud modernes (Spine-Leaf & EVPN-VXLAN)'
  ],
  created_at: '2026-01-18T10:00:00Z',
  updated_at: '2026-01-18T10:00:00Z',
};

export const NETWORK_TOPOLOGY_CHAPTERS: Chapter[] = [
  {
    id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    chapter_number: 1,
    title: 'Chapitre 1 — La Boucle Locale & L\'Accès Abonnés',
    description: 'Terminaux abonnés, CPE, ONT FTTH GPON/XGS-PON et antennes relais cellulaires.',
    objectives: [
      'Différencier l\'accès optique passif (PON) et l\'accès point-à-point.',
      'Comprendre le rôle des longueurs d\'onde 1490nm (Downstream) et 1310nm (Upstream).',
      'Identifier l\'architecture du réseau d\'accès mobile (Fronthaul, Midhaul, Backhaul).'
    ],
    duration_minutes: 180,
    lessons_count: 2,
    position: 1,
  },
  {
    id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    chapter_number: 2,
    title: 'Chapitre 2 — Cœur Opérateur & Interconnexion Mondiale',
    description: 'Agrégation métropolitaine, passerelles BNG, backbone MPLS, transit Tier-1 et Datacenter Cloud.',
    objectives: [
      'Comprendre le rôle du BNG dans l\'attribution d\'IP et la gestion de QoS abonnés.',
      'Suivre le trafic à travers les points d\'échange Internet (France IX, AMS-IX, DE-CIX).',
      'Comprendre l\'architecture réseau Spine-Leaf à haute disponibilité d\'un Datacenter moderne.'
    ],
    duration_minutes: 240,
    lessons_count: 3,
    position: 2,
  }
];

export const NETWORK_TOPOLOGY_LESSONS: Lesson[] = [
  {
    id: 'l4000001-0000-4000-8000-000000000001',
    chapter_id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: "1. La Boucle Locale Optique FTTH (GPON & XGS-PON)",
    slug: 'boucle-locale-optique-ftth-gpon',
    duration_minutes: 45,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Architecture du réseau d\'accès passif : OLT (Optical Line Terminal), coupleurs optiques (Splitters 1:64) et ONT chez l\'abonné.',
    video_url: undefined,
    video_provider: null,
    video_duration: '38:00',
    summary: 'Le réseau FTTH repose sur une topologie point-à-multipoint passive (sans électronique dans la rue). Un arbre PON partage une fibre entre 32 ou 64 abonnés avec chiffrement AES.',
    key_points: [
      'OLT : équipement opérateur dans le NRO (Nœud de Raccordement Optique).',
      'Coupleurs (Splitters) passifs : divisent le signal lumineux sans alimentation électrique.',
      'GPON : 2.5 Gbps descendant / 1.25 Gbps montant.',
      'XGS-PON : 10 Gbps symétrique pour les offres ultra haut débit.'
    ],
    cli_examples: [
      {
        title: 'Inspecter les niveaux de signal optique d\'un ONT (dBm)',
        os: 'Terminal ONT',
        command: 'show optical-power',
        outputDescription: 'Vérifie que la puissance reçue se situe dans la plage nominale (entre -8 dBm et -27 dBm).'
      }
    ],
    content: `### 1. La Boucle Locale Optique (FTTH)

La technologie **PON (Passive Optical Network)** est le pilier du raccordement en fibre optique jusqu'au domicile (FTTH).

Contrairement à l'ADSL sur cuivre qui souffrait d'atténuation rapide avec la distance, la fibre optique monomode (G.652/G.657) permet de couvrir des distances de 20 kilomètres sans répéteur.`
  },
  {
    id: 'l4000001-0000-4000-8000-000000000002',
    chapter_id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: "2. L'Accès Radio Mobile 4G/5G (Fronthaul & Backhaul)",
    slug: 'acces-radio-mobile-4g-5g',
    duration_minutes: 45,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Architecture des sites radio : antennes actives MIMO, têtes radio distantes (RRH), bande de base (BBU) et transport optique vers le cœur de réseau mobile (5G Core).',
    video_url: undefined,
    video_provider: null,
    video_duration: '36:15',
    summary: 'Les antennes cellulaires 4G (eNodeB) et 5G (gNodeB) s\'appuient sur un réseau de transport optique ultra-rapide et synchronisé (PTP IEEE 1588v2) pour relier la radio au cœur de réseau.',
    key_points: [
      'Fronthaul : liaison optique à très faible latence (eCPRI) entre l\'antenne et la station de base.',
      'Backhaul : transport du trafic des antennes vers les routeurs d\'agrégation opérateur.',
      'Massive MIMO : faisceaux radio orientables (Beamforming) pour concentrer l\'énergie vers chaque utilisateur.'
    ],
    cli_examples: [
      {
        title: 'Tester la synchronisation de phase PTP sur équipement télécom',
        os: 'Cisco IOS-XR',
        command: 'show ptp foreign-masters-table',
        outputDescription: 'Vérifie que le routeur d\'agrégation mobile reçoit le signal d\'horloge atomique GPS/GNSS.'
      }
    ],
    content: `### 2. Le Réseau d'Accès Radio (RAN)

Quand vous utilisez votre smartphone, le signal radio franchit les airs sur quelques centaines de mètres, mais **rejoint immédiatement une fibre optique au pied du pylône télécom**.

Le transport mobile moderne exige une synchronisation temporelle ultra-précise (au nanoseconde près) pour permettre le passage transparent d'une antenne à l'autre (Handover).`
  },
  {
    id: 'l4000001-0000-4000-8000-000000000003',
    chapter_id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: "3. La Passerelle BNG (Broadband Network Gateway)",
    slug: 'passerelle-bng-ipoe-pppoe',
    duration_minutes: 50,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Le cerveau de la gestion des abonnés : authentification RADIUS, attribution des adresses IP (DHCP/IPoE), limitation de débit (Policing) et facturation.',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:00',
    summary: 'Le BNG est le routeur de premier niveau IP qui gère les sessions des abonnés résidentiels. C\'est lui qui applique le forfait (ex: 1 Gbit/s ou 2 Gbit/s) et attribue l\'adresse IPv4/IPv6.',
    key_points: [
      'Termine les sessions abonnés (IPoE moderne avec DHCP Option 82, ou ancien PPPoE).',
      'Communique avec le serveur RADIUS / AAA pour vérifier la validité de l\'abonnement.',
      'Applique les profils de QoS (Quality of Service) et la limitation de débit par abonné.'
    ],
    cli_examples: [
      {
        title: 'Afficher les sessions abonnés actives sur un BNG',
        os: 'Junos / Cisco BNG',
        command: 'show subscriber session summary',
        outputDescription: 'Affiche le nombre d\'abonnés connectés simultanément sur la plateforme.'
      }
    ],
    content: `### 3. Le Rôle Central du BNG

Le **BNG (Broadband Network Gateway)** est l'équipement frontière qui transforme des flux de trames Ethernet brutes provenant des OLTs en sessions IP individuelles identifiées et facturables.

Sans BNG, une box internet ne peut pas obtenir d'adresse IP ni accéder au reste du réseau.`
  },
  {
    id: 'l4000001-0000-4000-8000-000000000004',
    chapter_id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: "4. Cœur de Réseau National (Backbone) & Points d'Échange (IXP)",
    slug: 'backbone-national-points-echange-ixp',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Les autoroutes de l\'information : fibres DWDM à 800 Gbit/s, routeurs de cœur terabits et peering direct aux nœuds d\'échange Internet.',
    video_url: undefined,
    video_provider: null,
    video_duration: '40:30',
    summary: 'Le backbone transporte des térabits de trafic entre les grandes métropoles. Les IXP (Internet Exchange Points) permettent aux opérateurs d\'échanger du trafic gratuitement sans passer par un transitaire payant.',
    key_points: [
      'DWDM : multiplexe jusqu\'à 96 longueurs d\'onde sur une seule paire de fibres.',
      'Cœur MPLS / Segment Routing : commute les flux sans goulot d\'étranglement.',
      'IXP (ex: France-IX, DE-CIX) : réduit la latence et améliore la souveraineté des flux.'
    ],
    cli_examples: [
      {
        title: 'Tracer la route vers un point d\'échange avec traceroute',
        os: 'Linux Terminal',
        command: 'traceroute -n franceix.net',
        outputDescription: 'Visualise les sauts à travers le backbone national jusqu\'au nœud d\'échange.'
      }
    ],
    content: `### 4. Le Backbone Télécom et les Nœuds d'Échange (IXP)

Une fois agrégé par le BNG, le trafic emprunte les autoroutes nationales de fibres optiques.
Pour relier Paris à Marseille ou New York à Londres, les opérateurs utilisent le **DWDM (Dense Wavelength Division Multiplexing)**, capable d'atteindre plus de 40 Térabits par seconde par fibre !`
  },
  {
    id: 'l4000001-0000-4000-8000-000000000005',
    chapter_id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: "5. L'Entrée dans le Datacenter Cloud : Spine & Leaf",
    slug: 'entree-datacenter-spine-leaf',
    duration_minutes: 50,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Architecture réseau interne des Datacenters modernes : topologie Clos non bloquante (Spine-Leaf), VXLAN et serveurs applicatifs.',
    video_url: undefined,
    video_provider: null,
    video_duration: '43:00',
    summary: 'L\'architecture Spine-Leaf garantit une latence constante et prévisible (exactement 2 sauts entre n\'importe quels serveurs du datacenter). L\'overlay VXLAN permet de déplacer des machines virtuelles sans changer d\'IP.',
    key_points: [
      'Chaque switch Leaf (accès) est connecté à TOUS les switches Spine (cœur).',
      'Aucune liaison directe entre Spines, aucune liaison directe entre Leafs.',
      'Suppression du protocole Spanning Tree au profit du routage ECMP (Equal-Cost Multi-Path).',
      'VXLAN encapsule les trames Ethernet de couche 2 dans des paquets UDP port 4789.'
    ],
    cli_examples: [
      {
        title: 'Vérifier les chemins ECMP équilibrés sur un switch Spine',
        os: 'Arista / Cisco Nexus',
        command: 'show ip route ecmp',
        outputDescription: 'Affiche la répartition dynamique de charge vers les switches Leaf.'
      }
    ],
    content: `### 5. L'Arrivée dans le Datacenter Cloud

La destination finale du paquet est un serveur hébergé dans un Datacenter (Google Cloud, AWS, OVHcloud).

Pour éviter les congestions internes et gérer le trafic "Est-Ouest" (entre serveurs), les datacenters ont banni les anciennes architectures 3-tiers au profit de la topologie **Spine & Leaf (Réseau de Clos)**, offrant une bande passante massive et symétrique.`
  }
];
