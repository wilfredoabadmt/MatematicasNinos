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
  {
    mode: 'suma' as GameMode,
    title: 'Sumas Divertidas',
    emoji: '➕',
    color: 'from-[#7AC943] to-[#4F9A25]',
    bgLight: 'bg-[#7AC943]/10',
    border: 'border-[#7AC943]/30',
    description: '¡Juntemos cantidades y contemos el total!',
    speech: '¡Excelente elección! Vamos a practicar Sumas Divertidas.',
  },
  {
    mode: 'resta' as GameMode,
    title: 'Restas Ágiles',
    emoji: '➖',
    color: 'from-[#FF8A25] to-[#E05315]',
    bgLight: 'bg-[#FF8A25]/10',
    border: 'border-[#FF8A25]/30',
    description: '¡Quita una parte y descubre cuánto queda!',
    speech: '¡Genial! Es momento de resolver Restas Ágiles.',
  },
  {
    mode: 'multiplicacion' as GameMode,
    title: 'Multiplicar en Grupos',
    emoji: '✖️',
    color: 'from-[#35206F] to-[#4B2C99]',
    bgLight: 'bg-[#35206F]/10',
    border: 'border-[#35206F]/30',
    description: '¡Suma conjuntos iguales a toda velocidad!',
    speech: '¡Fantástico! Vamos a Multiplicar en Grupos.',
  },
  {
    mode: 'division' as GameMode,
    title: 'Repartir en Partes Iguales',
    emoji: '➗',
    color: 'from-[#38A9E8] to-[#1E6FA8]',
    bgLight: 'bg-[#38A9E8]/10',
    border: 'border-[#38A9E8]/30',
    description: '¡Comparte equitativamente con tus amigos!',
    speech: '¡Estupendo! Vamos a Repartir en Partes Iguales.',
  },
  {
    mode: 'completar' as GameMode,
    title: 'Número Escondido',
    emoji: '🧩',
    color: 'from-[#FFC928] to-[#E0A800]',
    bgLight: 'bg-[#FFC928]/10',
    border: 'border-[#FFC928]/30',
    description: '¡Descubre la cifra oculta en la ecuación!',
    speech: '¡Un gran desafío! Vamos a encontrar el Número Escondido.',
  },
  {
    mode: 'comparar' as GameMode,
    title: '¿Quién es Mayor?',
    emoji: '⚖️',
    color: 'from-[#6B6280] to-[#35206F]',
    bgLight: 'bg-[#6B6280]/10',
    border: 'border-[#6B6280]/30',
    description: '¡Compara cantidades y elige la más grande!',
    speech: '¡Me encanta! Vamos a comparar números y encontrar la cifra mayor.',
  },
];

