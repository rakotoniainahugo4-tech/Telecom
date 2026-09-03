import { Course, Chapter, Lesson } from '../../types/learning';

export const VOIP_COURSE: Course = {
  id: 'c1000000-0000-4000-8000-000000000001',
  title: 'Téléphonie IP, VoIP & Asterisk / FreePBX',
  slug: 'telephonie-ip-voip-asterisk-freepbx',
  description: 'Comprendre et mettre en œuvre des solutions de téléphonie IP professionnelles.',
  full_description: `La Voix sur IP (VoIP) a définitivement remplacé le Réseau Téléphonique Commuté (RTC). Ce cours approfondi vous forme aux standards incontournables des télécoms modernes :
- La séparation fondamentale entre le plan de contrôle (Signalisation SIP RFC 3261 en port UDP/TCP 5060) et le plan utilisateur (Transport média RTP en UDP).
- Les mécanismes d'authentification MD5 Digest, l'enregistrement des User Agents auprès du Registrar.
- La négociation de session multimédia avec SDP (Session Description Protocol).
- Le déploiement et l'administration d'un IPBX Asterisk avec la pile moderne chan_pjsip.
- Le diagnostic des problèmes audio complexes (One-Way Audio, traversée du NAT, gigue et perte de paquets) à l'aide de Wireshark et sngrep.`,
  category: 'VoIP',
  difficulty: 'Intermédiaire',
  badge: 'VOIX SUR IP',
  published: true,
  estimated_hours: 20,
  total_hours: 20,
  chapters_count: 3,
  lessons_count: 10,
  rating: 4.8,
  reviews_count: 96,
  thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Connaissance des bases des réseaux IP (adresses IPv4, masques, ports UDP/TCP).',
    'Familiarité avec la ligne de commande Linux basique.',
    'Avoir suivi le cours Réseaux IP ou posséder un niveau équivalent.'
  ],
  objectives: [
    'Maîtriser le déroulement exact des requêtes et réponses SIP (REGISTER, INVITE, 100, 180, 200 OK, ACK, BYE).',
    'Analyser les flux RTP et mesurer la qualité de service (Jitter, Packet Loss, score MOS).',
    'Configurer un serveur Asterisk sous Linux avec fichiers pjsip.conf et extensions.conf.',
    'Résoudre les problèmes de traversée de NAT (Symmetric NAT, STUN, TURN, ICE, SBC).'
  ],
  skills_acquired: [
    'Architecture de réseaux voix sur IP d\'entreprise',
    'Analyse de protocoles SIP et SDP sous Wireshark & sngrep',
    'Administration d\'IPBX Asterisk et FreePBX',
    'Dimensionnement de la bande passante et sélection des codecs (G.711, G.729, Opus)',
    'Résolution d\'incidents de téléphonie VoIP et audio unidirectionnel'
  ],
  created_at: '2026-01-10T10:00:00Z',
  updated_at: '2026-01-10T10:00:00Z',
};

export const VOIP_CHAPTERS: Chapter[] = [
  {
    id: 'ch100000-0000-4000-8000-000000000001',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    chapter_number: 1,
    title: 'Chapitre 1 — Introduction à la VoIP & Fondations',
    description: 'Principes de la numérisation de la voix, séparation signalisation/média et éléments de base d\'un réseau voix sur IP.',
    objectives: [
      'Différencier la commutation de circuits RTC et la commutation de paquets VoIP.',
      'Comprendre le rôle des composants clés (User Agents, IPBX, passerelles et SBC).',
      'Calculer la bande passante requise pour un flux RTP avec différents codecs.'
    ],
    duration_minutes: 180,
    lessons_count: 4,
    position: 1,
  },
  {
    id: 'ch100000-0000-4000-8000-000000000002',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    chapter_number: 2,
    title: 'Chapitre 2 — Protocole SIP & Échanges de Signalisation',
    description: 'Analyse approfondie de la RFC 3261 : requêtes REGISTER, INVITE, ACK, BYE, et codes de réponse 1xx à 6xx.',
    objectives: [
      'Décortiquer les en-têtes SIP (Via, From, To, Call-ID, CSeq, Contact).',
      'Comprendre le mécanisme de challenge Digest MD5 lors de l\'enregistrement SIP.',
      'Suivre l\'établissement et la clôture d\'un appel complet avec négociation SDP.'
    ],
    duration_minutes: 200,
    lessons_count: 3,
    position: 2,
  },
  {
    id: 'ch100000-0000-4000-8000-000000000003',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    chapter_number: 3,
    title: 'Chapitre 3 — IPBX Asterisk, Trunks & Dépannage',
    description: 'Mise en œuvre concrète d\'Asterisk, dialplans (pjsip.conf, extensions.conf) et analyse de flux Wireshark.',
    objectives: [
      'Rédiger un plan de numérotation d\'entreprise complet dans extensions.conf.',
      'Monter un Trunk SIP opérateur avec authentification et gestion des SDA.',
      'Utiliser sngrep pour capturer et dépanner les messages SIP en temps réel.'
    ],
    duration_minutes: 240,
    lessons_count: 3,
    position: 3,
  }
];

