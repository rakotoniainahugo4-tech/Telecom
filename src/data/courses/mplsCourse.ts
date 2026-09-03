import { Course, Chapter, Lesson } from '../../types/learning';

export const MPLS_COURSE: Course = {
  id: 'c2000000-0000-4000-8000-000000000002',
  title: 'Architectures IP/MPLS & L3VPN / L2VPN',
  slug: 'architectures-ip-mpls-l3vpn-l2vpn',
  description: 'Comprendre et configurer les architectures MPLS utilisées dans les réseaux opérateurs.',
  full_description: `Le réseau cœur des opérateurs télécoms mondiaux repose sur la technologie IP/MPLS. Ce cours de haut niveau vous enseigne comment concevoir, configurer et dépanner un backbone opérateur moderne :
- Les fondements de la commutation de labels (en-tête de 32 bits, tables FIB, LIB et LFIB).
- La distribution automatique d'étiquettes avec LDP (Label Distribution Protocol, RFC 5036).
- L'architecture VPN de niveau 3 (RFC 4364) avec isolation totale par VRF (Virtual Routing and Forwarding).
- L'échange de routes multi-clients via MP-BGP (Multi-Protocol BGP) utilisant Route Distinguishers (RD) et Route Targets (RT).
- Le mécanisme de la pile à deux étiquettes (étiquette Transport extérieure + étiquette Service VPN intérieure).`,
  category: 'MPLS / Réseaux opérateurs',
  difficulty: 'Avancé',
  badge: 'CŒUR DE RÉSEAU',
  published: true,
  estimated_hours: 25,
  total_hours: 25,
  chapters_count: 3,
  lessons_count: 8,
  rating: 4.9,
  reviews_count: 67,
  thumbnail_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Excellente compréhension du routage IP (OSPF, BGP de base, tables RIB/FIB).',
    'Connaissance des modèles de réseau opérateur (Client CE, Bordure PE, Cœur P).',
    'Avoir validé le cours Réseaux IP ou équivalent ingénieur.'
  ],
  objectives: [
    'Déchiffrer la structure de l\'en-tête MPLS (20 bits Label, 3 bits TC, 1 bit Bottom of Stack, 8 bits TTL).',
    'Comprendre les opérations Push, Swap, Pop et le mécanisme PHP (Penultimate Hop Popping).',
    'Configurer des VRF sur routeurs Cisco IOS / IOS-XR pour étanchéifier des clients aux adresses IP identiques.',
    'Dépanner un réseau VPN MPLS avec traceroute mpls et vérification de la LFIB.'
  ],
  skills_acquired: [
    'Conception d\'architectures cœur de réseau opérateur IP/MPLS',
    'Configuration du protocole LDP et de l\'IGP sous-jacent',
    'Déploiement de services L3VPN d\'entreprise multi-tenants',
    'Configuration MP-BGP avec Address-Family VPNv4',
    'Troubleshooting avancé de la pile de labels et des sessions LDP'
  ],
  created_at: '2026-01-12T10:00:00Z',
  updated_at: '2026-01-12T10:00:00Z',
};

export const MPLS_CHAPTERS: Chapter[] = [
  {
    id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    chapter_number: 1,
    title: 'Chapitre 1 — Principes de la Commutation par Étiquettes',
    description: 'Architecture des routeurs LER/LSR, en-tête shim de 32 bits et opérations Push, Swap, Pop, PHP.',
    objectives: [
      'Différencier le plan de contrôle (Control Plane) et le plan de transfert (Data Plane) MPLS.',
      'Comprendre le rôle des routeurs P (Cœur) et PE (Bordure).',
      'Calculer l\'impact du mécanisme PHP sur la consommation CPU du PE de sortie.'
    ],
    duration_minutes: 180,
    lessons_count: 3,
    position: 1,
  },
  {
    id: 'ch200000-0000-4000-8000-000000000002',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    chapter_number: 2,
    title: 'Chapitre 2 — Protocole LDP & Tables de Commutation',
    description: 'Distribution des labels avec LDP (RFC 5036), synchronisation IGP-LDP, et structure des tables FIB, LIB, LFIB.',
    objectives: [
      'Comprendre la découverte de voisins LDP en UDP 646 et la session TCP 646.',
      'Détailler la relation entre la FIB, la LIB et la LFIB.',
      'Identifier les labels réservés (0 = Explicit NULL, 3 = Implicit NULL).'
    ],
    duration_minutes: 180,
    lessons_count: 2,
    position: 2,
  },
  {
    id: 'ch200000-0000-4000-8000-000000000003',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    chapter_number: 3,
    title: 'Chapitre 3 — VPN MPLS de Niveau 3 (RFC 4364)',
    description: 'Isolation multi-clients avec VRF, Route Distinguisher (RD), Route Target (RT) et MP-BGP.',
    objectives: [
      'Résoudre les conflits d\'adresses privées RFC 1918 entre clients distincts.',
      'Configurer les Route Distinguishers (RD) et Route Targets (RT) d\'import/export.',
      'Analyser le cheminement complet d\'un paquet avec la double pile d\'étiquettes (Transport + VPN).'
    ],
    duration_minutes: 240,
    lessons_count: 3,
    position: 3,
  }
];

