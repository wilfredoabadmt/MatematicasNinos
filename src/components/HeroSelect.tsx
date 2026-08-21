import React, { useEffect } from 'react';
import { heroes, Hero } from '../data/heroes';
import { PlayerProfile } from '../types';
import HeroAvatar from './HeroAvatar';
import { speakAndWait, speakAsync, playSound, stopSpeaking } from '../utils/speech';

interface HeroSelectProps {
  onSelectHero: (hero: Hero) => void;
  activeProfile?: PlayerProfile | null;
}

const HeroSelect: React.FC<HeroSelectProps> = ({ onSelectHero, activeProfile }) => {
  useEffect(() => {
    setTimeout(() => {
      const greetingName = activeProfile ? `${activeProfile.firstName}` : 'amigo';
      speakAndWait(`¡Hola, ${greetingName}! Elige a tu compañero favorito para comenzar tu aventura en KidGenius Club.`);
    }, 400);
    return () => stopSpeaking();
  }, [activeProfile]);

  const handleSelect = (hero: Hero) => {
    playSound('magic');
    stopSpeaking();
    speakAsync(hero.greeting);
    onSelectHero(hero);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EC] relative overflow-hidden flex flex-col justify-between p-4 sm:p-6">
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#7AC943]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FFC928]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col items-center">
        <div className="text-center mb-5 animate-[fadeInDown_0.6s_ease-out]">
          <div className="inline-flex items-center gap-1.5 bg-[#35206F] text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-sm mb-2 font-fredoka">
            <span>✨</span>
            <span>ELIGE TU COMPAÑERO DE AVENTURA</span>
            <span>✨</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#35206F] font-fredoka mb-1">
            ¿Quién te acompañará hoy en <span className="text-[#7AC943]">KidGenius</span>? 🌟
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6280] font-bold font-nunito">
            Cada compañero celebra tus logros y te ayuda a resolver cada reto matemático.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 w-full">
          {heroes.map((hero, index) => {
            const isFeatured = hero.id === 'geni';
            return (
              <button
                key={hero.id}
                onClick={() => handleSelect(hero)}
                className={`bg-white rounded-3xl p-4 sm:p-5
                  transform transition-all duration-300 hover:scale-104 active:scale-96
                  shadow-kg hover:shadow-kg-lg border-2 ${isFeatured ? 'border-[#7AC943] ring-2 ring-[#7AC943]/50' : 'border-[#FFC928]/40 hover:border-[#FFC928]'}
                  group relative overflow-hidden text-center flex flex-col items-center justify-between`}
                style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.07}s both` }}
              >
                {isFeatured && (
                  <div className="absolute top-2 right-2 bg-[#7AC943] text-white text-[9px] font-black px-2 py-0.5 rounded-full font-fredoka shadow-xs animate-pulse">
                    ★ MASCOTA OFICIAL
                  </div>
                )}

                <div className="my-2 flex justify-center transform group-hover:scale-108 transition-transform duration-300">
                  <HeroAvatar heroId={hero.id} size={80} talking />
                </div>

                <div className="w-full">
                  <h3 className="text-base sm:text-lg font-bold text-[#35206F] font-fredoka mb-0.5 leading-tight">
                    {hero.name}
                  </h3>
                  <p className="text-[11px] text-[#6B6280] font-semibold font-nunito mb-2">
                    {hero.movie}
                  </p>
                  <div className="w-full bg-[#FFF9EC] group-hover:bg-[#7AC943] group-hover:text-white text-[#35206F] text-xs font-bold py-1.5 rounded-xl border border-[#FFC928]/40 transition-colors font-fredoka">
                    ¡Elegir a {hero.name.split(' ')[0]}! 🚀
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSelect;
