// Sistema de voz alegre, jovial y motivadora — Mujer joven latinoamericana (25-30 años)
// Usa ElevenLabs automáticamente para voz carismática real + Web Speech API como respaldo

let currentResolve: (() => void) | null = null;
let currentAudioElement: HTMLAudioElement | null = null;

// ─── Música de fondo ───
let bgAudioElement: HTMLAudioElement | null = null;
let musicEnabled = true;

export const setMusicEnabled = (enabled: boolean) => {
  musicEnabled = enabled;
  if (!enabled) stopBackgroundMusic();
  else startBackgroundMusic();
};

export const isMusicEnabled = () => musicEnabled;

export const startBackgroundMusic = () => {
  if (!musicEnabled) return;
  try {
    if (!bgAudioElement) {
      bgAudioElement = new Audio('/sound/icecreamman.mp3');
      bgAudioElement.loop = true;
      bgAudioElement.volume = 0.12;
    }
    if (bgAudioElement.paused) {
      bgAudioElement.play().catch(() => {});
    }
  } catch (_e) {}
};

export const stopBackgroundMusic = () => {
  if (bgAudioElement) {
    try { bgAudioElement.pause(); } catch (_e) {}
  }
};

// ─── Limpieza de texto ───
export const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/grrr[-|\s]?/gi, '')
    .replace(/fiuuu[-|\s]?/gi, '')
    .replace(/zuuuum[-|\s]?/gi, '')
    .replace(/zap[-|\s]?/gi, '')
    .replace(/boom[-|\s]?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// ─── ElevenLabs: voz real carismática y expresiva ───
// Daniela: mujer joven latinoamericana, energética, alegre y motivadora
const VOICE_ID = 'ajOR9IDAaubDK5qtLUqQ';
const DEFAULT_API_KEY = (import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined) || 'sk_7459c04760770cce19a02a605edbd60102ac07908f85fa08';

// Prioridad: clave pegada por el jugador > variable de entorno > clave por defecto
const getApiKey = (): string => {
  try {
    const userKey = localStorage.getItem('dino_elevenlabs_api_key')?.trim();
    return userKey || DEFAULT_API_KEY;
  } catch (_e) {
    return DEFAULT_API_KEY;
  }
};

const audioCache = new Map<string, string>();

const speakElevenLabs = async (text: string): Promise<boolean> => {
  const API_KEY = getApiKey();
  if (!API_KEY || !text) return false;

  const cacheKey = text.trim().toLowerCase();
  let audioUrl = audioCache.get(cacheKey);

  if (!audioUrl) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.15,         // Baja: máxima expresividad, entusiasmo y carisma
            similarity_boost: 0.86,
            style: 0.88,             // Muy alta: alegría desbordante, motivación y energía
            use_speaker_boost: true,
          },
        }),
      });
      if (!res.ok) return false;
      const blob = await res.blob();
      audioUrl = URL.createObjectURL(blob);
      audioCache.set(cacheKey, audioUrl);
    } catch (_e) {
      return false;
    }
  }

  try {
    const audio = new Audio(audioUrl);
    audio.playbackRate = 1.12;
    audio.volume = 1;
    currentAudioElement = audio;
    return new Promise((resolve) => {
      audio.onended = () => resolve(true);
      audio.onerror = () => resolve(false);
      audio.play().catch(() => resolve(false));
    });
  } catch (_e) {
    return false;
  }
};

// ─── Selección de voz femenina latinoamericana (fallback) ───
const getBestVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const isLatam = (v: SpeechSynthesisVoice) =>
    v.lang.startsWith('es-MX') || v.lang.startsWith('es-419') ||
    v.lang.startsWith('es-US') || v.lang.startsWith('es-CO') ||
    v.lang.startsWith('es-AR') || v.lang.startsWith('es-CL') ||
    v.name.toLowerCase().includes('mexico') || v.name.toLowerCase().includes('latin');

  const femNames = ['paulina', 'sabina', 'mia', 'sofia', 'lupe', 'penelope', 'paloma', 'dalia', 'female'];

  const latamFem = voices.find(v => isLatam(v) && femNames.some(n => v.name.toLowerCase().includes(n)));
  if (latamFem) return latamFem;

  const anyLatam = voices.find(v => isLatam(v));
  if (anyLatam) return anyLatam;

  const anyFem = voices.find(v => v.lang.startsWith('es') && femNames.some(n => v.name.toLowerCase().includes(n)));
  if (anyFem) return anyFem;

  return voices.find(v => v.lang.startsWith('es')) || null;
};

