import { Course, Chapter, Lesson } from '../../types/learning';

export const IP_NETWORKS_COURSE: Course = {
  id: 'c0000000-0000-4000-8000-000000000000',
  title: 'Réseaux IP — De débutant à ingénieur réseau',
  slug: 'ip-networks',
  description: 'Formation complète et professionnalisante permettant de comprendre en profondeur puis de maîtriser l\'architecture, l\'adressage, la commutation et le routage des réseaux IP d\'entreprise et d\'opérateur.',
  full_description: `Cette formation de référence a été spécialement conçue pour vous amener du niveau débutant jusqu'aux compétences réelles requises pour un poste d'ingénieur réseau ou d'administrateur infrastructure.

Vous y découvrirez les mécanismes physiques et logiques de transmission des données, la manipulation chirurgicale de l'adressage IPv4 et du subnetting VLSM, la segmentation en VLANs 802.1Q avec trunks, le routage dynamique à état de liens avec OSPFv2, ainsi qu'une introduction pratique à la commutation par étiquettes MPLS des opérateurs télécoms.

Chaque leçon est structurée selon un modèle rigoureux : fondations théoriques, schémas d'architecture, exemples réels, configurations CLI Cisco IOS & Linux, pièges courants, méthodologie de troubleshooting et exercices pratiques.`,
  category: 'TELECOM ACADEMY',
  difficulty: 'Intermédiaire',
  badge: 'PROGRAMME COMPLET',
  published: true,
  estimated_hours: 30,
  total_hours: 30,
  chapters_count: 7,
  lessons_count: 21,
  rating: 4.9,
  reviews_count: 184,
  thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Connaissances générales de base de l\'outil informatique et d\'un système d\'exploitation (Windows, macOS ou Linux).',
    'Capacité à ouvrir et utiliser un terminal ou une invite de commande.',
    'Aucune certification ou expérience réseau préalable requise : le cours part des fondamentaux stricts.'
  ],
  objectives: [
    'Comprendre le modèle OSI et la pile TCP/IP pour analyser précisément chaque couche de communication.',
    'Calculer instantanément des masques de sous-réseau (CIDR/VLSM) et planifier un plan d\'adressage sans gaspillage.',
    'Configurer des commutateurs Ethernet d\'entreprise, implémenter des VLANs 802.1Q et des trunks de transport.',
    'Mettre en œuvre le routage inter-VLAN (Router-on-a-Stick et Switch L3 / SVI).',
    'Déployer et dépanner le protocole de routage dynamique OSPFv2 en environnement multi-aires.',
    'Maîtriser les outils de diagnostic réseau et l\'analyse de trames avec Wireshark et tcpdump.',
    'Comprendre les fondations des réseaux de transport opérateur à commutation par labels MPLS.'
  ],
  skills_acquired: [
    'Conception et dimensionnement d\'architectures de réseaux locaux (LAN) et étendus (WAN)',
    'Calcul de masques de sous-réseaux IPv4 & plan d\'adressage hiérarchique VLSM',
    'Configuration des équipements Cisco IOS (Switches Catalyst, Routeurs ISR/ASR) et Linux IP stack',
    'Segmentation réseau par VLAN (802.1Q), protocoles STP/RSTP et agrégation LACP',
    'Routage statique, passerelles par défaut et routage dynamique OSPFv2 (Adjacences, LSA, Dijkstra)',
    'Méthodologie formelle de diagnostic et troubleshooting réseau (Wireshark, ping, traceroute, ARP)'
  ],
  created_at: '2026-01-05T08:00:00Z',
  updated_at: '2026-01-05T08:00:00Z',
};

export const IP_NETWORKS_CHAPTERS: Chapter[] = [
  {
    id: 'ch000000-0000-4000-8000-000000000001',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    chapter_number: 1,
    title: 'Chapitre 1 — Fondamentaux des réseaux & Modèle TCP/IP',
    description: 'Comprendre comment deux machines communiquent à travers un réseau, le processus d\'encapsulation et le rôle des 4 couches TCP/IP.',
    objectives: [
      'Différencier le modèle théorique OSI à 7 couches et le modèle opérationnel TCP/IP à 4 couches.',
      'Suivre le voyage d\'un paquet réseau de l\'application jusqu\'aux bits sur le câble.',
      'Identifier les unités de données (PDU) : Données, Segment, Paquet, Trame, Bits.'
    ],
    duration_minutes: 180,
    lessons_count: 3,
    position: 1,
  },
  {
    id: 'ch000000-0000-4000-8000-000000000002',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    chapter_number: 2,
    title: 'Chapitre 2 — Adressage IPv4 & Structure binaire',
    description: 'Structure d\'une adresse IP sur 32 bits, conversion décimal/binaire, classes d\'adresses historiques et notation CIDR moderne.',
    objectives: [
      'Convertir rapidement n\'importe quel octet IPv4 entre binaire et décimal.',
      'Identifier la partie réseau (NetID) et la partie hôte (HostID) via le masque de sous-réseau.',
      'Distinguer les adresses privées RFC 1918 et les adresses publiques routables sur Internet.'
    ],
    duration_minutes: 240,
    lessons_count: 3,
    position: 2,
  },
  {
    id: 'ch000000-0000-4000-8000-000000000003',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    chapter_number: 3,
    title: 'Chapitre 3 — Subnetting & Découpage VLSM',
    description: 'Maîtriser le découpage d\'adresses à longueur variable pour optimiser l\'utilisation des préfixes et éliminer le gaspillage.',
    objectives: [
      'Calculer l\'adresse réseau, la première IP hôte, la dernière IP hôte et l\'adresse de broadcast.',
      'Concevoir un plan d\'adressage VLSM complet pour une entreprise multisite.',
      'Comprendre le routage sans classe (CIDR) et l\'agrégation de routes (Supernetting).'
    ],
    duration_minutes: 300,
    lessons_count: 3,
    position: 3,
  },
  {
    id: 'ch000000-0000-4000-8000-000000000004',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    chapter_number: 4,
    title: 'Chapitre 4 — Commutation Ethernet & Segmentation VLAN (802.1Q)',
    description: 'Fonctionnement d\'un commutateur (Switch L2), table d\'adresses MAC, isolation des domaines de broadcast par VLAN et liens Trunks.',
    objectives: [
      'Expliquer le mécanisme d\'apprentissage et de transfert d\'un commutateur (MAC Table Flooding).',
      'Créer et assigner des ports dans des VLANs distincts sur Cisco IOS.',
      'Configurer un lien Trunk 802.1Q avec encapsulation d\'en-tête (Tag 4 octets).'
    ],
    duration_minutes: 270,
    lessons_count: 3,
    position: 4,
  },
  {
    id: 'ch000000-0000-4000-8000-000000000005',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    chapter_number: 5,
    title: 'Chapitre 5 — Routage Statique & Passerelle par Défaut',
    description: 'Principes de la table de routage (RIB/FIB), passerelle par défaut (0.0.0.0/0), distance administrative et routage inter-VLAN.',
    objectives: [
      'Analyser une table de routage IP et comprendre la règle du préfixe le plus long (Longest Prefix Match).',
      'Configurer des routes statiques et des routes par défaut sur routeurs Cisco.',
      'Implémenter le routage inter-VLAN avec la technique Router-on-a-Stick (sous-interfaces dot1q).'
    ],
    duration_minutes: 240,
    lessons_count: 3,
    position: 5,
  },
  {
    id: 'ch000000-0000-4000-8000-000000000006',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    chapter_number: 6,
    title: 'Chapitre 6 — Protocole de Routage Dynamique OSPFv2',
    description: 'Routage IGP à état de liens : découverte des voisins (Hello), formation d\'adjacences, base topologique LSDB et algorithme SPF de Dijkstra.',
    objectives: [
      'Expliquer la supériorité d\'un protocole Link-State par rapport aux protocoles à vecteur de distance.',
      'Déployer OSPFv2 dans une aire unique (Area 0 Backbone) puis en multi-aires.',
      'Interpréter les états OSPF (Down, Init, 2-Way, ExStart, Exchange, Loading, Full).'
    ],
    duration_minutes: 360,
    lessons_count: 3,
    position: 6,
  },
  {
    id: 'ch000000-0000-4000-8000-000000000007',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    chapter_number: 7,
    title: 'Chapitre 7 — Introduction au Cœur de Réseau & MPLS',
    description: 'Pourquoi le routage IP pur atteint ses limites dans les cœurs opérateurs et comment la commutation par étiquettes MPLS révolutionne le transport.',
    objectives: [
      'Identifier les limites du routage IP classique "hop-by-hop" pour les opérateurs télécoms.',
      'Comprendre le principe d\'un label MPLS de 32 bits et la commutation rapide en silicium (ASIC).',
      'Distinguer les rôles LER (Ingress/Egress) et LSR (Core) dans un réseau de transport.'
    ],
    duration_minutes: 210,
    lessons_count: 3,
    position: 7,
  }
];

