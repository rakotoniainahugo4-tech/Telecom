import React from 'react';
import { Course, Chapter, Lesson, UserProgress } from '../../types/learning';
import { Check, Play, Circle, ChevronRight, X, Layers, Clock } from 'lucide-react';

interface CourseSidebarProps {
  course: Course;
  currentLessonId: string;
  userProgressMap: Record<string, UserProgress>;
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  currentLessonId,
  userProgressMap,
  isOpen,
  onClose,
  onSelectLesson,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#080e1a] border-l border-cyan-500/30 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#0b1424]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Sommaire de la Formation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Course Info Brief */}
        <div className="p-4 bg-[#060b14] border-b border-cyan-500/10">
          <p className="text-xs font-mono text-cyan-400 font-bold truncate">{course.title}</p>
          <p className="text-[11px] text-slate-400 mt-1">Sélectionnez une leçon pour y accéder directement :</p>
        </div>

        {/* Chapter & Lesson List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(course.chapters || []).map((chapter, cIdx) => (
            <div key={chapter.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-cyan-500/10">
                <span className="font-bold text-cyan-300">
                  CH {chapter.chapter_number || cIdx + 1} : {chapter.title}
                </span>
              </div>

              <div className="space-y-1">
                {(chapter.lessons || []).map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const isCompleted = Boolean(userProgressMap[lesson.id]?.completed);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        onSelectLesson(lesson.id);
                        onClose();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'hover:bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isCurrent
                            ? 'bg-cyan-500/30 text-cyan-300'
                            : 'bg-slate-900 text-slate-500 border border-slate-700'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : isCurrent ? (
                            <Play className="w-2.5 h-2.5 fill-current" />
                          ) : (
                            <Circle className="w-2 h-2" />
                          )}
                        </div>
                        <span className="truncate">{lesson.title}</span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {lesson.duration_minutes}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
