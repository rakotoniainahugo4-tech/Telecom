import { Course, Chapter, Lesson } from '../../types/learning';

export const FIBER_TRANSMISSION_COURSE: Course = {
  id: 'c5000000-0000-4000-8000-000000000005',
  title: 'Transmission & Fibre Optique',
  slug: 'transmission-fibre-optique',
  description: 'Maîtriser les principes de transmission télécom, fibre optique et faisceaux hertziens.',
  full_description: `La couche physique de transport constitue l'épine dorsale des réseaux télécoms mondiaux. Cette formation technique approfondie forme les ingénieurs et techniciens aux technologies de pointe de la transmission :
- **Boucle Locale Optique FTTH (Fiber to the Home)** : architecture point-à-multipoint PON, coupleurs optiques passifs (Splitters), normes ITU-T G.984 (GPON) et G.9807.1 (XGS-PON symétrique à 10 Gbps).
- **Déploiement Moderne Quick ODN** : méthodes de pré-connectarisation Plug-and-Play, boîtiers étanches d'épissure (BPI/PBO), suppression des soudures sur le terrain et gain de productivité.
- **Multiplexage en Longueurs d'Onde (WDM)** : CWDM métropolitain, DWDM à 80+ canaux, amplificateurs optiques EDFA, transpondeurs et optiques cohérentes 400ZR/800G.
- **Bilan de Liaison Optique & Réflectométrie (OTDR)** : calcul d'atténuation (dB/km), pertes par connecteur/épissure, mesure de la réflectance (ORL) et interprétation experte des courbes de réflectométrie.
- **Faisceaux Hertziens Micro-ondes (FH)** : transport radio point-à-point pour le backhaul mobile, modulations d'amplitude en quadrature (QAM jusqu'à 4096-QAM), zone de Fresnel et calcul du bilan de liaison radio.`,
  category: 'Transmission',
  difficulty: 'Intermédiaire',
  badge: 'FIBRE & TRANSPORT',
  published: true,
  estimated_hours: 24,
  total_hours: 24,
  chapters_count: 3,
  lessons_count: 9,
  rating: 4.9,
  reviews_count: 98,
  thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  prerequisites: [
    'Notions de base en physique (ondes électromagnétiques, décibels dB et dBm).',
    'Familiarité avec les principes généraux des réseaux informatiques.'
  ],
  objectives: [
    'Concevoir une architecture FTTH arborescente GPON et XGS-PON avec coupleurs optiques.',
    'Maîtriser les spécifications des fibres monomodes ITU-T G.652.D et G.657 (insensibles aux courbures).',
    'Calculer avec précision le bilan de puissance optique d\'une liaison de l\'OLT à l\'ONT.',
    'Analyser les traces OTDR pour localiser une coupure ou une contrainte physique sur la fibre.',
    'Dimensionner un lien FH micro-onde avec dégagement de la 1ère zone de Fresnel.'
  ],
  skills_acquired: [
    'Dimensionnement de réseaux d\'accès optique FTTH / ODN',
    'Méthodologie Quick ODN (pré-connectarisation terrain)',
    'Calculs de bilans de liaison optique et budget de pertes (dB)',
    'Mesures et diagnostic par réflectométrie optique (OTDR)',
    'Multiplexage en longueur d\'onde CWDM et DWDM opérateur',
    'Ingénierie des liaisons faisceaux hertziens micro-ondes'
  ],
  created_at: '2026-01-22T10:00:00Z',
  updated_at: '2026-01-22T10:00:00Z',
};

