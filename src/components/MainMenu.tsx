import React, { useState, useEffect } from 'react';
import { GameMode, Difficulty, PlayerProfile } from '../types';
import { Hero } from '../data/heroes';
import HeroAvatar from './HeroAvatar';
import { speakAndWait, speakAsync, playSound, stopSpeaking } from '../utils/speech';
import { generateDiplomaPDF } from '../utils/diplomaGenerator';

interface MainMenuProps {
  hero: Hero;
  onStartGame: (mode: GameMode, difficulty: Difficulty) => void;
  onChangeHero: () => void;
  totalStars: number;
  activityEggs?: Record<string, number>;
  totalEggs?: number;
  onOpenPuzzle?: () => void;
  activeProfile?: PlayerProfile | null;
  onOpenRegistration?: () => void;
}

const gameCategories = [
  { mode: 'suma' as GameMode, title: 'Sumas Jurásicas', emoji: '➕', color: 'from-emerald-500 to-green-700', description: '¡Sumemos juntos!', speech: '¡Vamos a sumar!' },
  { mode: 'resta' as GameMode, title: 'Restas de Dinosaurio', emoji: '➖', color: 'from-amber-500 to-orange-700', description: '¡Resta y aprende!', speech: '¡Hora de restar!' },
  { mode: 'multiplicacion' as GameMode, title: 'Multiplicar Nidos', emoji: '✖️', color: 'from-purple-500 to-indigo-700', description: '¡Suma grupos iguales!', speech: '¡A multiplicar!' },
  { mode: 'division' as GameMode, title: 'Repartir Frutas', emoji: '➗', color: 'from-teal-500 to-cyan-700', description: '¡Reparte en partes iguales!', speech: '¡Vamos a dividir!' },
  { mode: 'completar' as GameMode, title: 'Huevos Escondidos', emoji: '🧩', color: 'from-rose-500 to-pink-700', description: '¡Descubre lo que falta!', speech: '¡Busca el número oculto!' },
  { mode: 'comparar' as GameMode, title: '¿Quién es Mayor?', emoji: '⚖️', color: 'from-amber-600 to-yellow-700', description: '¡Encuentra el más grande!', speech: '¡Comparemos números!' },
];

const difficulties = [
  { value: 'facil' as Difficulty, label: '🥚 Bebé Dino (Fácil)', sub: 'Números chiquitos (1° y 2°)', color: 'from-emerald-500 to-green-600', speech: 'Nivel Bebé Dino.' },
  { value: 'medio' as Difficulty, label: '🦕 Dino Joven (Medio)', sub: 'Desafío medio (3° y 4°)', color: 'from-amber-500 to-orange-600', speech: 'Nivel Dino Joven.' },
  { value: 'dificil' as Difficulty, label: 'REX T-Rex Máster (Difícil)', sub: 'Para campeones (5° y 6°)', color: 'from-red-500 to-rose-700', speech: 'Nivel T-Rex Máster.' },
];

