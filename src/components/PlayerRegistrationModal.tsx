import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { playSound } from '../utils/speech';

interface PlayerRegistrationModalProps {
  onSaveProfile: (firstName: string, lastName: string) => void;
  onSelectExistingProfile?: (profile: PlayerProfile) => void;
  existingProfiles?: PlayerProfile[];
  onClose?: () => void;
}

const PlayerRegistrationModal: React.FC<PlayerRegistrationModalProps> = ({
  onSaveProfile,
  onSelectExistingProfile,
  existingProfiles = [],
  onClose,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('¡Escribe tu nombre para guardar tus premios!');
      return;
    }
    playSound('magic');
    onSaveProfile(firstName.trim(), lastName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-amber-900 hover:scale-125 transition-transform">
            ❌
          </button>
        )}

        <div className="text-center mb-4">
          <div className="text-4xl sm:text-5xl mb-2 animate-bounce">🦖📝</div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950" style={{ fontFamily: "'Fredoka One', cursive" }}>
            ¡REGISTRO DE CAMPEÓN JURÁSICO!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-emerald-800" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Ingresa tu Nombre y Apellido para guardar tus huevos, trofeos y diplomas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mb-4">
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
              👤 Nombre del Niño / Niña:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={e => { setFirstName(e.target.value); setError(''); }}
              placeholder="Ej: Mateo"
              className="w-full bg-white border-2 border-amber-300 focus:border-emerald-500 rounded-2xl py-3 px-4 text-base font-bold text-emerald-950 shadow-inner outline-none transition-all"
              style={{ fontFamily: "'Nunito', sans-serif" }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
              🐾 Apellido:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Ej: Ramírez"
              className="w-full bg-white border-2 border-amber-300 focus:border-emerald-500 rounded-2xl py-3 px-4 text-base font-bold text-emerald-950 shadow-inner outline-none transition-all"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-900 mb-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
              🎙️ Clave API ElevenLabs (Opcional para voz personalizada):
            </label>
            <input
              type="password"
              defaultValue={localStorage.getItem('dino_elevenlabs_api_key') || ''}
              onChange={e => localStorage.setItem('dino_elevenlabs_api_key', e.target.value.trim())}
              placeholder="Pega tu xi-api-key para voz de Daniela"
              className="w-full bg-white border border-amber-300 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs font-mono text-emerald-950 shadow-inner outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-extrabold text-center animate-shake" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-black py-3.5 px-4 rounded-2xl text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/40 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            <span>🌋</span>
            <span>¡GUARDAR MI PERFIL Y JUGAR!</span>
            <span>🌋</span>
          </button>
        </form>

        {/* Perfiles de Jugadores Existentes en el mismo dispositivo */}
        {existingProfiles.length > 0 && onSelectExistingProfile && (
          <div className="mt-4 border-t-2 border-amber-200 pt-3">
            <p className="text-xs font-bold text-amber-900 mb-2 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>
              👥 O selecciona un perfil existente:
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {existingProfiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => { playSound('click'); onSelectExistingProfile(profile); }}
                  className="w-full bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl px-3 py-2 text-left flex items-center justify-between transition-all hover:scale-102"
                >
                  <span className="text-xs font-bold text-emerald-950" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    👤 {profile.firstName} {profile.lastName}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    🥚 {Object.values(profile.activityEggs || {}).reduce((a, b) => a + b, 0)} Huevos
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerRegistrationModal;
