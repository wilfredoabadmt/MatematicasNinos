import React, { useState } from 'react';
import { Hero } from '../data/heroes';
import { RewardItem } from '../types';
import { playSound, speakAndWait } from '../utils/speech';

interface EggHatchModalProps {
  hero: Hero;
  milestone: 5 | 12 | 15 | 20;
  playerName?: string;
  surpriseReward?: RewardItem;
  onClose: () => void;
  onAction?: () => void;
}

const EggHatchModal: React.FC<EggHatchModalProps> = ({ hero, milestone, playerName, surpriseReward, onClose, onAction }) => {
  const [cracks, setCracks] = useState(0);
  const [hatched, setHatched] = useState(false);

  React.useEffect(() => {
    const greetingName = playerName ? `${playerName}` : 'amiguito';
    speakAndWait(`¡Toca el huevo tres veces para descubrir tu premio sorpresa, ${greetingName}!`);
  }, [playerName]);

  const getRewardInfo = () => {
    if (surpriseReward) {
      return {
        title: surpriseReward.title,
        desc: surpriseReward.description,
        icon: surpriseReward.icon,
      };
    }

    switch (milestone) {
      case 5:
        return {
          title: '🎨 ¡Lámina PDF para Colorear!',
          desc: `¡Has ganado la Lámina de Regalo en PDF de ${hero.name} lista para pintar por números!`,
          icon: '🎨📄',
        };
      case 12:
        return {
          title: '🧩 ¡Juego de Rompecabezas Jurásico!',
          desc: `¡Has liberado el Juego de Rompecabezas de 3x3 de ${hero.name}!`,
          icon: '🧩🦖',
        };
      case 15:
        return {
          title: '📜 ¡Diploma Oficial de Campeón Jurásico!',
          desc: `¡Felicidades! Has ganado el Certificado Oficial de Maestro con ${hero.name}.`,
          icon: '📜🏆',
        };
      case 20:
        return {
          title: '👑 ¡Corona Dorada de Rey Rex!',
          desc: `¡${hero.name} ahora viste la Corona Dorada de Rey Jurásico!`,
          icon: '👑🦕',
        };
    }
  };

  const reward = getRewardInfo();

  const handleEggTap = () => {
    if (hatched) return;

    if (cracks < 2) {
      playSound('click');
      setCracks(prev => prev + 1);
    } else {
      setCracks(3);
      setHatched(true);
      playSound('victory');
      const greetingName = playerName ? `${playerName}` : 'campeón';
      speakAndWait(`¡Wao, felicidades ${greetingName}! ¡El huevo se rompió y ganaste tu ${reward.title}! ¡Eres un verdadero súper campeón jurásico!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="bg-gradient-to-b from-amber-50 to-yellow-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden">
        {/* Rayos de luz mágicos */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-300/30 via-transparent to-transparent animate-pulse pointer-events-none" />

        <h2 className="text-xl sm:text-2xl font-black text-amber-950 mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
          🐣 ¡HUEVO DE RECOMPENSA! 🐣
        </h2>
        <p className="text-xs sm:text-sm font-bold text-amber-800 mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {hatched ? '¡Premio Revelado!' : '¡Toca el Huevo 3 veces para hacerlo eclosionar!'}
        </p>

        {/* Huevo Mágico Interactivo */}
        <div className="my-6 flex justify-center items-center cursor-pointer" onClick={handleEggTap}>
          {!hatched ? (
            <div className={`relative transition-transform duration-200 ${cracks === 1 ? 'animate-[bounce_0.3s_ease-in-out]' : cracks === 2 ? 'scale-110 rotate-6' : 'hover:scale-105'}`}>
              <div className="text-8xl sm:text-9xl filter drop-shadow-2xl select-none">
                {cracks === 0 ? '🥚' : cracks === 1 ? '🥚' : '🐣'}
              </div>
              {cracks > 0 && (
                <span className="absolute inset-0 flex items-center justify-center text-4xl animate-ping">
                  ✨
                </span>
              )}
            </div>
          ) : (
            <div className="animate-[bounceIn_0.6s_ease-out] flex flex-col items-center">
              <div className="text-7xl sm:text-8xl mb-2 animate-bounce">{reward.icon}</div>
              <h3 className="text-lg sm:text-xl font-black text-emerald-950 mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
                {reward.title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 font-bold max-w-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {reward.desc}
              </p>
            </div>
          )}
        </div>

        {hatched && (
          <div className="space-y-2 mt-4">
            {onAction && (
              <button
                onClick={() => {
                  onClose();
                  onAction();
                }}
                className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-black py-3 px-4 rounded-2xl text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/40"
                style={{ fontFamily: "'Fredoka One', cursive" }}
              >
                🎉 ¡Usar Mi Recompensa Ahora!
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-amber-100 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-md"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              🏠 Continuar Jugando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EggHatchModal;