export const IP_NETWORKS_LESSONS: Lesson[] = [
  // Chapitre 1
  {
    id: 'l0000001-0000-4000-8000-000000000001',
    chapter_id: 'ch000000-0000-4000-8000-000000000001',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '1. Modèle OSI vs Modèle TCP/IP : Les fondations de l\'Internet',
    slug: 'modele-osi-tcpip',
    duration_minutes: 45,
    position: 1,
    published: true,
    technical_level: 'Débutant',
    description: 'Comprendre la communication réseau en couches : découpage en responsabilités strictes, du câble physique jusqu\'au navigateur web.',
    video_url: undefined,
    video_provider: null,
    video_duration: '38:15',
    summary: 'Le modèle TCP/IP structure toutes les communications sur 4 couches : Accès Réseau, Internet (IP), Transport (TCP/UDP) et Application. L\'encapsulation ajoute des métadonnées à chaque niveau pour acheminer les données.',
    key_points: [
      'Le modèle OSI comporte 7 couches théoriques (Physique à Application).',
      'Le modèle TCP/IP opérationnel comporte 4 couches (Accès réseau, Internet, Transport, Application).',
      'Chaque couche ne communique qu\'avec sa couche équivalente distante via des en-têtes (Headers).',
      'L\'encapsulation descend les couches en ajoutant un en-tête ; la désencapsulation remonte en le retirant.'
    ],
    troubleshooting: `Si une application ne répond pas :
1. Vérifier la Couche 1 (Lien physique : câble branché, LED allumée, signal Wi-Fi).
2. Vérifier la Couche 2 (Liaison : adresse MAC reconnue, statut d'interface up/up).
3. Vérifier la Couche 3 (Réseau : adresse IP valide, masque correct, ping vers passerelle par défaut).
4. Vérifier la Couche 4 (Transport : port TCP/UDP ouvert, pare-feu autorisant le flux).
5. Vérifier la Couche 7 (Application : service en écoute, certificat SSL valide).`,
    cli_examples: [
      {
        title: 'Vérifier la connectivité Couche 3 (IP) et Couche 4 (Ports)',
        os: 'Linux / MacOS',
        command: 'ping -c 4 8.8.8.8\nnc -zv 8.8.8.8 53',
        outputDescription: 'Teste d\'abord la connectivité ICMP au niveau IP, puis vérifie l\'ouverture du port DNS 53 en TCP.'
      },
      {
        title: 'Inspecter les interfaces et adresses physiques/logiques',
        os: 'Cisco IOS',
        command: 'show ip interface brief\nshow interfaces status',
        outputDescription: 'Affiche l\'état matériel (Status) et protocolaire (Protocol) de chaque interface Ethernet.'
      }
    ],
    content: `### 1. Le Concept Fondamental : La Communication en Couches

Imaginez que vous deviez envoyer une lettre commerciale de Paris à Tokyo. Vous ne vous souciez pas de savoir quel modèle d'avion sera utilisé, quelle route maritime le navire empruntera ou quel employé postal triera l'enveloppe. Vous écrivez votre message, vous l'insérez dans une enveloppe portant une adresse normalisée, et vous confiez l'acheminement à un système logistique qui opère par niveaux de responsabilité indépendants.

En informatique et télécommunications, ce principe d'abstraction est incarné par **les modèles en couches** :
- **Le Modèle OSI (Open Systems Interconnection)** : norme ISO définie en 1984 comportant 7 couches théoriques.
- **La Pile TCP/IP (Internet Protocol Suite)** : modèle opérationnel et pragmatique conçu pour le réseau ARPANET, sur lequel repose l'intégralité de l'Internet mondial moderne.

---

### 2. Pourquoi ce modèle existe-t-il ?

Sans modèle standardisé :
- Un navigateur web devrait être réécrit pour chaque type de carte réseau (Ethernet, Wi-Fi 6, Fibre optique, 5G).
- Toute modification du matériel obligerait à refaire l'ensemble des logiciels de la planète.
- Les équipements de constructeurs différents (Cisco, Juniper, Huawei, Nokia, serveurs Linux) seraient incapables d'interagir.

Grâce à la séparation en couches, **la couche Transport (TCP) n'a pas besoin de savoir si les données circulent sur une fibre optique sous-marine ou sur un signal radio satellite**, tant que la couche Internet (IP) lui fournit des paquets adressés.

---

### 3. Architecture et Comparaison des deux modèles

\`\`\`
  MODÈLE OSI (7 Couches)             PILE TCP/IP (4 Couches)          UNITÉ DE DONNÉES (PDU)
┌─────────────────────────────┐   ┌─────────────────────────────┐   ┌────────────────────────┐
│ 7. Application (HTTP, DNS)  │   │                             │   │                        │
├─────────────────────────────┤   │ 4. Application              │   │ Message / Données      │
│ 6. Présentation (TLS, JSON) │───│    (HTTP, SSH, DNS, SIP)    │   │                        │
├─────────────────────────────┤   │                             │   │                        │
│ 5. Session (Sockets, RPC)   │   │                             │   │                        │
├─────────────────────────────┤   ├─────────────────────────────┤   ├────────────────────────┤
│ 4. Transport (TCP, UDP)     │───│ 3. Transport (TCP / UDP)    │───│ Segment (TCP) / Datagramme
├─────────────────────────────┤   ├─────────────────────────────┤   ├────────────────────────┤
│ 3. Réseau (IP, ICMP, OSPF)  │───│ 2. Internet (IPv4 / IPv6)   │───│ Paquet IP              │
├─────────────────────────────┤   ├─────────────────────────────┤   ├────────────────────────┤
│ 2. Liaison (Ethernet, ARP)  │───│ 1. Accès Réseau             │───│ Trame (Frame)          │
├─────────────────────────────┤   │    (Ethernet 802.3, Wi-Fi,  │   ├────────────────────────┤
│ 1. Physique (Câble, Ondes)  │───│     Fibre, 4G/5G)           │───│ Bits (0 et 1)          │
└─────────────────────────────┘   └─────────────────────────────┘   └────────────────────────┘
\`\`\`

---

### 4. Le Mécanisme Clé : L'Encapsulation & la Désencapsulation

Quand un client web demande une page via \`https://telecomlab.com\` :
1. **Couche Application** : Le navigateur génère une requête \`GET / HTTP/1.1\`.
2. **Couche Transport** : Le système ajoute un en-tête **TCP** de 20 octets spécifiant le port source (ex: 54128) et le port de destination (443 pour HTTPS) avec numéro de séquence. L'ensemble devient un **Segment**.
3. **Couche Internet** : Le système ajoute un en-tête **IPv4** de 20 octets contenant l'adresse IP source (ex: 192.168.1.50) et l'adresse IP destination (ex: 104.21.45.12). L'ensemble devient un **Paquet IP**.
4. **Couche Accès Réseau** : La carte réseau ajoute un en-tête **Ethernet** de 14 octets avec les adresses physiques MAC (Source MAC et Gateway MAC) et une remorque FCS (Frame Check Sequence) de 4 octets. L'ensemble devient une **Trame**.
5. **Couche Physique** : La trame est encodée en signaux électriques, optiques ou radiofréquences sur le média de transmission.

À l'arrivée sur le serveur web distant, le processus inverse (**Désencapsulation**) a lieu : chaque couche lit et retire son en-tête respectif avant de passer la charge utile à la couche supérieure.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000002',
    chapter_id: 'ch000000-0000-4000-8000-000000000001',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '2. Couche Transport : TCP (Fiable) vs UDP (Temps Réel)',
    slug: 'tcp-vs-udp',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Débutant',
    description: 'Comprendre pourquoi le web utilise TCP (Three-Way Handshake, fenêtrage, retransmissions) tandis que la voix sur IP et le streaming utilisent UDP.',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:00',
    summary: 'TCP garantit la livraison ordonnée et sans perte de données grâce à un accusé de réception (ACK) et au Three-Way Handshake. UDP privilégie la vitesse et la faible latence sans accusé de réception, idéal pour la voix et la vidéo.',
    key_points: [
      'TCP est orienté connexion : Three-Way Handshake (SYN -> SYN-ACK -> ACK).',
      'TCP gère le contrôle de flux (Window Size) et le contrôle de congestion (Slow Start).',
      'UDP est sans état (stateless) et sans garantie : overhead minimal de 8 octets contre 20 octets pour TCP.',
      'En télécoms, la voix (RTP) voyage sur UDP car une retransmission avec retard dégrade l\'intelligibilité.'
    ],
    troubleshooting: `Diagnostic des problèmes de couche transport :
- Erreur "Connection Refused" : Le paquet SYN est arrivé à l'hôte, mais aucun service n'écoute sur le port cible (le serveur renvoie un TCP RST).
- Erreur "Connection Timed Out" : Le paquet SYN a été rejeté silencieusement (Drop) par un pare-feu en amont, ou l'adresse IP n'est pas joignable.`,
    cli_examples: [
      {
        title: 'Observer les connexions actives et ports en écoute',
        os: 'Linux',
        command: 'ss -tuln\nnetstat -tulpen',
        outputDescription: 'Liste tous les sockets en écoute (LISTEN) en TCP (t) et UDP (u) avec les numéros de ports.'
      }
    ],
    content: `### 1. Pourquoi deux protocoles de transport majeurs ?

Tous les types de trafic réseau n'ont pas les mêmes exigences fondamentales :
- Si vous téléchargez un fichier exécutable ou une page bancaire, **pas un seul octet ne peut être perdu ou inversé**, sous peine de corrompre le fichier. La latence de quelques millisecondes est secondaire.
- Si vous êtes en appel téléphonique VoIP ou en visioconférence, **entendre un mot perdu avec 700 ms de retard est insupportable** et perturbe la conversation. Il vaut mieux ignorer le paquet perdu et continuer le flux en direct.

C'est cette dichotomie qui justifie l'existence de **TCP (Transmission Control Protocol - RFC 793)** et **UDP (User Datagram Protocol - RFC 768)**.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000003',
    chapter_id: 'ch000000-0000-4000-8000-000000000001',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '3. Adresses MAC et Protocole ARP (Address Resolution Protocol)',
    slug: 'mac-et-arp',
    duration_minutes: 40,
    position: 3,
    published: true,
    technical_level: 'Débutant',
    description: 'Faire le lien entre l\'adresse logique IP de couche 3 et l\'adresse matérielle MAC de couche 2 : fonctionnement détaillé d\'ARP.',
    video_url: undefined,
    video_provider: null,
    video_duration: '35:20',
    summary: 'Sur un réseau local Ethernet, les paquets ne voyagent pas directement d\'IP à IP : ils sont encapsulés dans des trames acheminées par adresses MAC. Le protocole ARP permet à une machine de découvrir l\'adresse MAC associée à une adresse IP.',
    key_points: [
      'L\'adresse MAC (48 bits / 6 octets) est gravée dans la carte réseau (ex: 00:1A:2B:3C:4D:5E).',
      'Les 3 premiers octets correspondent à l\'OUI (Organizationally Unique Identifier) du constructeur.',
      'ARP Request est envoyé en broadcast niveau 2 (FF:FF:FF:FF:FF:FF).',
      'ARP Reply est envoyé en unicast directement au demandeur.'
    ],
    cli_examples: [
      {
        title: 'Consulter et vider le cache ARP local',
        os: 'Linux / Windows',
        command: 'arp -a\nip neigh show',
        outputDescription: 'Affiche la table de correspondance IP <-> MAC actuellement mémorisée par le système d\'exploitation.'
      }
    ],
    content: `### 1. Le paradoxe de l'adressage local

Une machine connaît généralement l'adresse IP de destination (par exemple la passerelle \`192.168.1.1\` ou un serveur local \`192.168.1.20\`). Cependant, les commutateurs Ethernet de votre bâtiment ne comprennent pas les adresses IP : ils ne commutent que des trames Ethernet basées sur **l'adresse physique MAC**.

Comment une machine sait-elle à quelle adresse MAC envoyer sa trame pour joindre une IP donnée ?
C'est le rôle exclusif d'**ARP (Address Resolution Protocol - RFC 826)**.`
  },

  // Chapitre 2 : Adressage IPv4
  {
    id: 'l0000001-0000-4000-8000-000000000004',
    chapter_id: 'ch000000-0000-4000-8000-000000000002',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '4. Structure binaire d\'IPv4 et Conversion Décimal/Binaire',
    slug: 'structure-ipv4-binaire',
    duration_minutes: 50,
    position: 1,
    published: true,
    technical_level: 'Débutant',
    description: 'Comprendre qu\'une adresse IP n\'est pas une suite de 4 nombres magiques, mais une chaîne ininterrompue de 32 bits.',
    video_url: undefined,
    video_provider: null,
    video_duration: '45:10',
    summary: 'Une adresse IPv4 est un identifiant de 32 bits découpé en 4 octets de 8 bits. La méthode des puissances de 2 (128, 64, 32, 16, 8, 4, 2, 1) permet de convertir instantanément n\'importe quelle valeur entre 0 et 255.',
    key_points: [
      '32 bits = 4 octets séparés par des points (notation décimale pointée).',
      'Chaque octet varie strictement entre 0 (00000000) et 255 (11111111).',
      'Il existe 2^32 adresses possibles, soit environ 4,29 milliards d\'adresses IPv4 dans le monde.',
      'Le masque de sous-réseau indique exactement où s\'arrête la partie Réseau et où commence la partie Hôte.'
    ],
    cli_examples: [
      {
        title: 'Calculateur d\'adresses et de masques IP sous Linux',
        os: 'Linux',
        command: 'ipcalc 192.168.10.45/24',
        outputDescription: 'Décompose l\'adresse en binaire, affiche le masque, l\'adresse réseau et la plage d\'hôtes disponibles.'
      }
    ],
    content: `### 1. La réalité d'une adresse IPv4

Dans nos interfaces réseau, nous écrivons \`192.168.1.1\`. Pour les processeurs de vos routeurs et ordinateurs, cette adresse n'a aucun sens décimal : elle est strictement représentée par une suite de **32 zéros et uns** :

\`\`\`
192      . 168      . 1        . 1
11000000 . 10101000 . 00000001 . 00000001
\`\`\`

#### Le tableau des 8 puissances de 2 :
Pour convertir n'importe quel nombre décimal en octet binaire, retenez impérativement cette ligne :
\`\`\`
128 | 64 | 32 | 16 | 8 | 4 | 2 | 1
\`\`\`
Exemple pour 192 : 128 + 64 = **11000000**.
Exemple pour 168 : 128 + 32 + 8 = **10101000**.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000005',
    chapter_id: 'ch000000-0000-4000-8000-000000000002',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '5. Classes d\'adresses (A, B, C) et Adresses Privées RFC 1918',
    slug: 'classes-adresses-rfc1918',
    duration_minutes: 45,
    position: 2,
    published: true,
    technical_level: 'Débutant',
    description: 'Historique des classes A, B, C, et règles strictes des plages réservées pour les réseaux locaux d\'entreprise (RFC 1918) face au NAT.',
    video_url: undefined,
    video_provider: null,
    video_duration: '40:00',
    summary: 'La RFC 1918 définit 3 blocs d\'adresses privées (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) non routables sur Internet public, utilisées pour tous les réseaux locaux derrière un routeur NAT.',
    key_points: [
      'Classe A : 1.0.0.0 à 126.255.255.255 (/8) pour les très grands réseaux.',
      'Classe B : 128.0.0.0 à 191.255.255.255 (/16) pour les réseaux intermédiaires.',
      'Classe C : 192.0.0.0 à 223.255.255.255 (/24) pour les petits réseaux locaux.',
      'Classe D (224.0.0.0 à 239.255.255.255) réservée au Multicast.',
      'Plages RFC 1918 : 10.0.0.0/8, 172.16.0.0/12 à 172.31.255.255/12, 192.168.0.0/16.'
    ],
    cli_examples: [
      {
        title: 'Identifier son adresse IP publique réelle sur Internet',
        os: 'Terminal',
        command: 'curl -s https://ifconfig.me\ncurl -s https://api.ipify.org',
        outputDescription: 'Interroge un service public pour afficher l\'IP publique routable attribuée à votre routeur par votre opérateur.'
      }
    ],
    content: `### 1. Pourquoi a-t-on créé les adresses privées ?

Au début des années 1990, les ingénieurs se sont rendu compte que si chaque ordinateur branché à un réseau recevait une adresse IP publique unique, les 4,3 milliards d'adresses IPv4 seraient épuisées en quelques années.

Pour éviter la saturation immédiate, l'IETF a publié la **RFC 1918** en 1996, définissant des plages d'adresses privées réutilisables à l'infini dans des millions d'entreprises et de domiciles, isolées d'Internet par le mécanisme **NAT (Network Address Translation)**.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000006',
    chapter_id: 'ch000000-0000-4000-8000-000000000002',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '6. Le Masque de Sous-réseau et l\'Opération Logique ET (AND)',
    slug: 'masque-sous-reseau-et-logique',
    duration_minutes: 50,
    position: 3,
    published: true,
    technical_level: 'Débutant',
    description: 'Comment une machine détermine si sa cible est sur le même réseau local ou nécessite l\'envoi à la passerelle par défaut via l\'opération ET logique.',
    video_url: undefined,
    video_provider: null,
    video_duration: '44:30',
    summary: 'Le masque de sous-réseau est une série continue de 1 suivie d\'une série continue de 0. En appliquant l\'opération binaire ET entre une adresse IP et son masque, on obtient l\'adresse réseau.',
    key_points: [
      'Masque classique /24 : 255.255.255.0 = 24 bits à 1 et 8 bits à 0.',
      'Opération ET : 1 AND 1 = 1 ; 1 AND 0 = 0 ; 0 AND 0 = 0.',
      'Si [IP_Source AND Masque] == [IP_Destination AND Masque] -> Communication directe locale (ARP).',
      'Si différent -> Envoi de la trame à la passerelle par défaut (Default Gateway).'
    ],
    cli_examples: [
      {
        title: 'Afficher la passerelle par défaut configurée',
        os: 'Linux',
        command: 'ip route show default',
        outputDescription: 'Affiche la route "default via X.X.X.X dev eth0" vers laquelle tous les paquets distants sont transmis.'
      }
    ],
    content: `### 1. Comment votre ordinateur sait-il où envoyer un paquet ?

Quand votre PC avec l'IP \`192.168.1.15/24\` veut envoyer un message à \`192.168.1.20\`, il ne contacte pas sa box ou son routeur : il contacte directement son voisin par une requête ARP locale.

Mais quand il veut joindre \`142.250.200.46\` (Google), il ne cherche même pas à envoyer une requête ARP vers cette IP : il sait mathématiquement qu'elle est sur un réseau extérieur et l'envoie à l'adresse MAC de sa passerelle par défaut.

Cette décision instantanée est calculée grâce à l'**Opération Binaire ET (AND)** entre l'adresse IP et le masque de sous-réseau.`
  },

  // Chapitre 3 : Subnetting & VLSM
  {
    id: 'l0000001-0000-4000-8000-000000000007',
    chapter_id: 'ch000000-0000-4000-8000-000000000003',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '7. Subnetting IPv4 : Méthode de calcul rapide et sans erreur',
    slug: 'subnetting-calcul-rapide',
    duration_minutes: 60,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'La méthode infaillible du "Nombre Magique" pour découper un réseau en sous-réseaux réguliers sans se tromper.',
    video_url: undefined,
    video_provider: null,
    video_duration: '52:15',
    summary: 'Le nombre magique (256 - valeur du dernier octet significatif du masque) donne instantanément la taille de chaque sous-réseau et les multiples de départ.',
    key_points: [
      'Formule des sous-réseaux : 2^s >= nombre de sous-réseaux nécessaires (s = bits empruntés).',
      'Formule des hôtes utiles : (2^h) - 2 >= nombre d\'hôtes requis (h = bits restants).',
      'On soustrait toujours 2 adresses : l\'adresse réseau (tous les bits hôtes à 0) et l\'adresse de broadcast (tous les bits hôtes à 1).',
      'Le nombre magique est égal à 256 moins la valeur du masque dans l\'octet modifié.'
    ],
    cli_examples: [
      {
        title: 'Tester un masque spécifique et son nombre d\'hôtes utiles',
        os: 'Linux',
        command: 'python3 -c "import ipaddress; net=ipaddress.ip_network(\'192.168.10.0/26\'); print(\'Hôtes utiles:\', net.num_addresses - 2); print(\'Broadcast:\', net.broadcast_address)"',
        outputDescription: 'Utilise le module standard Python ipaddress pour vérifier rapidement le calcul.'
      }
    ],
    content: `### 1. La Problématique du Découpage Réseau

Supposons que votre opérateur vous attribue le réseau \`192.168.10.0/24\` (254 hôtes utilisables). Votre entreprise compte 4 départements distincts :
- Département Ingénierie : 50 machines
- Département Ventes : 50 machines
- Département Support : 50 machines
- Département Direction : 20 machines

Si vous mettez tout le monde dans le même réseau \`/24\`, les tempêtes de broadcast ralentissent tout le monde, et les stagiaires peuvent capturer les paquets du service financier.

Vous devez **découper ce réseau \`/24\` en 4 sous-réseaux isolés**.

---

### 2. La Règle des Puissances de 2

Pour obtenir 4 sous-réseaux :
2^s = 4 -> **s = 2 bits empruntés**.
Le nouveau masque passe donc de \`/24\` à \`/26\` (24 + 2 = 26).

En binaire, le dernier octet du masque devient :
\`11000000\` = 128 + 64 = **255.255.255.192**.

---

### 3. La Technique Secrète du "Nombre Magique"

Pour trouver les adresses réseaux sans faire de calcul binaire complexe :
\`\`\`
Nombre Magique = 256 - 192 = 64
\`\`\`
Les sous-réseaux démarrent de 64 en 64 :
1. **Sous-réseau 1** : \`192.168.10.0/26\` (Plage : .1 à .62, Broadcast : .63)
2. **Sous-réseau 2** : \`192.168.10.64/26\` (Plage : .65 à .126, Broadcast : .127)
3. **Sous-réseau 3** : \`192.168.10.128/26\` (Plage : .129 à .190, Broadcast : .191)
4. **Sous-réseau 4** : \`192.168.10.192/26\` (Plage : .193 à .254, Broadcast : .255)`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000008',
    chapter_id: 'ch000000-0000-4000-8000-000000000003',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '8. VLSM (Variable Length Subnet Masking) : Optimisation d\'entreprise',
    slug: 'vlsm-optimisation-adresse',
    duration_minutes: 65,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Adapter la taille exacte de chaque sous-réseau aux besoins réels pour ne pas gaspiller d\'adresses IP, notamment pour les liaisons point-à-point en /30 et /31.',
    video_url: undefined,
    video_provider: null,
    video_duration: '56:00',
    summary: 'VLSM permet d\'appliquer des masques de tailles différentes au sein d\'un même espace d\'adressage. La règle d\'or : toujours allouer les sous-réseaux du plus grand au plus petit.',
    key_points: [
      'Règle impérative : Trier les besoins en hôtes par ordre décroissant.',
      'Liaisons inter-routeurs point-à-point : utiliser un masque /30 (2 adresses utiles) ou /31 (RFC 3021).',
      'Évite le gaspillage massif imposé par le subnetting à masque fixe (FLSM).',
      'Nécessite des protocoles de routage modernes sans classe (RIPv2, OSPF, EIGRP, BGP) transportant le masque.'
    ],
    cli_examples: [
      {
        title: 'Configurer une liaison point-à-point en /30 sur Cisco IOS',
        os: 'Cisco IOS',
        command: 'interface GigabitEthernet0/0/0\n ip address 10.0.0.1 255.255.255.252\n no shutdown',
        outputDescription: 'Assigne une adresse IP sur un sous-réseau /30 (255.255.255.252) dédié à un lien inter-routeur.'
      }
    ],
    content: `### 1. Pourquoi le VLSM est obligatoire dans la vraie vie ?

Avec le subnetting classique à masque fixe (FLSM), tous les sous-réseaux doivent avoir la même taille. Si vous découpez en blocs de 60 adresses pour satisfaire votre plus gros service, vos liaisons point-à-point entre deux routeurs (qui n'ont besoin que de 2 adresses !) gaspilleront 58 adresses IP chacune !

**VLSM (Variable Length Subnet Masking)** résout ce problème en permettant de subdiviser un sous-réseau déjà découpé.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000009',
    chapter_id: 'ch000000-0000-4000-8000-000000000003',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '9. Atelier Pratique : Conception d\'un Plan d\'Adressage Complet',
    slug: 'atelier-plan-adressage-vlsm',
    duration_minutes: 55,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Étude de cas réelle : concevoir le plan d\'adressage complet d\'une entreprise avec siège, filiales régionales, serveurs DMZ et liaisons WAN.',
    video_url: undefined,
    video_provider: null,
    video_duration: '48:30',
    summary: 'Mise en application pratique de VLSM à partir d\'un bloc 172.16.0.0/16 pour 5 sites d\'entreprise, avec matrice d\'adresses, passerelles et tables d\'interfaces.',
    key_points: [
      'Toujours réserver 20 à 30% d\'adresses supplémentaires pour la croissance future de chaque site.',
      'Attribuer systématiquement la première ou la dernière adresse utile à la passerelle (Default Gateway).',
      'Normaliser les conventions : ex: .1 pour le routeur principal, .2 pour le routeur de secours (HSRP), .10 à .20 pour les serveurs.'
    ],
    cli_examples: [
      {
        title: 'Vérifier la table de routage globale résultante',
        os: 'Cisco IOS',
        command: 'show ip route',
        outputDescription: 'Vérifie que chaque sous-réseau VLSM apparaît bien avec son masque spécifique.'
      }
    ],
    content: `### 1. Cahier des Charges de l'Entreprise "Alpha Telecom"

Alpha Telecom dispose du bloc privé \`10.100.0.0/16\` et doit interconnecter :
1. Siège social - Utilisateurs : 500 postes
2. Siège social - Centre de données (Datacenter) : 120 serveurs
3. Agence Lyon : 60 postes
4. Agence Marseille : 25 postes
5. 3 liaisons WAN point-à-point entre le siège et les agences

Dans cet atelier, nous construisons pas à pas l'arbre de découpage binaire et validons l'étanchéité des plages.`
  },

  // Chapitre 4 : Commutation Ethernet & VLAN (802.1Q)
  {
    id: 'l0000001-0000-4000-8000-000000000010',
    chapter_id: 'ch000000-0000-4000-8000-000000000004',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '10. Commutation Ethernet & Fonctionnement de la table MAC (CAM)',
    slug: 'commutation-ethernet-cam-table',
    duration_minutes: 50,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Comment un switch apprend les adresses MAC sources, prend ses décisions de transfert et évite les collisions grâce au full-duplex.',
    video_url: undefined,
    video_provider: null,
    video_duration: '41:10',
    summary: 'Un switch inspecte l\'adresse MAC source pour enrichir sa table CAM (apprentissage) et utilise l\'adresse MAC de destination pour transférer la trame vers le bon port (Forwarding). Si l\'adresse est inconnue, il effectue un Unknown Unicast Flooding.',
    key_points: [
      'Le switch apprend sur la MAC SOURCE, il commute sur la MAC DESTINATION.',
      'Chaque port de switch est un domaine de collision indépendant.',
      'Par défaut, tous les ports d\'un switch non configuré appartiennent au même domaine de broadcast.',
      'La table CAM expire généralement les entrées inactives après 300 secondes (5 minutes).'
    ],
    cli_examples: [
      {
        title: 'Inspecter la table d\'adresses MAC sur un switch Cisco',
        os: 'Cisco IOS',
        command: 'show mac address-table\nshow mac address-table dynamic',
        outputDescription: 'Affiche la correspondance entre les ports physiques (ex: Gi0/1), les adresses MAC et les numéros de VLAN.'
      }
    ],
    content: `### 1. Du Hub (Concentrateur) au Switch (Commutateur)

Dans les anciens réseaux Ethernet à base de Hubs :
- Tout signal reçu sur un port était répété électriquement sur **tous** les autres ports.
- Deux machines émettant en même temps provoquaient une **collision**, imposant le mécanisme CSMA/CD et divisant la bande passante par le nombre d'utilisateurs.

Le **Switch L2** a révolutionné les réseaux en créant une micro-segmentation : chaque port dispose de sa propre bande passante dédiée en mode Full-Duplex.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000011',
    chapter_id: 'ch000000-0000-4000-8000-000000000004',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '11. Les VLANs (802.1Q) : Segmentation logique & Sécurité',
    slug: 'vlans-8021q-segmentation',
    duration_minutes: 55,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Isoler les flux sensibles (VoIP, Gestion, Clients, RH) au sein d\'un même commutateur physique grâce aux Virtual LANs.',
    video_url: undefined,
    video_provider: null,
    video_duration: '47:45',
    summary: 'Un VLAN divise un commutateur physique en plusieurs commutateurs logiques distincts. Deux machines situées sur des VLANs différents ne peuvent pas communiquer directement au niveau 2, même si elles sont branchées côte à côte.',
    key_points: [
      'VLAN ID : valeur de 1 à 4094 (VLAN 1 = VLAN par défaut non modifiable).',
      'Ports Access : connectés aux terminaux utilisateurs (PC, imprimantes) ; trames non taguées.',
      'Réduit la portée des tempêtes de broadcast (Broadcast Domain Containment).',
      'Améliore la sécurité en empêchant l\'écoute passive inter-départements.'
    ],
    cli_examples: [
      {
        title: 'Créer un VLAN et affecter un port sur switch Cisco',
        os: 'Cisco IOS',
        command: 'vlan 20\n name DIRECTION_RH\nexit\ninterface FastEthernet0/5\n switchport mode access\n switchport access vlan 20',
        outputDescription: 'Crée le VLAN 20 et place l\'interface FastEthernet0/5 en mode accès dans ce VLAN.'
      }
    ],
    content: `### 1. Pourquoi créer des VLANs ?

Si une entreprise regroupe 200 employés sur un même commutateur sans VLAN :
- Une infection par un ver réseau ou un malware diffusant du broadcast paralyse l'ensemble des 200 employés.
- N'importe quel collaborateur peut lancer Wireshark et écouter les trames ARP et diffusions des serveurs de paye.

Le **VLAN (Virtual Local Area Network - IEEE 802.1Q)** permet de découper logiquement le matériel en zones étanches.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000012',
    chapter_id: 'ch000000-0000-4000-8000-000000000004',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '12. Liens Trunks 802.1Q & En-tête de Tagging (4 octets)',
    slug: 'trunks-8021q-tagging',
    duration_minutes: 50,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Transporter plusieurs dizaines de VLANs sur un seul câble physique entre deux commutateurs grâce à l\'encapsulation 802.1Q.',
    video_url: undefined,
    video_provider: null,
    video_duration: '43:30',
    summary: 'Un port Trunk insère un en-tête 802.1Q de 4 octets à l\'intérieur de la trame Ethernet pour transporter le VLAN ID (VID) entre commutateurs. Le Native VLAN voyage sans tag pour des raisons de compatibilité historique.',
    key_points: [
      'Le Tag 802.1Q s\'insère entre l\'adresse MAC Source et le champ EtherType.',
      'Contient le TPID (0x8100), le champ PCP (Priorité QoS 3 bits) et le VID (VLAN ID 12 bits).',
      'Le Native VLAN (généralement VLAN 1) n\'est pas tagué sur le trunk.',
      'Bonne pratique de sécurité : toujours changer le Native VLAN par défaut vers un VLAN dédié non utilisé.'
    ],
    cli_examples: [
      {
        title: 'Configurer une liaison Trunk 802.1Q inter-switch',
        os: 'Cisco IOS',
        command: 'interface GigabitEthernet0/1\n switchport trunk encapsulation dot1q\n switchport mode trunk\n switchport trunk allowed vlan 10,20,30\n switchport trunk native vlan 99',
        outputDescription: 'Définit le port en Trunk 802.1Q, autorise uniquement les VLANs 10, 20 et 30, et sécurise le Native VLAN sur l\'ID 99.'
      }
    ],
    content: `### 1. Le Problème du Transport Multi-VLAN

Si vous avez deux commutateurs distants de 200 mètres et 8 VLANs différents :
- Faut-il tirer 8 câbles Ethernet physiques entre les deux commutateurs ?
- Que se passe-t-il si vous avez 50 VLANs ?

La réponse de la norme **IEEE 802.1Q** est le **Trunk** : un seul câble haut débit (ex: 10 Gbit/s) capable de transporter simultanément les trames de tous les VLANs en leur apposant une étiquette (Tag) de 4 octets.`
  },

  // Chapitre 5 : Routage Statique & Passerelle par Défaut
  {
    id: 'l0000001-0000-4000-8000-000000000013',
    chapter_id: 'ch000000-0000-4000-8000-000000000005',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '13. Fonctionnement d\'un Routeur : Tables RIB, FIB & Routage Statique',
    slug: 'fonctionnement-routeur-rib-fib',
    duration_minutes: 55,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Comment un routeur prend ses décisions d\'aiguillage : décrémentation du TTL, calcul du checksum, réécriture des en-têtes Ethernet et Longest Prefix Match.',
    video_url: undefined,
    video_provider: null,
    video_duration: '46:00',
    summary: 'Un routeur reçoit une trame Ethernet, vérifie son FCS, retire l\'en-tête de couche 2, inspecte l\'IP de destination, consulte sa FIB selon la règle du préfixe le plus long, décrémente le TTL et réencapsule dans une nouvelle trame Ethernet.',
    key_points: [
      'Le routeur modifie les adresses MAC à chaque saut (Hop), mais conserve les adresses IP d\'origine.',
      'Le TTL (Time to Live) est décrémenté de 1 à chaque passage de routeur pour éviter les boucles infinies.',
      'Si TTL = 0, le routeur détruit le paquet et renvoie un message ICMP Time Exceeded (principe de traceroute).',
      'Règle du Longest Prefix Match : la route la plus spécifique (/28 avant /24) est toujours choisie en priorité.'
    ],
    cli_examples: [
      {
        title: 'Ajouter une route statique sur Cisco IOS',
        os: 'Cisco IOS',
        command: 'ip route 192.168.50.0 255.255.255.0 10.0.0.2\nip route 0.0.0.0 0.0.0.0 198.51.100.1',
        outputDescription: 'Configure une route statique vers le sous-réseau distant .50.0/24 via le prochain saut 10.0.0.2, puis une route par défaut vers le routeur opérateur.'
      }
    ],
    content: `### 1. Le Voyage d'un Paquet à Travers un Routeur

Quand un paquet traverse un routeur, que se passe-t-il exactement sous le capot ?
Contrairement à ce que croient beaucoup de débutants, **un routeur ne se contente pas de relayer les signaux** : il détruit l'en-tête Ethernet de couche 2 et en reconstruit un tout neuf !

\`\`\`
[ Host A: 192.168.1.10 ] ──(MAC_A -> MAC_R1)──> [ Routeur R1 ] ──(MAC_R1 -> MAC_R2)──> [ Routeur R2 ]
\`\`\`

À chaque saut, **les adresses MAC changent**, mais **les adresses IP restent identiques** de bout en bout.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000014',
    chapter_id: 'ch000000-0000-4000-8000-000000000005',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '14. Routage Inter-VLAN : Router-on-a-Stick & Switch Niveau 3 (SVI)',
    slug: 'routage-inter-vlan-svi',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Permettre aux machines de VLANs distincts de communiquer de façon contrôlée : comparaison entre sous-interfaces dot1q et interfaces virtuelles SVI.',
    video_url: undefined,
    video_provider: null,
    video_duration: '44:10',
    summary: 'Le Router-on-a-Stick utilise un lien trunk unique relié à un routeur via des sous-interfaces logiques. Les commutateurs de niveau 3 utilisent des interfaces SVI (Switched Virtual Interface) directement commutées en ASIC à vitesse filaire.',
    key_points: [
      'Router-on-a-Stick : économique mais risque de goulot d\'étranglement sur le lien physique vers le routeur.',
      'Switch L3 : routage inter-VLAN matériel à vitesse de câble (Wire-Speed Routing) sans latence externe.',
      'Une SVI (interface Vlan 10) sert de passerelle par défaut pour tous les équipements du VLAN 10.'
    ],
    cli_examples: [
      {
        title: 'Configurer le Router-on-a-Stick sur routeur Cisco',
        os: 'Cisco IOS',
        command: 'interface GigabitEthernet0/0/1.10\n encapsulation dot1Q 10\n ip address 192.168.10.1 255.255.255.0\ninterface GigabitEthernet0/0/1.20\n encapsulation dot1Q 20\n ip address 192.168.20.1 255.255.255.0',
        outputDescription: 'Crée deux sous-interfaces associées aux VLANs 10 et 20 avec leurs adresses de passerelle respectives.'
      }
    ],
    content: `### 1. Pourquoi le Routage Inter-VLAN est-il nécessaire ?

Puisque les VLANs segmentent les machines au niveau 2, un PC du VLAN 10 (Comptabilité) ne peut pas échanger le moindre paquet avec l'imprimante du VLAN 30 (Services Généraux), même s'ils sont physiquement branchés sur le même switch.

Pour que ces flux légitimes puissent traverser les frontières en toute sécurité, ils doivent obligatoirement remonter en **Couche 3** auprès d'une passerelle de routage.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000015',
    chapter_id: 'ch000000-0000-4000-8000-000000000005',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '15. Distance Administrative & Métriques de Routage',
    slug: 'distance-administrative-metrique',
    duration_minutes: 45,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Comment un routeur choisit entre plusieurs chemins appris par des sources différentes (Directement connecté, Route Statique, OSPF, BGP).',
    video_url: undefined,
    video_provider: null,
    video_duration: '38:00',
    summary: 'La Distance Administrative (AD) mesure la fiabilité de la source de routage. Plus l\'AD est faible, plus la route est prioritaire. Si deux routes ont la même AD, la métrique départage le meilleur chemin.',
    key_points: [
      'Directement connecté (Connected) : AD = 0 (fiabilité absolue).',
      'Route statique : AD = 1.',
      'eBGP (BGP externe) : AD = 20.',
      'EIGRP interne : AD = 90.',
      'OSPF : AD = 110.',
      'iBGP (BGP interne) : AD = 200.'
    ],
    cli_examples: [
      {
        title: 'Créer une route statique flottante de secours (Floating Static Route)',
        os: 'Cisco IOS',
        command: 'ip route 0.0.0.0 0.0.0.0 192.0.2.1 1\nip route 0.0.0.0 0.0.0.0 198.51.100.1 200',
        outputDescription: 'La route avec AD 1 est active en permanence. Si son lien tombe, la route de secours avec AD 200 prend automatiquement le relais.'
      }
    ],
    content: `### 1. Le Dilemme du Routeur Multivoies

Supposons qu'un routeur apprenne la destination \`10.50.0.0/16\` par trois moyens différents :
1. Une route statique configurée à la main par l'administrateur
2. Une mise à jour dynamique reçue via OSPF
3. Une annonce BGP d'un opérateur tiers

Lequel de ces chemins doit être installé dans la table de commutation FIB ?
C'est le rôle fondamental de la **Distance Administrative (AD)**.`
  },

  // Chapitre 6 : Routage Dynamique OSPFv2
  {
    id: 'l0000001-0000-4000-8000-000000000016',
    chapter_id: 'ch000000-0000-4000-8000-000000000006',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '16. Introduction à OSPF : Algorithme SPF & États d\'Adjacence',
    slug: 'ospf-introduction-spf-adjacence',
    duration_minutes: 60,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    description: 'Pourquoi abandonner les routes statiques dans les grands réseaux : fonctionnement du protocole Link-State standard de l\'industrie (RFC 2328).',
    video_url: undefined,
    video_provider: null,
    video_duration: '54:20',
    summary: 'OSPF découvre ses voisins via des paquets Hello (224.0.0.5), synchronise sa base topologique (LSDB) et exécute l\'algorithme SPF de Dijkstra pour calculer l\'arbre des plus courts chemins sans aucune boucle.',
    key_points: [
      'Protocole ouvert standard (RFC 2328) supporté par tous les constructeurs mondiaux.',
      'Protocole Link-State : chaque routeur possède la carte complète et exacte de la topologie.',
      'Les 7 états d\'adjacence : Down -> Init -> 2-Way -> ExStart -> Exchange -> Loading -> Full.',
      'Élection de DR (Designated Router) et BDR sur les segments multi-accès Ethernet pour éviter N*(N-1)/2 sessions.'
    ],
    cli_examples: [
      {
        title: 'Vérifier l\'état des voisins OSPF sur Cisco IOS',
        os: 'Cisco IOS',
        command: 'show ip ospf neighbor\nshow ip ospf interface brief',
        outputDescription: 'Vérifie que les voisins atteignent l\'état FULL/DR ou FULL/BDR et que le Dead Timer décompte correctement.'
      }
    ],
    content: `### 1. Pourquoi le routage statique devient impossible à grande échelle

Sur un réseau de 5 routeurs, le routage statique est envisageable.
Sur un réseau de 80 routeurs d'entreprise ou d'opérateur :
- Si un lien fibre est coupé par un engin de chantier à 3h du matin, les routes statiques continuent d'envoyer le trafic dans le gouffre (Black Hole).
- Aucun basculement automatique n'est possible sans intervention manuelle d'un ingénieur.

**OSPF (Open Shortest Path First)** détecte automatiquement la panne en quelques secondes, recalcule les chemins alternatifs et rétablit le trafic de façon totalement transparente.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000017',
    chapter_id: 'ch000000-0000-4000-8000-000000000006',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '17. Déploiement OSPF Multi-Aires & Rôle des LSA',
    slug: 'ospf-multi-aires-lsa',
    duration_minutes: 60,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    description: 'Hiérarchisation avec le Backbone Area 0, routeurs ABR/ASBR et analyse des paquets d\'état de lien (LSA Type 1 à 5).',
    video_url: undefined,
    video_provider: null,
    video_duration: '58:00',
    summary: 'Le découpage en aires limite le calcul SPF à une zone restreinte. L\'Area 0 (Backbone) interconnecte toutes les autres aires via les routeurs ABR (Area Border Router). Les LSA 1 et 2 restent intra-aire ; la LSA 3 résume les réseaux inter-aires.',
    key_points: [
      'Toutes les aires secondaires (Area 1, Area 2...) doivent obligatoirement être raccordées à l\'Area 0.',
      'LSA 1 (Router LSA) : généré par chaque routeur pour décrire ses interfaces.',
      'LSA 2 (Network LSA) : généré par le DR sur les segments broadcast.',
      'LSA 3 (Summary LSA) : généré par les ABR pour annoncer les préfixes d\'une aire dans une autre.',
      'LSA 5 (AS External LSA) : annonce les routes externes redistribuées (ex: routes BGP ou statiques).'
    ],
    cli_examples: [
      {
        title: 'Inspecter la base de données topologique OSPF (LSDB)',
        os: 'Cisco IOS',
        command: 'show ip ospf database\nshow ip ospf database summary',
        outputDescription: 'Affiche toutes les annonces LSA 1, 2, 3 mémorisées dans la base de données topologique.'
      }
    ],
    content: `### 1. La Limite d'une Aire Unique

Si un réseau compte 1000 routeurs dans une seule aire OSPF :
- La moindre fluctuation de lien (Flapping Interface) oblige **les 1000 routeurs** à réexécuter l'algorithme de Dijkstra en même temps.
- La mémoire vive et le processeur des routeurs saturent.

La solution architecturale consiste à segmenter le réseau en **Aires hiérarchiques** : seule l'aire concernée par la panne recalcule sa topologie interne, tandis que les autres aires reçoivent simplement une mise à jour résumée.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000018',
    chapter_id: 'ch000000-0000-4000-8000-000000000006',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '18. Métrique de Coût OSPF & Dépannage des Pannes d\'Adjacence',
    slug: 'metrique-cout-ospf-troubleshooting',
    duration_minutes: 55,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    description: 'Calcul du coût OSPF (Bande passante de référence) et méthodologie d\'investigation quand deux routeurs refusent de passer en état FULL.',
    video_url: undefined,
    video_provider: null,
    video_duration: '49:15',
    summary: 'La métrique OSPF est calculée par Coût = Bande Passante de Référence / Bande Passante de l\'Interface. Pour former une adjacence, 6 paramètres doivent impérativement correspondre entre les deux routeurs.',
    key_points: [
      'Formule standard : Coût = 100 Mbps / Bande passante de l\'interface.',
      'Attention : sur les réseaux modernes (1G, 10G, 100G), il faut ajuster "auto-cost reference-bandwidth" pour différencier 1 Gbps et 10 Gbps.',
      'Les 6 conditions obligatoires pour passer en état FULL : Même Sous-réseau, Même Area ID, Mêmes Hello/Dead Timers, Même MTU, Même type d\'aire (Stub), Authentification identique.'
    ],
    cli_examples: [
      {
        title: 'Ajuster la bande passante de référence pour interfaces Gigabit/10G',
        os: 'Cisco IOS',
        command: 'router ospf 1\n auto-cost reference-bandwidth 100000',
        outputDescription: 'Définit la référence à 100 Gbps pour que les interfaces 1G, 10G et 40G reçoivent des coûts distincts et cohérents.'
      }
    ],
    content: `### 1. Pourquoi deux routeurs OSPF restent bloqués en état INIT ou 2-WAY ?

En production télécom, 95% des pannes OSPF proviennent d'une discordance de configuration entre deux extrémités de câble.

Voici la check-list absolue de l'ingénieur réseau en cas d'échec d'adjacence :
1. **Masque de sous-réseau différent** : les deux routeurs doivent avoir exactement le même masque sur leur interface commune.
2. **Timers discordants** : Hello Timer (10s par défaut) et Dead Timer (40s par défaut) doivent être identiques.
3. **Area ID incohérent** : l'un est en Area 0, l'autre en Area 1.
4. **MTU Mismatch** : si le MTU de l'interface A est à 1500 octets et le MTU de l'interface B est à 9000 (Jumbo Frames), l'adjacence restera bloquée en état \`EXSTART / EXCHANGE\` !`
  },

  // Chapitre 7 : Cœur de Réseau & MPLS
  {
    id: 'l0000001-0000-4000-8000-000000000019',
    chapter_id: 'ch000000-0000-4000-8000-000000000007',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '19. Les Limites du Routage IP Pur dans les Cœurs d\'Opérateurs',
    slug: 'limites-routage-ip-coeur',
    duration_minutes: 45,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    description: 'Pourquoi le routage IP hop-by-hop basé sur les tables BGP mondiales de 950 000 préfixes est inefficace pour le transport rapide en cœur de réseau.',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:30',
    summary: 'Consulter une table de routage complète à chaque saut pour chaque paquet consomme une puissance CPU démesurée. MPLS résout ce défi en remplaçant la recherche IP par une commutation ultra-rapide sur une étiquette entière courte.',
    key_points: [
      'Table de routage globale Internet (DFZ) : plus de 950 000 préfixes IPv4 en mémoire.',
      'Recherche "Longest Match" lente comparée à un simple index de tableau dans une puce ASIC.',
      'Impossibilité de faire de l\'ingénierie de trafic (Traffic Engineering) : le trafic suit aveuglément le chemin IGP à moindre coût.',
      'Difficulté d\'isoler des flux clients hermétiques sans créer des tunnels GRE instables.'
    ],
    cli_examples: [
      {
        title: 'Observer la taille actuelle de la table de routage BGP globale',
        os: 'Looking Glass Opérateur',
        command: 'show ip bgp summary',
        outputDescription: 'Affiche le nombre astronomique de préfixes reçus des pairs transitaires mondiaux.'
      }
    ],
    content: `### 1. La Crise de Croissance des Cœurs de Réseaux

À la fin des années 1990, avec l'explosion du Web, les routeurs des opérateurs télécoms (France Télécom, AT&T, Deutsche Telekom) s'effondraient sous le volume de paquets.

Chaque routeur de cœur devait ouvrir chaque paquet IP de 64 octets à 1500 octets, lire les 32 bits de l'adresse de destination, et parcourir des centaines de milliers de lignes de table de routage pour trouver le meilleur préfixe.

C'est cette impasse technique qui a donné naissance à **MPLS (Multi-Protocol Label Switching)**.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000020',
    chapter_id: 'ch000000-0000-4000-8000-000000000007',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '20. Principes de la Commutation par Étiquettes MPLS',
    slug: 'principes-labels-mpls',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    description: 'L\'en-tête Shim de 32 bits (Label, TC/QoS, S-bit, TTL) et les opérations Push, Swap, Pop sur les routeurs LER et LSR.',
    video_url: undefined,
    video_provider: null,
    video_duration: '45:00',
    summary: 'Le routeur d\'entrée (Ingress LER) classe le paquet et lui colle une étiquette (Push). Les routeurs de cœur (LSR) changent l\'étiquette (Swap) en quelques nanosecondes sans jamais regarder l\'adresse IP. Le routeur de sortie retire l\'étiquette (Pop).',
    key_points: [
      'En-tête MPLS (32 bits) : Label (20 bits), Traffic Class (3 bits), Stack Bottom S (1 bit), TTL (8 bits).',
      'Ingress PE (LER) : Opération PUSH (ajout de label).',
      'P Router (LSR) : Opération SWAP (remplacement de label via la table LFIB).',
      'Egress PE (LER) : Opération POP (suppression de label).',
      'PHP (Penultimate Hop Popping) : le routeur juste avant la sortie retire le label pour soulager le PE final.'
    ],
    cli_examples: [
      {
        title: 'Vérifier la table de commutation d\'étiquettes LFIB',
        os: 'Cisco IOS',
        command: 'show mpls forwarding-table',
        outputDescription: 'Affiche la correspondance exacte entre le Local Label entrant, le Outgoing Label et le prochain saut.'
      }
    ],
    content: `### 1. La Métaphore de la Poste et des Bagages d'Aéroport

Quand vous prenez l'avion, la compagnie n'examine pas le contenu de votre valise à chaque escale.
À l'enregistrement, on colle une étiquette avec un simple code-barres (ex: \`CDG-HND-0428\`). Tout au long des tapis roulants automatiques, les scanners lisent ce code-barres en un millième de seconde et aiguillent le bagage.

C'est exactement ce que fait **MPLS** :
- Le routeur de bordure (**PE - Provider Edge**) colle une étiquette de 32 bits sur le paquet IP.
- Les routeurs de cœur (**P - Provider**) ne lisent QUE l'étiquette et l'échangent contre une nouvelle via une table matérielle ultrarapide appelée **LFIB**.`
  },
  {
    id: 'l0000001-0000-4000-8000-000000000021',
    chapter_id: 'ch000000-0000-4000-8000-000000000007',
    course_id: 'c0000000-0000-4000-8000-000000000000',
    title: '21. Synthèse Globale & Passerelle vers le Niveau Ingénieur Réseau',
    slug: 'synthese-de-debutant-a-ingenieur',
    duration_minutes: 40,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    description: 'Bilan complet des compétences acquises : de la trame Ethernet initiale jusqu\'au backbone MPLS opérateur, et feuille de route vers les spécialisations Télécoms & Cloud.',
    video_url: undefined,
    video_provider: null,
    video_duration: '36:10',
    summary: 'Félicitations pour avoir parcouru l\'intégralité des 7 chapitres ! Vous maîtrisez désormais la chaîne complète de communication IP : modèles, binaire, subnetting, VLANs, trunks, routage statique, OSPF et MPLS.',
    key_points: [
      'La cohérence d\'un réseau repose sur la rigueur du modèle en couches.',
      'Le subnetting et VLSM sont la grammaire indispensable de toute infrastructure.',
      'La commutation L2 organise les flux locaux ; le routage L3 relie le monde.',
      'Prochaines étapes recommandées : VoIP/SIP (Téléphonie IP), Cœur MPLS/BGP approfondi et Labs pratiques.'
    ],
    cli_examples: [
      {
        title: 'Bilan d\'intégrité global d\'un équipement réseau',
        os: 'Cisco IOS',
        command: 'show version\nshow ip interface brief\nshow ip route summary\nshow running-config',
        outputDescription: 'Vérifie l\'état complet du système, des interfaces, de la mémoire et des routes actives.'
      }
    ],
    content: `### Le Bilan de Votre Parcours

Vous venez d'accomplir un cycle complet d'apprentissage équivalent aux formations d'ingénieur réseau certifiantes (type CCNA / Nokia NRS-I / JNCIA).

Vous comprenez désormais non seulement **comment** taper une commande sur un équipement, mais surtout **POURQUOI** le protocole a été conçu ainsi et quel comportement physique il engendre sur le réseau.

Pour poursuivre votre perfectionnement, vous pouvez désormais vous orienter vers nos formations spécialisées :
- **VoIP & Signalisation SIP en Profondeur**
- **Architecture IP/MPLS & Services L3VPN**
- **Topologie du Transport Télécom de Bout en Bout**`
  }
];
