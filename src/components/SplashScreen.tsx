import React, { useEffect, useState } from 'react';
import { PlayerProfile } from '../types';
import { speakAndWait, stopSpeaking, playSound } from '../utils/speech';
import HeroAvatar from './HeroAvatar';

interface SplashScreenProps {
  onContinue: (firstName: string, lastName: string) => void;
  activeProfile?: PlayerProfile | null;
  existingProfiles?: PlayerProfile[];
  onSelectExistingProfile?: (profile: PlayerProfile) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onContinue,
  activeProfile,
  existingProfiles = [],
  onSelectExistingProfile,
}) => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState(activeProfile?.firstName || '');
  const [lastName, setLastName] = useState(activeProfile?.lastName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 800),
      setTimeout(() => setStep(3), 1500),
      setTimeout(() => {
        setStep(4);
        const nameMsg = activeProfile ? `¡Bienvenido de nuevo ${activeProfile.firstName}!` : '¡Bienvenido a Dino Math! Escribe tu nombre para guardar tus premios.';
        speakAndWait(nameMsg);
      }, 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('¡Escribe tu nombre para guardar tus misiones y premios!');
      return;
    }
    playSound('magic');
    stopSpeaking();
    onContinue(firstName.trim(), lastName.trim());
  };

  return (
    <div className="min-h-screen bg-emerald-950 relative overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer">
      {/* Jurassic Background Effects */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url(/images/dino-bg.png)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-teal-950/60 to-amber-950/80" />
      <div className="absolute inset-0">
        <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-gradient-radial from-amber-500/30 via-orange-600/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-gradient-radial from-emerald-500/20 via-teal-600/10 to-transparent rounded-full blur-3xl" />

        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute bg-emerald-300/40 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`, animationDuration: `${Math.random() * 3 + 2}s`,
            }} />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg w-full px-2 my-auto">
        {/* Dinosaur Row */}
        <div className={`grid grid-cols-3 sm:flex justify-center items-end gap-2 sm:gap-3 mb-2 sm:mb-4 max-w-xs sm:max-w-none mx-auto transition-all duration-1000 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center"><HeroAvatar heroId="rexy" size={45} talking /></div>
          <div className="flex justify-center"><HeroAvatar heroId="tricy" size={45} /></div>
          <div className="flex justify-center"><HeroAvatar heroId="stego" size={50} celebrating /></div>
          <div className="flex justify-center"><HeroAvatar heroId="bronto" size={45} /></div>
          <div className="flex justify-center"><HeroAvatar heroId="ptero" size={40} /></div>
          <div className="flex justify-center"><HeroAvatar heroId="rapto" size={45} talking /></div>
        </div>

        {/* Title */}
        <div className={`transition-all duration-1000 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <h1 className="text-3xl sm:text-5xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-emerald-300">
              Dino Math 🌋
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`transition-all duration-1000 ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <p className="text-sm sm:text-lg text-white/95 font-bold mb-1 leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
            🌴 ¡Misiones de Matemáticas en el Valle Jurásico! 🌴
          </p>
        </div>

        {/* Formulario de Registro de Nombre y Apellido */}
        <div className={`my-3 bg-amber-50/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 border-2 border-amber-300 shadow-2xl transition-all duration-1000 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="flex items-center justify-center gap-1.5 mb-2 text-emerald-950 font-bold text-xs sm:text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>
            <span>📝</span>
            <span>REGISTRO DE CAMPEÓN MATEMÁTICO</span>
          </div>

          <form onSubmit={handleStart} className="space-y-2 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-amber-950 mb-0.5" style={{ fontFamily: "'Fredoka One', cursive" }}>
                  👤 Nombre del Niño/a:
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => { setFirstName(e.target.value); setError(''); }}
                  placeholder="Ej: Mateo"
                  className="w-full bg-white border border-amber-300 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-emerald-950 shadow-inner outline-none"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-950 mb-0.5" style={{ fontFamily: "'Fredoka One', cursive" }}>
                  🐾 Apellido:
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Ej: Ramírez"
                  className="w-full bg-white border border-amber-300 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-emerald-950 shadow-inner outline-none"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                />
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 font-extrabold text-center animate-shake" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {error}
              </p>
            )}

            <button type="submit"
              className="w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-600 text-white rounded-xl py-3 text-sm sm:text-base font-bold
                transform hover:scale-105 active:scale-95 transition-all shadow-xl animate-pulse border border-white/30
                flex items-center justify-center gap-2 whitespace-nowrap mt-2"
              style={{ fontFamily: "'Fredoka One', cursive" }}>
              <span>🌋</span>
              <span>¡GUARDAR PERFIL Y ENTRAR AL VALLE!</span>
              <span>🌋</span>
            </button>
          </form>

          {/* Selección de Jugador Existente */}
          {existingProfiles.length > 0 && onSelectExistingProfile && (
            <div className="mt-3 border-t border-amber-200/80 pt-2 text-left">
              <p className="text-[11px] font-bold text-amber-900 mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
                👥 O seleccionar perfil guardado:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {existingProfiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { playSound('click'); onSelectExistingProfile(p); }}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-lg px-2.5 py-1 text-[11px] font-bold shadow-xs flex items-center gap-1 border border-emerald-300"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    <span>👤</span>
                    <span>{p.firstName} {p.lastName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mockups de Premios */}
        <div className={`mb-3 bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-600/90 backdrop-blur-md rounded-2xl p-2.5 border border-amber-300 shadow-xl transition-all duration-1000 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <p className="text-[11px] sm:text-xs font-bold text-amber-950 flex items-center justify-center gap-1 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>
            <span>🎁 Premios Sorpresa Aleatorios: Láminas PDF • Diplomas • Rompecabezas • Corona Dorada</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
