import React, { useEffect, useState } from 'react';
import { Hero } from '../data/heroes';
import { GameMode, PlayerProfile } from '../types';
import HeroAvatar from './HeroAvatar';
import { speakAndWait, playSound, stopSpeaking } from '../utils/speech';
import { generateColoringPDF } from '../utils/pdfGenerator';
import { generateDiplomaPDF } from '../utils/diplomaGenerator';

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
  score,
  correctAnswers,
  totalQuestions,
  bestStreak,
  earnedStars,
  hero,
  mode,
  activityEggs = {},
  totalEggs = 0,
  activeProfile,
  onPlayAgain,
  onBackToMenu,
  onOpenPuzzle,
}) => {
  const [showStars, setShowStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [heroTalking, setHeroTalking] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingDiploma, setDownloadingDiploma] = useState(false);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const currentModeEggs = activityEggs[mode] || 0;
  const isPDFUnlocked = currentModeEggs >= 5;
  const isPuzzleUnlocked = totalEggs >= 12;
  const isDiplomaUnlocked = totalEggs >= 15;
  const fullName = activeProfile
    ? `${activeProfile.firstName} ${activeProfile.lastName}`.trim()
    : 'Campeón KidGenius';

  useEffect(() => {
    if (earnedStars > 0) {
      const timer = setInterval(() => {
        setShowStars(prev => {
          if (prev >= earnedStars) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
      setShowConfetti(true);
      playSound('victory');
      return () => clearInterval(timer);
    }
  }, [earnedStars]);

  // Hero speaks results
  useEffect(() => {
    const speakResults = async () => {
      await new Promise(r => setTimeout(r, 500));
      setHeroTalking(true);
      const nameText = activeProfile ? `${activeProfile.firstName}` : 'campeón';
      if (isPDFUnlocked) {
        await speakAndWait(
          `¡Excelente trabajo, ${nameText}! ${hero.victoryMessage} ¡Alcanzaste 5 misiones y desbloqueaste tu lámina especial de KidGenius Club lista para colorear!`
        );
      } else {
        await speakAndWait(
          `¡Qué maravilla, ${nameText}! ${hero.victoryMessage} Ganaste ${earnedStars} estrellas brillantes. ¡Sigamos practicando con una sonrisa!`
        );
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

  const handleDownloadDiploma = async () => {
    playSound('magic');
    setDownloadingDiploma(true);
    try {
      await generateDiplomaPDF(hero, score, totalEggs, fullName);
    } finally {
      setDownloadingDiploma(false);
    }
  };

  const getMessage = () => {
    if (percentage >= 90) return '🏆 ¡EXTRAORDINARIO! ¡Un verdadero Campeón KidGenius!';
    if (percentage >= 70) return '🌟 ¡GRAN TRIUNFO! ¡Lo estás haciendo increíble!';
    if (percentage >= 50) return '💪 ¡BUEN ESFUERZO! ¡La práctica hace al maestro!';
    return '🌈 ¡Cada día aprendes más! ¡Geni celebra tu esfuerzo!';
  };

  const listenAgain = async () => {
    stopSpeaking();
    setHeroTalking(true);
    if (isPDFUnlocked) {
      await speakAndWait(`${hero.victoryMessage} Toca el botón para descargar tu lámina para colorear.`);
    } else {
      await speakAndWait(
        `Llevas ${currentModeEggs} de 5 misiones para desbloquear tu lámina PDF. ¡Sigue adelante con mucho entusiasmo!`
      );
    }
    setHeroTalking(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EC] relative overflow-hidden flex items-center justify-center p-3 sm:p-5">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-[confettiFall_3s_ease-in_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 16 + 14}px`,
              }}
            >
              {['🎉', '⭐', '✨', '🥚', '🌟', hero.emoji, '🚀', '🏆'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 bg-white rounded-3xl shadow-kg-lg p-4 sm:p-7 max-w-lg w-full animate-[bounceIn_0.6s_ease-out] border-2 border-[#FFC928]/50">
        <div className="flex justify-center mb-2">
          <HeroAvatar
            heroId={hero.id}
            size={95}
            celebrating={percentage >= 50}
            sad={percentage < 50}
            talking={heroTalking}
          />
        </div>

        <div className="flex justify-center mb-2">
          <span className="bg-[#35206F] text-white px-3.5 py-1 rounded-full text-xs font-bold font-fredoka shadow-xs">
            {hero.emoji} {hero.name}
          </span>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-2">
          {[1, 2, 3].map(star => (
            <div
              key={star}
              className={`text-3xl sm:text-4xl transition-all duration-700 ${
                showStars >= star
                  ? 'scale-100 opacity-100 animate-[bounceIn_0.4s_ease-out]'
                  : 'scale-50 opacity-20 grayscale'
              }`}
              style={{ transitionDelay: `${star * 0.25}s` }}
            >
              ⭐
            </div>
          ))}
        </div>

        <h2 className="text-base sm:text-lg font-bold text-center text-[#35206F] mb-1 font-fredoka">
          {getMessage()}
        </h2>

        <button
          onClick={listenAgain}
          className="mx-auto mb-3 flex items-center gap-1.5 bg-[#FFF9EC] hover:bg-[#FFF3D9] text-[#35206F] rounded-full px-3 py-1 text-xs font-bold border border-[#FFC928]/40 transition-all font-nunito"
        >
          🔊 Escuchar a {hero.name.split(' ')[0]}
        </button>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/30">
            <p className="text-lg mb-0.5">✅</p>
            <p className="text-base sm:text-lg font-bold text-[#35206F] font-fredoka">{correctAnswers}/{totalQuestions}</p>
            <p className="text-[10px] font-semibold text-[#6B6280] font-nunito">Aciertos</p>
          </div>
          <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/30">
            <p className="text-lg mb-0.5">🏆</p>
            <p className="text-base sm:text-lg font-bold text-[#35206F] font-fredoka">{score}</p>
            <p className="text-[10px] font-semibold text-[#6B6280] font-nunito">Puntos</p>
          </div>
          <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/30">
            <p className="text-lg mb-0.5">🔥</p>
            <p className="text-base sm:text-lg font-bold text-[#35206F] font-fredoka">{bestStreak}</p>
            <p className="text-[10px] font-semibold text-[#6B6280] font-nunito">Mejor Racha</p>
          </div>
          <div className="bg-[#FFF9EC] rounded-2xl p-2.5 text-center border border-[#FFC928]/30">
            <p className="text-lg mb-0.5">📊</p>
            <p className="text-base sm:text-lg font-bold text-[#35206F] font-fredoka">{percentage}%</p>
            <p className="text-[10px] font-semibold text-[#6B6280] font-nunito">Precisión</p>
          </div>
        </div>

        {/* Bonus Unlocks in Results */}
        <div className="space-y-2 mb-3">
          {isPDFUnlocked ? (
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="w-full bg-gradient-to-r from-[#FFC928] via-[#FF8A25] to-[#7AC943] text-white rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold transform hover:scale-102 active:scale-98 transition-all shadow-md font-fredoka flex items-center justify-center gap-2"
            >
              <span>🎨</span>
              <span>{downloadingPDF ? 'Generando lámina...' : `¡DESCARGAR LÁMINA DE ${hero.name.toUpperCase()} PARA COLOREAR!`}</span>
              <span>📄</span>
            </button>
          ) : (
            <div className="w-full bg-[#FFF9EC] border border-[#FFC928]/40 rounded-2xl py-2 px-3 text-center">
              <p className="text-[11px] font-bold text-[#35206F] font-fredoka">
                🔒 Lámina para Colorear: junta 5 misiones ({currentModeEggs}/5)
              </p>
            </div>
          )}

          {isDiplomaUnlocked && (
            <button
              onClick={handleDownloadDiploma}
              disabled={downloadingDiploma}
              className="w-full bg-[#35206F] hover:bg-[#4B2C99] text-white rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold transform hover:scale-102 active:scale-98 transition-all shadow-md font-fredoka flex items-center justify-center gap-2"
            >
              <span>📜</span>
              <span>{downloadingDiploma ? 'Generando diploma...' : '¡DESCARGAR DIPLOMA OFICIAL KIDGENIUS (PDF)!'}</span>
              <span>🏆</span>
            </button>
          )}

          {isPuzzleUnlocked && (
            <button
              onClick={() => {
                playSound('magic');
                onOpenPuzzle && onOpenPuzzle();
              }}
              className="w-full bg-gradient-to-r from-[#35206F] to-[#7AC943] text-white rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold transform hover:scale-102 active:scale-98 transition-all shadow-md font-fredoka flex items-center justify-center gap-2"
            >
              <span>🧩</span>
              <span>¡JUGAR ROMPECABEZAS CON {hero.name.toUpperCase()}!</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              playSound('magic');
              stopSpeaking();
              onPlayAgain();
            }}
            className="w-full bg-[#7AC943] hover:bg-[#4F9A25] text-white rounded-2xl py-3 text-sm sm:text-base font-bold transform hover:scale-102 active:scale-98 transition-all shadow-md font-fredoka"
          >
            🔄 ¡Jugar otra misión de 15 min!
          </button>
          <button
            onClick={() => {
              playSound('click');
              stopSpeaking();
              onBackToMenu();
            }}
            className="w-full bg-white hover:bg-[#FFF3D9] text-[#35206F] rounded-2xl py-2.5 text-xs sm:text-sm font-bold border border-[#FFC928]/40 transition-all font-fredoka"
          >
            🏠 Volver al menú KidGenius
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
