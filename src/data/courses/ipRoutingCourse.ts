import { Course, Chapter, Lesson } from '../../types/learning';

export const IP_ROUTING_COURSE: Course = {
  id: 'c3000000-0000-4000-8000-000000000003',
  title: 'Ingénierie IP & Routage Avancé',
  slug: 'ingenierie-ip-routage-avance',
  description: 'Maîtriser les architectures IP modernes et les protocoles de routage utilisés dans les réseaux d\'entreprise et opérateurs.',
  full_description: `Cette formation de référence forme l'ingénieur aux protocoles cardinaux qui irriguent l'Internet et les cœurs de réseaux opérateurs :
- **Architecture de Routage à État de Liens** : OSPFv2 (RFC 2328), hiérarchie en aires (Area 0 Backbone, Stub, Totally Stubby, NSSA), typologie des LSA 1 à 7, élection DR/BDR, calcul SPF de Dijkstra et convergence rapide (BFD).
- **Le Protocole Opérateur IS-IS (Intermediate System to Intermediate System)** : niveaux Level 1 et Level 2, adjacences TLV (Type-Length-Value), indépendance vis-à-vis de la couche 3 et déploiement préféré des grands opérateurs télécoms (Tier-1 ISPs).
- **Le Protocole d'Interconnexion Mondiale BGP-4 (Border Gateway Protocol)** : sessions eBGP (External) et iBGP (Internal), peering, Route Reflectors, confédérations, et l'algorithme complet de décision BGP (Weight, Local Preference, AS Path Prepending, Origin, MED).
- **Routage et Transition IPv6** : format de l'en-tête IPv6 (40 octets fixes), types d'adresses (Global Unicast, Link-Local, Solicited-Node Multicast), protocoles SLAAC (Stateless Address Autoconfiguration) et DHCPv6, OSPFv3 et MP-BGP pour IPv6.
- **Filtrage et Ingénierie de Trafic (Traffic Engineering)** : Route Maps, Prefix Lists, AS-Path Access-Lists, communautés BGP (Standard et Large Communities) et prévention des fuites de routes (BGP Route Leaks).`,
  category: 'Réseaux IP',
  difficulty: 'Avancé',
  badge: 'ROUTAGE AVANCÉ',
  published: true,
  estimated_hours: 32,
  total_hours: 32,
  chapters_count: 3,
  lessons_count: 10,
  rating: 4.9,
  reviews_count: 142,
  thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Maîtrise des fondements du modèle TCP/IP et du subnetting CIDR / VLSM.',
    'Expérience de base de la ligne de commande réseau (Cisco IOS, FRRouting ou Junos).'
  ],
  objectives: [
    'Concevoir et déployer une architecture OSPF multi-aires résiliente avec optimisation SPF.',
    'Configurer et maintenir le protocole IS-IS dans un réseau opérateur multi-niveaux (L1/L2).',
    'Établir des sessions d\'interconnexion eBGP et iBGP avec politiques de filtrage fines.',
    'Maîtriser l\'adressage IPv6, SLAAC, le protocole NDP et le routage OSPFv3 / MP-BGP IPv6.'
  ],
  skills_acquired: [
    'Ingénierie du routage intra-domaine (OSPFv2/v3, IS-IS)',
    'Contrôle de l\'acheminement Internet mondial via BGP-4 & MP-BGP',
    'Ingénierie de trafic BGP (Local_Pref, MED, AS-Path Prepending)',
    'Conception d\'un plan d\'adressage et de routage IPv6 natif',
    'Dépannage d\'incidents de routage complexes (boucles, asymétries, flapping de routes)'
  ],
  created_at: '2026-01-08T08:00:00Z',
  updated_at: '2026-01-08T08:00:00Z',
};

