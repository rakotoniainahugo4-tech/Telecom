-- ====================================================================
-- TELECOM LAB : Schéma PostgreSQL Complet pour l'Apprentissage E-Learning
-- Architecture Professionnelle : Formation -> Chapitres -> Leçons -> Vidéos/Écrit -> Quiz -> Exercices -> Labs -> Projets -> Progression
-- Compatible Supabase SQL Editor (RLS stricte sur auth.uid())
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE COURSES (Formations complètes)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    full_description TEXT,
    category TEXT DEFAULT 'TELECOM ACADEMY',
    difficulty TEXT DEFAULT 'Intermédiaire', -- Débutant, Intermédiaire, Avancé, Expert
    thumbnail_url TEXT,
    badge TEXT DEFAULT 'FORMATION OFFICIELLE',
    published BOOLEAN DEFAULT true,
    estimated_hours NUMERIC DEFAULT 10,
    total_hours NUMERIC DEFAULT 10,
    chapters_count INTEGER DEFAULT 0,
    lessons_count INTEGER DEFAULT 0,
    prerequisites TEXT[] DEFAULT '{}',
    objectives TEXT[] DEFAULT '{}',
    skills_acquired TEXT[] DEFAULT '{}',
    rating NUMERIC DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 120,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE CHAPTERS (Chapitres de formation)
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT,
    objectives TEXT[] DEFAULT '{}',
    duration_minutes INTEGER DEFAULT 60,
    lessons_count INTEGER DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE LESSONS (Leçons techniques approfondies)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    content TEXT,
    video_url TEXT,
    video_provider TEXT, -- 'youtube', 'vimeo', 'storage', 'html5', null
    video_duration TEXT,
    thumbnail_url TEXT,
    transcript TEXT,
    captions_url TEXT,
    duration_minutes INTEGER DEFAULT 25,
    position INTEGER NOT NULL DEFAULT 1,
    published BOOLEAN DEFAULT true,
    technical_level TEXT DEFAULT 'Intermédiaire',
    key_points TEXT[] DEFAULT '{}',
    summary TEXT,
    troubleshooting TEXT,
    cli_examples JSONB DEFAULT '[]'::jsonb,
    has_exercise BOOLEAN DEFAULT false,
    has_quiz BOOLEAN DEFAULT false,
    has_lab BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE QUIZZES (Quiz pédagogiques)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE QUIZ_QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings
    correct_index INTEGER NOT NULL,
    explanation TEXT,
    position INTEGER DEFAULT 1
);

-- 7. TABLE QUIZ_ATTEMPTS (Tentatives de quiz par utilisateur - RLS)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score_percent INTEGER NOT NULL,
    passed BOOLEAN DEFAULT false,
    attempt_number INTEGER DEFAULT 1,
    answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLE EXERCISES (Exercices pratiques)
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Réseau IP',
    difficulty TEXT DEFAULT 'Moyen',
    instructions TEXT NOT NULL,
    expected_output TEXT,
    hints TEXT[] DEFAULT '{}',
    solution TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLE LABS (Laboratoires pratiques télécom)
CREATE TABLE IF NOT EXISTS public.labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'simulation', -- 'simulation' ou 'real_lab'
    objective TEXT NOT NULL,
    prerequisites TEXT[] DEFAULT '{}',
    equipment_needed TEXT[] DEFAULT '{}',
    topology_description TEXT,
    steps JSONB DEFAULT '[]'::jsonb,
    validation_criteria TEXT[] DEFAULT '{}',
    troubleshooting TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABLE PROJECTS (Projets de fin de formation)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    topology_summary TEXT,
    requirements TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    evaluation_grid JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABLE ENROLLMENTS (Inscriptions aux formations)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

-- 12. TABLE USER_PROGRESS (Progression individuelle par leçon & reprise vidéo)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percent INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    last_video_position_seconds NUMERIC DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- 12b. TABLE USER_COURSE_STATE (Dernière leçon consultée, état actif par cours et global)
CREATE TABLE IF NOT EXISTS public.user_course_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    last_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_course_state UNIQUE (user_id, course_id)
);

-- 13. INDEXES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON public.chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON public.lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON public.exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_labs_course_id ON public.labs(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON public.user_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_course_state_user ON public.user_course_state(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_state_user_course ON public.user_course_state(user_id, course_id);

-- 14. ACTIVATION DE LA ROW LEVEL SECURITY (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 15. POLICIES SÉCURITÉ PUBLIQUE (LECTURE FORMATIONS, CHAPITRES, LEÇONS, QUIZ, LABS)
DROP POLICY IF EXISTS "Lecture cours publiés" ON public.courses;
CREATE POLICY "Lecture cours publiés" ON public.courses
    FOR SELECT TO authenticated, anon
    USING (published = true);

DROP POLICY IF EXISTS "Lecture chapitres" ON public.chapters;
CREATE POLICY "Lecture chapitres" ON public.chapters
    FOR SELECT TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Lecture leçons" ON public.lessons;
CREATE POLICY "Lecture leçons" ON public.lessons
    FOR SELECT TO authenticated, anon
    USING (published = true);

DROP POLICY IF EXISTS "Lecture quiz" ON public.quizzes;
CREATE POLICY "Lecture quiz" ON public.quizzes
    FOR SELECT TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Lecture questions quiz" ON public.quiz_questions;
CREATE POLICY "Lecture questions quiz" ON public.quiz_questions
    FOR SELECT TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Lecture exercices" ON public.exercises;
CREATE POLICY "Lecture exercices" ON public.exercises
    FOR SELECT TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Lecture labs" ON public.labs;
CREATE POLICY "Lecture labs" ON public.labs
    FOR SELECT TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Lecture projets" ON public.projects;
CREATE POLICY "Lecture projets" ON public.projects
    FOR SELECT TO authenticated, anon
    USING (true);

-- 16. POLICIES STRICTES PAR UTILISATEUR CONNECTÉ (auth.uid() = user_id)
DROP POLICY IF EXISTS "Gestion personnelle inscriptions" ON public.enrollments;
CREATE POLICY "Gestion personnelle inscriptions" ON public.enrollments
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Gestion personnelle progression" ON public.user_progress;
CREATE POLICY "Gestion personnelle progression" ON public.user_progress
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Gestion personnelle quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Gestion personnelle quiz attempts" ON public.quiz_attempts
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Gestion personnelle course state" ON public.user_course_state;
CREATE POLICY "Gestion personnelle course state" ON public.user_course_state
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 17. SEED INITIAL (Catalogue complet Télécom, Réseaux, Systèmes & Infrastructure)
INSERT INTO public.courses (id, title, slug, description, category, difficulty, badge, published, estimated_hours, total_hours, thumbnail_url)
VALUES
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

-- CHAPITRES DU CATALOGUE
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
ON CONFLICT (id) DO NOTHING;

-- LEÇONS DU CATALOGUE
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
ON CONFLICT (id) DO NOTHING;