// Voz de respaldo con máxima expresividad posible en Web Speech API
const speakFallbackTTS = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-419';
    u.rate = 1.18;
    u.pitch = 1.65;
    u.volume = 1;
    const voice = getBestVoice();
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  } catch (_e) {}
};

let lastSpokenText = '';
let lastSpokenTime = 0;

// ─── Hablar sin esperar (fire & forget) ───
export const speakAsync = (text: string): void => {
  const clean = cleanTextForSpeech(text);
  if (!clean) return;

  const now = Date.now();
  if (clean === lastSpokenText && (now - lastSpokenTime) < 1500) return;
  lastSpokenText = clean;
  lastSpokenTime = now;

  stopSpeaking();
  playSound('dinoRoar');

  // Intentar ElevenLabs primero, fallback a Web Speech API
  speakElevenLabs(clean).then(ok => {
    if (!ok) speakFallbackTTS(clean);
  });
};

// ─── Hablar y esperar a que termine ───
export const speakAndWait = (text: string): Promise<void> => {
  const clean = cleanTextForSpeech(text);
  if (!clean) return Promise.resolve();

  const now = Date.now();
  if (clean === lastSpokenText && (now - lastSpokenTime) < 1500) return Promise.resolve();
  lastSpokenText = clean;
  lastSpokenTime = now;

  stopSpeaking();
  playSound('dinoRoar');

  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      currentResolve = null;
      resolve();
    };

    // Timeout de seguridad para no bloquear la interfaz
    const timeout = setTimeout(finish, Math.min(4000, Math.max(1500, clean.length * 60)));

    speakElevenLabs(clean).then(ok => {
      if (ok) {
        clearTimeout(timeout);
        finish();
        return;
      }

      // Fallback: Web Speech API
      if (!('speechSynthesis' in window)) { clearTimeout(timeout); finish(); return; }

      try {
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'es-419';
        u.rate = 1.18;
        u.pitch = 1.65;
        u.volume = 1;
        const voice = getBestVoice();
        if (voice) u.voice = voice;

        currentResolve = finish;
        u.onend = () => { clearTimeout(timeout); finish(); };
        u.onerror = () => { clearTimeout(timeout); finish(); };

        window.speechSynthesis.speak(u);
      } catch (_e) {
        clearTimeout(timeout);
        finish();
      }
    });
  });
};

// ─── Detener toda voz ───
export const stopSpeaking = () => {
  lastSpokenText = '';
  if (currentAudioElement) {
    try { currentAudioElement.pause(); } catch (_e) {}
    currentAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentResolve) {
    currentResolve();
    currentResolve = null;
  }
};

// ─── Inicializar voces del navegador ───
export const initVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) { resolve(); return; }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(); return; }
    window.speechSynthesis.onvoiceschanged = () => resolve();
    setTimeout(resolve, 1500);
  });
};

// ─── Efectos de sonido (sintetizados) ───
export const playSound = (type: 'correct' | 'wrong' | 'victory' | 'click' | 'magic' | 'dinoRoar') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (type === 'dinoRoar') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.42);
    } else if (type === 'correct') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.4);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.4);
      });
    } else if (type === 'wrong') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'victory') {
      let t = 0;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + t);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + t + 0.25);
        osc.start(audioCtx.currentTime + t);
        osc.stop(audioCtx.currentTime + t + 0.3);
        t += 0.18;
      });
    } else if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.06);
    } else if (type === 'magic') {
      [800, 1000, 1200, 1400].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.04 + 0.18);
        osc.start(audioCtx.currentTime + i * 0.04);
        osc.stop(audioCtx.currentTime + i * 0.04 + 0.2);
      });
    }
  } catch (_e) {}
};
