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
      const greetingName = activeProfile ? `${activeProfile.firstName}` : 'amiguito';
      speakAndWait(`¡Hola ${greetingName}! Soy Daniela. ¡Elige a tu dinosaurio compañero favorito para comenzar!`);
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
    <div className="min-h-screen bg-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(/images/dino-bg.png)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-teal-950/70 to-amber-950/90" />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-5">
        <div className="text-center mb-5 animate-[fadeInDown_0.8s_ease-out]">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-emerald-300 to-amber-300 mb-2"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            🌋 ¡Elige tu Dinosaurio! 🌋
          </h1>
          <p className="text-base text-emerald-100 font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>
            🐾 ¿Quién será tu amiguito hoy? 🐾
          </p>
          <button onClick={() => speakAndWait('¡Elige tu dinosaurio jurásico!')}
            className="mt-2 text-3xl hover:scale-125 transition-transform" title="Escuchar">
            🔊
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 w-full max-w-4xl px-1">
          {heroes.map((hero, index) => (
            <button key={hero.id} onClick={() => handleSelect(hero)}
              className={`bg-gradient-to-br ${hero.gradient} rounded-2xl sm:rounded-3xl p-3 sm:p-5
                transform transition-all duration-300 hover:scale-105 active:scale-95
                shadow-xl hover:shadow-2xl border-2 border-white/30 group relative overflow-hidden`}
              style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both` }}>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl sm:rounded-3xl" />
              <div className="relative text-center">
                <div className="mb-1 sm:mb-2 flex justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <HeroAvatar heroId={hero.id} size={75} talking />
                </div>
                <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white drop-shadow-lg mb-0.5 leading-tight"
                  style={{ fontFamily: "'Fredoka One', cursive" }}>
                  {hero.emoji} {hero.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-amber-100 font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {hero.movie}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSelect;
