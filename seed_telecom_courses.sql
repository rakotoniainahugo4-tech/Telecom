-- ============================================================
-- SCRIPT D'INITIALISATION IDEMPOTENT DU CATALOGUE TELECOM LAB
-- 6 Formations Fondamentales & Professionnelles
-- Compatible Supabase PostgreSQL (sans DROP TABLE, sans suppression)
-- ============================================================

-- 1. INSERTION / MISE À JOUR IDEMPOTENTE DES 6 FORMATIONS DANS public.courses
INSERT INTO public.courses (
  id,
  title,
  slug,
  description,
  category,
  difficulty,
  badge,
  published,
  estimated_hours,
  total_hours,
  thumbnail_url
) VALUES
(
  'c3000000-0000-4000-8000-000000000003',
  'Ingénierie IP & Routage Avancé',
  'ingenierie-ip-routage-avance',
  'Maîtriser les architectures IP modernes et les protocoles de routage utilisés dans les réseaux d''entreprise et opérateurs.',
  'Réseaux IP',
  'Avancé',
  'ROUTAGE AVANCÉ',
  true,
  32,
  32,
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
),
(
  'c2000000-0000-4000-8000-000000000002',
  'Architectures IP/MPLS & L3VPN / L2VPN',
  'architectures-ip-mpls-l3vpn-l2vpn',
  'Comprendre et configurer les architectures MPLS utilisées dans les réseaux opérateurs.',
  'MPLS / Réseaux opérateurs',
  'Avancé',
  'CŒUR DE RÉSEAU',
  true,
  25,
  25,
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80'
),
(
  'c1000000-0000-4000-8000-000000000001',
  'Téléphonie IP, VoIP & Asterisk / FreePBX',
  'telephonie-ip-voip-asterisk-freepbx',
  'Comprendre et mettre en œuvre des solutions de téléphonie IP professionnelles.',
  'VoIP',
  'Intermédiaire',
  'VOIX SUR IP',
  true,
  20,
  20,
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
),
(
  'c4000000-0000-4000-8000-000000000004',
  'Réseaux Mobiles & Cellulaires',
  'reseaux-mobiles-cellulaires',
  'Comprendre l''évolution des réseaux mobiles de la 2G à la 5G.',
  'Téléphonie mobile',
  'Intermédiaire',
  'CELLULAIRE & 5G',
  true,
  28,
  28,
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80'
),
(
  'c5000000-0000-4000-8000-000000000005',
  'Transmission & Fibre Optique',
  'transmission-fibre-optique',
  'Maîtriser les principes de transmission télécom, fibre optique et faisceaux hertziens.',
  'Transmission',
  'Intermédiaire',
  'FIBRE & TRANSPORT',
  true,
  24,
  24,
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
),
(
  'c6000000-0000-4000-8000-000000000006',
  'Automation Réseau & Linux pour Ingénieurs',
  'automation-reseau-linux-ingenieurs',
  'Automatiser les tâches réseau et maîtriser les outils Linux utilisés dans les infrastructures modernes.',
  'Automation / DevOps',
  'Intermédiaire',
  'NETDEVOPS & PYTHON',
  true,
  22,
  22,
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  badge = EXCLUDED.badge,
  published = EXCLUDED.published,
  estimated_hours = EXCLUDED.estimated_hours,
  total_hours = EXCLUDED.total_hours,
  thumbnail_url = EXCLUDED.thumbnail_url;

-- 2. INSERTION IDEMPOTENTE DES CHAPITRES (S'ils n'existent pas déjà)
INSERT INTO public.chapters (id, course_id, title, description, position)
VALUES
-- VoIP
('ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', 'Chapitre 1 — Introduction à la VoIP & Fondations', 'Principes de la numérisation de la voix et éléments de base.', 1),
('ch100000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', 'Chapitre 2 — Protocole SIP & Échanges de Signalisation', 'Analyse approfondie de la RFC 3261 : requêtes REGISTER, INVITE, ACK, BYE.', 2),
('ch100000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000001', 'Chapitre 3 — IPBX Asterisk, Trunks & Dépannage', 'Mise en œuvre concrète d''Asterisk, dialplans et analyse Wireshark.', 3),
-- MPLS
('ch200000-0000-4000-8000-000000000001', 'c2000000-0000-4000-8000-000000000002', 'Chapitre 1 — Fondations de la Commutation d''Étiquettes MPLS', 'En-tête Shim 32 bits, label stack, opérations Push/Swap/Pop et PHP.', 1),
('ch200000-0000-4000-8000-000000000002', 'c2000000-0000-4000-8000-000000000002', 'Chapitre 2 — Protocole LDP & Distribution des Labels', 'Sessions LDP TCP port 646, base LIB, LFIB et convergence.', 2),
('ch200000-0000-4000-8000-000000000003', 'c2000000-0000-4000-8000-000000000002', 'Chapitre 3 — Services VPN de Niveau 3 (BGP/MPLS L3VPN)', 'VRF, Route Distinguisher (RD), Route Target (RT) et sessions MP-BGP VPNv4.', 3),
-- IP & Routage
('ch300000-0000-4000-8000-000000000010', 'c3000000-0000-4000-8000-000000000003', 'Chapitre 1 — Routage IGP Avancé : OSPF Multi-Aires & IS-IS Opérateur', 'Mécanismes internes d''OSPF (LSA 1 à 7, types d''aires) et comparaison avec IS-IS.', 1),
('ch300000-0000-4000-8000-000000000020', 'c3000000-0000-4000-8000-000000000003', 'Chapitre 2 — BGP-4 : Le Protocole Inter-Domaines de l''Internet Mondial', 'Sessions eBGP vs iBGP, Route Reflectors, attributs de chemin et filtrage.', 2),
('ch300000-0000-4000-8000-000000000030', 'c3000000-0000-4000-8000-000000000003', 'Chapitre 3 — Architecture IPv6, NDP, OSPFv3 & MP-BGP', 'Adressage 128 bits, Neighbor Discovery Protocol, auto-configuration SLAAC et routage.', 3),
-- Mobiles 4G/5G
('ch400000-0000-4000-8000-000000000001', 'c4000000-0000-4000-8000-000000000004', 'Chapitre 1 — Principes Cellulaires & Évolution de la 2G à la 4G LTE', 'Structure cellulaire, réutilisation de fréquences, E-UTRAN et cœur EPC.', 1),
('ch400000-0000-4000-8000-000000000002', 'c4000000-0000-4000-8000-000000000004', 'Chapitre 2 — 5G New Radio (NR) & Architecture Radio Avancée', 'Spectre FR1/FR2, Massive MIMO 64T64R, Beamforming et options NSA/SA.', 2),
('ch400000-0000-4000-8000-000000000003', 'c4000000-0000-4000-8000-000000000004', 'Chapitre 3 — Cœur de Réseau 5GC (SBA) & Network Slicing', 'Architecture SBA, fonctions AMF, SMF, UPF et découpage logique eMBB/URLLC.', 3),
-- Fibre & Transmission
('ch500000-0000-4000-8000-000000000001', 'c5000000-0000-4000-8000-000000000005', 'Chapitre 1 — La Fibre Optique & Boucle Locale FTTH (GPON / XGS-PON)', 'Fibres monomodes G.652/G.657, architecture PON, OLT et splitters optiques.', 1),
('ch500000-0000-4000-8000-000000000002', 'c5000000-0000-4000-8000-000000000005', 'Chapitre 2 — Ingénierie Quick ODN, Bilan Optique & Réflectométrie OTDR', 'Solutions pré-connectarisées Plug-and-Play, budget optique et traces OTDR.', 2),
('ch500000-0000-4000-8000-000000000003', 'c5000000-0000-4000-8000-000000000005', 'Chapitre 3 — Multiplexage Optique WDM & Faisceaux Hertziens (FH)', 'Systèmes DWDM multi-canaux et liaisons radio FH point-à-point.', 3),
-- Automation
('ch600000-0000-4000-8000-000000000001', 'c6000000-0000-4000-8000-000000000006', 'Chapitre 1 — Linux Avancé pour l''Ingénieur Réseau', 'Pile réseau Linux : iproute2, network namespaces et filtrage nftables.', 1),
('ch600000-0000-4000-8000-000000000002', 'c6000000-0000-4000-8000-000000000006', 'Chapitre 2 — Automatisation Python & Playbooks Ansible', 'Netmiko, templates Jinja2, YAML et orchestration idempotente Ansible.', 2),
('ch600000-0000-4000-8000-000000000003', 'c6000000-0000-4000-8000-000000000006', 'Chapitre 3 — Modèles YANG, NETCONF/RESTCONF & Docker Containerlab', 'Modélisation YANG standardisée, APIs RESTCONF et émulation sous conteneurs.', 3)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position;

-- 3. INSERTION IDEMPOTENTE DES LEÇONS INITIALES
INSERT INTO public.lessons (id, chapter_id, course_id, title, description, duration_minutes, position, published)
VALUES
-- VoIP
('l1000001-0000-4000-8000-000000000001', 'ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '1. Qu''est-ce que la VoIP ?', 'Définition, historique, comparaison RTC vs paquets IP.', 15, 1, true),
('l1000001-0000-4000-8000-000000000002', 'ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '2. Architecture globale d''un réseau VoIP', 'Les composants clés : IP Phone, passerelles, IPBX et SBC.', 20, 2, true),
('l1000001-0000-4000-8000-000000000003', 'ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '3. Le protocole RTP & RTCP pour le transport multimédia', 'Transport en temps réel des échantillons de parole (RFC 3550).', 20, 3, true),
('l1000001-0000-4000-8000-000000000005', 'ch100000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', '5. L''enregistrement SIP (SIP REGISTER)', 'Annonce au Registrar SIP et authentification MD5 Digest.', 20, 1, true),
('l1000001-0000-4000-8000-000000000006', 'ch100000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', '6. Établissement d''un appel : SIP INVITE, SDP & ACK', 'Déroulement pas-à-pas de l''appel et négociation des codecs audio.', 25, 2, true),
-- IP Routing
('l3000001-0000-4000-8000-000000000011', 'ch300000-0000-4000-8000-000000000010', 'c3000000-0000-4000-8000-000000000003', '1. OSPFv2 Approfondi : Algorithme SPF & Adjacences', 'États d''adjacence, élection DR/BDR et types de réseau.', 25, 1, true),
('l3000001-0000-4000-8000-000000000014', 'ch300000-0000-4000-8000-000000000010', 'c3000000-0000-4000-8000-000000000003', '4. IS-IS Opérateur : Niveaux L1/L2 & Encodage TLV', 'Fonctionnement du protocole IS-IS couche 2 et adressage NSAP.', 30, 4, true),
('l3000001-0000-4000-8000-000000000021', 'ch300000-0000-4000-8000-000000000020', 'c3000000-0000-4000-8000-000000000003', '5. Fondations BGP-4 : Sessions eBGP, iBGP & FSM', 'Établissement des sessions TCP 179 et split-horizon iBGP.', 30, 1, true),
('l3000001-0000-4000-8000-000000000031', 'ch300000-0000-4000-8000-000000000030', 'c3000000-0000-4000-8000-000000000003', '8. En-tête IPv6 & Adressage Link-Local', 'Format fixe à 40 octets, préfixes et rôle de l''adresse fe80::.', 25, 1, true),
-- MPLS
('l2000001-0000-4000-8000-000000000001', 'ch200000-0000-4000-8000-000000000001', 'c2000000-0000-4000-8000-000000000002', '1. En-tête Shim MPLS 32 bits & Label Stack', 'Structure du label, champ Traffic Class (EXP), Bottom of Stack (S) et TTL.', 25, 1, true),
('l2000001-0000-4000-8000-000000000002', 'ch200000-0000-4000-8000-000000000001', 'c2000000-0000-4000-8000-000000000002', '2. Opérations Push, Swap, Pop & PHP', 'Commutation de labels et mécanisme Penultimate Hop Popping.', 30, 2, true),
('l2000001-0000-4000-8000-000000000004', 'ch200000-0000-4000-8000-000000000002', 'c2000000-0000-4000-8000-000000000002', '4. Protocole LDP (Label Distribution Protocol)', 'Sessions LDP TCP port 646, base LIB, LFIB et convergence.', 30, 1, true),
('l2000001-0000-4000-8000-000000000007', 'ch200000-0000-4000-8000-000000000003', 'c2000000-0000-4000-8000-000000000002', '7. Architecture BGP/MPLS L3VPN & VRF', 'Virtual Routing and Forwarding, Route Distinguisher et Route Target.', 35, 1, true),
-- Mobiles
('l4000001-0000-4000-8000-000000000001', 'ch400000-0000-4000-8000-000000000001', 'c4000000-0000-4000-8000-000000000004', '1. Principes des réseaux cellulaires & Handover', 'Topologie en nid d''abeille et handover intercellulaire.', 25, 1, true),
('l4000001-0000-4000-8000-000000000004', 'ch400000-0000-4000-8000-000000000002', 'c4000000-0000-4000-8000-000000000004', '4. 5G New Radio : Bandes FR1/FR2 & Numérologie', 'Spectre Sub-6GHz vs mmWave et espacement sous-porteuses flexible.', 35, 1, true),
('l4000001-0000-4000-8000-000000000007', 'ch400000-0000-4000-8000-000000000003', 'c4000000-0000-4000-8000-000000000004', '7. Architecture 5GC Service-Based Architecture (SBA)', 'Microservices AMF, SMF, UPF sur HTTP/2 REST.', 30, 1, true),
-- Fibre
('l5000001-0000-4000-8000-000000000001', 'ch500000-0000-4000-8000-000000000001', 'c5000000-0000-4000-8000-000000000005', '1. Principes physiques de la fibre optique & Normes ITU-T', 'Fibres monomodes G.652.D/G.657 et connectique SC/APC.', 25, 1, true),
('l5000001-0000-4000-8000-000000000004', 'ch500000-0000-4000-8000-000000000002', 'c5000000-0000-4000-8000-000000000005', '4. Technologie Quick ODN : La Révolution Pré-connectarisée', 'Déploiement Plug-and-Play sans soudures terrain.', 30, 1, true),
('l5000001-0000-4000-8000-000000000005', 'ch500000-0000-4000-8000-000000000002', 'c5000000-0000-4000-8000-000000000005', '5. Calcul du Bilan de Liaison Optique', 'Puissance d''émission, pertes splitters et budget de marge.', 30, 2, true),
-- Automation
('l6000001-0000-4000-8000-000000000001', 'ch600000-0000-4000-8000-000000000001', 'c6000000-0000-4000-8000-000000000006', '1. Pile réseau Linux : iproute2 & Socket Statistics', 'Commandes ip, ss et forwarding IP du noyau.', 25, 1, true),
('l6000001-0000-4000-8000-000000000004', 'ch600000-0000-4000-8000-000000000002', 'c6000000-0000-4000-8000-000000000006', '4. Automatisation SSH avec Python : Netmiko & Scrapli', 'Scripts Python pour administration massive de routeurs.', 35, 1, true),
('l6000001-0000-4000-8000-000000000006', 'ch600000-0000-4000-8000-000000000002', 'c6000000-0000-4000-8000-000000000006', '6. Déploiement Idempotent avec Ansible', 'Playbooks, templates Jinja2 et modules cisco.ios.', 30, 3, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  position = EXCLUDED.position;