export const FIBER_TRANSMISSION_CHAPTERS: Chapter[] = [
  {
    id: 'ch500000-0000-4000-8000-000000000001',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    chapter_number: 1,
    title: 'Chapitre 1 — La Fibre Optique & Boucle Locale FTTH (GPON / XGS-PON)',
    description: 'Propagation de la lumière, fibres monomodes G.652/G.657, architecture PON, OLT, ONT et coupleurs passifs.',
    objectives: [
      'Différencier fibre monomode (SMF) et multimode (MMF).',
      'Comprendre la structure d\'un arbre PON et le multiplexage temporel TDMA voie montante.',
      'Comparer les longueurs d\'onde GPON (1310/1490nm) et XGS-PON (1270/1577nm).'
    ],
    duration_minutes: 80,
    lessons_count: 3,
    position: 1,
    created_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'ch500000-0000-4000-8000-000000000002',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    chapter_number: 2,
    title: 'Chapitre 2 — Ingénierie Quick ODN, Bilan Optique & Réflectométrie OTDR',
    description: 'Solutions Plug-and-Play Quick ODN, calcul du budget de liaison (dBm) et analyse des événements OTDR.',
    objectives: [
      'Appliquer les technologies Quick ODN pour accélérer le déploiement sur poteaux ou façades.',
      'Effectuer un calcul complet de budget optique tenant compte des marges de sécurité.',
      'Identifier les connecteurs, soudures et fins de fibre sur une trace OTDR.'
    ],
    duration_minutes: 90,
    lessons_count: 3,
    position: 2,
    created_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'ch500000-0000-4000-8000-000000000003',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    chapter_number: 3,
    title: 'Chapitre 3 — Multiplexage Optique WDM & Faisceaux Hertziens (FH)',
    description: 'Systèmes CWDM/DWDM, transpondeurs cohérents, et liaisons hertziennes micro-ondes pour le backhaul.',
    objectives: [
      'Comprendre la grille ITU des fréquences DWDM à espacement de 50 GHz et 100 GHz.',
      'Expliquer l\'amplification optique EDFA sans régénération électrique.',
      'Calculer le dégagement de la zone de Fresnel et l\'atténuation pluie sur un lien FH.'
    ],
    duration_minutes: 85,
    lessons_count: 3,
    position: 3,
    created_at: '2026-01-22T10:00:00Z',
  },
];

