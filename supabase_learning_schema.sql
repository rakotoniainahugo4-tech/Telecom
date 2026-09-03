-- ====================================================================
-- TELECOM LAB : Schéma PostgreSQL Complet pour l'Apprentissage Personnalisé
-- Compatible Supabase SQL Editor
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE COURSES (Formations)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'TELECOM ACADEMY',
    difficulty TEXT DEFAULT 'Intermédiaire',
    thumbnail_url TEXT,
    badge TEXT DEFAULT 'COURS CLÉ',
    published BOOLEAN DEFAULT true,
    estimated_hours INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE CHAPTERS (Chapitres)
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE LESSONS (Leçons)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 20,
    position INTEGER NOT NULL,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE ENROLLMENTS (Inscriptions aux formations)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

-- 6. TABLE USER_PROGRESS (Progression individuelle par leçon)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percent INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- 7. INDEXES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON public.chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON public.lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON public.user_progress(user_id, lesson_id);

-- 8. ACTIVATION DE LA ROW LEVEL SECURITY (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 9. POLICIES SÉCURITÉ POUR COURSES / CHAPTERS / LESSONS (Lecture seule pour étudiants)
DROP POLICY IF EXISTS "Lecture cours publiés" ON public.courses;
CREATE POLICY "Lecture cours publiés" ON public.courses
    FOR SELECT TO authenticated, anon
    USING (published = true);

DROP POLICY IF EXISTS "Lecture chapitres" ON public.chapters;
CREATE POLICY "Lecture chapitres" ON public.chapters
    FOR SELECT TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Lecture leçons publiées" ON public.lessons;
CREATE POLICY "Lecture leçons publiées" ON public.lessons
    FOR SELECT TO authenticated, anon
    USING (published = true);

-- 10. POLICIES SÉCURITÉ STRICTES POUR ENROLLMENTS (Isolation totale par auth.uid())
DROP POLICY IF EXISTS "Lecture enrollments propres" ON public.enrollments;
CREATE POLICY "Lecture enrollments propres" ON public.enrollments
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Insertion enrollments propres" ON public.enrollments;
CREATE POLICY "Insertion enrollments propres" ON public.enrollments
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Mise à jour enrollments propres" ON public.enrollments;
CREATE POLICY "Mise à jour enrollments propres" ON public.enrollments
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

-- 11. POLICIES SÉCURITÉ STRICTES POUR USER_PROGRESS (auth.uid() = user_id)
DROP POLICY IF EXISTS "Lecture progression propre" ON public.user_progress;
CREATE POLICY "Lecture progression propre" ON public.user_progress
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Insertion progression propre" ON public.user_progress;
CREATE POLICY "Insertion progression propre" ON public.user_progress
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Mise à jour progression propre" ON public.user_progress;
CREATE POLICY "Mise à jour progression propre" ON public.user_progress
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Suppression progression propre" ON public.user_progress;
CREATE POLICY "Suppression progression propre" ON public.user_progress
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 12. SEED INITIAL (Données de formation VoIP et MPLS)
INSERT INTO public.courses (id, title, slug, description, category, difficulty, badge, published, estimated_hours)
VALUES
('c1000000-0000-4000-8000-000000000001', 'VoIP & Téléphonie d''Entreprise', 'voip', 'Comprendre l''architecture complète de la voix sur IP, le protocole de signalisation SIP (RFC 3261), le transport multimédia RTP/RTCP, les codecs audio et la configuration d''un IPBX Asterisk.', 'TELECOM ACADEMY', 'Intermédiaire', 'VOIX SUR IP', true, 6),
('c2000000-0000-4000-8000-000000000002', 'Architecture IP/MPLS & Services L3VPN', 'mpls', 'Maîtriser la commutation par étiquettes Multi-Protocol Label Switching, les opérations Push/Swap/Pop/PHP, le protocole LDP, et le déploiement de VRF d''entreprise avec MP-BGP.', 'TELECOM LABORATORY', 'Avancé', 'CŒUR DE RÉSEAU', true, 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chapters (id, course_id, title, description, position)
VALUES
('ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', 'Chapitre 1 — Introduction à la VoIP & Fondations', 'Principes de la numérisation de la voix et éléments de base.', 1),
('ch100000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', 'Chapitre 2 — Protocole SIP & Échanges de Signalisation', 'Analyse approfondie de la RFC 3261 : requêtes REGISTER, INVITE, ACK, BYE.', 2),
('ch100000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000001', 'Chapitre 3 — IPBX Asterisk, Trunks & Dépannage', 'Mise en œuvre concrète d''Asterisk, dialplans et analyse Wireshark.', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (id, chapter_id, course_id, title, description, duration_minutes, position, published)
VALUES
('l1000001-0000-4000-8000-000000000001', 'ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '1. Qu''est-ce que la VoIP ?', 'Définition, historique, comparaison RTC vs paquets IP.', 15, 1, true),
('l1000001-0000-4000-8000-000000000002', 'ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '2. Architecture globale d''un réseau VoIP', 'Les composants clés : IP Phone, passerelles, IPBX et SBC.', 20, 2, true),
('l1000001-0000-4000-8000-000000000003', 'ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '3. Le protocole RTP & RTCP pour le transport multimédia', 'Transport en temps réel des échantillons de parole (RFC 3550).', 20, 3, true),
('l1000001-0000-4000-8000-000000000004', 'ch100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '4. Codecs audio (G.711, G.729, Opus) & Bande passante', 'Quantification PCM, MOS et calcul du débit réel.', 25, 4, true),
('l1000001-0000-4000-8000-000000000005', 'ch100000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', '5. L''enregistrement SIP (SIP REGISTER)', 'Annonce au Registrar SIP et authentification MD5 Digest.', 20, 1, true),
('l1000001-0000-4000-8000-000000000006', 'ch100000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', '6. Établissement d''un appel : SIP INVITE, SDP & ACK', 'Déroulement pas-à-pas de l''appel et négociation des codecs audio.', 25, 2, true),
('l1000001-0000-4000-8000-000000000007', 'ch100000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', '7. Terminaison d''appel (BYE) & Codes de statut SIP', 'Fermeture de la session et catalogue des codes 1xx à 6xx.', 20, 3, true),
('l1000001-0000-4000-8000-000000000008', 'ch100000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000001', '8. Déploiement d''un IPBX Asterisk avec chan_pjsip', 'Installation d''Asterisk et configuration de pjsip.conf.', 30, 1, true),
('l1000001-0000-4000-8000-000000000009', 'ch100000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000001', '9. Dialplan & Configuration des Trunks SIP Opérateur', 'Syntaxe d''extensions.conf et interconnexion télécom.', 25, 2, true),
('l1000001-0000-4000-8000-000000000010', 'ch100000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000001', '10. Dépannage VoIP : Analyse Wireshark & NAT', 'Diagnostiquer One-Way Audio et gigue avec sngrep.', 25, 3, true)
ON CONFLICT (id) DO NOTHING;
