import { Course, Chapter, Lesson } from '../../types/learning';

export const NETWORK_AUTOMATION_COURSE: Course = {
  id: 'c6000000-0000-4000-8000-000000000006',
  title: 'Automation Réseau & Linux pour Ingénieurs',
  slug: 'automation-reseau-linux-ingenieurs',
  description: 'Automatiser les tâches réseau et maîtriser les outils Linux utilisés dans les infrastructures modernes.',
  full_description: `L'administration réseau manuelle en ligne de commande (CLI SSH) appartient au passé. Cette formation pratique forme l'ingénieur réseau moderne aux méthodes DevOps et NetDevOps :
- **Linux pour l'Ingénieur Réseau** : la pile réseau du noyau Linux (iproute2, iptables/nftables, namespaces réseau, veth pairs et ponts Linux bridge).
- **Scripts d'Automatisation Python** : manipulation programmatique d'équipements Cisco, Juniper et Linux avec Netmiko, Scrapli et NAPALM. Structuration des données en JSON et YAML.
- **Gestion de Configuration avec Ansible** : inventaires dynamiques, rôles Ansible, modules réseau natifs (cisco.ios, cisco.nxos, junipernetworks.junos), templates Jinja2 pour générer des configurations sans erreur.
- **Modélisation de Données YANG, NETCONF & RESTCONF** : abandon du screen-scraping CLI au profit de modèles de données standardisés (IETF, OpenConfig) pilotés via XML/JSON sur SSH et HTTPS.
- **Conteneurs Docker & Emulation Réseau** : déploiement de topologies de test conteneurisées avec Containerlab, capture et télémétrie en temps réel (gNMI, InfluxDB, Grafana).`,
  category: 'Automation / DevOps',
  difficulty: 'Intermédiaire',
  badge: 'NETDEVOPS & PYTHON',
  published: true,
  estimated_hours: 22,
  total_hours: 22,
  chapters_count: 3,
  lessons_count: 9,
  rating: 4.9,
  reviews_count: 85,
  thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Connaissance des principes de routage et commutation (adresses IP, VLAN, interfaces).',
    'Familiarité avec un terminal de commande et les bases de la syntaxe informatique.'
  ],
  objectives: [
    'Maîtriser les commandes réseau fondamentales sous Linux (ip, ss, tcpdump, namespaces).',
    'Écrire des scripts Python pour sauvegarder et configurer des dizaines de routeurs en parallèle.',
    'Construire des playbooks Ansible idempotents avec templates Jinja2.',
    'Interagir avec des routeurs via les protocoles programmables NETCONF (RFC 6241) et RESTCONF (RFC 8040).',
    'Créer des laboratoires d\'émulation réseau légers avec Docker et Containerlab.'
  ],
  skills_acquired: [
    'Administration réseau avancée sous Linux (Linux Network Stack)',
    'Automatisation Python multi-constructeurs (Netmiko, Scrapli, NAPALM)',
    'Déploiement continu d\'infrastructures réseau avec Ansible & Jinja2',
    'Modélisation de données réseau YANG et APIs NETCONF/RESTCONF',
    'Conteneurisation d\'architectures de test avec Docker & Containerlab'
  ],
  created_at: '2026-01-25T10:00:00Z',
  updated_at: '2026-01-25T10:00:00Z',
};

export const NETWORK_AUTOMATION_CHAPTERS: Chapter[] = [
  {
    id: 'ch600000-0000-4000-8000-000000000001',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    chapter_number: 1,
    title: 'Chapitre 1 — Linux Avancé pour l\'Ingénieur Réseau',
    description: 'La pile réseau Linux : suite iproute2, espaces de noms (network namespaces), ponts virtuels et routage logiciel.',
    objectives: [
      'Remplacer les commandes obsolètes (ifconfig, netstat) par ip et ss.',
      'Créer des routeurs et commutateurs virtuels isolés avec les network namespaces.',
      'Configurer le forwarding IP et le filtrage de paquets avec iptables/nftables.'
    ],
    duration_minutes: 75,
    lessons_count: 3,
    position: 1,
    created_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'ch600000-0000-4000-8000-000000000002',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    chapter_number: 2,
    title: 'Chapitre 2 — Automatisation Python & Playbooks Ansible',
    description: 'Programmation réseau avec Python (Netmiko, NAPALM) et orchestration d\'équipements à grande échelle avec Ansible.',
    objectives: [
      'Exécuter des commandes de configuration sur 50 routeurs simultanément en multithreading.',
      'Générer des configurations réseau complètes à partir de modèles Jinja2 et variables YAML.',
      'Garantir l\'idempotence des modifications réseau avec Ansible.'
    ],
    duration_minutes: 95,
    lessons_count: 3,
    position: 2,
    created_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'ch600000-0000-4000-8000-000000000003',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    chapter_number: 3,
    title: 'Chapitre 3 — Modèles YANG, NETCONF/RESTCONF & Docker Containerlab',
    description: 'La programmabilité moderne des routeurs : séparation données/RPC, APIs RESTCONF et émulation de topologie sous conteneurs.',
    objectives: [
      'Lire et modifier l\'état d\'une interface routeur via des requêtes HTTP GET/PATCH RESTCONF.',
      'Manipuler des payloads de données formatés selon les modèles YANG OpenConfig.',
      'Lancer une topologie BGP/MPLS complète en quelques secondes avec Containerlab.'
    ],
    duration_minutes: 80,
    lessons_count: 3,
    position: 3,
    created_at: '2026-01-25T10:00:00Z',
  },
];

