import React, { useEffect, useState } from 'react';
import { Hero } from '../data/heroes';
import { GameMode, PlayerProfile } from '../types';
import HeroAvatar from './HeroAvatar';
import { speakAndWait, playSound, stopSpeaking } from '../utils/speech';
import { generateColoringPDF } from '../utils/pdfGenerator';

interface ResultsScreenProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  bestStreak: number;
  earnedStars: number;
  hero: Hero;
  mode: GameMode;
  activityEggs?: Record<string, number>;
  totalEggs?: number;
  activeProfile?: PlayerProfile | null;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onOpenPuzzle?: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score, correctAnswers, totalQuestions, bestStreak, earnedStars, hero, mode, activityEggs = {}, totalEggs = 0, activeProfile, onPlayAgain, onBackToMenu, onOpenPuzzle,
}) => {
  const [showStars, setShowStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [heroTalking, setHeroTalking] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const currentModeEggs = activityEggs[mode] || 0;
  const isPDFUnlocked = currentModeEggs >= 5;
  const isPuzzleUnlocked = totalEggs >= 12;
  const fullName = activeProfile ? `${activeProfile.firstName} ${activeProfile.lastName}`.trim() : 'Campeón Jurásico';

  useEffect(() => {
    if (earnedStars > 0) {
      const timer = setInterval(() => {
        setShowStars(prev => {
          if (prev >= earnedStars) { clearInterval(timer); return prev; }
          return prev + 1;
        });
      }, 600);
      setShowConfetti(true);
      playSound('victory');
      return () => clearInterval(timer);
    }
  }, [earnedStars]);

  // Hero speaks results
  useEffect(() => {
    const speakResults = async () => {
      await new Promise(r => setTimeout(r, 600));
      setHeroTalking(true);
      const nameText = activeProfile ? `${activeProfile.firstName}` : 'campeón';
      if (isPDFUnlocked) {
        await speakAndWait(`¡Excelente trabajo, ${nameText}! ${hero.victoryMessage} ¡Alcanzaste 5 huevos jurásicos y desbloqueaste tu regalo especial en PDF listo para colorear! ¡Espléndido resultado!`);
      } else {
        await speakAndWait(`¡Qué maravilla, ${nameText}! ${hero.victoryMessage} Ganaste ${earnedStars} estrellas brillantes y un nuevo huevo jurásico. ¡Sigue adelante para desbloquear más sorpresas!`);
      }
      setHeroTalking(false);
    };
    speakResults();
    return () => stopSpeaking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownloadPDF = async () => {
    playSound('magic');
    setDownloadingPDF(true);
    try {
      await generateColoringPDF(hero, score, earnedStars, fullName);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const getMessage = () => {
    if (percentage >= 90) return '🏆 ¡RUGIDO EXTRAORDINARIO! ¡Un verdadero Rey Jurásico!';
    if (percentage >= 70) return '🌟 ¡GRAN TRIUNFO JURÁSICO! ¡Increíble trabajo!';
    if (percentage >= 50) return '💪 ¡BUEN ESFUERZO DE DINOSAURIO! ¡Sigue practicando!';
    return '🌈 ¡Sigue caminando por el valle! ¡Tú puedes!';
  };

  const getGradient = () => {
    if (percentage >= 90) return 'from-emerald-800 via-teal-900 to-amber-950';
    if (percentage >= 70) return 'from-amber-800 via-orange-900 to-emerald-950';
    if (percentage >= 50) return 'from-teal-800 via-emerald-900 to-cyan-950';
    return 'from-purple-900 via-indigo-950 to-emerald-950';
  };

  const listenAgain = async () => {
    stopSpeaking();
    setHeroTalking(true);
    if (isPDFUnlocked) {
      await speakAndWait(`${hero.victoryMessage} Toca el botón dorado para descargar tu lámina para colorear.`);
    } else {
      await speakAndWait(`Llevas acumulados ${currentModeEggs} de 5 huevos para desbloquear tu lámina PDF. ¡Sigue jugando con mucho entusiasmo!`);
    }
    setHeroTalking(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getGradient()} relative overflow-hidden flex items-center justify-center p-4`}>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute animate-[confettiFall_3s_ease-in_forwards]"
              style={{ left: `${Math.random() * 100}%`, top: '-10%', animationDelay: `${Math.random() * 2}s`, fontSize: `${Math.random() * 18 + 14}px` }}>
              {['🎉', '🥚', '🐾', '🌿', '🎨', '🌋', hero.emoji, hero.icon][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 bg-amber-50/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-7 max-w-lg w-full animate-[bounceIn_0.8s_ease-out] border-3 sm:border-4 border-amber-300">
        <div className="flex justify-center mb-2 sm:mb-3">
          <HeroAvatar heroId={hero.id} size={90} celebrating={percentage >= 50} sad={percentage < 50} talking={heroTalking} />
        </div>

        <div className="flex justify-center mb-2">
          <span className={`bg-gradient-to-r ${hero.gradient} text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg`}
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            {hero.emoji} {hero.name}
          </span>
        </div>

        {/* Earned Dino Eggs / Stars */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          {[1, 2, 3].map(star => (
            <div key={star} className={`text-4xl sm:text-5xl transition-all duration-700 ${showStars >= star ? 'scale-100 opacity-100 animate-[bounceIn_0.5s_ease-out]' : 'scale-50 opacity-20 grayscale'}`}
              style={{ transitionDelay: `${star * 0.3}s` }}>🥚</div>
          ))}
        </div>

        <h2 className="text-base sm:text-xl font-bold text-center text-emerald-950 mb-2 sm:mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>{getMessage()}</h2>

        <button onClick={listenAgain}
          className="mx-auto mb-3 sm:mb-4 flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-bold text-emerald-900 transition-all hover:scale-105"
          style={{ fontFamily: "'Nunito', sans-serif" }}>
          🔊 Escuchar a {hero.name}
        </button>

        <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
          <div className={`bg-gradient-to-br ${hero.gradient} rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center text-white`}>
            <p className="text-xl sm:text-2xl mb-0.5">✅</p>
            <p className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>{correctAnswers}/{totalQuestions}</p>
            <p className="text-[10px] font-semibold opacity-90">Correctas</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center text-white">
            <p className="text-xl sm:text-2xl mb-0.5">🏆</p>
            <p className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>{score}</p>
            <p className="text-[10px] font-semibold opacity-90">Puntos Jurásicos</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center text-white">
            <p className="text-xl sm:text-2xl mb-0.5">🔥</p>
            <p className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>{bestStreak}</p>
            <p className="text-[10px] font-semibold opacity-90">Mejor racha</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center text-white">
            <p className="text-xl sm:text-2xl mb-0.5">📊</p>
            <p className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>{percentage}%</p>
            <p className="text-[10px] font-semibold opacity-90">Precisión</p>
          </div>
        </div>

        {/* Botón de Premio PDF para Colorear (DESBLOQUEADO A LOS 5 HUEVOS) */}
        {isPDFUnlocked ? (
          <button onClick={handleDownloadPDF} disabled={downloadingPDF}
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 rounded-xl sm:rounded-2xl py-3 px-4 text-xs sm:text-base font-black transform hover:scale-105 active:scale-95 transition-all shadow-xl border-2 border-white/40 flex items-center justify-center gap-2 animate-pulse mb-2"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            <span>🎨</span>
            <span>{downloadingPDF ? 'Generando lámina...' : `¡DESCARGAR PREMIO: LÁMINA DE ${hero.name.toUpperCase()} PARA COLOREAR!`}</span>
            <span>📄</span>
          </button>
        ) : (
          <div className="w-full bg-amber-900/10 border-2 border-amber-300/80 rounded-xl sm:rounded-2xl py-2.5 px-3 text-center mb-2">
            <p className="text-xs font-bold text-amber-950 flex items-center justify-center gap-1.5" style={{ fontFamily: "'Fredoka One', cursive" }}>
              <span>🔒</span>
              <span>Lámina PDF para Colorear: junta 5 huevos ({currentModeEggs}/5)</span>
            </p>
          </div>
        )}

        {/* Botón de Juego de Rompecabezas (DESBLOQUEADO A LOS 12 HUEVOS) */}
        {isPuzzleUnlocked ? (
          <button onClick={() => { playSound('magic'); onOpenPuzzle && onOpenPuzzle(); }}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl py-3 px-4 text-xs sm:text-base font-black transform hover:scale-105 active:scale-95 transition-all shadow-xl border-2 border-yellow-300 flex items-center justify-center gap-2 animate-bounce mb-3"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            <span>🧩</span>
            <span>¡DESAFÍO 12 HUEVOS LIBERADO! JUGAR ROMPECABEZAS DE {hero.name.toUpperCase()}</span>
            <span>🦖</span>
          </button>
        ) : (
          <div className="w-full bg-indigo-950/20 border border-indigo-300/50 rounded-xl py-2 px-3 text-center mb-3">
            <p className="text-[11px] font-bold text-indigo-950" style={{ fontFamily: "'Nunito', sans-serif" }}>
              🔒 Juego de Rompecabezas Jurásico: reúne 12 huevos totales ({totalEggs}/12)
            </p>
          </div>
        )}

        <div className="space-y-2">
          <button onClick={() => { playSound('magic'); stopSpeaking(); onPlayAgain(); }}
            className={`w-full bg-gradient-to-r ${hero.gradient} text-white rounded-xl sm:rounded-2xl py-3 sm:py-3.5 text-base sm:text-lg font-bold transform hover:scale-105 active:scale-95 transition-all shadow-lg`}
            style={{ fontFamily: "'Fredoka One', cursive" }}>🔄 ¡Jugar de nuevo en el valle!</button>
          <button onClick={() => { playSound('click'); stopSpeaking(); onBackToMenu(); }}
            className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 text-amber-100 rounded-xl sm:rounded-2xl py-3 sm:py-3.5 text-base sm:text-lg font-bold transform hover:scale-105 active:scale-95 transition-all shadow-lg"
            style={{ fontFamily: "'Fredoka One', cursive" }}>🏠 Volver al menú jurásico</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
