// Web Audio API Audio Engine for SIP Softphone (DTMF, Ringtones, Ringback, Echo Test, Voice Prompts)

const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  'A': [697, 1633],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  'B': [770, 1633],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  'C': [852, 1633],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
  'D': [941, 1633]
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Play DTMF Tone for standard telephone keypad feedback
export function playDtmfTone(char: string, durationMs = 160): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const key = char.toUpperCase();
  const freqs = DTMF_FREQS[key];
  if (!freqs) return;

  try {
    const [f1, f2] = freqs;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.value = f1;

    osc2.type = 'sine';
    osc2.frequency.value = f2;

    const now = ctx.currentTime;
    const duration = durationMs / 1000;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gainNode.gain.setValueAtTime(0.12, now + duration - 0.02);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (err) {
    console.debug('DTMF Audio Error:', err);
  }
}

// Play Ringback Tone (Outgoing calling: 425Hz pulsating 1.5s on, 3.5s off)
let ringbackInterval: any = null;
export function startRingbackTone(): void {
  stopRingbackTone();
  const ctx = getAudioContext();
  if (!ctx) return;

  const playBeep = () => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 425; // Standard European PBX Ringback tone
      const now = ctx.currentTime;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.setValueAtTime(0.08, now + 1.2);
      gain.gain.linearRampToValueAtTime(0, now + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // Ignored
    }
  };

  playBeep();
  ringbackInterval = setInterval(playBeep, 3500);
}

export function stopRingbackTone(): void {
  if (ringbackInterval) {
    clearInterval(ringbackInterval);
    ringbackInterval = null;
  }
}

// Play Incoming Ringtone (Linphone-style electronic ring)
let ringtoneInterval: any = null;
export function startIncomingRingtone(): void {
  stopIncomingRingtone();
  const ctx = getAudioContext();
  if (!ctx) return;

  const playRingChime = () => {
    try {
      const notes = [587.33, 880, 1174.66, 880]; // D5, A5, D6, A5
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + i * 0.12;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // Ignored
    }
  };

  playRingChime();
  ringtoneInterval = setInterval(playRingChime, 2400);
}

export function stopIncomingRingtone(): void {
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
}

// Hold Music Synthesizer (calm chord progression)
let holdInterval: any = null;
export function startHoldMusic(): void {
  stopHoldMusic();
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [
    [261.63, 329.63, 392.00], // C
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
    [196.00, 246.94, 293.66], // G
  ];
  let chordIndex = 0;

  const playChord = () => {
    try {
      const now = ctx.currentTime;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
        gain.gain.setValueAtTime(0.04, now + 1.6);
        gain.gain.linearRampToValueAtTime(0, now + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.0);
      });
    } catch {
      // Ignored
    }
  };

  playChord();
  holdInterval = setInterval(playChord, 2200);
}

export function stopHoldMusic(): void {
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null;
  }
}

// Real Voice Echo Test using Microphone stream loopback
let micStream: MediaStream | null = null;
let micSource: MediaStreamAudioSourceNode | null = null;
let delayNode: DelayNode | null = null;
let filterNode: BiquadFilterNode | null = null;

export async function startMicrophoneEchoTest(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micSource = ctx.createMediaStreamSource(micStream);
    delayNode = ctx.createDelay(1.0);
    delayNode.delayTime.value = 0.25; // 250ms telephone delay

    // Bandpass filter to simulate G.711 / telephone audio bandwidth (300Hz - 3400Hz)
    filterNode = ctx.createBiquadFilter();
    filterNode.type = 'bandpass';
    filterNode.frequency.value = 1500;
    filterNode.Q.value = 0.8;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.7;

    micSource.connect(delayNode);
    delayNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    return true;
  } catch (e) {
    console.debug('Microphone permission not granted or unavailable for echo test:', e);
    return false;
  }
}

export function stopMicrophoneEchoTest(): void {
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop());
    micStream = null;
  }
  micSource = null;
  delayNode = null;
  filterNode = null;
}

// Synthetic Voice Prompts (French/English telecom IVR responses)
export function speakIvrPrompt(text: string): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignored
    }
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignored
    }
  }
}