export const NETWORK_AUTOMATION_LESSONS: Lesson[] = [
  {
    id: 'l6000001-0000-4000-8000-000000000001',
    chapter_id: 'ch600000-0000-4000-8000-000000000001',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '1. Maîtrise de la pile réseau Linux : iproute2 & Socket Statistics',
    slug: 'linux-iproute2-network-stack',
    description: 'Utilisation experte des commandes `ip link`, `ip addr`, `ip route` et `ss -tulpn` pour l\'inspection chirurgicale des couches 2, 3 et 4.',
    duration_minutes: 25,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      '`ip route show table all` affiche toutes les tables de routage, y compris la table locale du noyau.',
      '`ss -tulpn` inspecte les sockets d\'écoute TCP et UDP avec les identifiants de processus (PID).',
      'Le fichier `/proc/sys/net/ipv4/ip_forward` transforme instantanément un système Linux en routeur IP.'
    ],
    summary: 'La maîtrise d\'iproute2 est la compétence socle indispensable pour tout ingénieur réseau opérant dans un environnement cloud ou conteneurisé.',
    cli_examples: [
      {
        title: 'Activer le routage et inspecter les routes',
        os: 'Linux Kernel (Debian/Ubuntu/RHEL)',
        command: 'sysctl -w net.ipv4.ip_forward=1 && ip route show'
      }
    ],
    has_exercise: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000002',
    chapter_id: 'ch600000-0000-4000-8000-000000000001',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '2. Network Namespaces & Paires Veth : Virtualisation Réseau',
    slug: 'linux-network-namespaces-veth',
    description: 'Création d\'instances de pile réseau indépendantes dans un même noyau Linux : simulation de deux routeurs reliés par un câble virtuel.',
    duration_minutes: 25,
    position: 2,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Un network namespace isole complètement les interfaces, adresses IP, tables de routage et règles de pare-feu.',
      'Une paire `veth` (Virtual Ethernet) agit comme un câble RJ45 virtuel reliant deux namespaces distincts.',
      'C\'est la technologie sous-jacente qui isole le réseau de chaque conteneur Docker et pod Kubernetes.'
    ],
    summary: 'Les namespaces réseau permettent de prototyper des topologies complexes directement sur une machine Linux sans machine virtuelle lourde.',
    has_lab: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000003',
    chapter_id: 'ch600000-0000-4000-8000-000000000001',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '3. Analyse et filtrage de paquets : tcpdump & iptables/nftables',
    slug: 'tcpdump-nftables-packet-analysis',
    description: 'Capture de paquets en ligne de commande avec tcpdump (expressions BPF), analyse de trames et redirection NAT (SNAT/DNAT Masquerade).',
    duration_minutes: 25,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      '`tcpdump -nnvv -i eth0 port 5060 or port 179` filtre précisément la signalisation SIP et le peering BGP.',
      'L\'écriture dans un fichier `.pcap` permet une analyse détaillée ultérieure dans Wireshark.',
      'nftables remplace iptables pour un filtrage ultra-rapide avec compilation bytecode dans le noyau.'
    ],
    summary: 'tcpdump est l\'outil de diagnostic ultime sur serveur ou passerelle télécom pour valider la réception et le routage des paquets.',
    has_quiz: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000004',
    chapter_id: 'ch600000-0000-4000-8000-000000000002',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '4. Automatisation SSH avec Python : Netmiko & Scrapli',
    slug: 'python-netmiko-scrapli',
    description: 'Connexion programmatique sécurisée par SSH à des routeurs Cisco IOS, Huawei VRP et Juniper Junos : exécution de commandes et parsing.',
    duration_minutes: 35,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'Netmiko gère automatiquement les invites de commande, la pagination (`terminal length 0`) et les modes d\'activation (`enable`).',
      'Scrapli offre des performances d\'exécution jusqu\'à 10 fois plus rapides grâce à l\'asynchronisme et un parsing regex optimisé.',
      'Extraction des données semi-structurées en dictionnaires Python grâce à TextFSM et Cisco Genie.'
    ],
    summary: 'Netmiko et Scrapli permettent d\'automatiser rapidement des parcs existants sans modifier l\'infrastructure logicielle des routeurs.',
    has_exercise: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000005',
    chapter_id: 'ch600000-0000-4000-8000-000000000002',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '5. Modélisation de configuration avec Jinja2 & YAML',
    slug: 'jinja2-yaml-network-config',
    description: 'Séparation rigoureuse des données (adresses IP, AS BGP, numéros de VLAN dans un fichier YAML) et des modèles de configuration Jinja2.',
    duration_minutes: 30,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'Les fichiers YAML définissent la source unique de vérité ("Single Source of Truth").',
      'Le moteur de template Jinja2 boucle sur les interfaces et génère un fichier de configuration syntaxiquement parfait.',
      'Élimination complète des erreurs de frappe manuelles et uniformisation des standards de sécurité du parc.'
    ],
    summary: 'La modélisation Jinja2/YAML est le premier pas vers la méthodologie Infrastructure-as-Code (IaC) en réseau.',
    has_lab: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000006',
    chapter_id: 'ch600000-0000-4000-8000-000000000002',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '6. Déploiement Idempotent avec Ansible pour Équipements Réseau',
    slug: 'ansible-network-automation',
    description: 'Architecture sans agent d\'Ansible, modules `cisco.ios.ios_config`, `ios_command`, inventaires avec groupes de production et tests en diff.',
    duration_minutes: 30,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'L\'idempotence garantit qu\'un playbook exécuté 10 fois n\'appliquera la modification qu\'une seule fois si l\'état désiré est déjà atteint.',
      'Le mode `--check --diff` simule les modifications et affiche précisément les lignes de commande qui seront insérées ou retirées.',
      'Gestion centralisée des identifiants et clés SSH d\'accès via Ansible Vault.'
    ],
    summary: 'Ansible fournit un cadre d\'orchestration fiable pour déployer des modifications massives sans risquer de coupure de service inopinée.',
    has_quiz: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000007',
    chapter_id: 'ch600000-0000-4000-8000-000000000003',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '7. Modélisation de Données YANG & Programmabilité Réseau',
    slug: 'yang-data-modeling',
    description: 'Comprendre pourquoi la CLI textuelle est inadaptée aux machines : structure d\'arborescence de données YANG (conteneurs, listes, feuilles leaf).',
    duration_minutes: 25,
    position: 1,
    published: true,
    technical_level: 'Expert',
    key_points: [
      'YANG (RFC 6020 / RFC 7950) est un langage de modélisation de données standardisé, pas un protocole de transport.',
      'Il existe des modèles YANG natifs (constructeurs) et des modèles ouverts multi-vendeurs (OpenConfig et IETF).',
      'YANG définit strictement les types de données, plages de valeurs, contraintes et dépendances entre configurations.'
    ],
    summary: 'YANG transforme les configurations et états opérationnels des routeurs en objets de données strictement typés.',
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000008',
    chapter_id: 'ch600000-0000-4000-8000-000000000003',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '8. Protocoles NETCONF & RESTCONF pour Opérateurs',
    slug: 'netconf-restconf-apis',
    description: 'Échanges XML sur SSH avec NETCONF (opérations <get-config>, <edit-config>, <commit>) vs API Web HTTP RESTCONF (JSON/YANG).',
    duration_minutes: 30,
    position: 2,
    published: true,
    technical_level: 'Expert',
    key_points: [
      'NETCONF (port 830) utilise des datastores séparés : running, candidate et startup, permettant le rollback automatique en cas de panne.',
      'RESTCONF (port 443) transpose la modélisation YANG en une API REST standard : GET pour lire, PUT pour créer, PATCH pour modifier.',
      'Les requêtes peuvent être envoyées simplement avec `curl` ou la librairie Python `requests`.'
    ],
    summary: 'NETCONF et RESTCONF fournissent l\'interface programmatique de référence pour l\'orchestration SDN et la télémétrie moderne.',
    has_lab: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'l6000001-0000-4000-8000-000000000009',
    chapter_id: 'ch600000-0000-4000-8000-000000000003',
    course_id: 'c6000000-0000-4000-8000-000000000006',
    title: '9. Émulation Réseau Moderne : Docker & Containerlab',
    slug: 'docker-containerlab-network-emulation',
    description: 'Déploiement en 10 secondes d\'une topologie de 10 routeurs virtuels (Nokia SR Linux, Arista cEOS, FRRouting) interconnectés via un simple fichier YAML.',
    duration_minutes: 25,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Containerlab remplace les émulateurs lourds (GNS3, EVE-NG) par des conteneurs Linux natifs extrêmement légers.',
      'Chaque routeur est un conteneur avec ses interfaces reliées par des paires veth configurées automatiquement par Containerlab.',
      'Intégration directe dans les pipelines d\'intégration continue (CI/CD GitHub Actions / GitLab CI) pour tester les changements avant la production.'
    ],
    summary: 'Containerlab permet aux ingénieurs réseau de valider leurs scripts d\'automatisation et configurations complexes instantanément.',
    has_quiz: true,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  }
];
