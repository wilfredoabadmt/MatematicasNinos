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

const EggHatchModal: React.FC<EggHatchModalProps> = ({
  hero,
  milestone,
  playerName,
  surpriseReward,
  onClose,
  onAction,
}) => {
  const [cracks, setCracks] = useState(0);
  const [hatched, setHatched] = useState(false);

  React.useEffect(() => {
    const greetingName = playerName ? `${playerName}` : 'campeón';
    speakAndWait(
      `¡Toca el huevo tres veces para descubrir tu recompensa de KidGenius Club, ${greetingName}!`
    );
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
          desc: `¡Has desbloqueado la Lámina de KidGenius Club de ${hero.name} lista para pintar!`,
          icon: '🎨📄',
        };
      case 12:
        return {
          title: '🧩 ¡Rompecabezas Interactivo!',
          desc: `¡Has liberado el Juego de Rompecabezas de 3x3 con ${hero.name}!`,
          icon: '🧩🌟',
        };
      case 15:
        return {
          title: '📜 ¡Diploma Oficial KidGenius Club!',
          desc: `¡Felicidades! Has ganado el Certificado Oficial de Maestro Matemático con ${hero.name}.`,
          icon: '📜🏆',
        };
      case 20:
        return {
          title: '👑 ¡Corona Dorada de Genio!',
          desc: `¡${hero.name} ahora viste la Corona Dorada de Campeón de KidGenius Club!`,
          icon: '👑✨',
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
      speakAndWait(
        `¡Muchas felicidades, ${greetingName}! Acabas de ganar tu ${reward.title}. ¡Excelente logro en KidGenius Club!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-[#FFC928] text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-[#35206F] text-white px-3 py-0.5 rounded-full text-xs font-bold font-fredoka mb-2">
          <span>✨</span>
          <span>RECOMPENSA KIDGENIUS</span>
          <span>✨</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#35206F] mb-1 font-fredoka">
          🐣 ¡Huevo Sorpresa Desbloqueado! 🐣
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-[#6B6280] mb-3 font-nunito">
          {hatched ? '¡Premio Revelado con Éxito!' : '¡Toca el Huevo 3 veces para abrirlo!'}
        </p>

        {/* Huevo Mágico Interactivo */}
        <div className="my-5 flex justify-center items-center cursor-pointer" onClick={handleEggTap}>
          {!hatched ? (
            <div
              className={`relative transition-transform duration-200 ${
                cracks === 1
                  ? 'animate-[bounce_0.3s_ease-in-out]'
                  : cracks === 2
                  ? 'scale-110 rotate-6'
                  : 'hover:scale-105'
              }`}
            >
              <div className="text-8xl sm:text-9xl filter drop-shadow-lg select-none">
                {cracks === 0 ? '🥚' : cracks === 1 ? '🥚' : '🐣'}
              </div>
              {cracks > 0 && (
                <span className="absolute inset-0 flex items-center justify-center text-4xl animate-ping">
                  ✨
                </span>
              )}
            </div>
          ) : (
            <div className="animate-[bounceIn_0.5s_ease-out] flex flex-col items-center">
              <div className="text-7xl sm:text-8xl mb-2 animate-bounce">{reward.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-[#35206F] mb-1 font-fredoka">
                {reward.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6280] font-bold max-w-xs font-nunito">
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
                className="w-full bg-[#7AC943] hover:bg-[#4F9A25] text-white font-bold py-3 px-4 rounded-2xl text-sm sm:text-base shadow-md hover:scale-102 active:scale-98 transition-all font-fredoka"
              >
                🎉 ¡Ver Mi Recompensa Ahora!
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full bg-white hover:bg-[#FFF3D9] text-[#35206F] font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm border border-[#FFC928]/40 transition-all font-fredoka"
            >
              🏠 Continuar Practicando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EggHatchModal;