const difficulties = [
  {
    value: 'facil' as Difficulty,
    label: '🥚 Bebé Explorador (Fácil)',
    sub: '1° y 2° de Primaria · Números básicos',
    color: 'from-[#7AC943] to-[#4F9A25]',
    speech: 'Seleccionaste el nivel Bebé Explorador.',
  },
  {
    value: 'medio' as Difficulty,
    label: '🦕 Aventurero Pro (Medio)',
    sub: '3° y 4° de Primaria · Desafío intermedio',
    color: 'from-[#38A9E8] to-[#2B78C5]',
    speech: 'Seleccionaste el nivel Aventurero Pro.',
  },
  {
    value: 'dificil' as Difficulty,
    label: '👑 Genio Máster (Difícil)',
    sub: '5° y 6° de Primaria · Para súper campeones',
    color: 'from-[#FF8A25] to-[#E05315]',
    speech: 'Seleccionaste el nivel Genio Máster. ¡A demostrar todo tu talento!',
  },
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
  onOpenRegistration,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [heroTalking, setHeroTalking] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [downloadingDiploma, setDownloadingDiploma] = useState(false);

  const fullName = activeProfile
    ? `${activeProfile.firstName} ${activeProfile.lastName}`.trim()
    : 'Campeón KidGenius';

  useEffect(() => {
    const greeting = activeProfile
      ? `¡Hola ${activeProfile.firstName}! Qué gran alegría verte en KidGenius Club. Elige tu misión favorita para comenzar.`
      : `¡Hola! Te damos la bienvenida a KidGenius Club. Elige tu misión favorita para comenzar.`;
    setSpeechText(greeting);
    return () => stopSpeaking();
  }, [hero, activeProfile]);

  const handleCategoryClick = (cat: (typeof gameCategories)[0]) => {
    playSound('click');
    setSelectedMode(cat.mode);
    setSpeechText(cat.speech);
    setShowDifficulty(true);
    setHeroTalking(true);
    speakAsync(cat.speech);
    setTimeout(() => setHeroTalking(false), 1800);
  };

  const handleDifficultySelect = (diff: (typeof difficulties)[0]) => {
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
    <div className="min-h-screen bg-[#FFF9EC] relative overflow-hidden flex flex-col items-center justify-between p-3 md:p-6 text-[#241A3D]">
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-10 w-96 h-96 bg-[#FFC928]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#7AC943]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto">
        {/* Top Navbar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onChangeHero}
              className="flex items-center gap-1.5 bg-white hover:bg-[#FFF3D9] text-[#35206F] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs border border-[#FFC928]/40 font-fredoka"
            >
              <span>🔄</span> Cambiar Compañero
            </button>
            {onOpenRegistration && (
              <button
                onClick={onOpenRegistration}
                className="flex items-center gap-1.5 bg-white hover:bg-[#FFF3D9] text-[#35206F] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs border border-[#7AC943]/40 font-fredoka"
              >
                <span>👤</span> <span>{fullName}</span> <span>✏️</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#FFC928] text-[#35206F] rounded-full px-3 py-1 text-xs sm:text-sm font-bold shadow-xs font-fredoka border border-white">
              <span>🥚</span>
              <span>{totalEggs} Misiones</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#7AC943] text-white rounded-full px-3 py-1 text-xs sm:text-sm font-bold shadow-xs font-fredoka border border-white">
              <span>⭐</span>
              <span>{totalStars}</span>
            </div>
          </div>
        </div>

        {/* Mascot Speech Bubble Card */}
        <div className="w-full bg-white rounded-3xl p-3.5 sm:p-4 mb-3 sm:mb-4 shadow-kg border-2 border-[#FFC928]/40 flex items-center gap-3.5 animate-[fadeIn_0.5s_ease-out]">
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => speakAndWait(hero.greeting)}
          >
            <HeroAvatar heroId={hero.id} size={70} talking={heroTalking} hasCrown={hasCrown} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs sm:text-sm font-bold text-[#35206F] font-fredoka">
                {hero.emoji} {hero.name} {hasCrown && '👑'}
              </span>
              <span className="text-[10px] bg-[#7AC943]/15 text-[#4F9A25] font-bold px-2 py-0.5 rounded-full font-fredoka">
                Compañero Activo
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#241A3D] leading-snug font-nunito">
              {speechText}
            </p>
          </div>
        </div>

        {/* Branding & Subtitle */}
        <div className="text-center mb-3">
          <h1 className="text-2xl sm:text-4xl font-bold font-fredoka text-[#35206F] mb-0.5">
            KidGenius <span className="text-[#7AC943]">Club</span> 🚀
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6280] font-bold font-nunito">
            Solo 15 minutos al día para convertir las matemáticas en tu aventura favorita
          </p>
        </div>

        {/* Difficulty Selection Modal */}
        {showDifficulty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShowDifficulty(false)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-[#FFC928] animate-[bounceIn_0.4s_ease-out]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-center mb-2">
                <HeroAvatar heroId={hero.id} size={85} talking={heroTalking} hasCrown={hasCrown} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-1 text-[#35206F] font-fredoka">
                ¿Qué nivel quieres practicar hoy? 🤔
              </h2>
              <p className="text-center text-[#6B6280] mb-4 text-xs sm:text-sm font-semibold font-nunito">
                Alineado de 1° a 6° de Primaria
              </p>
              <div className="space-y-2.5">
                {difficulties.map(diff => (
                  <button
                    key={diff.value}
                    onClick={() => handleDifficultySelect(diff)}
                    className={`w-full bg-gradient-to-r ${diff.color} text-white rounded-2xl py-3 px-5 text-base sm:text-lg font-bold
                      transform transition-all duration-200 hover:scale-103 active:scale-97 shadow-md font-fredoka text-left`}
                  >
                    <div>{diff.label}</div>
                    <span className="block text-xs font-normal opacity-90 font-nunito">{diff.sub}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDifficulty(false)}
                className="mt-3.5 w-full text-[#6B6280] hover:text-[#35206F] py-2 text-xs sm:text-sm font-bold font-fredoka text-center"
              >
                ← Volver a misiones
              </button>
            </div>
          </div>
        )}

        {/* Ruta de Aprendizaje y Bonos Desbloqueables */}
        <div className="w-full max-w-4xl mb-3 sm:mb-4 bg-white rounded-3xl p-3.5 sm:p-4 border-2 border-[#FFC928]/40 shadow-kg animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🗺️</span>
              <h2 className="text-xs sm:text-sm font-bold text-[#35206F] font-fredoka">
                Ruta de Recompensas y Bonos ({totalEggs} Misiones Superadas)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
            <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/40 shadow-2xs">
              <span className="text-base sm:text-lg block">🎨📄</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#35206F] block leading-tight font-fredoka">Lámina PDF</span>
              <span className="text-[9px] text-[#6B6280] font-bold block font-nunito">5 Misiones</span>
            </div>

            <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/40 shadow-2xs">
              <span className="text-base sm:text-lg block">{isPuzzleUnlocked ? '🔓🧩' : '🔒🧩'}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#35206F] block leading-tight font-fredoka">Rompecabezas</span>
              <span className="text-[9px] text-[#6B6280] font-bold block font-nunito">{isPuzzleUnlocked ? '¡LIBERADO!' : `${totalEggs}/12 Misiones`}</span>
            </div>

            <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/40 shadow-2xs">
              <span className="text-base sm:text-lg block">{isDiplomaUnlocked ? '📜🏆' : '🔒📜'}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#35206F] block leading-tight font-fredoka">Diploma Oficial</span>
              <span className="text-[9px] text-[#6B6280] font-bold block font-nunito">{isDiplomaUnlocked ? '¡LIBERADO!' : `${totalEggs}/15 Misiones`}</span>
            </div>

            <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/40 shadow-2xs">
              <span className="text-base sm:text-lg block">{hasCrown ? '👑✨' : '🔒👑'}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#35206F] block leading-tight font-fredoka">Corona de Genio</span>
              <span className="text-[9px] text-[#6B6280] font-bold block font-nunito">{hasCrown ? '¡PUESTA!' : `${totalEggs}/20 Misiones`}</span>
            </div>
          </div>

          <div className="space-y-2">
            {isPuzzleUnlocked && (
              <button
                onClick={() => { playSound('magic'); onOpenPuzzle && onOpenPuzzle(); }}
                className="w-full bg-gradient-to-r from-[#35206F] via-[#4B2C99] to-[#7AC943] text-white rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold transform hover:scale-102 active:scale-98 transition-all shadow-md font-fredoka flex items-center justify-center gap-2"
              >
                <span>🧩</span> <span>¡JUGAR ROMPECABEZAS CON {hero.name.toUpperCase()}!</span>
              </button>
            )}
            {isDiplomaUnlocked && (
              <button
                onClick={handleDownloadDiploma}
                disabled={downloadingDiploma}
                className="w-full bg-gradient-to-r from-[#FFC928] via-[#FF8A25] to-[#7AC943] text-white rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold transform hover:scale-102 active:scale-98 transition-all shadow-md font-fredoka flex items-center justify-center gap-2"
              >
                <span>📜</span> <span>{downloadingDiploma ? 'Generando diploma oficial...' : '¡DESCARGAR DIPLOMA OFICIAL KIDGENIUS CLUB (PDF)!'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 6 Math Game Modules Cards */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {gameCategories.map((cat, index) => {
              const eggsCount = activityEggs[cat.mode] || 0;
              const isUnlocked = eggsCount >= 5;
              return (
                <button
                  key={cat.mode}
                  onClick={() => handleCategoryClick(cat)}
                  className={`bg-white rounded-3xl p-4 md:p-5
                    transform transition-all duration-300 hover:scale-104 active:scale-96 shadow-kg hover:shadow-kg-lg
                    group relative overflow-hidden border-2 ${isUnlocked ? 'border-[#7AC943] ring-2 ring-[#7AC943]/40' : 'border-[#FFC928]/30 hover:border-[#FFC928]'}`}
                  style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.06}s both` }}
                >
                  {isUnlocked && (
                    <div className="absolute top-2 right-2 bg-[#7AC943] text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-xs font-fredoka animate-pulse">
                      🔓 RETO DOMINADO
                    </div>
                  )}

                  <div className="relative text-center">
                    <div className="text-3xl md:text-4xl mb-1 transform group-hover:scale-115 transition-transform duration-300">{cat.emoji}</div>
                    <h3 className="text-sm md:text-base font-bold text-[#35206F] mb-0.5 font-fredoka leading-tight">{cat.title}</h3>
                    <p className="text-[10px] md:text-xs text-[#6B6280] font-semibold mb-2 font-nunito leading-tight">{cat.description}</p>

                    <div className="inline-flex items-center justify-center gap-1.5 bg-[#FFF9EC] rounded-full px-3 py-0.5 border border-[#FFC928]/40">
                      <span className="text-xs">🥚</span>
                      <span className="text-[11px] font-bold text-[#35206F] font-fredoka">
                        {eggsCount}/5 {isUnlocked ? '🔓 Logrado' : 'Misiones'}
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
