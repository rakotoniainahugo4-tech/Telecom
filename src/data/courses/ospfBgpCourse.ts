import { Course, Chapter, Lesson } from '../../types/learning';

export const OSPF_BGP_COURSE: Course = {
  id: 'c3000000-0000-4000-8000-000000000003',
  title: 'Routage Dynamique Avancé : OSPF & BGP',
  slug: 'ospf-bgp',
  description: 'Apprenez le fonctionnement des protocoles de routage à état de liens (OSPF multi-aires, types de LSA) et le protocole de routage inter-domaines de l\'Internet mondial (BGP, peering, ASN, best path algorithm).',
  full_description: `Cette formation avancée est dédiée aux deux protocoles cardinaux qui font fonctionner l'Internet :
- **OSPF (Open Shortest Path First)** : le protocole intra-domaine (IGP) standard des grandes entreprises, campus et réseaux d'accès.
- **BGP (Border Gateway Protocol)** : le protocole inter-domaines (EGP) qui relie l'ensemble des opérateurs mondiaux et régit les 950 000 préfixes de la table Internet DFZ.

Vous apprendrez la mécanique exacte de l'algorithme SPF de Dijkstra, la modélisation hiérarchique en aires, l'établissement de sessions de peering eBGP et iBGP, la manipulation des attributs de chemin (Weight, Local_Pref, AS-Path, MED) et l'implémentation de politiques de filtrage BGP avancées.`,
  category: 'TELECOM ACADEMY',
  difficulty: 'Avancé',
  badge: 'ROUTAGE IP',
  published: true,
  estimated_hours: 20,
  total_hours: 20,
  chapters_count: 2,
  lessons_count: 6,
  rating: 4.9,
  reviews_count: 88,
  thumbnail_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Excellente maîtrise du modèle TCP/IP et du subnetting VLSM.',
    'Avoir validé le cours Réseaux IP ou posséder des compétences de niveau CCNA.',
    'Maîtrise de la ligne de commande Cisco IOS ou FRRouting.'
  ],
  objectives: [
    'Concevoir une architecture OSPF multi-aires avec agrégation de routes et optimisation de la bande passante de référence.',
    'Comprendre le rôle de chaque type de LSA (LSA 1 à 7) et des types d\'aires (Stub, Totally Stubby, NSSA).',
    'Établir des sessions eBGP et iBGP stables avec Route Reflectors.',
    'Manipuler la décision de routage BGP (Best Path Selection Algorithm) pour contrôler le trafic entrant et sortant.'
  ],
  skills_acquired: [
    'Ingénierie du routage dynamique intra et inter-domaines',
    'Configuration OSPFv2/v3 et BGP-4 sur routeurs d\'entreprise et d\'opérateur',
    'Contrôle du trafic Internet (Traffic Engineering BGP)',
    'Résolution d\'incidents de routage, boucles et asymétries de trafic'
  ],
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-01-15T10:00:00Z',
};

export const OSPF_BGP_CHAPTERS: Chapter[] = [
  {
    id: 'ch300000-0000-4000-8000-000000000001',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    chapter_number: 1,
    title: 'Chapitre 1 — Routage Intra-Domaine : OSPFv2 / OSPFv3',
    description: 'Algorithme SPF de Dijkstra, formation des adjacences, types d\'aires et LSA 1 à 7.',
    objectives: [
      'Analyser en profondeur la base de données topologique LSDB.',
      'Configurer des aires Stub et NSSA pour soulager les routeurs d\'accès.',
      'Sécuriser les sessions OSPF avec authentification cryptographique SHA-256.'
    ],
    duration_minutes: 240,
    lessons_count: 3,
    position: 1,
  },
  {
    id: 'ch300000-0000-4000-8000-000000000002',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    chapter_number: 2,
    title: 'Chapitre 2 — Routage Inter-Domaines : BGP-4 & Peering',
    description: 'Table de routage DFZ mondiale, attributs de chemin (Weight, Local_Pref, AS-Path, MED) et filtrage des préfixes.',
    objectives: [
      'Comprendre le concept d\'Autonomous System (ASN 16 et 32 bits).',
      'Maîtriser les 10 critères de l\'algorithme de sélection BGP Best Path.',
      'Appliquer des Route Maps et Prefix Lists pour filtrer les annonces indésirables.'
    ],
    duration_minutes: 240,
    lessons_count: 3,
    position: 2,
  }
];

