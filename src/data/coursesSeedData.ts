import { Course, Chapter, Lesson } from '../types/learning';

export const SEED_COURSES: Course[] = [
  {
    id: 'c1000000-0000-4000-8000-000000000001',
    title: 'VoIP & Téléphonie d\'Entreprise',
    slug: 'voip',
    description: 'Comprendre l\'architecture complète de la voix sur IP, le protocole de signalisation SIP (RFC 3261), le transport multimédia RTP/RTCP, les codecs audio et la configuration d\'un IPBX Asterisk.',
    category: 'TELECOM ACADEMY',
    difficulty: 'Intermédiaire',
    badge: 'VOIX SUR IP',
    published: true,
    estimated_hours: 6,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'c2000000-0000-4000-8000-000000000002',
    title: 'Architecture IP/MPLS & Services L3VPN',
    slug: 'mpls',
    description: 'Maîtriser la commutation par étiquettes Multi-Protocol Label Switching, les opérations Push/Swap/Pop/PHP, le protocole LDP, et le déploiement de VRF d\'entreprise avec MP-BGP.',
    category: 'TELECOM LABORATORY',
    difficulty: 'Avancé',
    badge: 'CŒUR DE RÉSEAU',
    published: true,
    estimated_hours: 8,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    id: 'c3000000-0000-4000-8000-000000000003',
    title: 'Routage Dynamique Avancé : OSPF & BGP',
    slug: 'ospf-bgp',
    description: 'Apprenez le fonctionnement des protocoles de routage à état de liens (OSPF multi-aires, types de LSA) et le protocole de routage inter-domaines de l\'Internet mondial (BGP, peering, ASN, best path algorithm).',
    category: 'TELECOM ACADEMY',
    difficulty: 'Avancé',
    badge: 'ROUTAGE IP',
    published: true,
    estimated_hours: 7,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'c4000000-0000-4000-8000-000000000004',
    title: 'Topologie du Transport Télécom de Bout en Bout',
    slug: 'network-topology',
    description: 'Parcours complet en 7 étapes : de l\'accès FTTH/PON et radio mobile 4G/5G, jusqu\'au Datacenter Cloud via l\'agrégation métropolitaine, le cœur MPLS et le transit BGP.',
    category: 'NETWORK OPERATIONS',
    difficulty: 'Intermédiaire',
    badge: 'INFRASTRUCTURE',
    published: true,
    estimated_hours: 5,
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:00:00Z',
  }
];

