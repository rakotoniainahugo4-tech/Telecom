import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Gauge, Sparkles, Video } from 'lucide-react';
import { learningService } from '../../lib/learningService';

interface VideoPlayerProps {
  userId: string;
  lessonId: string;
  courseId: string;
  videoUrl?: string;
  videoDuration?: string;
  title: string;
  onEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  userId,
  lessonId,
  courseId,
  videoUrl,
  videoDuration = '15:00',
  title,
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(900); // 15 mins default
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasResumedNotice, setHasResumedNotice] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse duration string like '28:45' into seconds
  const parseDurationToSeconds = (durStr: string): number => {
    const parts = durStr.split(':').map(Number);
    if (parts.length === 2) {
      return (parts[0] * 60) + parts[1];
    }
    if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }
    return 900;
  };

  useEffect(() => {
    const totalSecs = parseDurationToSeconds(videoDuration);
    setDuration(totalSecs);

    // Fetch saved position
    const loadSavedPosition = async () => {
      if (!userId || !lessonId) return;
      const savedSeconds = await learningService.getVideoPosition(userId, lessonId);
      if (savedSeconds > 5 && savedSeconds < totalSecs - 10) {
        setCurrentTime(savedSeconds);
        setHasResumedNotice(true);
        if (videoRef.current) {
          videoRef.current.currentTime = savedSeconds;
        }
        setTimeout(() => setHasResumedNotice(false), 5000);
      }
    };

    loadSavedPosition();
  }, [userId, lessonId, videoDuration]);

  // Periodic saving of position
  useEffect(() => {
    if (isPlaying && userId && lessonId) {
      saveTimerRef.current = setInterval(() => {
        learningService.saveVideoPosition(userId, lessonId, currentTime, courseId);
      }, 5000);
    } else if (saveTimerRef.current) {
      clearInterval(saveTimerRef.current);
    }

    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [isPlaying, currentTime, userId, lessonId, courseId]);

  // Synthetic simulation if videoUrl is not a real mp4 video file
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && !videoUrl) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackRate;
          if (next >= duration) {
            setIsPlaying(false);
            if (onEnded) onEnded();
            return duration;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, videoUrl, duration, playbackRate, onEnded]);

  const togglePlay = () => {
    if (videoRef.current && videoUrl) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    if (userId) {
      learningService.saveVideoPosition(userId, lessonId, newTime, courseId);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#060c18] overflow-hidden shadow-2xl relative group">
      {/* Video Display Area */}
      <div className="aspect-video w-full relative bg-slate-950 flex items-center justify-center overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              if (onEnded) onEnded();
            }}
          />
        ) : (
          /* Interactive Telecommunications Stream Master */
          <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#091325] via-[#050b14] to-[#03060a]">
            {/* Ambient Background Grid & Radar Sweep */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#08334415_1px,transparent_1px),linear-gradient(to_bottom,#08334415_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            {/* Animated Radar Signal Wave */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
              <div className={`w-96 h-96 rounded-full border border-cyan-500/30 transition-all duration-1000 ${isPlaying ? 'scale-150 animate-ping opacity-20' : 'scale-100'}`} />
              <div className="w-64 h-64 rounded-full border border-sky-400/20" />
            </div>

            {/* Central Master Badge */}
            <div className="relative z-10 space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold">
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONFÉRENCE VIDÉO TECHNIQUE & DÉMONSTRATION CLI</span>
              </div>

              <h3 className="text-lg sm:text-xl font-heading font-black text-white tracking-tight">
                {title}
              </h3>

              <p className="text-xs font-mono text-slate-400">
                Support multimédia interactif avec indexation temporelle et reprise de lecture.
              </p>

              {/* Big Center Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-950/80 hover:scale-105 transition-all cursor-pointer border border-cyan-300/50"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-slate-950 text-slate-950" />
                ) : (
                  <Play className="w-7 h-7 fill-slate-950 text-slate-950 ml-1" />
                )}
              </button>
            </div>

            {/* Resumed notice */}
            {hasResumedNotice && (
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs animate-in fade-in">
                Reprise automatique à {formatTime(currentTime)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Control Bar */}
      <div className="p-3 sm:p-4 bg-[#08101e] border-t border-cyan-500/20 space-y-2">
        {/* Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-cyan-300 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400 w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Playback Controls & Speed Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => {
                const newT = Math.max(0, currentTime - 10);
                setCurrentTime(newT);
                if (videoRef.current) videoRef.current.currentTime = newT;
              }}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Reculer de 10s"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
              <Gauge className="w-3 h-3 text-cyan-400" />
              Vitesse :
            </span>
            {[1, 1.25, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  playbackRate === speed
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