export const OSPF_BGP_LESSONS: Lesson[] = [
  {
    id: 'l3000001-0000-4000-8000-000000000001',
    chapter_id: 'ch300000-0000-4000-8000-000000000001',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: "1. OSPF Avancé : Calcul SPF & Analyse de la LSDB",
    slug: 'ospf-avance-spf-lsdb',
    duration_minutes: 50,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    description: 'Structure interne de la base de données LSDB, calcul du plus court chemin par Dijkstra et synchronisation des LSA.',
    video_url: undefined,
    video_provider: null,
    video_duration: '44:00',
    summary: 'La Link-State Database (LSDB) est identique sur tous les routeurs d\'une même aire. Chacun exécute Dijkstra indépendamment pour placer sa propre Loopback à la racine de l\'arbre.',
    key_points: [
      'LSDB synchronisée à 100% au sein d\'une aire.',
      'Dijkstra calcule le chemin le plus court vers chaque nœud.',
      'LSA Aging : durée de vie maximale de 3600 secondes (1 heure).'
    ],
    cli_examples: [
      {
        title: 'Voir le détail d\'une LSA Routeur dans la LSDB',
        os: 'Cisco IOS',
        command: 'show ip ospf database router 10.0.0.1',
        outputDescription: 'Affiche la description détaillée des liens et adresses annoncés par le routeur ID 10.0.0.1.'
      }
    ],
    content: `### 1. La Link-State Database (LSDB) sous le microscope

Contrairement aux protocoles à vecteur de distance qui s'échangent des rumeurs, OSPF construit une carte exacte du réseau.
Chaque routeur décrit l'état de ses propres liens dans des paquets **LSA (Link-State Advertisement)**.`
  },
  {
    id: 'l3000001-0000-4000-8000-000000000002',
    chapter_id: 'ch300000-0000-4000-8000-000000000001',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: "2. Types d'Aires Spéciales : Stub, Totally Stubby & NSSA",
    slug: 'types-aires-speciales-ospf',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    description: 'Soulager la mémoire des routeurs de succursale en bloquant les LSA 4 et 5 au profit d\'une route par défaut 0.0.0.0/0 automatique.',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:30',
    summary: 'Les aires Stub bloquent les routes externes (LSA 5). Les Totally Stubby bloquent aussi les routes inter-aires (LSA 3) pour ne conserver qu\'une route par défaut.',
    key_points: [
      'Stub Area : bloque LSA 4 et 5, génère route par défaut 0.0.0.0/0.',
      'Totally Stubby Area (Cisco) : bloque LSA 3, 4 et 5.',
      'NSSA (Not-So-Stubby Area) : permet de redistribuer des routes externes via LSA Type 7.'
    ],
    cli_examples: [
      {
        title: 'Configurer une aire Totally Stubby sur l\'ABR',
        os: 'Cisco IOS',
        command: 'router ospf 1\n area 10 stub no-summary',
        outputDescription: 'Injecte une route par défaut unique dans l\'aire 10 et bloque toutes les LSA de type 3, 4 et 5.'
      }
    ],
    content: `### 2. Les Aires Spéciales OSPF

Dans une entreprise multisite, les petits routeurs d'agence n'ont pas besoin de connaître les 500 sous-réseaux internes du siège : une simple route par défaut \`0.0.0.0/0\` suffit amplement !

Les **Aires Spéciales** réduisent drastiquement la taille de la table de routage et de la LSDB.`
  },
  {
    id: 'l3000001-0000-4000-8000-000000000003',
    chapter_id: 'ch300000-0000-4000-8000-000000000001',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: "3. OSPFv3 pour IPv6 et Convergence Rapide (BFD)",
    slug: 'ospfv3-ipv6-bfd',
    duration_minutes: 45,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    description: 'Routage IPv6 avec OSPFv3 (RFC 5340), adresses Link-Local fe80:: et détection de panne milliseconde avec BFD.',
    video_url: undefined,
    video_provider: null,
    video_duration: '39:00',
    summary: 'OSPFv3 opère directement au-dessus d\'IPv6 et forme ses adjacences exclusivement via les adresses Link-Local fe80::. Le protocole BFD (Bidirectional Forwarding Detection) permet de détecter une coupure physique en moins de 50 ms.',
    key_points: [
      'OSPFv3 s\'exécute par lien et non par sous-réseau.',
      'BFD remplace les Hello timers lents pour une convergence quasi-instantanée.',
      'Support de l\'Address-Family IPv4 et IPv6 au sein d\'une instance unique.'
    ],
    cli_examples: [
      {
        title: 'Associer BFD à OSPF pour détection sub-seconde',
        os: 'Cisco IOS',
        command: 'interface GigabitEthernet0/0\n bfd interval 50 min_rx 50 multiplier 3\n ip ospf bfd',
        outputDescription: 'Détecte une panne de lien en 150 millisecondes au lieu des 40 secondes de l\'OSPF Dead Timer.'
      }
    ],
    content: `### 3. OSPFv3 et la Convergence Sub-Seconde

Avec l'avènement du Cloud et de la voix interactive, attendre 40 secondes (Dead Timer classique) pour constater qu'un lien fibre est coupé est inacceptable.

L'intégration de **BFD (Bidirectional Forwarding Detection - RFC 5880)** avec OSPF permet de converger en moins de **150 millisecondes**.`
  },
  {
    id: 'l3000001-0000-4000-8000-000000000004',
    chapter_id: 'ch300000-0000-4000-8000-000000000002',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: "4. Fondements de BGP-4 : Systèmes Autonomes (AS) & Peering",
    slug: 'fondements-bgp4-as-peering',
    duration_minutes: 50,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    description: 'Comprendre l\'organisation globale d\'Internet : ASN, relations de transit Tier-1/Tier-2, points d\'échange IXP et sessions BGP sur TCP 179.',
    video_url: undefined,
    video_provider: null,
    video_duration: '45:00',
    summary: 'BGP est le protocole de routage vecteur de chemin (Path Vector) qui relie les dizaines de milliers de Systèmes Autonomes constituant l\'Internet. Il repose sur des sessions fiables TCP port 179.',
    key_points: [
      'ASN (Autonomous System Number) : identifiant public unique attribué par les RIRs (RIPE, ARIN).',
      'eBGP (BGP externe) : entre deux ASN différents (TTL par défaut = 1).',
      'iBGP (BGP interne) : au sein d\'un même ASN (nécessite un maillage complet ou Route Reflectors).',
      'Port de communication : TCP 179.'
    ],
    cli_examples: [
      {
        title: 'Établir une session de peering eBGP',
        os: 'Cisco IOS',
        command: 'router bgp 65001\n neighbor 198.51.100.2 remote-as 65002\n neighbor 198.51.100.2 description PEERING_OPERATEUR_X',
        outputDescription: 'Démarre la session BGP vers l\'AS distant 65002 en port TCP 179.'
      }
    ],
    content: `### 4. Comment Internet est-il structuré ?

Internet n'est pas un réseau unique géré par une entité centrale : c'est une interconnexion de plus de **115 000 Systèmes Autonomes (AS)** appartenant à des opérateurs (Orange, NTT, Lumen), des géants du Cloud (Google, AWS, Cloudflare) et des entreprises.

Le seul langage qu'ils utilisent tous pour s'échanger leurs adresses est **BGP-4 (Border Gateway Protocol Version 4 - RFC 4271)**.`
  },
  {
    id: 'l3000001-0000-4000-8000-000000000005',
    chapter_id: 'ch300000-0000-4000-8000-000000000002',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: "5. L'Algorithme BGP Best Path & Manipulation des Attributs",
    slug: 'algorithme-bgp-best-path-attributs',
    duration_minutes: 55,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    description: 'Les critères d\'arbitrage dans l\'ordre strict : Weight, Local_Pref, AS-Path, Origin, MED, eBGP avant iBGP, métrique IGP vers Next-Hop et Router ID.',
    video_url: undefined,
    video_provider: null,
    video_duration: '48:30',
    summary: 'BGP ne choisit pas le chemin le plus court en débit : il applique des politiques économiques et contractuelles à travers ses attributs (Weight local, Local_Pref pour la sortie de l\'AS, AS-Path pour la brièveté, MED pour influencer l\'entrée).',
    key_points: [
      'Weight (propriétaire Cisco) : plus élevé gagne, local au routeur.',
      'Local Preference : plus élevé gagne, distribué dans tout l\'iBGP de l\'AS (choisit le lien de sortie).',
      'AS-Path : chemin traversant le moins d\'AS (AS-Path Prepending pour décourager un chemin).',
      'MED (Multi-Exit Discriminator) : plus faible gagne, suggère à l\'AS voisin par où entrer.'
    ],
    cli_examples: [
      {
        title: 'Voir le détail de l\'arbitrage BGP sur un préfixe',
        os: 'Cisco IOS',
        command: 'show ip bgp 8.8.8.8',
        outputDescription: 'Affiche tous les chemins reçus pour 8.8.8.8 et met en valeur le chemin gagnant noté par ">".'
      }
    ],
    content: `### 5. La Séquence de Sélection BGP Best Path

Quand un routeur BGP reçoit plusieurs annonces pour le même préfixe réseau, il applique cet algorithme immuable dans l'ordre strict :

1. **Weight le plus élevé** (Spécifique Cisco, local au routeur).
2. **Local_Preference la plus élevée** (Définit la politique de sortie de tout l'AS).
3. **Originaire localement** (Route générée par le routeur lui-même).
4. **AS-Path le plus court** (Nombre d'AS traversés).
5. **Origin Code le plus bas** (IGP < EGP < Incomplete).
6. **MED la plus basse** (Entre routes venant du même AS voisin).
7. **eBGP avant iBGP** (Préférence pour la liaison externe directe).
8. **Métrique IGP la plus faible** vers le Next-Hop BGP.
9. **BGP Router ID le plus bas** (Critère de départage final).`
  },
  {
    id: 'l3000001-0000-4000-8000-000000000006',
    chapter_id: 'ch300000-0000-4000-8000-000000000002',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: "6. Filtrage BGP, Prefix-Lists & Sécurité RPKI",
    slug: 'filtrage-bgp-prefix-lists-rpki',
    duration_minutes: 50,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    description: 'Protéger son réseau contre les détournements de trafic (BGP Hijacking) et fuites de routes (Route Leaks) grâce aux Prefix-Lists et à la validation RPKI (ROA).',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:00',
    summary: 'Sans filtrage strict, une erreur d\'un opérateur tiers peut détourner l\'intégralité du trafic mondial d\'un service. RPKI valide cryptographiquement l\'authenticité de l\'AS annonçant chaque préfixe.',
    key_points: [
      'Ne jamais faire de peering BGP sans Prefix-List stricte en entrée et en sortie.',
      'RPKI (Resource Public Key Infrastructure) : validation cryptographique d\'origine (ROA).',
      'États RPKI : Valid, Invalid (à rejeter impérativement), NotFound.'
    ],
    cli_examples: [
      {
        title: 'Configurer une Prefix-List stricte pour autoriser uniquement ses préfixes clients',
        os: 'Cisco IOS',
        command: 'ip prefix-list OUT_BGP_FILTER seq 10 permit 198.51.100.0/24\nrouter bgp 65001\n neighbor 203.0.113.1 prefix-list OUT_BGP_FILTER out',
        outputDescription: 'Empêche toute fuite de routes accidentelle vers l\'opérateur de transit.'
      }
    ],
    content: `### 6. Sécurisation et Filtrage BGP

Une seule mauvaise ligne de configuration BGP peut couper l'accès à un géant du web sur toute la planète (ex: les incidents historiques impliquant Cloudflare, Google ou Facebook).

Dans cette leçon, nous configurons les **Prefix-Lists**, les **Route-Maps de contrôle** et la validation cryptographique **RPKI (ROA)** pour garantir l'intégrité de vos annonces de routage.`
  }
];