export const VOIP_LESSONS: Lesson[] = [
  {
    id: 'l1000001-0000-4000-8000-000000000001',
    chapter_id: 'ch100000-0000-4000-8000-000000000001',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "1. Qu'est-ce que la VoIP ?",
    slug: 'quest-ce-que-la-voip',
    duration_minutes: 40,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Définition, historique, comparaison RTC commuté (PSTN) vs paquets IP, et bénéfices pour les entreprises.',
    video_url: undefined,
    video_provider: null,
    video_duration: '32:15',
    summary: 'La VoIP permet de transmettre la voix numérisée sur réseau IP. Elle remplace avantageusement le RTC grâce à la mutualisation des réseaux, la réduction des coûts et une grande flexibilité.',
    key_points: [
      'RTC = Commutation de circuits (canal réservé 64 kbit/s).',
      'VoIP = Commutation de paquets IP en temps réel.',
      'Séparation stricte : SIP pour la signalisation, RTP pour la voix.',
      'Fin programmée du cuivre et du RTC dans le monde entier.'
    ],
    troubleshooting: `Vérification initiale d'un équipement VoIP :
- Vérifier la connectivité IP (ping vers le serveur IPBX).
- Vérifier que le port UDP 5060 n'est pas bloqué par un pare-feu local.
- S'assurer que le protocole SIP ALG n'est pas activé sur le routeur (source n°1 de corruption de paquets SIP).`,
    cli_examples: [
      {
        title: 'Tester l\'accessibilité du serveur SIP en UDP',
        os: 'Linux',
        command: 'nc -zvu 192.168.1.1 5060',
        outputDescription: 'Vérifie que le port UDP 5060 de l\'IPBX répond.'
      }
    ],
    content: `### 1. Qu'est-ce que la VoIP (Voice over IP) ?

La **VoIP** (Voice over Internet Protocol) désigne l'ensemble des protocoles et techniques permettant de transporter la voix humaine numérisée sous forme de paquets de données sur un réseau utilisant le protocole IP (réseau local Ethernet, lien WAN ou Internet public).

Contrairement à l'ancien **Réseau Téléphonique Commuté (RTC / PSTN)** qui reposait sur la commutation de circuits dédiés (canal TDM à 64 kbit/s réservé pendant toute la durée de la communication), la VoIP repose sur la **commutation de paquets**.

#### Les bénéfices majeurs :
- **Convergence voix et données** sur un même câblage RJ45 ou réseau Wi-Fi.
- **Réduction drastique des coûts d'infrastructure** : suppression des lignes RNIS (T0/T2) au profit de liens Trunk SIP.
- **Flexibilité et mobilité** : utilisation de softphones sur PC, smartphones ou téléphones SIP IP n'importe où dans le monde.`
  },
  {
    id: 'l1000001-0000-4000-8000-000000000002',
    chapter_id: 'ch100000-0000-4000-8000-000000000001',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "2. Architecture globale d'un réseau VoIP",
    slug: 'architecture-globale-voip',
    duration_minutes: 45,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Les composants clés : terminaux IP Phone, passerelles VoIP (Media Gateway), serveurs IPBX / Registrar et SBC (Session Border Controller).',
    video_url: undefined,
    video_provider: null,
    video_duration: '38:40',
    summary: 'Une infrastructure VoIP d\'entreprise associe des User Agents (téléphones/softphones), un serveur IPBX pour le routage d\'appels, et un SBC pour sécuriser les flux vers le Trunk SIP opérateur.',
    key_points: [
      'User Agent Client (UAC) et User Agent Server (UAS).',
      'IPBX (Private Branch Exchange) : centre névralgique de distribution des appels.',
      'SBC (Session Border Controller) : pare-feu applicatif VoIP et remédiation NAT.',
      'Media Gateway : conversion entre monde analogique/TDM et monde IP.'
    ],
    cli_examples: [
      {
        title: 'Lister les modules de canaux Asterisk chargés',
        os: 'Asterisk CLI',
        command: 'module show like chan_pjsip',
        outputDescription: 'Vérifie que la pile PJSIP est active et prête à recevoir les connexions.'
      }
    ],
    content: `### 2. Architecture globale d'un réseau VoIP

Un réseau de téléphonie sur IP d'entreprise s'articule autour de quatre éléments architecturaux principaux :

\`\`\`
[ IP Phone / Softphone ]
           │
           │  SIP (Signalisation : Port UDP 5060)
           ▼
[ IPBX / SIP Server (Asterisk/FreePBX) ] ─────── [ SBC / Firewall ] ───> [ Trunk SIP Opérateur ]
           │
           │  RTP (Média Voix : Ports UDP 10000-20000)
           ▼
[ IP Phone Distant / Passerelle RTC ]
\`\`\`

#### 1. Les Terminaux Utilisateurs (User Agents - UA)
- **Hardphones IP** : téléphones de bureau avec combiné et pile SIP intégrée.
- **Softphones** : logiciels VoIP sur ordinateur ou application smartphone.

#### 2. L'IPBX (Private Branch eXchange)
Le cerveau du système téléphonique d'entreprise : il enregistre les postes, applique les plans de numérotation (dialplans), gère les files d'attente, les répondeurs et les transferts.

#### 3. Le SBC (Session Border Controller)
Placé en frontière de réseau, le SBC sécurise le flux SIP contre les attaques par déni de service (DoS), masque la topologie IP interne et réécrit les en-têtes NAT.`
  },
  {
    id: 'l1000001-0000-4000-8000-000000000003',
    chapter_id: 'ch100000-0000-4000-8000-000000000001',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "3. Le protocole RTP & RTCP pour le transport multimédia",
    slug: 'protocole-rtp-rtcp',
    duration_minutes: 45,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Transport en temps réel des échantillons de parole (RFC 3550), numérotation de paquets, timestamps et statistiques de gigue avec RTCP.',
    video_url: undefined,
    video_provider: null,
    video_duration: '36:00',
    summary: 'RTP transporte les paquets audio sur UDP avec numéros de séquence et horodatages. RTCP transmet en parallèle des rapports de qualité (Jitter, Packet Loss, Round Trip Time).',
    key_points: [
      'RTP voyage sur des ports UDP pairs (ex: 10000).',
      'RTCP voyage sur le port UDP impair immédiatement supérieur (ex: 10001).',
      'Sequence Number : permet de réordonner les paquets et détecter les pertes.',
      'Jitter Buffer : tampon mémoire récepteur lissant les variations de délai.'
    ],
    cli_examples: [
      {
        title: 'Observer les statistiques RTP en direct sur Asterisk',
        os: 'Asterisk CLI',
        command: 'pjsip set logger on\nrtp set debug on',
        outputDescription: 'Active la trace détaillée des paquets RTP émis et reçus sur la console.'
      }
    ],
    content: `### 3. Le protocole RTP (Real-time Transport Protocol) & RTCP

Alors que **SIP** s'occupe de la signalisation (faire sonner, décrocher, raccrocher), **RTP** transporte le flux audio réel contenant la voix de vos interlocuteurs.

#### Pourquoi UDP et non TCP ?
TCP garantit l'arrivée sans perte mais introduit des retransmissions incompatibles avec la voix interactive : entendre un mot perdu avec 600 ms de retard est pire que d'entendre un léger blanc imperceptible. La voix tolère une perte de paquets < 1%, mais exige une latence < 150 ms (recommandation ITU-T G.114).

#### En-tête RTP (12 octets) :
- **Sequence Number (16 bits)** : détecte les pertes et permet de remettre les paquets audio dans le bon ordre.
- **Timestamp (32 bits)** : indique l'instant d'échantillonnage pour que le récepteur régule le buffer de gigue (Jitter Buffer).
- **Payload Type (7 bits)** : identifie le codec audio utilisé (0 = PCMU / G.711u, 8 = PCMA / G.711a, 9 = G.722, 18 = G.729).`
  },
  {
    id: 'l1000001-0000-4000-8000-000000000004',
    chapter_id: 'ch100000-0000-4000-8000-000000000001',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "4. Codecs audio (G.711, G.729, Opus) & Bande passante",
    slug: 'codecs-audio-bande-passante',
    duration_minutes: 50,
    position: 4,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Théorème de Shannon-Nyquist, quantification PCM, compression vocale MOS (Mean Opinion Score) et calcul du débit réel avec en-têtes IP/UDP/RTP.',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:30',
    summary: 'Le codec compresse et numérise la voix. G.711 offre une excellente clarté sans compression (87 kbit/s réel), G.729 compresse à 8 kbit/s utile (31 kbit/s réel), et Opus s\'adapte dynamiquement à la congestion du réseau.',
    key_points: [
      'G.711 (PCMA/PCMU) : 64 kbps utile, MOS 4.1, pas de charge CPU.',
      'G.729 : 8 kbps utile, compression CS-ACELP brevetée, idéal pour les liens faibles.',
      'Opus : codec moderne open-source supérieur, bande passante adaptative.',
      'Overhead réseau : +21.2 kbit/s minimum par appel en paquets de 20ms.'
    ],
    cli_examples: [
      {
        title: 'Vérifier la négociation des codecs sur une session active',
        os: 'Asterisk CLI',
        command: 'pjsip show channel <channel-id>',
        outputDescription: 'Affiche le codec audio effectivement sélectionné pour la communication en cours.'
      }
    ],
    content: `### 4. Codecs audio & Dimensionnement de la bande passante

Le codec (COdeur-DÉCodeur) transforme le signal analogique de la voix en flux binaire numérique.

| Codec | Bande Passante Utile | Taille échantillon | Débit Réel avec IP/UDP/RTP (20ms) | Score MOS |
|---|---|---|---|---|
| **G.711 (PCMA/PCMU)** | 64 kbit/s | Non compressé | **87.2 kbit/s** | 4.1 / 5 |
| **G.729** | 8 kbit/s | CS-ACELP compressé | **31.2 kbit/s** | 3.9 / 5 |
| **G.722 (HD Voice)** | 64 kbit/s | Large bande (7 kHz) | **87.2 kbit/s** | 4.3 / 5 |
| **Opus** | 6 à 510 kbit/s | Adaptatif dynamique | Variable (30-90 kbit/s) | 4.5 / 5 |

#### Formule de calcul du débit par appel :
Pour un paquet G.711 avec 20 ms de voix (160 octets de payload) :
- En-tête Ethernet : 14 octets
- En-tête IP : 20 octets
- En-tête UDP : 8 octets
- En-tête RTP : 12 octets
- Payload audio : 160 octets
- Total par paquet : 214 octets = 1712 bits
- À 50 paquets/seconde (1000ms / 20ms) = **85.6 kbit/s** par sens de communication.`
  },
  {
    id: 'l1000001-0000-4000-8000-000000000005',
    chapter_id: 'ch100000-0000-4000-8000-000000000002',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "5. L'enregistrement SIP (SIP REGISTER)",
    slug: 'enregistrement-sip-register',
    duration_minutes: 45,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Comment le téléphone annonce son adresse IP au Registrar SIP, authentification MD5 Digest et temps d\'expiration (Expires).',
    video_url: undefined,
    video_provider: null,
    video_duration: '35:00',
    summary: 'Le processus d\'enregistrement associe l\'adresse AoR (ex: sip:101@domain) à l\'adresse de contact physique (ex: sip:101@192.168.1.50:5060) après validation d\'un challenge 401 Unauthorized.',
    key_points: [
      'Requête REGISTER initiale sans authentification.',
      'Réponse 401 Unauthorized du serveur contenant un Nonce cryptographique aléatoire.',
      'Seconde requête REGISTER contenant la signature MD5 Digest.',
      'Réponse 200 OK avec paramètre Expires fixant la durée de validité du bail.'
    ],
    cli_examples: [
      {
        title: 'Voir les terminaux enregistrés sur Asterisk',
        os: 'Asterisk CLI',
        command: 'pjsip show endpoints\npjsip show aors',
        outputDescription: 'Affiche la liste de tous les postes connectés avec leur adresse IP et port de contact.'
      }
    ],
    content: `### 5. L'enregistrement SIP (SIP REGISTER)

Pour pouvoir recevoir un appel, un terminal VoIP (User Agent Client) doit s'enregistrer auprès du serveur **SIP Registrar** de l'entreprise.

#### Diagramme d'échange :
\`\`\`
IP Phone (192.168.1.50)               SIP Registrar (192.168.1.1)
        │                                        │
        │─── 1. REGISTER (sans auth) ───────────>│
        │                                        │
        │<── 2. 401 Unauthorized (avec Nonce) ──│
        │                                        │
        │─── 3. REGISTER (avec Digest MD5) ─────>│
        │                                        │
        │<── 4. 200 OK (Expires: 3600) ──────────│
\`\`\`

L'en-tête \`Contact: <sip:101@192.168.1.50:5060>\` permet au serveur d'associer le numéro interne **101** à l'adresse IP physique du poste.`
  },
  {
    id: 'l1000001-0000-4000-8000-000000000006',
    chapter_id: 'ch100000-0000-4000-8000-000000000002',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "6. Établissement d'un appel : SIP INVITE, SDP & ACK",
    slug: 'etablissement-appel-invite-sdp-ack',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Déroulement pas-à-pas de l\'appel : négociation des codecs audio avec SDP, codes 100 Trying, 180 Ringing et validation par ACK.',
    video_url: undefined,
    video_provider: null,
    video_duration: '42:15',
    summary: 'Le Three-Way Handshake SIP (INVITE -> 200 OK -> ACK) établit la session. Le corps SDP négocie les adresses IP et ports UDP pour le flux voix RTP direct.',
    key_points: [
      '100 Trying : le serveur confirme la prise en charge de la requête.',
      '180 Ringing : le terminal appelé sonne.',
      '200 OK : l\'utilisateur a décroché, transportant le SDP de réponse.',
      'ACK : confirmation finale de l\'appelant permettant de débuter le flux RTP.'
    ],
    cli_examples: [
      {
        title: 'Observer les messages SIP avec sngrep',
        os: 'Linux Terminal',
        command: 'sngrep -d eth0',
        outputDescription: 'Lance une interface visuelle temps réel montrant tous les diagrammes de signalisation SIP.'
      }
    ],
    content: `### 6. Établissement d'un appel : SIP INVITE & Négociation SDP

Le dialogue SIP pour établir une communication vocale bidirectionnelle suit la séquence standard définie par la RFC 3261 :

\`\`\`
Poste A (101)                SIP Proxy                 Poste B (102)
     │                           │                           │
     │─── INVITE (SDP) ─────────>│                           │
     │<── 100 Trying ────────────│─── INVITE (SDP) ─────────>│
     │                           │<── 180 Ringing ───────────│
     │<── 180 Ringing ───────────│                           │
     │                           │<── 200 OK (SDP) ──────────│ (B décroche)
     │<── 200 OK (SDP) ──────────│                           │
     │─── ACK ──────────────────>│─── ACK ──────────────────>│
     │                           │                           │
     │══════════════ FLUX AUDIO MULTIMÉDIA RTP ══════════════│
\`\`\`

Le corps du message contient la description **SDP (Session Description Protocol)** listant l'adresse IP et le port UDP sur lesquels le terminal écoute le flux audio, ainsi que les codecs supportés.`
  },
  {
    id: 'l1000001-0000-4000-8000-000000000007',
    chapter_id: 'ch100000-0000-4000-8000-000000000002',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "7. Terminaison d'appel (BYE) & Codes de statut SIP",
    slug: 'terminaison-bye-codes-statut',
    duration_minutes: 40,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Fermeture de la session, libération des ressources de bande passante et catalogue des codes 1xx, 2xx, 3xx, 4xx, 5xx et 6xx.',
    video_url: undefined,
    video_provider: null,
    video_duration: '34:00',
    summary: 'La terminaison d\'un dialogue SIP s\'effectue via une transaction BYE -> 200 OK. La maîtrise des codes 4xx/5xx est indispensable pour diagnostiquer rapidement les refus d\'appels.',
    key_points: [
      'BYE est émis par le premier participant qui raccroche.',
      '404 Not Found : le numéro composé n\'existe pas dans le dialplan.',
      '486 Busy Here : l\'utilisateur distant est déjà en communication.',
      '488 Not Acceptable Here : aucun codec commun n\'a pu être négocié via SDP.'
    ],
    cli_examples: [
      {
        title: 'Filtrer les erreurs SIP dans les journaux Asterisk',
        os: 'Linux Terminal',
        command: 'grep -i "SIP/2.0 4" /var/log/asterisk/messages',
        outputDescription: 'Recherche toutes les réponses d\'erreur 4xx survenues récemment.'
      }
    ],
    content: `### 7. Terminaison d'appel & Codes de statut SIP

Pour mettre fin à une communication, l'un des deux participants envoie la requête \`BYE\`, à laquelle l'autre répond par \`200 OK\`. Les flux RTP sont alors immédiatement stoppés.

#### Catégories de codes de réponse SIP :
- **1xx (Informationnel)** : \`100 Trying\`, \`180 Ringing\`, \`183 Session Progress\`.
- **2xx (Succès)** : \`200 OK\`.
- **3xx (Redirection)** : \`301 Moved Permanently\`, \`302 Moved Temporarily\`.
- **4xx (Erreur Client)** : \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`486 Busy Here\`.
- **5xx (Erreur Serveur)** : \`500 Server Internal Error\`, \`503 Service Unavailable\`.
- **6xx (Échec Global)** : \`603 Decline\`.`
  },
  {
    id: 'l1000001-0000-4000-8000-000000000008',
    chapter_id: 'ch100000-0000-4000-8000-000000000003',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "8. Déploiement d'un IPBX Asterisk avec chan_pjsip",
    slug: 'deploiement-asterisk-pjsip',
    duration_minutes: 55,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Installation d\'Asterisk sur Linux, configuration de pjsip.conf (endpoints, aors, auths) et gestion des extensions.',
    video_url: undefined,
    video_provider: null,
    video_duration: '48:10',
    summary: 'chan_pjsip structure la configuration en objets indépendants (transport, endpoint, auth, aor). Cette modularité permet le multi-contact et une sécurité renforcée.',
    key_points: [
      'Transport : définit l\'IP et le port d\'écoute (bind=0.0.0.0:5060).',
      'Endpoint : profil de l\'utilisateur avec codecs autorisés et contexte de routage.',
      'Auth : identifiants de sécurité MD5 (username/password).',
      'AOR (Address of Record) : stocke les contacts IP enregistrés.'
    ],
    cli_examples: [
      {
        title: 'Recharger la configuration PJSIP à chaud sans couper les appels',
        os: 'Asterisk CLI',
        command: 'pjsip reload',
        outputDescription: 'Prend en compte immédiatement les modifications de pjsip.conf.'
      }
    ],
    content: `### 8. Déploiement d'un IPBX Asterisk avec chan_pjsip

Asterisk est le standard open-source pour la création de PBX et serveurs vocaux interactifs. Depuis Asterisk 13+, la pile de référence est **chan_pjsip** (remplaçant l'ancien chan_sip obsolète).

#### Configuration minimale dans \`/etc/asterisk/pjsip.conf\` :
\`\`\`ini
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060

[101]
type=endpoint
context=interne
disallow=all
allow=g722,ulaw,alaw
auth=101-auth
aors=101-aor

[101-auth]
type=auth
auth_type=userpass
username=101
password=SuperSecretTelecomPassword2026!

[101-aor]
type=aor
max_contacts=2
\`\`\``
  },
  {
    id: 'l1000001-0000-4000-8000-000000000009',
    chapter_id: 'ch100000-0000-4000-8000-000000000003',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "9. Dialplan & Configuration des Trunks SIP Opérateur",
    slug: 'dialplan-trunks-sip-operateur',
    duration_minutes: 50,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Syntaxe d\'extensions.conf, règles de routage sortant, SDA (Sélection Directe à l\'Arrivée) et interconnexion avec les opérateurs télécoms.',
    video_url: undefined,
    video_provider: null,
    video_duration: '44:00',
    summary: 'Le dialplan orchestre le traitement des appels avec la syntaxe exten => numéro,priorité,application. La commande Dial() sonne les postes ou achemine vers le Trunk SIP opérateur.',
    key_points: [
      'exten => _0[1-9]XXXXXXXX,1,Dial(PJSIP/\${EXTEN}@trunk-sip) : pattern matching pour les numéros nationaux.',
      'SDA (DID) : numéro public routé directement vers l\'extension interne correspondante.',
      'Gestion du répondeur avec l\'application VoiceMail().'
    ],
    cli_examples: [
      {
        title: 'Tester la résolution d\'une extension dans le dialplan',
        os: 'Asterisk CLI',
        command: 'dialplan show 101@interne',
        outputDescription: 'Affiche les étapes et priorités qui seront exécutées lors de la composition du 101.'
      }
    ],
    content: `### 9. Dialplan & Configuration des Trunks SIP Opérateur

Le plan de numérotation (**dialplan**) dans \`/etc/asterisk/extensions.conf\` définit les règles d'acheminement des appels entrants et sortants.

\`\`\`ini
[interne]
; Appel entre postes internes
exten => 101,1,Dial(PJSIP/101,20)
exten => 101,2,Voicemail(101@default)

exten => 102,1,Dial(PJSIP/102,20)
exten => 102,2,Voicemail(102@default)

; Sortie vers l'extérieur (numéros à 10 chiffres débutant par 0)
exten => _0[1-9]XXXXXXXX,1,Dial(PJSIP/\${EXTEN}@trunk-operateur,60)
exten => _0[1-9]XXXXXXXX,2,Hangup()
\`\`\``
  },
  {
    id: 'l1000001-0000-4000-8000-000000000010',
    chapter_id: 'ch100000-0000-4000-8000-000000000003',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "10. Dépannage VoIP : Analyse Wireshark & NAT",
    slug: 'depannage-voip-wireshark-nat',
    duration_minutes: 50,
    position: 3,
    published: true,
    technical_level: 'Intermédiaire',
    description: 'Diagnostiquer One-Way Audio, dysfonctionnements du NAT, gigue excessive et paquets rejetés avec Wireshark et sngrep.',
    video_url: undefined,
    video_provider: null,
    video_duration: '45:20',
    summary: 'Le problème de l\'audio unidirectionnel (One-Way Audio) est dans 99% des cas causé par un SDP annonçant une adresse IP privée RFC 1918 non routable à travers Internet. La solution : forcer l\'IP publique sur l\'endpoint Asterisk et activer STUN/ICE.',
    key_points: [
      'One-Way Audio : le participant A entend, mais le participant B n\'entend rien.',
      'Cause n°1 : Le SDP contient une IP privée locale (ex: c=IN IP4 192.168.1.50) au lieu de l\'IP publique.',
      'SIP ALG (Application Layer Gateway) : souvent défaillant sur les box grand public, à désactiver systématiquement.',
      'Outil indispensable : sngrep sous terminal pour visualiser les flows en temps réel.'
    ],
    cli_examples: [
      {
        title: 'Capturer le trafic SIP et RTP avec tcpdump pour analyse Wireshark',
        os: 'Linux Terminal',
        command: 'tcpdump -i eth0 -n -s 0 -w voip_trace.pcap "port 5060 or (udp portrange 10000-20000)"',
        outputDescription: 'Génère un fichier de capture analysable dans Wireshark avec le menu Téléphonie -> Flux VoIP.'
      }
    ],
    content: `### 10. Dépannage VoIP : Wireshark, sngrep & Problématiques du NAT

#### Le Problème du NAT dans le protocole SIP
Le protocole SIP a été conçu à l'origine pour des machines disposant toutes d'adresses IP publiques uniques.

Quand un téléphone situé derrière une Box NAT envoie un message SIP \`INVITE\`, il inscrit son adresse IP privée locale dans le corps SDP :
\`\`\`text
c=IN IP4 192.168.1.50
m=audio 10004 RTP/AVP 0 8
\`\`\`

Le correspondant distant reçoit cette information et tente d'envoyer ses paquets voix RTP vers \`192.168.1.50\`, une adresse privée qui ne peut pas être routée sur Internet ! Résultat immédiat : **Audio Unidirectionnel (One-Way Audio)**.

#### La Solution chan_pjsip :
Dans \`/etc/asterisk/pjsip.conf\` :
\`\`\`ini
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
local_net=192.168.1.0/24
external_media_address=203.0.113.45
external_signaling_address=203.0.113.45
\`\`\`
Asterisk réécrit automatiquement les en-têtes SDP pour y placer l'adresse IP publique réelle !`
  }
];