const MainMenu: React.FC<MainMenuProps> = ({ 
  hero, 
  onStartGame, 
  onChangeHero, 
  totalStars, 
  activityEggs = {}, 
  totalEggs = 0, 
  onOpenPuzzle,
  activeProfile,
  onOpenRegistration 
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [heroTalking, setHeroTalking] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [downloadingDiploma, setDownloadingDiploma] = useState(false);

  const fullName = activeProfile ? `${activeProfile.firstName} ${activeProfile.lastName}`.trim() : 'Campeón Jurásico';

  useEffect(() => {
    const greeting = activeProfile ? `¡Hola ${activeProfile.firstName}! ¡Elige tu misión jurásica!` : `¡Elige tu misión jurásica!`;
    setSpeechText(greeting);
    return () => stopSpeaking();
  }, [hero, activeProfile]);

  const handleCategoryClick = (cat: typeof gameCategories[0]) => {
    playSound('click');
    setSelectedMode(cat.mode);
    setSpeechText(cat.speech);
    setShowDifficulty(true);
    setHeroTalking(true);
    speakAsync(cat.speech);
    setTimeout(() => setHeroTalking(false), 1800);
  };

  const handleDifficultySelect = (diff: typeof difficulties[0]) => {
    if (selectedMode) {
      playSound('magic');
      stopSpeaking();
      onStartGame(selectedMode, diff.value);
    }
  };

  const handleDownloadDiploma = async () => {
    playSound('magic');
    setDownloadingDiploma(true);
    try {
      await generateDiplomaPDF(hero, totalStars * 10, totalEggs, fullName);
    } finally {
      setDownloadingDiploma(false);
    }
  };

  const isPuzzleUnlocked = totalEggs >= 12;
  const isDiplomaUnlocked = totalEggs >= 15;
  const hasCrown = totalEggs >= 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-amber-950 relative overflow-hidden flex flex-col items-center justify-between p-3 md:p-6 text-white">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(/images/dino-bg.png)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-teal-950/70 to-amber-950/90" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto">
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <button onClick={onChangeHero}
              className="flex items-center gap-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-md border border-emerald-500/30"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              <span>🔄</span> Cambiar Dino
            </button>
            {onOpenRegistration && (
              <button onClick={onOpenRegistration}
                className="flex items-center gap-1 bg-amber-900/80 hover:bg-amber-800 text-amber-100 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-md border border-amber-500/30"
                style={{ fontFamily: "'Nunito', sans-serif" }}>
                <span>👤</span> <span>{fullName}</span> <span>✏️</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-500/90 rounded-full px-3 py-1 text-xs sm:text-sm font-bold text-amber-950 shadow-md border border-amber-300">
              <span>🥚</span>
              <span style={{ fontFamily: "'Fredoka One', cursive" }}>{totalEggs} Huevos</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/90 rounded-full px-3 py-1 text-xs sm:text-sm font-bold text-white shadow-md border border-emerald-300">
              <span>⭐</span>
              <span style={{ fontFamily: "'Fredoka One', cursive" }}>{totalStars}</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-amber-50/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-xl border-2 sm:border-3 border-amber-300 flex items-center gap-3 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => speakAndWait(hero.greeting)}>
            <HeroAvatar heroId={hero.id} size={70} talking={heroTalking} hasCrown={hasCrown} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs sm:text-sm font-bold text-emerald-800" style={{ fontFamily: "'Fredoka One', cursive" }}>
                {hero.emoji} {hero.name} {hasCrown && '👑'}
              </span>
            </div>
            <p className="text-xs sm:text-base font-bold text-emerald-950 leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {speechText}
            </p>
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-center mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-emerald-300">Dino Math 🌋</span>
        </h1>
        <p className="text-amber-200/80 text-center mb-3 text-xs font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>
          🌴 ¡Misiones matemáticas en la Era Prehistórica! 🌴
        </p>

        {showDifficulty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowDifficulty(false)}>
            <div className="bg-amber-50 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-[bounceIn_0.5s_ease-out] border-4 border-amber-400" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center mb-3"><HeroAvatar heroId={hero.id} size={85} talking={heroTalking} hasCrown={hasCrown} /></div>
              <h2 className="text-2xl font-bold text-center mb-1 text-emerald-900" style={{ fontFamily: "'Fredoka One', cursive" }}>¿Qué tan grande es el reto? 🤔</h2>
              <p className="text-center text-emerald-700 mb-4 text-sm font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>Elige tu nivel jurásico</p>
              <div className="space-y-3">
                {difficulties.map(diff => (
                  <button key={diff.value} onClick={() => handleDifficultySelect(diff)}
                    className={`w-full bg-gradient-to-r ${diff.color} text-white rounded-2xl py-4 px-6 text-lg font-bold
                      transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg border border-white/20`}
                    style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {diff.label}
                    <span className="block text-xs font-normal opacity-90" style={{ fontFamily: "'Nunito', sans-serif" }}>{diff.sub}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowDifficulty(false)} className="mt-4 w-full text-emerald-700 hover:text-emerald-900 py-2 text-sm font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>← Volver</button>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl mb-3 sm:mb-4 bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-600/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 sm:p-4 border-2 sm:border-3 border-amber-300 shadow-xl animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl animate-bounce">🗺️</span>
              <h2 className="text-sm sm:text-base font-bold text-amber-950" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Ruta del Valle Jurásico ({totalEggs} Huevos Recolectados)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            <div className="bg-amber-50/95 rounded-xl p-2 text-center border border-amber-300 shadow-md">
              <span className="text-base sm:text-lg block">🎨📄</span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-950 block leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>Lámina PDF</span>
              <span className="text-[8px] text-amber-800 font-bold block" style={{ fontFamily: "'Nunito', sans-serif" }}>5 Huevos</span>
            </div>

            <div className="bg-amber-50/95 rounded-xl p-2 text-center border border-amber-300 shadow-md">
              <span className="text-base sm:text-lg block">{isPuzzleUnlocked ? '🔓🧩' : '🔒🧩'}</span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-950 block leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>Rompecabezas</span>
              <span className="text-[8px] text-amber-800 font-bold block" style={{ fontFamily: "'Nunito', sans-serif" }}>{isPuzzleUnlocked ? '¡LIBERADO!' : `${totalEggs}/12 Huevos`}</span>
            </div>

            <div className="bg-amber-50/95 rounded-xl p-2 text-center border border-amber-300 shadow-md">
              <span className="text-base sm:text-lg block">{isDiplomaUnlocked ? '📜🏆' : '🔒📜'}</span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-950 block leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>Diploma PDF</span>
              <span className="text-[8px] text-amber-800 font-bold block" style={{ fontFamily: "'Nunito', sans-serif" }}>{isDiplomaUnlocked ? '¡LIBERADO!' : `${totalEggs}/15 Huevos`}</span>
            </div>

            <div className="bg-amber-50/95 rounded-xl p-2 text-center border border-amber-300 shadow-md">
              <span className="text-base sm:text-lg block">{hasCrown ? '👑🦖' : '🔒👑'}</span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-950 block leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>Corona Rey Rex</span>
              <span className="text-[8px] text-amber-800 font-bold block" style={{ fontFamily: "'Nunito', sans-serif" }}>{hasCrown ? '¡PUESTA!' : `${totalEggs}/20 Huevos`}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {isPuzzleUnlocked && (
              <button onClick={() => { playSound('magic'); onOpenPuzzle && onOpenPuzzle(); }}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white rounded-xl py-2 px-3 text-xs sm:text-sm font-black transform hover:scale-105 active:scale-95 transition-all shadow-md border border-yellow-300 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Fredoka One', cursive" }}>
                <span>🧩</span> <span>JUGAR ROMPECABEZAS DE {hero.name.toUpperCase()}</span>
              </button>
            )}
            {isDiplomaUnlocked && (
              <button onClick={handleDownloadDiploma} disabled={downloadingDiploma}
                className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 rounded-xl py-2 px-3 text-xs sm:text-sm font-black transform hover:scale-105 active:scale-95 transition-all shadow-md border border-white flex items-center justify-center gap-2"
                style={{ fontFamily: "'Fredoka One', cursive" }}>
                <span>📜</span> <span>{downloadingDiploma ? 'Generando diploma...' : '¡DESCARGAR DIPLOMA OFICIAL DE CAMPEÓN (PDF)!'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {gameCategories.map((cat, index) => {
              const eggsCount = activityEggs[cat.mode] || 0;
              const isUnlocked = eggsCount >= 5;
              return (
                <button key={cat.mode} onClick={() => handleCategoryClick(cat)}
                  className={`bg-gradient-to-br ${cat.color} rounded-2xl md:rounded-3xl p-4 md:p-5
                    transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl
                    group relative overflow-hidden border-2 ${isUnlocked ? 'border-amber-300 ring-2 ring-yellow-300/80 shadow-amber-500/30' : 'border-white/20'}`}
                  style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both` }}>
                  {isUnlocked && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-white animate-pulse">
                      🔓 DESAFÍO VIP
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl" />
                  <div className="relative text-center">
                    <div className="text-3xl md:text-4xl mb-1 transform group-hover:scale-125 transition-transform duration-300">{cat.emoji}</div>
                    <h3 className="text-base md:text-lg font-bold text-white drop-shadow-md mb-0.5" style={{ fontFamily: "'Fredoka One', cursive" }}>{cat.title}</h3>
                    <p className="text-[10px] md:text-xs text-amber-100 font-semibold mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>{cat.description}</p>
                    
                    {/* Barra / contador de 5 Huevos para liberar nuevo desafío */}
                    <div className="mt-1 flex items-center justify-center gap-1 bg-black/30 rounded-full px-2.5 py-0.5 border border-white/20">
                      <span className="text-xs">🥚</span>
                      <span className="text-[11px] font-bold text-amber-200" style={{ fontFamily: "'Fredoka One', cursive" }}>
                        {eggsCount}/5 {isUnlocked ? '🔓 Desbloqueado' : 'Huevos'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