export const MPLS_LESSONS: Lesson[] = [
  {
    id: 'l2000001-0000-4000-8000-000000000001',
    chapter_id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "1. Pourquoi MPLS ? Limites du routage IP classique",
    slug: 'pourquoi-mpls-limites-ip',
    duration_minutes: 45,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    description: 'Pourquoi la commutation par étiquettes a été inventée : accélération matérielle, indépendance du protocole de niveau 3 et séparation cœur/accès.',
    video_url: undefined,
    video_provider: null,
    video_duration: '38:15',
    summary: 'Le routage IP impose une recherche du préfixe le plus long à chaque saut. MPLS permet une commutation par index entier direct dans la mémoire ASIC des routeurs.',
    key_points: [
      'Supprime la dépendance à la table de routage BGP complète dans les routeurs de cœur P.',
      'Permet l\'ingénierie de trafic (Traffic Engineering avec RSVP-TE).',
      'Assure le transport multi-protocole (IPv4, IPv6, Ethernet L2VPN, etc.).'
    ],
    cli_examples: [
      {
        title: 'Activer MPLS sur une interface Cisco IOS',
        os: 'Cisco IOS',
        command: 'interface GigabitEthernet0/0\n mpls ip',
        outputDescription: 'Active la commutation MPLS et démarre le processus LDP sur l\'interface.'
      }
    ],
    content: `### 1. Pourquoi le routage IP classique a atteint ses limites

Dans le routage IP traditionnel, chaque routeur intermédiaire doit :
1. Lire l'adresse IP de destination (32 bits).
2. Parcourir sa table de routage (parfois 900 000 entrées BGP).
3. Trouver le préfixe le plus long (Longest Match).
4. Déterminer l'interface de sortie.

Dans un cœur de réseau opérateur à 100 Gbit/s, ce processus consomme trop de puissance CPU. **MPLS résout ce problème** en substituant une étiquette courte de 20 bits à l'adresse IP.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000002',
    chapter_id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "2. Structure de l'étiquette MPLS (En-tête Shim de 32 bits)",
    slug: 'structure-etiquette-mpls-shim',
    duration_minutes: 40,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    description: 'Analyse détaillée des 32 bits de l\'en-tête MPLS : Label (20 bits), TC / Exp (3 bits), S-bit (1 bit) et TTL (8 bits).',
    video_url: undefined,
    video_provider: null,
    video_duration: '34:00',
    summary: 'L\'en-tête MPLS est inséré (shim) entre la couche 2 (Ethernet) et la couche 3 (IP). Le champ S-bit indique si d\'autres étiquettes sont empilées en dessous.',
    key_points: [
      'Label (20 bits) : valeurs de 0 à 1 048 575 (labels 0 à 15 réservés RFC 3032).',
      'TC (Traffic Class, 3 bits) : utilisé pour la qualité de service QoS / DiffServ.',
      'S (Bottom of Stack, 1 bit) : vaut 1 pour la dernière étiquette, 0 si d\'autres suivent.',
      'TTL (8 bits) : décrémenté à chaque saut pour empêcher les boucles infinies.'
    ],
    cli_examples: [
      {
        title: 'Inspecter les paquets MPLS capturés avec tcpdump',
        os: 'Linux Terminal',
        command: 'tcpdump -i eth0 -nn -e "mpls"',
        outputDescription: 'Affiche les étiquettes MPLS transportées dans les trames Ethernet.'
      }
    ],
    content: `### 2. Anatomie de l'en-tête MPLS (32 bits)

L'en-tête MPLS s'insère comme une cale (shim) entre la trame Ethernet et le paquet IP :

\`\`\`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                Label (20 bits)                | TC  |S|  TTL  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
\`\`\`

- **Label (20 bits)** : l'identifiant numérique de commutation (ex: 1048).
- **Traffic Class (TC / EXP, 3 bits)** : priorisation QoS des paquets voix/vidéo.
- **S-bit (1 bit)** : Bottom of Stack. Vaut 1 si c'est la dernière étiquette de la pile, 0 si une autre étiquette (ex: label VPN) est empilée en dessous.
- **TTL (8 bits)** : Time-to-Live décrémenté à chaque routeur.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000003',
    chapter_id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "3. Opérations fondamentales : Push, Swap, Pop & PHP",
    slug: 'operations-push-swap-pop-php',
    duration_minutes: 50,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    description: 'Comment chaque routeur manipule l\'étiquette : injection à l\'entrée, commutation dans le cœur et optimisation PHP (Penultimate Hop Popping).',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:10',
    summary: 'Le routeur d\'entrée (Ingress PE) effectue un PUSH. Les routeurs de cœur (P) effectuent des SWAP. Le routeur précédant la sortie effectue un POP via PHP (Label 3) pour décharger le routeur final.',
    key_points: [
      'PUSH : Ajoute une étiquette en tête de paquet.',
      'SWAP : Remplace l\'étiquette par une autre selon la table LFIB.',
      'POP : Retire l\'étiquette supérieure.',
      'PHP (Penultimate Hop Popping) : évite au PE final une double consultation LFIB + FIB.'
    ],
    cli_examples: [
      {
        title: 'Vérifier l\'attribution du label Implicit Null (PHP)',
        os: 'Cisco IOS',
        command: 'show mpls ldp bindings',
        outputDescription: 'Montre les routes pour lesquelles le voisin annonce le label réservé 3 (imp-null).'
      }
    ],
    content: `### 3. Les Opérations de Commutation : Push, Swap, Pop & PHP

1. **PUSH (Empiler)** : Réalisé par le routeur **Ingress LER (PE)** à l'entrée du réseau MPLS. Il reçoit un paquet IP natif non étiqueté, détermine son FEC et insère une étiquette MPLS.
2. **SWAP (Échanger)** : Réalisé par les routeurs **LSR (P)** dans le cœur. Le routeur lit l'étiquette entrante, consulte sa table LFIB et la remplace par une nouvelle étiquette sortante.
3. **POP (Dépiler)** : Retire l'étiquette pour restituer le paquet IP d'origine.
4. **PHP (Penultimate Hop Popping)** : Le routeur P situé juste avant le routeur de sortie retire l'étiquette de transport (Label 3 Implicit Null). Ainsi, le PE de sortie n'a pas besoin de consulter deux tables successivement !`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000004',
    chapter_id: 'ch200000-0000-4000-8000-000000000002',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "4. Le Protocole LDP (Label Distribution Protocol - RFC 5036)",
    slug: 'protocole-ldp-rfc5036',
    duration_minutes: 50,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    description: 'Découverte des voisins LDP en UDP 646, session TCP 646 et distribution des labels pour chaque préfixe IGP.',
    video_url: undefined,
    video_provider: null,
    video_duration: '40:00',
    summary: 'LDP attribue automatiquement une étiquette locale à chaque préfixe appris par l\'IGP (OSPF/IS-IS) et la distribue à ses voisins.',
    key_points: [
      'Découverte des voisins : messages Hello en UDP port 646 sur 224.0.0.2 (All Routers).',
      'Session de transport des labels : TCP port 646.',
      'Nécessite impérativement que l\'IGP sous-jacent soit pleinement convergent.',
      'LDP Router ID : généralement l\'adresse IP de l\'interface Loopback0.'
    ],
    cli_examples: [
      {
        title: 'Vérifier les sessions LDP actives sur Cisco IOS',
        os: 'Cisco IOS',
        command: 'show mpls ldp neighbor',
        outputDescription: 'Affiche l\'adresse IP du voisin LDP et l\'état de la session TCP (OPERATIONAL).'
      }
    ],
    content: `### 4. Le Protocole LDP (Label Distribution Protocol)

Pour que les routeurs puissent échanger des étiquettes de transport, ils utilisent **LDP (RFC 5036)**.

Le fonctionnement s'effectue en deux phases :
1. **Découverte des voisins** : Émission périodique de paquets \`Hello LDP\` en multicast sur l'adresse \`224.0.0.2\` en port **UDP 646**.
2. **Session de transport de labels** : Établissement d'une connexion fiable en port **TCP 646** entre les Router IDs pour synchroniser les étiquettes.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000005',
    chapter_id: 'ch200000-0000-4000-8000-000000000002',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "5. Les tables FIB, LIB & LFIB",
    slug: 'tables-fib-lib-lfib',
    duration_minutes: 45,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    description: 'Comprendre la différence fondamentale entre la Forwarding Information Base, la Label Information Base et la Label Forwarding Information Base.',
    video_url: undefined,
    video_provider: null,
    video_duration: '37:30',
    summary: 'La FIB sert pour les paquets IP entrants. La LIB contient tous les labels reçus de tous les voisins LDP. La LFIB ne conserve que le meilleur label sortant pour commuter à vitesse matérielle.',
    key_points: [
      'FIB : table IP utilisée par l\'Ingress PE pour décider de l\'opération PUSH.',
      'LIB : base de données de stockage de tous les labels reçus (analogue à la LSDB en OSPF).',
      'LFIB : table matérielle ultra-rapide utilisée par les routeurs P pour l\'opération SWAP.'
    ],
    cli_examples: [
      {
        title: 'Consulter la table LFIB complète',
        os: 'Cisco IOS',
        command: 'show mpls forwarding-table',
        outputDescription: 'Affiche la correspondance exacte entre le Local Label entrant, le Outgoing Label et le prochain saut.'
      }
    ],
    content: `### 5. Les tables FIB, LIB & LFIB

- **FIB (Forwarding Information Base)** : Table de commutation IP pure dérivée de la RIB (utilisée pour les paquets non étiquetés entrants).
- **LIB (Label Information Base)** : Base de données de stockage de tous les labels reçus de tous les voisins LDP pour chaque préfixe.
- **LFIB (Label Forwarding Information Base)** : Table matérielle ultrarapide contenant uniquement le meilleur label de sortie pour chaque étiquette entrante (utilisée lors de l'opération de SWAP).`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000006',
    chapter_id: 'ch200000-0000-4000-8000-000000000003',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "6. VRF, Route Distinguisher (RD) & Route Target (RT)",
    slug: 'vrf-rd-rt-l3vpn',
    duration_minutes: 55,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    description: 'Virtual Routing and Forwarding pour étanchéifier les tables d\'adresses clients et résoudre les chevauchements d\'adresses RFC 1918 (ex: 10.0.0.0/8).',
    video_url: undefined,
    video_provider: null,
    video_duration: '46:00',
    summary: 'Les VRF créent des tables de routage virtuelles indépendantes sur un même routeur physique. Le RD rend chaque adresse IP unique au monde (adresse VPNv4). Les RT définissent les politiques d\'importation et d\'exportation des routes.',
    key_points: [
      'VRF (Virtual Routing and Forwarding) : isolation totale multi-entreprises.',
      'Route Distinguisher (RD - 64 bits) : préfixe ajouté à l\'IPv4 (ex: 65000:10:192.168.1.0/24).',
      'Route Target (RT - Extended Community BGP) : contrôle quelle VRF importe quelle route.'
    ],
    cli_examples: [
      {
        title: 'Créer et configurer une VRF client sur Cisco IOS',
        os: 'Cisco IOS',
        command: 'ip vrf CLIENT_BANQUE\n rd 65001:100\n route-target export 65001:100\n route-target import 65001:100\ninterface GigabitEthernet0/1\n ip vrf forwarding CLIENT_BANQUE\n ip address 10.1.1.1 255.255.255.0',
        outputDescription: 'Crée la VRF avec ses règles d\'import/export et y assigne une interface.'
      }
    ],
    content: `### 6. VRF, Route Distinguisher (RD) & Route Target (RT)

Pour permettre à plusieurs entreprises clientes (Client A et Client B) d'utiliser les mêmes plages d'adresses privées (ex: \`192.168.1.0/24\`) sur le même routeur opérateur sans aucun conflit, on utilise les **VRF (Virtual Routing and Forwarding)**.

- **Route Distinguisher (RD - 64 bits)** : préfixé à l'adresse IPv4 (32 bits) pour créer une adresse VPN-IPv4 unique de 96 bits (ex: \`65000:10:192.168.1.0/24\`).
- **Route Target (RT - Community BGP)** : définit la politique d'importation et d'exportation des routes entre les VRF.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000007',
    chapter_id: 'ch200000-0000-4000-8000-000000000003',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "7. MP-BGP (Multi-Protocol BGP) pour la distribution VPNv4",
    slug: 'mp-bgp-distribution-vpnv4',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    description: 'L\'extension MP-BGP (RFC 4760) pour transporter les routes VPNv4 entre les routeurs PE du réseau opérateur.',
    video_url: undefined,
    video_provider: null,
    video_duration: '43:30',
    summary: 'MP-BGP transporte les adresses VPNv4 de 96 bits et attribue à chaque préfixe un Label VPN qui servira au routeur PE de sortie à savoir dans quelle VRF locale injecter le paquet.',
    key_points: [
      'Address Family VPNv4 unicast (AFI 1 / SAFI 128).',
      'Session iBGP entre les Loopbacks des routeurs PE.',
      'Le Label VPN est alloué dynamiquement par BGP et annoncé avec le préfixe.'
    ],
    cli_examples: [
      {
        title: 'Inspecter les routes VPNv4 apprises par MP-BGP',
        os: 'Cisco IOS',
        command: 'show ip bgp vpnv4 all',
        outputDescription: 'Affiche toutes les routes VPNv4 de toutes les VRF avec leur Route Distinguisher.'
      }
    ],
    content: `### 7. MP-BGP pour la distribution des routes VPNv4

Le protocole BGP standard ne comprend que l'IPv4 unicast. L'extension **MP-BGP (Multi-Protocol BGP)** introduit les Address Families (AFI 1 / SAFI 128 pour VPN-IPv4).

Les routeurs de bordure (PE) établissent une session iBGP en VPNv4 pour échanger les préfixes clients et attribuer le **Label VPN (étiquette intérieure)** qui identifiera la VRF de destination.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000008',
    chapter_id: 'ch200000-0000-4000-8000-000000000003',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "8. Acheminement du paquet avec la pile de labels MPLS (2 labels)",
    slug: 'pile-deux-labels-mpls',
    duration_minutes: 50,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    description: 'Analyse du paquet complet dans le cœur : Label Transport (LDP) à l\'extérieur + Label VPN (MP-BGP) à l\'intérieur.',
    video_url: undefined,
    video_provider: null,
    video_duration: '41:45',
    summary: 'Dans un réseau VPN MPLS, deux étiquettes sont empilées. Les routeurs de cœur ne voient et ne commutent que le label extérieur de transport. Le routeur PE final utilise le label intérieur pour délivrer le paquet au client.',
    key_points: [
      'Label Supérieur (Transport / LDP) : guide le paquet à travers les routeurs P jusqu\'au PE de sortie.',
      'Label Inférieur (VPN / MP-BGP) : identifie la VRF cliente sur le PE de destination.',
      'Les routeurs de cœur P n\'ont aucune connaissance des routes clients ni de leurs adresses IP privées.'
    ],
    cli_examples: [
      {
        title: 'Effectuer un traceroute avec affichage des labels MPLS',
        os: 'Cisco IOS',
        command: 'traceroute mpls ipv4 10.1.1.1 255.255.255.255',
        outputDescription: 'Affiche la pile de labels traversée à chaque saut dans le réseau opérateur.'
      }
    ],
    content: `### 8. Acheminement avec la pile à deux labels (Two-Label Stack)

Dans un service VPN MPLS, les paquets qui traversent le cœur transportent **deux étiquettes superposées** :

\`\`\`
[ En-tête Ethernet ]
[ Label Transport (LDP) : Ex: 1045 - Utilisé par les routeurs P pour traverser le cœur ]
[ Label VPN (MP-BGP) : Ex: 2018 - Utilisé par le PE de sortie pour injecter le paquet dans la bonne VRF ]
[ Paquet IP Client Original (Ex: 10.1.1.1 -> 10.2.2.2) ]
\`\`\`

Les routeurs de cœur P n'ont aucune connaissance des routes du client : ils ne lisent et ne commutent que l'étiquette supérieure Transport !`
  }
];