export const SEED_CHAPTERS: Chapter[] = [
  // Course 1: VoIP
  {
    id: 'ch100000-0000-4000-8000-000000000001',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: 'Chapitre 1 — Introduction à la VoIP & Fondations',
    description: 'Principes de la numérisation de la voix, séparation signalisation/média et éléments de base d\'un réseau voix sur IP.',
    position: 1,
  },
  {
    id: 'ch100000-0000-4000-8000-000000000002',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: 'Chapitre 2 — Protocole SIP & Échanges de Signalisation',
    description: 'Analyse approfondie de la RFC 3261 : requêtes REGISTER, INVITE, ACK, BYE, et codes de réponse 1xx à 6xx.',
    position: 2,
  },
  {
    id: 'ch100000-0000-4000-8000-000000000003',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: 'Chapitre 3 — IPBX Asterisk, Trunks & Dépannage',
    description: 'Mise en œuvre concrète d\'Asterisk, dialplans (pjsip.conf, extensions.conf) et analyse de flux Wireshark.',
    position: 3,
  },

  // Course 2: MPLS
  {
    id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: 'Chapitre 1 — Principes de la Commutation par Étiquettes',
    description: 'Architecture des routeurs LER/LSR, en-tête shim de 32 bits et opérations Push, Swap, Pop, PHP.',
    position: 1,
  },
  {
    id: 'ch200000-0000-4000-8000-000000000002',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: 'Chapitre 2 — Protocole LDP & Tables de Commutation',
    description: 'Distribution des labels avec LDP (RFC 5036), synchronisation IGP-LDP, et structure des tables FIB, LIB, LFIB.',
    position: 2,
  },
  {
    id: 'ch200000-0000-4000-8000-000000000003',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: 'Chapitre 3 — VPN MPLS de Niveau 3 (RFC 4364)',
    description: 'Isolation multi-clients avec VRF, Route Distinguisher (RD), Route Target (RT) et MP-BGP.',
    position: 3,
  },

  // Course 3: OSPF & BGP
  {
    id: 'ch300000-0000-4000-8000-000000000001',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: 'Chapitre 1 — Routage Intra-Domaine : OSPFv2 / OSPFv3',
    description: 'Algorithme SPF de Dijkstra, formation des adjacences, types d\'aires et LSA 1 à 7.',
    position: 1,
  },
  {
    id: 'ch300000-0000-4000-8000-000000000002',
    course_id: 'c3000000-0000-4000-8000-000000000003',
    title: 'Chapitre 2 — Routage Inter-Domaines : BGP-4 & Peering',
    description: 'Table de routage DFZ mondiale, attributs de chemin (Weight, Local_Pref, AS-Path, MED) et filtrage des préfixes.',
    position: 2,
  },

  // Course 4: Network Topology
  {
    id: 'ch400000-0000-4000-8000-000000000001',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: 'Chapitre 1 — La Boucle Locale & L\'Accès Abonnés',
    description: 'Terminaux abonnés, CPE, ONT FTTH GPON/XGS-PON et antennes relais cellulaires.',
    position: 1,
  },
  {
    id: 'ch400000-0000-4000-8000-000000000002',
    course_id: 'c4000000-0000-4000-8000-000000000004',
    title: 'Chapitre 2 — Cœur Opérateur & Interconnexion Mondiale',
    description: 'Agrégation métropolitaine, backbone MPLS, passerelles BNG, transit Tier-1 et Datacenter Cloud.',
    position: 2,
  }
];

