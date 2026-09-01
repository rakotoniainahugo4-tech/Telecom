import { Radio, Zap, Layers, Network, PhoneCall, Server, Cpu } from 'lucide-react';

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TelecomLessonStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  colorScheme: {
    text: string;
    bg: string;
    border: string;
    accent: string;
    badgeBg: string;
  };
  summary: string;
  architecturalRole: {
    description: string;
    keyPoints: string[];
    importance: string;
  };
  technologies: Array<{
    name: string;
    acronym: string;
    description: string;
    specifications: string[];
  }>;
  encapsulation: {
    layer: string;
    frameStructure: Array<{
      name: string;
      bytes: string;
      description: string;
      color: string;
    }>;
    explanation: string;
  };
  realEquipment: Array<{
    vendor: string;
    model: string;
    role: string;
    capacity: string;
  }>;
  cliExamples: Array<{
    title: string;
    os: string;
    command: string;
    outputDescription: string;
  }>;
  quiz: LessonQuizQuestion[];
}

export const TELECOM_LESSONS_DATA: TelecomLessonStage[] = [
  {
    id: 'user-device',
    stepNumber: 1,
    title: "Appareils & Terminaux Utilisateurs",
    subtitle: "CPE / ONT / Smartphone UE / Box Résidentielle",
    badge: "COUCHE 1-3 • TERMINAL",
    iconName: "Radio",
    colorScheme: {
      text: "text-purple-400",
      bg: "bg-purple-950/40",
      border: "border-purple-500/40",
      accent: "from-purple-600 to-indigo-600",
      badgeBg: "bg-purple-900/30 text-purple-300 border-purple-500/30"
    },
    summary: "Point de départ et d'arrivée de toute transmission de données. Le terminal client (box, téléphone, PC) génère le paquet applicatif et l'encapsule dans le premier protocole de liaison locale.",
    architecturalRole: {
      description: "Le terminal utilisateur (CPE - Customer Premises Equipment ou UE - User Equipment) convertit l'information numérique de l'utilisateur (requête web, flux vidéo, appel voix) en signaux électriques, radio ou optiques vers le réseau de l'opérateur.",
      keyPoints: [
        "Génération des requêtes IP (IPv4 / IPv6) avec ports sources et destinations TCP/UDP",
        "Traduction d'adresse réseau locale (NAT) et attribution d'adresses privées (RFC 1918) via serveur DHCP local",
        "Émission radioélectrique Wi-Fi (802.11) ou 4G/5G (NR-Uu interface radio)",
        "Marquage initial de qualité de service (DSCP / ToS) pour prioriser la voix ou la vidéo"
      ],
      importance: "Sans un terminal correctement configuré et authentifié, aucune connexion au réseau de transport de l'opérateur n'est autorisée."
    },
    technologies: [
      {
        name: "Customer Premises Equipment (CPE) / Box",
        acronym: "CPE / Box",
        description: "Passerelle résidentielle ou d'entreprise combinant modem, routeur NAT, pare-feu, commutateur Ethernet et point d'accès Wi-Fi.",
        specifications: ["Wi-Fi 6 / 6E / 7 (802.11ax/be)", "Ports RJ45 1G / 2.5G / 10G", "Gestion TR-069 / TR-369 (USP)", "Client PPPoE ou DHCP IPoE"]
      },
      {
        name: "Optical Network Terminal (ONT)",
        acronym: "ONT / ONU",
        description: "Boîtier ou module SFP optique qui convertit les signaux lumineux de la fibre FTTH en trames Ethernet électriques.",
        specifications: ["Interface optique SC/APC", "Sensibilité optique -8 dBm à -28 dBm", "Gestion OMCI (G.988)", "Laser 1310 nm en émission"]
      },
      {
        name: "User Equipment Mobile (UE)",
        acronym: "UE (4G/5G)",
        description: "Smartphone, tablette, modem 4G/5G ou routeur FWA (Fixed Wireless Access) muni d'une carte SIM/eSIM pour s'authentifier au réseau cellulaire.",
        specifications: ["Normes 3GPP Rel.15 à Rel.18", "Bandes Sub-6GHz & Ondes Millimétriques", "Agrégation de porteuses (CA)", "MIMO 4x4 / 8x8"]
      }
    ],
    encapsulation: {
      layer: "Couches 1 à 7 (Application à Physique)",
      frameStructure: [
        { name: "Préambule + SFD", bytes: "8 octets", description: "Synchronisation physique de la carte réseau", color: "bg-slate-700 text-slate-200" },
        { name: "En-tête Ethernet (MAC Src/Dst + EtherType)", bytes: "14 octets", description: "Adresses MAC locales et protocole (IPv4 0x0800 / IPv6 0x86DD)", color: "bg-purple-900 text-purple-200" },
        { name: "En-tête IP (IPv4 / IPv6)", bytes: "20 à 40 octets", description: "Adresses IP Source et Destination, TTL, Protocole L4", color: "bg-indigo-900 text-indigo-200" },
        { name: "En-tête Transport (TCP / UDP)", bytes: "8 à 20 octets", description: "Ports sources/destinations, numéros de séquence", color: "bg-blue-900 text-blue-200" },
        { name: "Données Applicatives (Payload)", bytes: "Variable (ex: 1460 o)", description: "Données HTTP, TLS, DNS, RTP VoIP...", color: "bg-emerald-900 text-emerald-200" },
        { name: "FCS / CRC Checksum", bytes: "4 octets", description: "Contrôle d'intégrité de la trame Ethernet", color: "bg-slate-800 text-slate-300" }
      ],
      explanation: "Au niveau de l'ordinateur de l'utilisateur, les données sont découpées en segments TCP (taille MSS typique 1460 octets), puis encapsulées dans un paquet IP (MTU 1500 octets), puis dans une trame Ethernet locale vers la passerelle par défaut."
    },
    realEquipment: [
      { vendor: "Nokia", model: "G-010G-R & Beacon 6", role: "ONT Optique GPON & Routeur Wi-Fi 6 Mesh", capacity: "1 Gbps PON / 2.5 Gbps LAN" },
      { vendor: "Huawei", model: "EchoLife HG8010H / OptiXstar", role: "ONT FTTH Résidentiel", capacity: "1 Port GE SC/APC" },
      { vendor: "Cradlepoint / Ericsson", model: "W1850 5G Wideband Adapter", role: "Routeur d'entreprise 5G FWA", capacity: "Jusqu'à 4.14 Gbps 5G NR" }
    ],
    cliExamples: [
      {
        title: "Vérification de l'adresse IP et de la passerelle par défaut (Terminal Client)",
        os: "Linux / macOS CLI",
        command: "ip -br addr show && ip route show",
        outputDescription: "Affiche l'adresse IP locale (ex: 192.168.1.50/24) et la route par défaut vers la Box (default via 192.168.1.1 dev eth0)."
      },
      {
        title: "Test de résolution DNS et latence locale",
        os: "Client Bash",
        command: "dig +noall +answer example.com && ping -c 4 192.168.1.1",
        outputDescription: "Mesure le temps de réponse de la passerelle locale (généralement < 1 ms en Ethernet, 2-5 ms en Wi-Fi)."
      }
    ],
    quiz: [
      {
        id: "q1-1",
        question: "Quel équipement réalise la conversion du signal optique lumineux en signal Ethernet électrique chez l'abonné FTTH ?",
        options: ["Le DSLAM", "L'ONT (Optical Network Terminal)", "Le routeur de transit BGP", "L'eNodeB 4G"],
        correctIndex: 1,
        explanation: "L'ONT (ou ONU) est le boîtier d'extrémité optique passif chez l'abonné qui reçoit le signal lumineux (1490nm/1577nm) et le convertit en trames Ethernet RJ45."
      },
      {
        id: "q1-2",
        question: "Quelle est la taille maximale standard (MTU) d'un paquet IP sur un réseau Ethernet standard ?",
        options: ["512 octets", "1500 octets", "9000 octets (Jumbo)", "65535 octets"],
        correctIndex: 1,
        explanation: "La taille maximale de l'unité de transmission (MTU) standard sur Ethernet est de 1500 octets pour le paquet IP (hors en-tête Ethernet de 14 octets et CRC de 4 octets)."
      },
      {
        id: "q1-3",
        question: "Quel protocole est principalement utilisé pour attribuer automatiquement une adresse IP et les serveurs DNS à un terminal ?",
        options: ["BGP", "LDP", "DHCP", "OSPF"],
        correctIndex: 2,
        explanation: "DHCP (Dynamic Host Configuration Protocol) fournit dynamiquement au terminal son adresse IP, son masque de sous-réseau, sa passerelle par défaut et ses résolveurs DNS."
      }
    ]
  },
  {
    id: 'access-network',
    stepNumber: 2,
    title: "Réseau d'Accès Télécom",
    subtitle: "GPON OLT / eNodeB 4G / gNodeB 5G / Répartiteurs Optiques",
    badge: "ACCÈS OPTIQUE & RADIO",
    iconName: "Zap",
    colorScheme: {
      text: "text-indigo-400",
      bg: "bg-indigo-950/40",
      border: "border-indigo-500/40",
      accent: "from-indigo-600 to-blue-600",
      badgeBg: "bg-indigo-900/30 text-indigo-300 border-indigo-500/30"
    },
    summary: "Le réseau d'accès (Last Mile / RAN) connecte des milliers de clients finaux vers les premiers équipements de concentration de l'opérateur via fibre optique (PON) ou ondes radio (4G/5G).",
    architecturalRole: {
      description: "Le réseau d'accès assure la mutualisation physique et logique du support de transmission. En FTTH (PON), une seule fibre part de l'OLT et est divisée passivement pour alimenter jusqu'à 64 abonnés. En mobile, les antennes (eNodeB/gNodeB) partagent le spectre radio entre les utilisateurs connectés.",
      keyPoints: [
        "Multiplexage passif par division temporelle (TDMA en voie montante pour éviter les collisions optiques)",
        "Chiffrement AES-128 individuel sur la voie descendante (car chaque ONT reçoit les données de tous les voisins de l'arbre)",
        "Gestion dynamique de la bande passante (DBA - Dynamic Bandwidth Allocation)",
        "Gestion radioélecrique (puissance, modulation QAM-256/1024, beamforming 5G)"
      ],
      importance: "C'est la couche la plus coûteuse en infrastructure physique (génie civil, poteaux, câbles de distribution optique, pylônes de télécommunication)."
    },
    technologies: [
      {
        name: "Gigabit Passive Optical Network (GPON & XGS-PON)",
        acronym: "GPON / XGS-PON",
        description: "Technologie point-à-multipoint normalisée ITU-T G.984 (GPON) et ITU-T G.9807.1 (XGS-PON).",
        specifications: [
          "GPON : 2.488 Gbps Down (1490 nm) / 1.244 Gbps Up (1310 nm)",
          "XGS-PON : 9.953 Gbps symétrique (Down 1577 nm / Up 1270 nm)",
          "Portée max : 20 à 40 km avec ratio de split 1:32 ou 1:64",
          "Budget optique classe B+ (28 dB) ou C+ (32 dB)"
        ]
      },
      {
        name: "Réseau d'Accès Radio 4G LTE & 5G NR",
        acronym: "RAN (eNodeB / gNodeB)",
        description: "Stations de base radio composées de la BBU (Baseband Unit) et des RRU/AAU (Remote Radio Units).",
        specifications: [
          "4G LTE-Advanced : MIMO 4x4, Modulation 256-QAM",
          "5G NR : Massive MIMO 64T64R, Largeurs de canal jusqu'à 100 MHz (Sub-6) et 400 MHz (mmWave)",
          "Interfaces O-RAN : eCPRI / RoE pour le Fronthaul optique",
          "Latence radio descendant à < 1 ms en 5G URLLC"
        ]
      }
    ],
    encapsulation: {
      layer: "Trames GEM (GPON Encapsulation Method) / RLC-MAC 3GPP",
      frameStructure: [
        { name: "En-tête Trame PON (PLM / PLOAM)", bytes: "Structure PON", description: "Contrôle physique, synchronisation d'accès et télémétrie", color: "bg-slate-700 text-slate-200" },
        { name: "En-tête GEM Header (Port-ID)", bytes: "5 octets", description: "Identifiant de port GEM (canal logique de l'abonné) et longueur", color: "bg-indigo-900 text-indigo-200" },
        { name: "Tag VLAN 802.1Q (C-VLAN)", bytes: "4 octets", description: "VLAN utilisateur (ex: VLAN 100 pour Data, VLAN 200 pour Voix)", color: "bg-blue-900 text-blue-200" },
        { name: "Trame Ethernet Client", bytes: "14 octets", description: "MAC Source et Destination du terminal client", color: "bg-purple-900 text-purple-200" },
        { name: "Paquet IP Payload", bytes: "Jusqu'à 1500 o", description: "Paquet IP de l'utilisateur", color: "bg-emerald-900 text-emerald-200" }
      ],
      explanation: "L'OLT encapsule chaque trame Ethernet du client dans des trames GEM (GPON Encapsulation Method) identifiées par un GEM Port-ID propre à cet abonné, avant de l'émettre en rafales optiques."
    },
    realEquipment: [
      { vendor: "Huawei", model: "SmartAX MA5800-X7 / X17", role: "Châssis OLT XGS-PON / GPON Haute Densité", capacity: "Jusqu'à 16 000 abonnés FTTH par châssis" },
      { vendor: "Nokia", model: "FX-4 / FX-8 / FX-16 ISAM", role: "OLT Fibre Optique Universelle", capacity: "Cartes 16 ports XGS-PON / Multi-PON" },
      { vendor: "Ericsson", model: "Radio 4415 / AIR 6449", role: "Antenne active Massive MIMO 5G", capacity: "64 émetteurs / 64 récepteurs, 200W RF" }
    ],
    cliExamples: [
      {
        title: "Affichage de l'état des ONT et de la puissance optique reçue (OLT Huawei)",
        os: "Huawei VRP / MA5800 OLT CLI",
        command: "display ont info 0 1 4 all\ndisplay ont optical-info 0 1 4 0",
        outputDescription: "Affiche le numéro de série de l'ONT (ex: 48575443...), son statut 'online', et la puissance reçue Rx Optical Power (ex: -19.45 dBm)."
      },
      {
        title: "Vérification des profils de bande passante DBA sur port PON (Nokia ISAM)",
        os: "Nokia ISAM CLI",
        command: "show equipment ont status 1/1/1/4\nshow pon protection 1/1/1",
        outputDescription: "Indique l'allocation de débit garanti (Assured) et de débit max (Maximum) configurée pour l'abonné."
      }
    ],
    quiz: [
      {
        id: "q2-1",
        question: "Sur un réseau FTTH GPON, quelle longueur d'onde est utilisée pour la voie descendante (de l'OLT vers les ONT) ?",
        options: ["1310 nm", "1490 nm", "1550 nm", "850 nm"],
        correctIndex: 1,
        explanation: "Le GPON utilise la longueur d'onde 1490 nm pour le flux descendant (Downstream) et 1310 nm pour le flux montant (Upstream)."
      },
      {
        id: "q2-2",
        question: "Comment les différents ONT partagent-ils la même fibre optique sans provoquer de collisions en voie montante ?",
        options: ["Par détection de collision CSMA/CD", "Par multiplexage temporel TDMA géré par l'OLT", "Par changement aléatoire de fréquence", "En émettant tous en permanence"],
        correctIndex: 1,
        explanation: "L'OLT alloue des plages horaires précises (Time Slots) à chaque ONT via le protocole TDMA (Time Division Multiple Access) et le mécanisme DBA."
      },
      {
        id: "q2-3",
        question: "Quel débit symétrique maximal théorique offre la technologie XGS-PON ?",
        options: ["1 Gbps", "2.5 Gbps", "10 Gbps", "100 Gbps"],
        correctIndex: 2,
        explanation: "Le 'X' signifie 10, 'G' Gigabit, et 'S' Symmetrical : XGS-PON fournit 10 Gbps en voie descendante et 10 Gbps en voie montante."
      }
    ]
  },
  {
    id: 'aggregation-network',
    stepNumber: 3,
    title: "Réseau d'Agrégation & Collecte Métropolitaine",
    subtitle: "Boucles Metro 10G/100G / Anneaux ERPS G.8032 / DWDM Métro",
    badge: "AGRÉGATION & COLLECTE",
    iconName: "Layers",
    colorScheme: {
      text: "text-blue-400",
      bg: "bg-blue-950/40",
      border: "border-blue-500/40",
      accent: "from-blue-600 to-cyan-600",
      badgeBg: "bg-blue-900/30 text-blue-300 border-blue-500/30"
    },
    summary: "Le réseau d'agrégation regroupe le trafic venant de dizaines d'OLT et de centaines de sites mobiles (eNodeB/gNodeB) sur des boucles optiques sécurisées (10G/100G/400G) pour les acheminer vers le cœur de réseau.",
    architecturalRole: {
      description: "Le réseau métropolitain collecte et encapsule les flux abonnés dans des tunnels de niveau 2 ou des anneaux optiques protégés. En cas de coupure de fibre sur une artère, le protocole de protection réoriente tout le trafic en moins de 50 millisecondes.",
      keyPoints: [
        "Isolation des abonnés par double taggage VLAN QinQ (IEEE 802.1ad : S-VLAN Opérateur + C-VLAN Client)",
        "Haute disponibilité grâce aux anneaux G.8032 ERPS (Ethernet Ring Protection Switching)",
        "Multiplexage en longueur d'onde WDM (CWDM / DWDM) pour faire passer 40 à 96 canaux sur une seule paire de fibre optique",
        "Agrégation de liens LACP (802.3ad) et liaisons 10GE / 25GE / 100GE"
      ],
      importance: "Il empêche la saturation des équipements de cœur et garantit une résilience locale face aux coupures de câbles optiques urbains."
    },
    technologies: [
      {
        name: "Ethernet Ring Protection Switching (ERPS G.8032)",
        acronym: "G.8032 ERPS",
        description: "Norme ITU-T assurant la protection et le basculement automatique des anneaux Ethernet en moins de 50 ms sans boucle de commutation.",
        specifications: [
          "Convergence < 50 ms en cas de rupture de lien",
          "Port bloqué RPL (Ring Protection Link) pour éliminer les boucles",
          "Messages R-APS (Ring Auto Protection Switch) d'alerte",
          "Support multi-anneaux et sous-anneaux (Sub-rings)"
        ]
      },
      {
        name: "VLAN Stacking QinQ (IEEE 802.1ad)",
        acronym: "QinQ (802.1ad)",
        description: "Ajout d'une deuxième étiquette VLAN (Service VLAN - S-TAG) au-dessus du VLAN client (Customer VLAN - C-TAG).",
        specifications: [
          "S-VLAN (EtherType 0x88A8) : identifie le NRO, l'OLT ou le service opérateur",
          "C-VLAN (EtherType 0x8100) : préserve le VLAN de l'abonné",
          "Permet jusqu'à 4094 x 4094 = 16 millions de combinaisons de flux",
          "Mappage direct vers les sous-interfaces du BNG ou les VRF"
        ]
      },
      {
        name: "Multiplexage Optique Dense (Metro DWDM / OTN)",
        acronym: "DWDM / OTN",
        description: "Transmission de multiples signaux indépendants sur des canaux spectraux espacés de 50 GHz ou 100 GHz (grille ITU-T).",
        specifications: [
          "Jusqu'à 96 longueurs d'onde dans la bande C (1530 - 1565 nm)",
          "Débits de 100 Gbps, 200 Gbps et 400 Gbps par canal optique (Lambda)",
          "Châssis ROADM (Reconfigurable Optical Add-Drop Multiplexer)"
        ]
      }
    ],
    encapsulation: {
      layer: "Trame Ethernet Double Taggée (QinQ 802.1ad)",
      frameStructure: [
        { name: "En-tête MAC (Src / Dst)", bytes: "12 octets", description: "Adresses MAC du commutateur d'agrégation et du routeur PE", color: "bg-slate-700 text-slate-200" },
        { name: "Service Tag S-VLAN (0x88A8)", bytes: "4 octets", description: "VLAN Opérateur (ex: VLAN 2500 - Collecte FTTH Secteur Nord)", color: "bg-blue-900 text-blue-200" },
        { name: "Customer Tag C-VLAN (0x8100)", bytes: "4 octets", description: "VLAN Client d'origine (ex: VLAN 100 - Flux Internet)", color: "bg-indigo-900 text-indigo-200" },
        { name: "EtherType (0x0800)", bytes: "2 octets", description: "Indique la charge utile IPv4", color: "bg-cyan-900 text-cyan-200" },
        { name: "Paquet IP", bytes: "Variable", description: "Paquet IP original de l'utilisateur", color: "bg-emerald-900 text-emerald-200" },
        { name: "FCS Checksum", bytes: "4 octets", description: "Vérification d'erreur de trame", color: "bg-slate-800 text-slate-300" }
      ],
      explanation: "À l'entrée de la boucle d'agrégation métropolitaine, le commutateur insère le S-TAG (Service-Tag) pour transporter le paquet à travers tout le réseau régional sans avoir à désencapsuler le paquet IP."
    },
    realEquipment: [
      { vendor: "Cisco", model: "NCS 540 & ASR 920 Series", role: "Routeur d'accès métropolitain et d'agrégation 100G", capacity: "Ports 10GE, 25GE, 100GE haute densité durci (-40°C à +65°C)" },
      { vendor: "Nokia", model: "7210 SAS (Service Access Switch)", role: "Commutateur de collecte Carrier Ethernet & MPLS-TP", capacity: "Précision de synchronisation SyncE / IEEE 1588v2" },
      { vendor: "Huawei", model: "NetEngine ATN 910C / 950B", role: "Passerelle de collecte mobile 5G Backhaul", capacity: "Commutation Wire-speed 100 Gbps" }
    ],
    cliExamples: [
      {
        title: "Vérification de l'état d'un anneau de protection Ethernet G.8032 (Cisco IOS-XE)",
        os: "Cisco IOS-XE",
        command: "show ethernet ring g8032 status\nshow ethernet ring g8032 detail ring-instance 1",
        outputDescription: "Affiche le statut de l'anneau (ex: 'State: IDLE', 'RPL Port: Blocked', 'Node Role: RPL Owner'). En cas de coupure, passe en état 'PROTECTION'."
      },
      {
        title: "Configuration d'un port d'agrégation QinQ (Nokia 7210 SAS)",
        os: "Nokia SR OS",
        command: "show service sap-using | match qinq\nshow port 1/1/2 optical-diagnostics",
        outputDescription: "Liste les interfaces SAP encapsulées avec le format encap-type qinq (ex: 1/1/2:2500.*)."
      }
    ],
    quiz: [
      {
        id: "q3-1",
        question: "Quel est le temps maximal de basculement garanti par la norme G.8032 ERPS en cas de coupure d'un câble de fibre optique ?",
        options: ["Moins de 50 millisecondes", "Environ 2 secondes", "30 secondes (Spanning Tree)", "5 minutes"],
        correctIndex: 0,
        explanation: "La norme ITU-T G.8032 ERPS garantit une restauration du trafic en moins de 50 ms pour préserver les appels téléphoniques VoIP et flux sensibles."
      },
      {
        id: "q3-2",
        question: "À quoi sert le double taggage VLAN QinQ (802.1ad) dans un réseau de collecte ?",
        options: ["À doubler la vitesse de la fibre", "À ajouter une étiquette opérateur (S-TAG) par-dessus le VLAN client (C-TAG)", "À crypter le mot de passe Wi-Fi", "À remplacer le protocole IP"],
        correctIndex: 1,
        explanation: "Le QinQ insère un S-TAG opérateur afin de transporter les flux de milliers de clients sans conflit de numéros de VLAN et sans regarder l'adresse IP."
      },
      {
        id: "q3-3",
        question: "Quel équipement optique permet d'insérer ou d'extraire des longueurs d'onde lumineuses sans convertir le signal en électricité ?",
        options: ["Le commutateur Gigabit RJ45", "Le ROADM (Reconfigurable Optical Add-Drop Multiplexer)", "Le serveur DHCP", "L'antenne Wi-Fi"],
        correctIndex: 1,
        explanation: "Le ROADM permet de commuter et router des longueurs d'onde entières (lambdas DWDM) de manière 100% optique et reconfigurable à distance."
      }
    ]
  },
  {
    id: 'mpls-core',
    stepNumber: 4,
    title: "Cœur de Réseau IP/MPLS",
    subtitle: "Routeurs Nokia 7750 / Cisco ASR / Huawei NE • P & PE Core",
    badge: "CŒUR DE RÉSEAU • MPLS",
    iconName: "Network",
    colorScheme: {
      text: "text-cyan-400",
      bg: "bg-cyan-950/40",
      border: "border-cyan-500/40",
      accent: "from-cyan-600 to-indigo-600",
      badgeBg: "bg-cyan-900/30 text-cyan-300 border-cyan-500/30"
    },
    summary: "L'autoroute dorsale (Backbone) de l'opérateur. Les routeurs commutent les paquets à des débits de plusieurs Terabits/s en utilisant des étiquettes (Labels) MPLS ultra-rapides plutôt que des recherches d'adresses IP complexes.",
    architecturalRole: {
      description: "Le cœur IP/MPLS interconnecte toutes les régions et assure le transport agnostique de n'importe quel service (Internet, VPN d'entreprise, Voix sur IP, 5G Core). Il sépare strictement le plan de contrôle (échange des tables de routage) du plan de données (commutation par label en puce ASIC/NP).",
      keyPoints: [
        "Rôle des routeurs PE (Provider Edge) : Injection du trafic IP, encapsulation des labels MPLS (Push), consultation de la table VRF",
        "Rôle des routeurs P (Provider Core) : Commutation ultra-rapide par simple échange d'étiquette (Swap) sans jamais lire le paquet IP client",
        "Mécanisme PHP (Penultimate Hop Popping) : Le routeur P avant-dernier retire le label de transport pour alléger la charge du PE de sortie",
        "Ingénierie de trafic (RSVP-TE / Segment Routing) pour router sur des chemins à débit réservé ou latence garantie"
      ],
      importance: "C'est le système nerveux central de l'opérateur, offrant une capacité multi-Terabits avec 99.999% de disponibilité."
    },
    technologies: [
      {
        name: "Multi-Protocol Label Switching (MPLS)",
        acronym: "MPLS (RFC 3031)",
        description: "Technologie de commutation de paquets basée sur une étiquette fixe de 32 bits (4 octets) insérée entre la couche 2 et la couche 3 (Layer 2.5).",
        specifications: [
          "Label (20 bits) : valeur de 0 à 1 048 575",
          "TC / EXP (3 bits) : Qualité de service et priorité QoS (DiffServ / CoS)",
          "S (1 bit - Bottom of Stack) : 1 si c'est la dernière étiquette, 0 sinon",
          "TTL (8 bits) : Décrémenté à chaque saut pour éviter les boucles infinies"
        ]
      },
      {
        name: "Protocole de Distribution d'Étiquettes (LDP & Segment Routing)",
        acronym: "LDP & SR-MPLS",
        description: "Protocoles de signalisation permettant aux routeurs d'échanger et d'associer automatiquement des étiquettes aux préfixes IP (FIB -> LIB -> LFIB).",
        specifications: [
          "LDP (RFC 5036) : Établissement de sessions TCP port 646 entre voisins IGP",
          "Segment Routing (SR-MPLS / SRv6) : Élimine LDP en encodant le chemin directement dans l'en-tête (Node-SID, Adjacency-SID)",
          "OSPF-TE / IS-IS-TE : Diffusion des métriques de bande passante et latence"
        ]
      },
      {
        name: "Multiprotocol BGP (MP-BGP EVPN & VPNv4)",
        acronym: "MP-BGP (RFC 4364)",
        description: "Extension du protocole BGP permettant de transporter des adresses VPNv4 (Route Distinguisher + Préfixe IPv4) et des routes EVPN.",
        specifications: [
          "Route Distinguisher (RD - 64 bits) : Rend unique tout préfixe IP privé (ex: 65000:100)",
          "Route Target (RT) : Attribut BGP Extended Community contrôlant l'import/export dans les VRF",
          "Transport de la double étiquette (Outer Label = LDP Transport, Inner Label = VPN Service)"
        ]
      }
    ],
    encapsulation: {
      layer: "Couche 2.5 (Shim Header MPLS)",
      frameStructure: [
        { name: "En-tête Ethernet Physique (L2)", bytes: "14 octets", description: "EtherType 0x8847 (MPLS Unicast)", color: "bg-slate-700 text-slate-200" },
        { name: "Étiquette de Transport (Outer Label)", bytes: "4 octets (32 bits)", description: "Ex: Label 10024 (Guide le paquet vers le bon PE de sortie à travers le cœur P)", color: "bg-cyan-900 text-cyan-200" },
        { name: "Étiquette de Service / VPN (Inner Label)", bytes: "4 octets (32 bits)", description: "Ex: Label 2001 (Indique au PE de sortie dans quelle VRF / client injecter le paquet)", color: "bg-indigo-900 text-indigo-200" },
        { name: "Paquet IP Client (L3)", bytes: "20+ octets", description: "Paquet IP avec adresse IP client (ex: 192.168.10.5)", color: "bg-purple-900 text-purple-200" },
        { name: "Payload Données & FCS", bytes: "Variable + 4 o", description: "Données applicatives et somme de contrôle", color: "bg-emerald-900 text-emerald-200" }
      ],
      explanation: "Dans le cœur IP/MPLS, le paquet possède une double étiquette (Label Stack) : l'étiquette externe (Transport) sert aux routeurs P pour traverser le réseau, l'étiquette interne (VPN/Service) sert au PE de sortie pour identifier le client destinataire."
    },
    realEquipment: [
      { vendor: "Nokia", model: "7750 Service Router (SR-12e / SR-7s)", role: "Routeur de cœur et PE multiservice de référence", capacity: "Capacité de fond de panier jusqu'à 288 Tbps (FP4 / FP5 silicon)" },
      { vendor: "Cisco", model: "ASR 9904 / 9922 & 8000 Series", role: "Routeur de bordure et de cœur opérateur (IOS-XR)", capacity: "Jusqu'à 400 Gbps / 800 Gbps par port optique" },
      { vendor: "Huawei", model: "NetEngine NE40E-X16 & NE8000", role: "Routeur de cœur IP/MPLS haute capacité", capacity: "Châssis multi-Terabits avec puces Solar" }
    ],
    cliExamples: [
      {
        title: "Inspection de la table de commutation d'étiquettes LFIB (Cisco IOS-XR)",
        os: "Cisco IOS-XR",
        command: "show mpls forwarding\nshow mpls ldp bindings 10.255.0.4/32",
        outputDescription: "Affiche pour chaque étiquette entrante (In-Label) l'opération appliquée (Swap/Pop/Push), l'étiquette sortante (Out-Label), et l'interface de sortie."
      },
      {
        title: "Vérification des sessions MP-BGP VPNv4 et tables VRF (Nokia SR OS)",
        os: "Nokia SR OS",
        command: "show router bgp summary\nshow router vrf \"VRF_CLIENT_A\" route-table",
        outputDescription: "Vérifie l'état 'Established' des pairs BGP VPNv4 et affiche les préfixes appris avec leur Route Distinguisher (RD)."
      }
    ],
    quiz: [
      {
        id: "q4-1",
        question: "Dans un réseau IP/MPLS, quel est le rôle d'un routeur 'P' (Provider Core) ?",
        options: [
          "Gérer les mots de passe des abonnés Wi-Fi",
          "Commuter ultra-rapidement les paquets par simple échange d'étiquettes (Swap) sans analyser l'adresse IP",
          "Fournir l'accès Internet direct aux téléphones portables",
          "Convertir la fibre optique en câble coaxial"
        ],
        correctIndex: 1,
        explanation: "Les routeurs P sont au cœur du réseau : ils ne connaissent pas les tables de routage des clients, ils se contentent d'échanger l'étiquette de transport (Label Swap) à la vitesse du silicium."
      },
      {
        id: "q4-2",
        question: "Que signifie le mécanisme PHP (Penultimate Hop Popping) en MPLS ?",
        options: [
          "L'avant-dernier routeur retire l'étiquette de transport avant de transmettre le paquet au PE de sortie",
          "Le routeur émet un bip sonore en cas de saturation",
          "Le paquet IP est compressé de moitié",
          "Tous les paquets sont rejetés en cas de panne"
        ],
        correctIndex: 0,
        explanation: "Le PHP permet à l'avant-dernier routeur (Penultimate Hop) de retirer l'étiquette de transport externe, évitant ainsi au routeur PE final d'effectuer deux consultations consécutives de table."
      },
      {
        id: "q4-3",
        question: "Sur combien de bits est codée une étiquette (Label) MPLS dans l'en-tête de 32 bits ?",
        options: ["8 bits", "16 bits", "20 bits", "32 bits"],
        correctIndex: 2,
        explanation: "La valeur du label occupe 20 bits (valeurs possibles de 0 à 1 048 575), les 12 autres bits étant réservés pour la QoS (3 bits EXP/TC), le Bottom-of-Stack (1 bit S) et le TTL (8 bits)."
      }
    ]
  },
  {
    id: 'services-gateways',
    stepNumber: 5,
    title: "Services Télécom & Passerelles d'Abonnés",
    subtitle: "BNG / BRAS • L3VPN d'Entreprise • Voix sur IP IMS • Passerelles CGNAT",
    badge: "SERVICES & ABONNÉS",
    iconName: "PhoneCall",
    colorScheme: {
      text: "text-emerald-400",
      bg: "bg-emerald-950/40",
      border: "border-emerald-500/40",
      accent: "from-emerald-600 to-teal-600",
      badgeBg: "bg-emerald-900/30 text-emerald-300 border-emerald-500/30"
    },
    summary: "L'intelligence applicative du réseau opérateur. C'est ici que sont gérées l'authentification des clients (PPPoE/IPoE), l'attribution des adresses IP publiques, la téléphonie fixe/mobile (IMS SIP) et l'isolation des réseaux d'entreprises (VPN).",
    architecturalRole: {
      description: "Le BNG (Broadband Network Gateway) est la porte d'entrée où chaque abonné est identifié, comptabilisé et connecté à ses services. Les serveurs de voix (IMS) gèrent la signalisation téléphonique SIP, et les plateformes CGNAT permettent de partager une adresse IPv4 publique entre plusieurs dizaines d'abonnés.",
      keyPoints: [
        "Authentification RADIUS / Diameter et contrôle d'accès abonnés (Option 82 DHCP)",
        "Application stricte de la bande passante (Policing / Shaping / QoS hiérarchique H-QoS)",
        "Carrier-Grade NAT (CGNAT) pour pallier la pénurie mondiale d'adresses IPv4 (plage RFC 6598 100.64.0.0/10)",
        "Cœur multimédia IP IMS pour les appels VoLTE (Voice over LTE) et VoWiFi"
      ],
      importance: "C'est la couche qui applique les contrats commerciaux des abonnés et garantit la qualité de service négociée (SLA)."
    },
    technologies: [
      {
        name: "Broadband Network Gateway (BNG / BRAS)",
        acronym: "BNG / BRAS",
        description: "Point de terminaison des sessions abonnés résidentiels et professionnels (PPPoE / IPoE).",
        specifications: [
          "Terminaison de sessions PPPoE (RFC 2516) et sessions IPoE (DHCP Snooping)",
          "Attribution d'adresses IPv4 privées/publiques et délégation de préfixes IPv6 (/56 ou /64)",
          "H-QoS multi-niveaux (par port, par abonné, par type de flux)",
          "Intégration serveur de facturation RADIUS / PCRF"
        ]
      },
      {
        name: "IP Multimedia Subsystem & Voix sur IP",
        acronym: "IMS / SIP / RTP",
        description: "Architecture de contrôle et de signalisation téléphonique tout-IP standardisée 3GPP/IETF.",
        specifications: [
          "Signalisation SIP (Session Initiation Protocol - RFC 3261) sur port 5060 UDP/TCP",
          "Flux média RTP / RTCP (Real-time Transport Protocol) avec codecs HD (G.711, AMR-WB, EVS)",
          "SBC (Session Border Controller) pour sécuriser et masquer la topologie interne",
          "Support VoLTE, VoNR (5G) et interconnexion avec le réseau téléphonique commuté (RTC/ISDN)"
        ]
      },
      {
        name: "Carrier Grade NAT (CGNAT)",
        acronym: "CGNAT (RFC 6598)",
        description: "Traduction d'adresses et de ports à très grande échelle pour partager une adresse IPv4 publique entre 32 à 128 clients.",
        specifications: [
          "Plage d'adresses dédiée : 100.64.0.0/10",
          "Allocation de blocs de ports déterministes (PBA - Port Block Allocation)",
          "Journalisation légale des correspondances IP privée/port source vers IP publique",
          "Déchargement matériel sur cartes de services ASIC multi-100G"
        ]
      }
    ],
    encapsulation: {
      layer: "Couche 4-7 (Signalisation SIP & Tunnels PPPoE/IPoE)",
      frameStructure: [
        { name: "En-tête Ethernet / VLAN", bytes: "18 octets", description: "VLAN d'accès vers le BNG", color: "bg-slate-700 text-slate-200" },
        { name: "En-tête PPPoE Session (si PPPoE)", bytes: "6 à 8 octets", description: "Identifiant de session et protocole PPP (0x0021 IPv4)", color: "bg-emerald-900 text-emerald-200" },
        { name: "En-tête IP de l'Abonné", bytes: "20 octets", description: "IP Source (ex: 100.64.12.80) / IP Dst (ex: 8.8.8.8)", color: "bg-indigo-900 text-indigo-200" },
        { name: "En-tête Transport (UDP / TCP)", bytes: "8 ou 20 octets", description: "Port Source dynamique (ex: 52140) / Port Dst (ex: 5060 SIP)", color: "bg-blue-900 text-blue-200" },
        { name: "Message Applicatif (SIP INVITE)", bytes: "Variable", description: "Texte clair SIP : INVITE sip:0612345678@ims.operateur.fr", color: "bg-teal-900 text-teal-200" }
      ],
      explanation: "Au niveau des passerelles de services, les protocoles d'authentification (PPPoE ou DHCP IPoE) sont traités pour identifier l'utilisateur avant d'orienter son trafic vers le bon service ou la passerelle NAT."
    },
    realEquipment: [
      { vendor: "Juniper Networks", model: "MX960 / MX10003 3D Universal Edge", role: "BNG & Routeur Edge Haute Performance", capacity: "Jusqu'à 100 000 sessions abonnés PPPoE/IPoE par carte MPC" },
      { vendor: "Cisco", model: "ASR 1000 Series / ASR 9000 BNG", role: "BNG, Serveur CGNAT & Passerelle d'interconnexion", capacity: "Débit de mise en forme H-QoS et NAT jusqu'à 200 Gbps" },
      { vendor: "Ribbon / AudioCodes", model: "SBC 7000 / Mediant 9000", role: "Session Border Controller Voix IMS", capacity: "Jusqu'à 150 000 sessions d'appels voix simultanées" }
    ],
    cliExamples: [
      {
        title: "Affichage des abonnés PPPoE / IPoE actifs sur une passerelle BNG (Juniper Junos)",
        os: "Juniper Junos",
        command: "show subscribers active summary\nshow subscribers address 100.64.10.45 extensive",
        outputDescription: "Affiche le nom d'utilisateur, le profil de QoS appliqué (ex: Profil_Fibre_1Gbps_Down), l'adresse IP et le temps de session."
      },
      {
        title: "Contrôle des traductions actives sur module CGNAT (Cisco ASR)",
        os: "Cisco IOS-XE",
        command: "show ip cgn nat translation 100.64.12.80\nshow platform hardware cgn status",
        outputDescription: "Affiche l'adresse IP publique attribuée et la plage de ports TCP/UDP allouée à cet abonné."
      }
    ],
    quiz: [
      {
        id: "q5-1",
        question: "Quel équipement opérateur termine les sessions des abonnés résidentiels et leur attribue leur adresse IP ?",
        options: ["Le BNG (Broadband Network Gateway)", "L'antenne relais 2G", "Le répéteur Wi-Fi", "Le commutateur Ethernet de bureau"],
        correctIndex: 0,
        explanation: "Le BNG (anciennement BRAS) est le routeur de bordure de service chargé de terminer les sessions d'accès abonnés (PPPoE/IPoE) et de contrôler leurs débits."
      },
      {
        id: "q5-2",
        question: "Quelle plage d'adresses IPv4 réservée par la RFC 6598 est spécifiquement utilisée pour le Carrier-Grade NAT (CGNAT) ?",
        options: ["192.168.0.0/16", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8"],
        correctIndex: 2,
        explanation: "La plage 100.64.0.0/10 (allant de 100.64.0.0 à 100.127.255.255) a été standardisée par la RFC 6598 pour le CGNAT opérateur (Shared Address Space)."
      },
      {
        id: "q5-3",
        question: "Quel protocole texte est universellement utilisé pour initier, modifier et terminer les sessions d'appels voix et vidéo en Téléphonie IP ?",
        options: ["FTP", "SIP (Session Initiation Protocol)", "SMTP", "BGP"],
        correctIndex: 1,
        explanation: "Le protocole SIP (Session Initiation Protocol - RFC 3261) est le standard mondial de signalisation pour la voix sur IP, le multimédia et les réseaux 4G VoLTE / 5G VoNR."
      }
    ]
  },
  {
    id: 'internet-transit',
    stepNumber: 6,
    title: "Interconnexion & Transit Internet Mondial",
    subtitle: "Opérateurs Tier-1 • Points d'Échange IXP • Protocole BGP-4 • RPKI",
    badge: "INTERNET & ROUTAGE MONDIAL",
    iconName: "Server",
    colorScheme: {
      text: "text-amber-400",
      bg: "bg-amber-950/40",
      border: "border-amber-500/40",
      accent: "from-amber-600 to-orange-600",
      badgeBg: "bg-amber-900/30 text-amber-300 border-amber-500/30"
    },
    summary: "La porte de sortie vers le reste du monde. Les routeurs de frontière BGP échangent des routes avec les autres opérateurs mondiaux (Tier-1) et les points d'échange Internet (IXP) pour joindre n'importe quelle adresse IP sur la planète.",
    architecturalRole: {
      description: "Internet n'est pas un réseau unique mais une interconnexion de plus de 75 000 systèmes autonomes (AS - Autonomous Systems). Le protocole BGP-4 (Border Gateway Protocol) permet aux routeurs de frontière d'apprendre plus de 950 000 préfixes IPv4 mondiaux et de choisir le chemin le plus direct et économique.",
      keyPoints: [
        "Différence entre Transit IP (payant, accès à toute la table mondiale) et Peering (gratuit ou à coût partagé sur un point d'échange IXP)",
        "Table BGP globale complète (Full BGP Routing Table) contenant plus de 950 000 routes IPv4 et 200 000 routes IPv6",
        "Sécurisation du routage par RPKI (Resource Public Key Infrastructure) et filtrage ROA pour empêcher le détournement de trafic (BGP Hijacking)",
        "Manipulation du chemin via BGP Attributes : Local Preference, AS-Path Prepending, MED et BGP Communities"
      ],
      importance: "Sans interconnexion BGP robuste et redondante avec plusieurs Tier-1, un opérateur reste isolé et ne peut joindre les services internationaux."
    },
    technologies: [
      {
        name: "Border Gateway Protocol version 4 (BGP-4)",
        acronym: "BGP-4 (RFC 4271)",
        description: "Protocole de routage inter-domaine à vecteur de chemin (Path-Vector) fonctionnant au-dessus de TCP (port 179).",
        specifications: [
          "Échange d'attributs de chemin (AS-Path, Next-Hop, Local-Pref, Multi-Exit Discriminator)",
          "Convergence mondiale décentralisée",
          "Support du multihoming (connexion simultanée à plusieurs fournisseurs Internet)",
          "Filtrage par listes de préfixes (Prefix-Lists) et politiques de routage (Route-Maps)"
        ]
      },
      {
        name: "Points d'Échange Internet (IXP / GIX)",
        acronym: "IXP / Peering",
        description: "Infrastructures neutres de commutation où des centaines d'opérateurs, hébergeurs et géants du web (Google, Netflix, Cloudflare) s'interconnectent directement.",
        specifications: [
          "Peering public via Route Servers (RS BGP)",
          "Peering privé (PNI - Private Network Interconnect) par fibre dédiée",
          "Réduction spectaculaire de la latence (souvent < 5 ms) et économie de coûts de transit",
          "Exemples majeurs : France-IX (Paris), AMS-IX (Amsterdam), DE-CIX (Francfort)"
        ]
      },
      {
        name: "Sécurisation RPKI & MANRS",
        acronym: "RPKI (RFC 6480)",
        description: "Infrastructure à clés publiques validant que l'opérateur qui annonce un préfixe IP est légitimement autorisé par le registre régional (RIPE NCC, ARIN, AFRINIC).",
        specifications: [
          "Validation de l'origine de la route (ROA - Route Origin Authorization)",
          "États de validation : Valid, Invalid (rejeté immédiatement), Not Found",
          "Protection absolue contre les erreurs de saisie et piratages de trafic BGP"
        ]
      }
    ],
    encapsulation: {
      layer: "Couche 3 & Session TCP BGP (Port 179)",
      frameStructure: [
        { name: "En-tête IP Public", bytes: "20 octets", description: "IP Publique Source de l'opérateur vers IP Publique Destination externe", color: "bg-slate-700 text-slate-200" },
        { name: "En-tête TCP", bytes: "20 octets", description: "Connexion fiable TCP point-à-point vers le pair BGP", color: "bg-blue-900 text-blue-200" },
        { name: "En-tête BGP Header", bytes: "19 octets", description: "Marker (16 octets), Longueur et Type de message (UPDATE)", color: "bg-amber-900 text-amber-200" },
        { name: "BGP Update Attributes", bytes: "Variable", description: "AS-PATH (ex: AS174 AS15169), ORIGIN, NEXT_HOP, COMMUNITY", color: "bg-orange-900 text-orange-200" },
        { name: "Préfixes NLRI annoncés", bytes: "Variable", description: "Réseaux IP annoncés au monde entier (ex: 142.250.0.0/15)", color: "bg-emerald-900 text-emerald-200" }
      ],
      explanation: "Sur les routeurs de transit, les paquets des utilisateurs transitent en routage IP pur, tandis que le plan de contrôle maintient les tables BGP en échangeant des messages BGP UPDATE avec les voisins internationaux."
    },
    realEquipment: [
      { vendor: "Cisco", model: "8800 Series & NCS 5500", role: "Routeur de Transit Internet & Core Backbone", capacity: "Châssis modulaire jusqu'à 260 Tbps avec puces Cisco Silicon One" },
      { vendor: "Juniper Networks", model: "PTX10008 / PTX10001-36MR", role: "Routeur de Transit BGP et Cœur de Peering", capacity: "Support natif de millions de routes BGP et ports 400GbE / 800GbE" },
      { vendor: "Arista Networks", model: "7800R3 & 7280R3 Series", role: "Routeur de Peering Internet & Cloud Spine", capacity: "Tables de routage haute densité avec mémoire TCAM algorithmique" }
    ],
    cliExamples: [
      {
        title: "Vérification des voisins BGP et de la réception de la table complète (Cisco IOS-XR)",
        os: "Cisco IOS-XR",
        command: "show bgp ipv4 unicast summary\nshow bgp ipv4 unicast 8.8.8.0/24",
        outputDescription: "Affiche le nombre de préfixes reçus de chaque opérateur de transit (ex: 'PfxRcd: 942500') et le chemin d'AS traversé pour joindre l'adresse."
      },
      {
        title: "Validation de l'état RPKI sur une route reçue (Juniper Junos)",
        os: "Juniper Junos",
        command: "show route protocol bgp 1.1.1.0/24 extensive | match validation",
        outputDescription: "Affiche 'Validation state: Valid', confirmant que l'annonce BGP est signée cryptographiquement par le détenteur légitime du préfixe."
      }
    ],
    quiz: [
      {
        id: "q6-1",
        question: "Quel protocole de routage est l'unique standard mondial utilisé pour échanger des routes entre différents Systèmes Autonomes (AS) sur Internet ?",
        options: ["OSPF", "RIP", "BGP-4 (Border Gateway Protocol)", "STP"],
        correctIndex: 2,
        explanation: "BGP-4 (Border Gateway Protocol version 4) est le protocole de routage extérieur fondamental qui régit l'ensemble de l'Internet mondial."
      },
      {
        id: "q6-2",
        question: "Quelle est la différence fondamentale entre le 'Transit IP' et le 'Peering' sur un point d'échange (IXP) ?",
        options: [
          "Le transit est sans fil, le peering est filaire",
          "Le transit donne accès à la totalité de l'Internet mondial (payant), le peering échange du trafic directement et localement entre deux réseaux membres",
          "Le peering est illégal",
          "Le transit ne fonctionne qu'en IPv4"
        ],
        correctIndex: 1,
        explanation: "Le Transit IP est un service payant ouvrant l'accès à tous les réseaux de la terre, tandis que le Peering sur un IXP permet d'échanger directement le trafic entre deux réseaux partenaires pour un coût minime."
      },
      {
        id: "q6-3",
        question: "À quoi sert la technologie RPKI (Resource Public Key Infrastructure) dans le routage Internet ?",
        options: [
          "À crypter les e-mails des utilisateurs",
          "À valider cryptographiquement que l'AS qui annonce un bloc d'adresses IP en est bien le propriétaire légitime (anti-hijacking)",
          "À augmenter la vitesse de téléchargement Wi-Fi",
          "À éteindre les serveurs la nuit"
        ],
        correctIndex: 1,
        explanation: "RPKI permet de vérifier cryptographiquement l'origine des annonces BGP (ROA) pour empêcher les détournements malveillants ou accidentels de trafic mondial (BGP Hijacking)."
      }
    ]
  },
  {
    id: 'cloud-datacenter',
    stepNumber: 7,
    title: "Datacenters Télécom & Cloud Infrastructure",
    subtitle: "Architectures Spine-Leaf • EVPN-VXLAN • Telco Cloud NFV / SDN",
    badge: "DATACENTER & CLOUD",
    iconName: "Cpu",
    colorScheme: {
      text: "text-rose-400",
      bg: "bg-rose-950/40",
      border: "border-rose-500/40",
      accent: "from-rose-600 to-pink-600",
      badgeBg: "bg-rose-900/30 text-rose-300 border-rose-500/30"
    },
    summary: "La destination finale des données. C'est ici que tournent les serveurs d'applications (Cloud public/privé, caches CDN, streaming vidéo) ainsi que les fonctions réseau virtualisées de l'opérateur (vIMS, 5G Core vUPF).",
    architecturalRole: {
      description: "Les centres de données modernes utilisent une matrice de commutation Spine-Leaf à très haute bande passante (100G/400G/800G) où chaque serveur communique avec n'importe quel autre avec une latence constante et sans aucun goulot d'étranglement. Les fonctions réseau matérielles traditionnelles y sont virtualisées sous forme de conteneurs (CNF) ou machines virtuelles (VNF).",
      keyPoints: [
        "Topologie réseau Spine-Leaf (réseau de Clos) assurant un débit non-bloquant et un routage symétrique Est-Ouest (serveur à serveur)",
        "Encapsulation d'overlay EVPN-VXLAN (RFC 7348) permettant d'étendre des réseaux de niveau 2 au-dessus d'une sous-couche IP (Underlay) routée robuste",
        "Virtualisation des fonctions réseau (NFV - Network Functions Virtualization) pour déployer des cœurs 5G et des routeurs virtuels en quelques secondes",
        "Caches de proximité (CDN - Content Delivery Network) pour servir les vidéos et contenus web au plus près des abonnés"
      ],
      importance: "Il héberge les applications des géants du web et représente le futur des cœurs de réseaux mobiles 5G/6G tout-logiciel (Cloud-Native)."
    },
    technologies: [
      {
        name: "Matrice de Commutation Spine-Leaf",
        acronym: "Spine-Leaf Fabric",
        description: "Architecture à deux niveaux où chaque commutateur de feuille (Leaf / ToR) est relié à tous les commutateurs vertébraux (Spine).",
        specifications: [
          "Élimination totale de Spanning Tree (STP) au profit du routage ECMP (Equal-Cost Multi-Path)",
          "Bande passante prédictible et latence ultra-faible (< 1 microseconde par saut)",
          "Liaisons 100GbE / 400GbE / 800GbE entre Spine et Leaf",
          "Routage BGP sous-jacent (eBGP Underlay RFC 7938)"
        ]
      },
      {
        name: "Overlay EVPN-VXLAN (BGP-EVPN)",
        acronym: "EVPN-VXLAN",
        description: "Protocole de tunneling encapsulant des trames Ethernet complètes dans des paquets UDP (port 4789) à travers le réseau IP.",
        specifications: [
          "VNI (VXLAN Network Identifier - 24 bits) offrant jusqu'à 16 millions de segments virtuels (contre 4094 pour les VLANs)",
          "Contrôle par BGP EVPN (RFC 7432) éliminant le flooding Broadcast/Unknown Unicast",
          "Mobilité instantanée des machines virtuelles et conteneurs sans reconfiguration réseau"
        ]
      },
      {
        name: "Telco Cloud & Virtualisation NFV / CNF",
        acronym: "Telco Cloud (NFV)",
        description: "Déploiement des éléments de réseau télécom (Cœur 5G AMF/SMF/UPF, IMS, vBNG) sous forme de conteneurs Kubernetes.",
        specifications: [
          "Accélération logicielle DPDK (Data Plane Development Kit) et SR-IOV pour contourner le noyau Linux",
          "Passage à l'échelle automatique (Auto-scaling) lors des pics de trafic (soirées, grands événements)",
          "Orchestration automatisée par Kubernetes et CI/CD Télécom"
        ]
      }
    ],
    encapsulation: {
      layer: "Tunneling VXLAN sur IP/UDP (Port UDP 4789)",
      frameStructure: [
        { name: "En-tête IP/Ethernet Underlay", bytes: "34 octets", description: "IP Source Leaf ToR / IP Dst Spine ou Leaf Destination", color: "bg-slate-700 text-slate-200" },
        { name: "En-tête UDP (Port 4789)", bytes: "8 octets", description: "Port destination standard VXLAN (4789) avec port source haché pour l'ECMP", color: "bg-blue-900 text-blue-200" },
        { name: "En-tête VXLAN Header (VNI)", bytes: "8 octets", description: "Identifiant de segment virtuel VNI (ex: VNI 50100 sur 24 bits)", color: "bg-rose-900 text-rose-200" },
        { name: "Trame Ethernet Client Originale", bytes: "14 octets", description: "MAC Source et Destination de la Machine Virtuelle ou Pod", color: "bg-purple-900 text-purple-200" },
        { name: "Paquet IP Serveur Applicatif", bytes: "Variable", description: "Données applicatives de la réponse web / vidéo", color: "bg-emerald-900 text-emerald-200" }
      ],
      explanation: "Dans le datacenter moderne, le commutateur Leaf encapsule la trame de la machine virtuelle dans un paquet UDP VXLAN. Le réseau sous-jacent (Underlay) achemine ce paquet comme un simple flux IP standard vers le Leaf de destination."
    },
    realEquipment: [
      { vendor: "Arista Networks", model: "7050X3 & 7060X Spine/Leaf", role: "Commutateur Datacenter Cloud Ultra-Faible Latence", capacity: "32 ports 400GbE / 100GbE dans 1U avec OS EOS modulaire" },
      { vendor: "Cisco", model: "Nexus 9300 & 9500 Series (Cloud Scale)", role: "Commutateur de Fabric EVPN-VXLAN et ACI", capacity: "Puces CloudScale avec télémétrie matérielle en temps réel" },
      { vendor: "Dell Technologies / HPE", model: "PowerEdge R750 / ProLiant DL380", role: "Serveurs de virtualisation Telco Cloud NFV", capacity: "Bi-processeurs Xeon / EPYC avec cartes SmartNIC 100GbE DPDK" }
    ],
    cliExamples: [
      {
        title: "Vérification des instances VXLAN NVE et des tunnels actifs (Cisco Nexus NX-OS)",
        os: "Cisco NX-OS",
        command: "show nve vni\nshow nve peers",
        outputDescription: "Affiche l'état 'Up' des VNI configurés (ex: VNI 50100), le type 'L2' ou 'L3', et la liste des routeurs Leaf distants (VTEP peers)."
      },
      {
        title: "Inspection des routes BGP EVPN de type 2 (MAC/IP Advertisement) (Arista EOS)",
        os: "Arista EOS",
        command: "show bgp evpn route-type mac-ip\nshow bgp evpn summary",
        outputDescription: "Liste les adresses MAC et IP apprises dynamiquement des serveurs avec leur VNI et leur adresse VTEP de saut suivant."
      }
    ],
    quiz: [
      {
        id: "q7-1",
        question: "Pourquoi l'architecture Spine-Leaf remplace-t-elle l'ancienne hiérarchie à 3 niveaux (Core-Aggregation-Access) dans les centres de données ?",
        options: [
          "Parce qu'elle est gratuite",
          "Pour garantir une latence symétrique et prédictible entre tous les serveurs (trafic Est-Ouest) grâce au routage ECMP",
          "Parce qu'elle supprime le besoin de câbles",
          "Pour permettre aux serveurs de fonctionner sans alimentation électrique"
        ],
        correctIndex: 1,
        explanation: "Dans une matrice Spine-Leaf, chaque Leaf est relié à tous les Spines, ce qui assure que n'importe quel serveur n'est séparé d'un autre que par exactement 3 sauts réseau avec une bande passante massive et sans blocage STP."
      },
      {
        id: "q7-2",
        question: "Sur combien de bits est codé l'identifiant de réseau virtuel VNI dans le protocole VXLAN ?",
        options: ["12 bits (4094 segments)", "16 bits (65 536 segments)", "24 bits (16 millions de segments)", "32 bits"],
        correctIndex: 2,
        explanation: "Le VXLAN utilise un identifiant VNI (VXLAN Network Identifier) de 24 bits, permettant de créer jusqu'à 16 777 216 segments isolés, brisant ainsi la limite historique des 4094 VLANs."
      },
      {
        id: "q7-3",
        question: "Qu'est-ce que le 'Telco Cloud' et la virtualisation des fonctions réseau (NFV) ?",
        options: [
          "Le remplacement des cartes et boîtiers matériels dédiés par des fonctions logicielles (VNF/CNF) exécutées sur des serveurs informatiques standards",
          "Un service de prévisions météorologiques pour les antennes",
          "Un abonnement pour stocker des photos sur smartphone",
          "Une nouvelle prise électrique pour les baies de serveurs"
        ],
        correctIndex: 0,
        explanation: "Le NFV (Network Functions Virtualization) consiste à exécuter les fonctions réseau d'un opérateur (cœurs 4G/5G, routeurs BNG, pare-feux, serveurs IMS) sous forme de conteneurs ou machines virtuelles sur du matériel serveur standard."
      }
    ]
  }
];