export const IP_ROUTING_CHAPTERS: Chapter[] = [
  {
    id: 'ch300000-0000-4000-8000-000000000010',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    chapter_number: 1,
    title: 'Chapitre 1 — Routage IGP Avancé : OSPF Multi-Aires & IS-IS Opérateur',
    description: 'Mécanismes internes d\'OSPF (LSA 1 à 7, types d\'aires) et comparaison opérationnelle avec IS-IS (L1, L2, TLV).',
    objectives: [
      'Analyser les 7 types de LSA OSPF et leur zone de propagation.',
      'Configurer les aires Stub, Totally Stubby et NSSA.',
      'Comprendre pourquoi les opérateurs majeurs déploient IS-IS en cœur de réseau.'
    ],
    duration_minutes: 100,
    lessons_count: 4,
    position: 1,
    created_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'ch300000-0000-4000-8000-000000000020',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    chapter_number: 2,
    title: 'Chapitre 2 — BGP-4 : Le Protocole Inter-Domaines de l\'Internet Mondial',
    description: 'Sessions eBGP vs iBGP, Route Reflectors, manipulation des attributs de chemin et politiques de filtrage.',
    objectives: [
      'Établir des sessions eBGP avec des fournisseurs de transit et des points d\'échange IXP.',
      'Résoudre le problème de maillage complet iBGP avec des Route Reflectors.',
      'Manipuler l\'algorithme de décision BGP (Best Path Selection).'
    ],
    duration_minutes: 110,
    lessons_count: 3,
    position: 2,
    created_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'ch300000-0000-4000-8000-000000000030',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    chapter_number: 3,
    title: 'Chapitre 3 — Architecture IPv6, NDP, OSPFv3 & MP-BGP',
    description: 'Structure d\'adressage 128 bits, Neighbor Discovery Protocol, auto-configuration SLAAC et routage IPv6 dynamique.',
    objectives: [
      'Comprendre le rôle des adresses Link-Local (fe80::) dans les adjacences de routage IPv6.',
      'Remplacer le broadcast ARP par les messages Multicast NDP (Sollicitation et Annonce de Voisin).',
      'Déployer le routage dual-stack IPv4/IPv6 avec OSPFv3 et MP-BGP.'
    ],
    duration_minutes: 90,
    lessons_count: 3,
    position: 3,
    created_at: '2026-01-08T08:00:00Z',
  },
];

