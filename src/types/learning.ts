export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description?: string;
  category: 'TELECOM ACADEMY' | 'TELECOM LABORATORY' | 'NETWORK OPERATIONS' | 'SITE & RF ENGINEERING' | 'RÉSEAUX & ROUTAGE IP' | 'CŒUR DE RÉSEAU OPÉRATEUR' | 'COMMUNICATIONS UNIFIÉES' | 'RÉSEAUX MOBILES & SANS-FIL' | 'TRANSMISSION & INFRASTRUCTURE' | 'DEVOPS & AUTOMATION' | string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  thumbnail_url?: string;
  badge?: string;
  published: boolean;
  estimated_hours?: number;
  total_hours?: number;
  chapters_count?: number;
  lessons_count?: number;
  prerequisites?: string[];
  objectives?: string[];
  skills_acquired?: string[];
  rating?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  course_id: string;
  chapter_number?: number;
  title: string;
  description?: string;
  objectives?: string[];
  duration_minutes?: number;
  lessons_count?: number;
  position: number;
  created_at?: string;
  lessons?: Lesson[];
}

export interface LessonCliExample {
  title: string;
  os: string;
  command: string;
  outputDescription?: string;
  description?: string;
}

export interface Lesson {
  id: string;
  chapter_id: string;
  course_id?: string;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  video_url?: string;
  video_provider?: 'youtube' | 'vimeo' | 'storage' | 'html5' | null;
  video_duration?: string;
  thumbnail_url?: string;
  transcript?: string;
  captions_url?: string;
  duration_minutes: number;
  position: number;
  published: boolean;
  technical_level?: string;
  key_points?: string[];
  summary?: string;
  troubleshooting?: string;
  cli_examples?: LessonCliExample[];
  has_exercise?: boolean;
  has_quiz?: boolean;
  has_lab?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProgress {
  id?: string;
  user_id: string;
  lesson_id: string;
  course_id?: string;
  completed: boolean;
  progress_percent: number;
  last_position_seconds: number;
  last_video_position_seconds?: number;
  started_at?: string;
  completed_at?: string | null;
  updated_at?: string;
}

export interface QuizQuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id?: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  lesson_id?: string;
  course_id?: string;
  title: string;
  description?: string;
  passing_score: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id?: string;
  user_id: string;
  quiz_id: string;
  score_percent: number;
  passed: boolean;
  attempt_number: number;
  answers: Record<string, number>;
  created_at?: string;
}

export interface Exercise {
  id: string;
  lesson_id?: string;
  course_id?: string;
  title: string;
  category: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  instructions: string;
  expected_output?: string;
  hints?: string[];
  solution?: string;
}

export interface Lab {
  id: string;
  course_id?: string;
  title: string;
  type: 'simulation' | 'real_lab';
  objective: string;
  prerequisites: string[];
  equipment_needed: string[];
  topology_description: string;
  steps: Array<{
    step_number: number;
    title: string;
    instructions: string;
    command?: string;
    expected_result?: string;
  }>;
  validation_criteria: string[];
  troubleshooting: string[];
}

export interface Project {
  id: string;
  course_id: string;
  title: string;
  description: string;
  topology_summary: string;
  requirements: string[];
  deliverables: string[];
  evaluation_grid: Array<{ criterion: string; points: number }>;
}

export interface Enrollment {
  id?: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string | null;
}

export interface ChapterProgressSummary {
  chapter_id: string;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  percent: number;
}

export type CourseProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'no_lessons';

export interface CourseProgressSummary {
  course: Course;
  total_lessons: number;
  completed_lessons: number;
  percent: number;
  is_completed: boolean;
  status: CourseProgressStatus;
  status_label: 'Non commencé' | 'En cours' | 'Terminé' | 'Contenu en cours de préparation';
  action_label: 'Commencer la formation' | 'Continuer la formation' | 'Revoir la formation' | 'Contenu en cours de préparation';
  last_lesson?: Lesson;
  next_lesson?: Lesson;
  chapter_summaries: ChapterProgressSummary[];
}

export interface CourseAuditResult {
  course_id: string;
  course_title: string;
  slug: string;
  published: boolean;
  chapters_count: number;
  lessons_count: number;
  completed_lessons: number;
  progress_percent: number;
  status: CourseProgressStatus;
  status_label: string;
  integrity_state: 'OK' | 'ERREUR DE DONNÉES' | 'CONTENU EN PRÉPARATION';
  details: string;
}

export interface UserLearningStats {
  courses_started: number;
  courses_completed: number;
  lessons_completed: number;
  total_lessons_available: number;
  global_progress_percent: number;
  labs_completed: number;
  total_labs_available: number;
  quiz_completed: number;
  average_quiz_score: number;
  learning_hours: number;
}