export const FIBER_TRANSMISSION_LESSONS: Lesson[] = [
  {
    id: 'l5000001-0000-4000-8000-000000000001',
    chapter_id: 'ch500000-0000-4000-8000-000000000001',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '1. Principes physiques de la fibre optique & Normes ITU-T',
    slug: 'physique-fibre-optique-normes',
    description: 'Réflexion totale interne, indice de réfraction, cœur de 9 µm, gaine de 125 µm, normes G.652.D et G.657.A2.',
    duration_minutes: 25,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'La fibre monomode standard G.652.D possède une atténuation de ~0.35 dB/km à 1310 nm et ~0.20 dB/km à 1550 nm.',
      'La norme G.657 (insensible aux courbures) autorise un rayon de courbure réduit (jusqu\'à 7.5 mm) indispensable dans les logements abonnés.',
      'Les connecteurs SC/APC à angle de 8° minimisent la réflectance (ORL > 60 dB).'
    ],
    summary: 'La fibre monomode transporte la lumière sur des dizaines de kilomètres avec une atténuation infime comparée au cuivre.',
    has_exercise: true,
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000002',
    chapter_id: 'ch500000-0000-4000-8000-000000000001',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '2. Architecture FTTH : Topologie PON, OLT, Splitters & ONT',
    slug: 'ftth-architecture-pon',
    description: 'Arborescence point-à-multipoint : NRO, baie OLT, câble de transport, Point de Mutualisation (PM), Point de Branchement Optique (PBO) et Prise Terminale Optique (PTO).',
    duration_minutes: 25,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'Une seule fibre en sortie d\'OLT dessert 32, 64 ou 128 abonnés via des coupleurs optiques passifs sans aucune alimentation électrique intermédiaire.',
      'Voie descendante (Downstream) : diffusion broadcast continue avec chiffrement AES.',
      'Voie montante (Upstream) : accès partagé TDMA contrôlé par l\'OLT via des allocations de tranches de temps (Dynamic Bandwidth Allocation - DBA).'
    ],
    summary: 'Le réseau PON élimine tous les équipements actifs intermédiaires entre le central opérateur et l\'abonné.',
    has_lab: true,
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000003',
    chapter_id: 'ch500000-0000-4000-8000-000000000001',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '3. Coexistence GPON & XGS-PON (10G Symétrique) avec filtres WDM1r',
    slug: 'gpon-xgpson-coexistence',
    description: 'Comment injecter simultanément les services GPON (2.5G/1.25G) et XGS-PON (10G/10G) sur la même fibre existante via un filtre WDM1r.',
    duration_minutes: 30,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'GPON utilise 1490 nm (down) et 1310 nm (up).',
      'XGS-PON utilise 1577 nm (down) et 1270 nm (up).',
      'L\'écart spectral permet une coexistence transparente sur le même arbre PON sans coupure de service pour les abonnés existants.'
    ],
    summary: 'XGS-PON multiplie par 4 la capacité descendante et par 8 la capacité montante sur la même infrastructure fibre.',
    has_quiz: true,
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000004',
    chapter_id: 'ch500000-0000-4000-8000-000000000002',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '4. Technologie Quick ODN : La Révolution Pré-connectarisée',
    slug: 'quick-odn-preconnectarise',
    description: 'Suppression des soudures par fusion sur le terrain grâce à des connecteurs renforcés étanches IP68, des boîtiers hub et des splitters inégaux.',
    duration_minutes: 30,
    position: 1,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'Le Quick ODN remplace le soudage traditionnel par des connexions quart-de-tour étanches (ex: Huawei FastConnect, Corning OptiTap).',
      'Les splitters inégaux (asymmetric splitters 85/15, 70/30) permettent une distribution en guirlande linéaire avec une seule fibre.',
      'Réduction du temps d\'installation d\'un raccordement de 60% et élimination des erreurs de soudeuse.'
    ],
    summary: 'La pré-connectarisation industrielle transforme le génie civil fibre en un assemblage Plug-and-Play fiable et rapide.',
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000005',
    chapter_id: 'ch500000-0000-4000-8000-000000000002',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '5. Calcul du Bilan de Liaison Optique (Optical Power Budget)',
    slug: 'bilan-liaison-optique-budget',
    description: 'Méthodologie de calcul rigoureuse : puissance d\'émission SFP (dBm), atténuation linéique, pertes par épissure (0.05 dB), perte par connecteur (0.3 dB), perte des coupleurs (3.5 dB par étage 1:2) et sensibilité de réception.',
    duration_minutes: 30,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'Formule : Perte totale = (L × $\\alpha$) + (N_soudures × 0.05) + (N_connecteurs × 0.3) + Perte_Splitters + Marge_Vieillissement (3 dB).',
      'Un coupleur 1:8 introduit ~10.5 dB de perte théorique, un 1:16 ~14 dB, un 1:32 ~17.5 dB.',
      'La classe optique GPON B+ autorise un budget de 28 dB, la classe C+ de 32 dB.'
    ],
    summary: 'Le respect du budget optique garantit que la puissance reçue par l\'ONT se situe toujours dans la plage de sensibilité utile.',
    has_exercise: true,
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000006',
    chapter_id: 'ch500000-0000-4000-8000-000000000002',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '6. Diagnostic par Réflectométrie Optique (OTDR)',
    slug: 'diagnostic-reflectometrie-otdr',
    description: 'Injection d\'impulsions laser Rayleigh et mesure de la rétrodiffusion : zones mortes d\'événement et d\'atténuation, identification des micro-courbures et des épissures défectueuses.',
    duration_minutes: 30,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'Un événement réflexif (pic vers le haut) correspond à un connecteur ou une coupure franche air-verre.',
      'Un événement non réflexif (marche descendante sans pic) correspond à une soudure ou une macro-courbure.',
      'L\'utilisation d\'une bobine amorce de 500m ou 1000m est obligatoire pour caractériser le premier connecteur.'
    ],
    summary: 'L\'OTDR est l\'instrument incontournable pour certifier une liaison optique et localiser un défaut au mètre près.',
    has_lab: true,
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000007',
    chapter_id: 'ch500000-0000-4000-8000-000000000003',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '7. Multiplexage en Longueurs d\'Onde : CWDM & DWDM Opérateur',
    slug: 'cwdm-dwdm-multiplexage',
    description: 'Transmission de dizaines de flux de données indépendants sur une seule paire de fibres : CWDM (espacement 20 nm) vs DWDM (espacement dense 0.8 nm / 100 GHz).',
    duration_minutes: 30,
    position: 1,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'CWDM permet jusqu\'à 18 canaux dans la fenêtre 1270-1610 nm sans refroidissement laser complexe.',
      'DWDM dans la bande C (1530-1565 nm) permet 80 à 96 longueurs d\'onde multiplexées, totalisant des dizaines de térabits par seconde.',
      'Les ROADM (Reconfigurable Optical Add-Drop Multiplexer) permettent de router optiquement les longueurs d\'onde sans conversion électronique.'
    ],
    summary: 'Le DWDM est la technologie fondamentale des cœurs de réseau régionaux, nationaux et des câbles sous-marins.',
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000008',
    chapter_id: 'ch500000-0000-4000-8000-000000000003',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '8. Faisceaux Hertziens Micro-ondes (FH) pour Backhaul Télécom',
    slug: 'faisceaux-hertziens-backhaul',
    description: 'Liaisons radio point-à-point directives (6 GHz à 80 GHz bande E) pour interconnecter des stations de base cellulaires isolées : modulations adaptatives et bandes de fréquences.',
    duration_minutes: 25,
    position: 2,
    published: true,
    technical_level: 'Intermédiaire',
    key_points: [
      'Les FH sont la solution idéale quand le déploiement physique de fibre est impossible ou trop coûteux (montagne, traversée de fleuve).',
      'La bande E (71-86 GHz) permet des débits de 10 Gbps à 20 Gbps sur de courtes distances (1 à 3 km).',
      'L\'Adaptive Modulation and Coding (AMC) bascule dynamiquement de 4096-QAM par temps clair vers QPSK sous forte pluie pour éviter la coupure.'
    ],
    summary: 'Le faisceau hertzien IP moderne rivalise avec la fibre sur les courtes distances pour le raccordement rapide de sites mobiles.',
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'l5000001-0000-4000-8000-000000000009',
    chapter_id: 'ch500000-0000-4000-8000-000000000003',
    course_id: 'c5000000-0000-4000-8000-000000000005',
    title: '9. Ingénierie FH : Zone de Fresnel & Évanouissements par Pluie',
    slug: 'fresnel-fading-fh',
    description: 'Calcul géométrique de l\'ellipsoïde de Fresnel, hauteur de pylône requise, marge de fading ITU-R P.530 et atténuation atmosphérique.',
    duration_minutes: 30,
    position: 3,
    published: true,
    technical_level: 'Avancé',
    key_points: [
      'La première zone de Fresnel doit être dégagée d\'au moins 60% (idéalement 100%) de tout obstacle (arbres, bâtiments, sol).',
      'Formule au milieu du lien : $R_1 = 17.32 \\times \\sqrt{D / (4 \\times f)}$ avec $D$ en km et $f$ en GHz.',
      'La pluie est le facteur d\'atténuation prépondérant au-delà de 10 GHz : une marge de fading de 30 dB garantit une disponibilité de 99.999% ("cinq neuf").'
    ],
    summary: 'Le respect du dégagement de Fresnel et de la marge de fading assure la haute disponibilité requise par les opérateurs télécoms.',
    has_quiz: true,
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
  }
];