export const IP_ROUTING_LESSONS: Lesson[] = [
  {
    id: 'l3000001-0000-4000-8000-000000000011',
    chapter_id: 'ch300000-0000-4000-8000-000000000010',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '1. OSPFv2 Approfondi : Algorithme SPF, Adjacences & Types de Réseau',
    slug: 'ospfv2-spf-adjacences',
    description: 'Les états de l\'adjacence OSPF (Down -> Init -> 2-Way -> ExStart -> Exchange -> Loading -> Full), élection DR/BDR et types de réseau (Broadcast, Point-to-Point).',
    duration_minutes: 25,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'L\'état 2-Way est l\'état normal entre deux routeurs DROther sur un segment Broadcast.',
      'Dans une liaison Point-to-Point (/30 ou /31), il n\'y a pas d\'élection DR/BDR, accélérant la convergence.',
      'La bande passante de référence (`auto-cost reference-bandwidth`) doit être augmentée pour différencier 1G, 10G et 100G.'
    ],
    summary: 'OSPF garantit une vue topologique identique (LSDB) sur l\'ensemble des routeurs d\'une même aire.',
    has_lab: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000012',
    chapter_id: 'ch300000-0000-4000-8000-000000000010',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '2. Typologie des LSA OSPF (LSA 1 à 7) & Conception Multi-Aires',
    slug: 'ospf-lsa-types-multi-aires',
    description: 'Analyse précise de chaque Link-State Advertisement : LSA 1 (Router), LSA 2 (Network), LSA 3 (Summary Inter-Area), LSA 4 (ASBR Summary), LSA 5 (External AS) et LSA 7 (NSSA External).',
    duration_minutes: 30,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Les LSA 1 et 2 restent confinés dans leur aire d\'origine (intra-aire).',
      'L\'ABR (Area Border Router) génère les LSA 3 pour résumer les réseaux vers les autres aires.',
      'L\'ASBR (Autonomous System Boundary Router) injecte des routes externes via les LSA 5.'
    ],
    summary: 'La segmentation en aires réduit la taille de la base LSDB et isole les calculs SPF lors d\'un incident.',
    has_quiz: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000013',
    chapter_id: 'ch300000-0000-4000-8000-000000000010',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '3. Aires Spéciales OSPF : Stub, Totally Stubby et NSSA',
    slug: 'ospf-aires-speciales-stub-nssa',
    description: 'Optimisation de la mémoire des routeurs de bordure en bloquant les LSA 4/5 et en injectant automatiquement une route par défaut 0.0.0.0/0.',
    duration_minutes: 25,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Aire Stub : bloque les LSA 5 et LSA 4, accepte les LSA 3.',
      'Aire Totally Stubby (Cisco) : bloque les LSA 5, 4 et 3 (sauf la route par défaut).',
      'Aire NSSA (Not-So-Stubby Area) : autorise un ASBR local via des LSA 7 traduits en LSA 5 par l\'ABR.'
    ],
    summary: 'Les aires spéciales protègent les petits routeurs d\'accès de l\'injection de milliers de routes externes.',
    has_exercise: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000014',
    chapter_id: 'ch300000-0000-4000-8000-000000000010',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '4. IS-IS Opérateur : Niveaux L1/L2, Adressage NSAP & Encodage TLV',
    slug: 'is-is-operateur-l1-l2',
    description: 'Fonctionnement du protocole IS-IS : encapsulation directe en couche 2 (pas d\'en-tête IP), adressage NET/NSAP, adjacences et LSP (Link State PDU).',
    duration_minutes: 30,
    position: 4,
    published: true,
    technical_level: 'Expert',
    key_points: [
      'IS-IS s\'exécute directement sur Ethernet (LLC/SNAP), le rendant totalement insensible aux attaques IP ou à l\'épuisement de pile.',
      'Les niveaux Level 1 (intra-zone) et Level 2 (épine dorsale inter-zones) structurent le backbone opérateur.',
      'Le format TLV (Type-Length-Value) permet d\'ajouter de nouvelles fonctionnalités (IPv6, MPLS-TE, Segment Routing) sans modifier le cœur du protocole.'
    ],
    summary: 'IS-IS est le protocole IGP de prédilection des grands opérateurs pour sa simplicité, sa scalabilité et son extensibilité.',
    has_lab: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000021',
    chapter_id: 'ch300000-0000-4000-8000-000000000020',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '5. Fondations BGP-4 : Sessions eBGP, iBGP & États FSM',
    slug: 'bgp4-ebgp-ibgp-fsm',
    description: 'Établissement des sessions TCP port 179 : états Idle, Connect, Active, OpenSent, OpenConfirm et Established. Différences capitales eBGP (TTL=1) vs iBGP.',
    duration_minutes: 30,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'BGP est un protocole à vecteur de chemins (Path Vector), pas un protocole à état de liens.',
      'Règle du split-horizon iBGP : un routeur ne ré-annonce jamais à un voisin iBGP une route apprise d\'un autre voisin iBGP.',
      'La commande `next-hop-self` est indispensable en iBGP pour que les routeurs internes sachent atteindre la passerelle eBGP de sortie.'
    ],
    summary: 'BGP connecte les systèmes autonomes (AS) et maintient la table de routage complète de l\'Internet mondial.',
    has_lab: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000022',
    chapter_id: 'ch300000-0000-4000-8000-000000000020',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '6. Algorithme de Décision BGP (Best Path Selection) & Attributs',
    slug: 'bgp-best-path-algorithm',
    description: 'Ordre exact d\'évaluation des attributs BGP : Weight (Cisco local), Local_Preference (dans tout l\'AS), Origine locale, AS-Path le plus court, Origin code (IGP > EGP > Incomplete), MED et eBGP avant iBGP.',
    duration_minutes: 35,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Local_Preference contrôle le trafic sortant de l\'AS (valeur par défaut = 100, la plus haute l\'emporte).',
      'AS-Path Prepending allonge artificiellement le chemin pour dissuader le trafic entrant de choisir un lien particulier.',
      'MED (Multi-Exit Discriminator) suggère à l\'AS voisin par quel lien faire entrer le trafic (la valeur la plus basse l\'emporte).'
    ],
    summary: 'La maîtrise fine de l\'algorithme BGP est le cœur de l\'ingénierie de trafic Internet (Traffic Engineering).',
    has_exercise: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000023',
    chapter_id: 'ch300000-0000-4000-8000-000000000020',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '7. Scalabilité iBGP : Route Reflectors & Communautés BGP',
    slug: 'bgp-route-reflectors-communities',
    description: 'Suppression du maillage complet iBGP $n(n-1)/2$ grâce aux Route Reflectors (Client/Non-Client, Originator-ID, Cluster-List) et marquage de routes avec les Communautés.',
    duration_minutes: 30,
    position: 3,
    published: true,
    technical_level: 'Expert',
    key_points: [
      'Un Route Reflector reflète les routes de ses clients vers tous les voisins, évitant des milliers de sessions iBGP individuelles.',
      'Les attributs Cluster-List et Originator-ID empêchent les boucles de routage dans les topologies à plusieurs RR.',
      'Les communautés BGP (ex: AS:Value) déclenchent des actions automatiques de routage chez les transitaires mondiaux.'
    ],
    summary: 'Les Route Reflectors permettent aux réseaux opérateurs comptant des centaines de routeurs de fonctionner avec une charge de contrôle maîtrisée.',
    has_quiz: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000031',
    chapter_id: 'ch300000-0000-4000-8000-000000000030',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '8. En-tête IPv6, Adressage Global Unicast & Link-Local',
    slug: 'ipv6-header-adressage-link-local',
    description: 'Format fixe de l\'en-tête IPv6 à 40 octets (pas de checksum, pas de champ de fragmentation), règles d\'écriture raccourcie (::) et rôles des préfixes (2000::/3, fe80::/10, ff00::/8).',
    duration_minutes: 25,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'La taille fixe de l\'en-tête (40 octets) accélère le traitement matériel par les routeurs ASIC.',
      'L\'adresse Link-Local (fe80::/64) est générée automatiquement et sert d\'adresse de prochain saut pour les protocoles de routage.',
      'La fragmentation n\'est plus effectuée par les routeurs intermédiaires : c\'est l\'hôte émetteur qui l\'assure (Path MTU Discovery).'
    ],
    summary: 'IPv6 résout définitivement l\'épuisement des adresses IPv4 avec un espace de $3.4 \\times 10^{38}$ adresses uniques.',
    has_exercise: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000032',
    chapter_id: 'ch300000-0000-4000-8000-000000000030',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '9. Le Protocole NDP (Neighbor Discovery Protocol) & SLAAC',
    slug: 'ndp-neighbor-discovery-slaac',
    description: 'Remplacement du protocole ARP par ICMPv6 : Router Solicitation (RS), Router Advertisement (RA), Neighbor Solicitation (NS) et Neighbor Advertisement (NA).',
    duration_minutes: 25,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'NDP utilise le multicast solicited-node au lieu du broadcast pour économiser la bande passante.',
      'SLAAC (Stateless Address Autoconfiguration) permet à un équipement de s\'auto-attribuer une adresse IP sans aucun serveur DHCP.',
      'DAD (Duplicate Address Detection) vérifie qu\'aucune autre machine n\'utilise la même adresse avant de l\'activer.'
    ],
    summary: 'NDP élimine le trafic de broadcast intrusif et automatise la configuration réseau des terminaux.',
    has_lab: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  },
  {
    id: 'l3000001-0000-4000-8000-000000000033',
    chapter_id: 'ch300000-0000-4000-8000-000000000030',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: '10. Routage IPv6 Opérateur : OSPFv3 & MP-BGP (AFI/SAFI)',
    slug: 'ospfv3-mpbgp-ipv6-operateur',
    description: 'Configuration du routage IPv6 : OSPFv3 activé par interface, MP-BGP avec Address-Family IPv6 Unicast et peering dual-stack.',
    duration_minutes: 30,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'OSPFv3 s\'exécute par lien physique et non plus par sous-réseau IP.',
      'MP-BGP transporte les préfixes IPv6 en utilisant AFI 2 (IPv6) et SAFI 1 (Unicast).',
      'Le Next-Hop IPv6 annoncé par MP-BGP contient à la fois l\'adresse Global Unicast et l\'adresse Link-Local du routeur de sortie.'
    ],
    summary: 'Le cœur de réseau moderne achemine simultanément et nativement les flux IPv4 et IPv6 via OSPFv3 et MP-BGP.',
    has_quiz: true,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
  }
];