export const SEED_LESSONS: Lesson[] = [
  // Course 1 - Chapter 1 (4 lessons)
  {
    id: 'l1000001-0000-4000-8000-000000000001',
    chapter_id: 'ch100000-0000-4000-8000-000000000001',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "1. Qu'est-ce que la VoIP ?",
    description: 'Définition, historique, comparaison RTC commuté (PSTN) vs paquets IP, et bénéfices pour les entreprises.',
    duration_minutes: 15,
    position: 1,
    published: true,
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
    description: 'Les composants clés : terminaux IP Phone, passerelles VoIP (Media Gateway), serveurs IPBX / Registrar et SBC (Session Border Controller).',
    duration_minutes: 20,
    position: 2,
    published: true,
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
    description: 'Transport en temps réel des échantillons de parole (RFC 3550), numérotation de paquets, timestamps et statistiques de gigue avec RTCP.',
    duration_minutes: 20,
    position: 3,
    published: true,
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
    description: 'Théorème de Shannon-Nyquist, quantification PCM, compression vocale MOS (Mean Opinion Score) et calcul du débit réel avec en-têtes IP/UDP/RTP.',
    duration_minutes: 25,
    position: 4,
    published: true,
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

  // Course 1 - Chapter 2 (3 lessons)
  {
    id: 'l1000001-0000-4000-8000-000000000005',
    chapter_id: 'ch100000-0000-4000-8000-000000000002',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "5. L'enregistrement SIP (SIP REGISTER)",
    description: 'Comment le téléphone annonce son adresse IP au Registrar SIP, authentification MD5 Digest et temps d\'expiration (Expires).',
    duration_minutes: 20,
    position: 1,
    published: true,
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
    description: 'Déroulement pas-à-pas de l\'appel : négociation des codecs audio avec SDP, codes 100 Trying, 180 Ringing et validation par ACK.',
    duration_minutes: 25,
    position: 2,
    published: true,
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
    description: 'Fermeture de la session, libération des ressources de bande passante et catalogue des codes 1xx, 2xx, 3xx, 4xx, 5xx et 6xx.',
    duration_minutes: 20,
    position: 3,
    published: true,
    content: `### 7. Terminaison d'appel & Codes de statut SIP

Pour mettre fin à une communication, l'un des deux participants envoie la requête \`BYE\`, à laquelle l'autre répond par \`200 OK\`. Les flux RTP sont alors immédiatement stoppés.

#### Catégories de codes de réponse SIP :
- **1xx (Informationnel)** : \`100 Trying\` (en cours de traitement), \`180 Ringing\` (la sonnerie retentit), \`183 Session Progress\` (tonalité anticipée).
- **2xx (Succès)** : \`200 OK\` (la requête a réussi).
- **3xx (Redirection)** : \`301 Moved Permanently\`, \`302 Moved Temporarily\`.
- **4xx (Erreur Client)** : \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`486 Busy Here\` (occupé).
- **5xx (Erreur Serveur)** : \`500 Server Internal Error\`, \`503 Service Unavailable\`.
- **6xx (Échec Global)** : \`603 Decline\` (refus explicite de l'appel).`
  },

  // Course 1 - Chapter 3 (3 lessons)
  {
    id: 'l1000001-0000-4000-8000-000000000008',
    chapter_id: 'ch100000-0000-4000-8000-000000000003',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "8. Déploiement d'un IPBX Asterisk avec chan_pjsip",
    description: 'Installation d\'Asterisk sur Linux, configuration de pjsip.conf (endpoints, aors, auths) et gestion des extensions.',
    duration_minutes: 30,
    position: 1,
    published: true,
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
    description: 'Syntaxe d\'extensions.conf, règles de routage sortant, SDA (Sélection Directe à l\'Arrivée) et interconnexion avec les opérateurs télécoms.',
    duration_minutes: 25,
    position: 2,
    published: true,
    content: `### 9. Dialplan & Configuration des Trunks SIP Opérateur

Le plan de numérotation (**dialplan**) dans \`/etc/asterisk/extensions.conf\` définit les règles d'acheminement des appels entrants et sortants.

\`\`\`ini
[interne]
; Appel direct entre postes internes (101, 102, 103...)
exten => _1XX,1,NoOp(Appel interne vers \${EXTEN})
 same => n,Dial(PJSIP/\${EXTEN},30)
 same => n,VoiceMail(\${EXTEN}@default,u)
 same => n,Hangup()

; Sortie vers l'extérieur avec préfixe 0 via Trunk Opérateur
exten => _0X.,1,NoOp(Appel externe vers \${EXTEN:1})
 same => n,Set(CALLERID(num)=0188880000)
 same => n,Dial(PJSIP/\${EXTEN:1}@TRUNK-ORANGE-SIP,60)
 same => n,Hangup()
\`\`\``
  },
  {
    id: 'l1000001-0000-4000-8000-000000000010',
    chapter_id: 'ch100000-0000-4000-8000-000000000003',
    course_id: 'c1000000-0000-4000-8000-000000000001',
    title: "10. Dépannage VoIP : Analyse Wireshark, One-Way Audio & NAT",
    description: 'Diagnostiquer les problèmes récurrents : audio unidirectionnel dû au NAT, gigue excessive, perte de paquets et capture de flux SIP avec sngrep.',
    duration_minutes: 25,
    position: 3,
    published: true,
    content: `### 10. Dépannage VoIP avec sngrep & Wireshark

Le problème numéro 1 en VoIP est le **One-Way Audio** (un seul correspondant entend l'autre).

#### Pourquoi le One-Way Audio survient-il ?
Dans la signalisation SIP, le SDP annonce l'adresse IP locale (ex: 192.168.1.50) pour le flux RTP. Si le routeur NAT ne remplace pas cette adresse par l'IP publique ou si les ports UDP RTP (10000 à 20000) sont bloqués sur le pare-feu distant, les paquets audio sont routés vers le néant.

#### Outil d'analyse recommandé en ligne de commande : \`sngrep\`
\`\`\`bash
# Capture en temps réel de tous les dialogues SIP
sngrep -d eth0 port 5060

# Analyse détaillée de flux RTP avec Wireshark :
# Menu Telephony > VoIP Calls > Flow Sequence & RTP Player
\`\`\``
  },

  // Course 2 - MPLS (8 lessons)
  {
    id: 'l2000001-0000-4000-8000-000000000001',
    chapter_id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "1. Limites du routage IP traditionnel & Genèse de MPLS",
    description: 'Pourquoi le "longest-prefix match" IP était trop lourd pour les backbones opérateurs et comment MPLS a révolutionné le transport.',
    duration_minutes: 20,
    position: 1,
    published: true,
    content: `### 1. Limites du routage IP & Origine de MPLS

Dans le routage IP classique, chaque routeur intermédiaire (hop-by-hop) doit :
1. Consulter sa table de routage complète (RIB/FIB).
2. Effectuer une recherche de plus long préfixe (Longest Prefix Match).
3. Décrémenter le TTL et recalculer le checksum IP.

Dans les années 90, cela créait un goulot d'étranglement majeur sur les cœurs de réseau. **MPLS (Multi-Protocol Label Switching)** a apporté la commutation par étiquette : le premier routeur de bordure (LER) inspecte le paquet une seule fois et lui colle une étiquette numérique de 20 bits. Les routeurs de cœur (LSR) se contentent de lire cette étiquette en hardware ultrarapide.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000002',
    chapter_id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "2. Structure de l'en-tête MPLS (Shim Header)",
    description: 'Les 32 bits de l\'en-tête shim : Label (20 bits), Traffic Class / Exp (3 bits), Bottom of Stack (1 bit), TTL (8 bits).',
    duration_minutes: 20,
    position: 2,
    published: true,
    content: `### 2. Anatomie de l'en-tête MPLS (32 bits)

L'en-tête MPLS est inséré entre la couche 2 (Ethernet) et la couche 3 (IPv4/IPv6), d'où son surnom de couche **2.5**.

\`\`\`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                Label (20 bits)                | TC  |S|  TTL  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
\`\`\`

- **Label (20 bits)** : valeur numérique entre 0 et 1 048 575 (les valeurs 0 à 15 sont réservées).
- **Traffic Class (TC / EXP - 3 bits)** : utilisé pour la qualité de service (QoS / DiffServ EXP mapping).
- **Bottom of Stack (S - 1 bit)** : vaut 1 s'il s'agit de la dernière étiquette de la pile, 0 si d'autres étiquettes suivent (ex: VPN label).
- **TTL (Time to Live - 8 bits)** : décrémenté à chaque saut pour éviter les boucles.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000003',
    chapter_id: 'ch200000-0000-4000-8000-000000000001',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "3. Les 4 opérations MPLS : Push, Swap, Pop & PHP",
    description: 'Fonctionnement détaillé de l\'imposition d\'étiquette, de la permutation en cœur de réseau et du Penultimate Hop Popping.',
    duration_minutes: 25,
    position: 3,
    published: true,
    content: `### 3. Les 4 opérations MPLS : Push, Swap, Pop & PHP

\`\`\`
[ Ingress PE ] ──Push 100──> [ P1 ] ──Swap 200──> [ P2 (PHP) ] ──Pop (IP Pur)──> [ Egress PE ]
\`\`\`

1. **PUSH (Imposition)** : Ajout d'une ou plusieurs étiquettes en tête de paquet par le routeur d'entrée (Ingress PE).
2. **SWAP (Permutation)** : Remplacement de l'étiquette d'entrée par une nouvelle étiquette de sortie par un routeur intermédiaire (P Router).
3. **POP (Disposition)** : Retrait de l'étiquette supérieure.
4. **PHP (Penultimate Hop Popping - Label 3)** : Le routeur avant-dernier retire l'étiquette transport pour éviter que le routeur de sortie ne doive faire deux lectures consécutives (MPLS puis IP).`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000004',
    chapter_id: 'ch200000-0000-4000-8000-000000000002',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "4. Le protocole LDP (Label Distribution Protocol)",
    description: 'Établissement des sessions LDP (port TCP 646), messages Hello UDP 646 et mise en correspondance des préfixes IGP (OSPF/IS-IS).',
    duration_minutes: 25,
    position: 1,
    published: true,
    content: `### 4. Le protocole LDP (RFC 5036)

LDP permet aux routeurs MPLS de s'annoncer mutuellement quelles étiquettes ils attribuent à chaque préfixe réseau découvert par le protocole de routage interne (IGP comme OSPF ou IS-IS).

#### Processus en deux phases :
1. **Découverte des voisins** : Émission de paquets \`Hello LDP\` en broadcast/multicast sur l'adresse \`224.0.0.2\` en port **UDP 646**.
2. **Session de transport de labels** : Établissement d'une connexion fiable en port **TCP 646** entre les LDP Router IDs.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000005',
    chapter_id: 'ch200000-0000-4000-8000-000000000002',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "5. Les tables FIB, LIB & LFIB",
    description: 'Comprendre la différence entre la Forwarding Information Base, la Label Information Base et la Label Forwarding Information Base.',
    duration_minutes: 20,
    position: 2,
    published: true,
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
    description: 'Virtual Routing and Forwarding pour étanchéifier les tables d\'adresses clients et résoudre les chevauchements d\'adresses RFC 1918 (ex: 10.0.0.0/8).',
    duration_minutes: 30,
    position: 1,
    published: true,
    content: `### 6. VRF, Route Distinguisher (RD) & Route Target (RT)

Pour permettre à plusieurs entreprises clientes (Client A et Client B) d'utiliser les mêmes plages d'adresses privées (ex: 192.168.1.0/24) sur le même routeur opérateur sans aucun conflit, on utilise les **VRF (Virtual Routing and Forwarding)**.

- **Route Distinguisher (RD - 64 bits)** : préfixé à l'adresse IPv4 (32 bits) pour créer une adresse VPN-IPv4 unique de 96 bits (ex: \`65000:10:192.168.1.0/24\`).
- **Route Target (RT - Community BGP)** : définit la politique d'importation et d'exportation des routes entre les VRF.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000007',
    chapter_id: 'ch200000-0000-4000-8000-000000000003',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "7. MP-BGP (Multi-Protocol BGP) pour la distribution VPNv4",
    description: 'L\'extension MP-BGP (RFC 4760) pour transporter les routes VPNv4 entre les routeurs PE du réseau opérateur.',
    duration_minutes: 25,
    position: 2,
    published: true,
    content: `### 7. MP-BGP pour la distribution des routes VPNv4

Le protocole BGP standard ne comprend que l'IPv4 unicast. L'extension **MP-BGP (Multi-Protocol BGP)** introduit les Address Families (AFI 1 / SAFI 128 pour VPN-IPv4).

Les routeurs de bordure (PE) établissent une session iBGP en VPNv4 pour échanger les préfixes clients et attribuer le **Label VPN (étiquette intérieure)** qui identifiera la VRF de destination.`
  },
  {
    id: 'l2000001-0000-4000-8000-000000000008',
    chapter_id: 'ch200000-0000-4000-8000-000000000003',
    course_id: 'c2000000-0000-4000-8000-000000000002',
    title: "8. Acheminement du paquet avec la pile de labels MPLS (2 labels)",
    description: 'Analyse du paquet complet dans le cœur : Label Transport (LDP) à l\'extérieur + Label VPN (MP-BGP) à l\'intérieur.',
    duration_minutes: 25,
    position: 3,
    published: true,
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
