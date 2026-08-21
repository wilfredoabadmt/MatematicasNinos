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
      setError('¡Escribe tu nombre para guardar tus logros!');
      return;
    }
    playSound('magic');
    onSaveProfile(firstName.trim(), lastName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-[#FFC928] relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-xl font-bold text-[#6B6280] hover:text-[#35206F] hover:scale-110 transition-transform"
          >
            ✕
          </button>
        )}

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-[#35206F] text-white px-3 py-0.5 rounded-full text-xs font-bold font-fredoka mb-2">
            <span>✨</span>
            <span>KIDGENIUS CLUB</span>
            <span>✨</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#35206F] font-fredoka">
            Registro de Campeón
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#6B6280] font-nunito">
            Ingresa tu Nombre y Apellido para guardar tus diplomas, misiones y premios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-[#241A3D] mb-1 font-fredoka">
              👤 Nombre del Niño / Niña:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={e => {
                setFirstName(e.target.value);
                setError('');
              }}
              placeholder="Ej: Mateo"
              className="w-full bg-[#FFF9EC] border-2 border-[#FFC928]/40 focus:border-[#7AC943] rounded-2xl py-2.5 px-3.5 text-sm font-bold text-[#241A3D] shadow-inner outline-none transition-all font-nunito"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241A3D] mb-1 font-fredoka">
              🎒 Apellido:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Ej: Ramírez"
              className="w-full bg-[#FFF9EC] border-2 border-[#FFC928]/40 focus:border-[#7AC943] rounded-2xl py-2.5 px-3.5 text-sm font-bold text-[#241A3D] shadow-inner outline-none transition-all font-nunito"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-extrabold text-center animate-shake font-nunito">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#7AC943] hover:bg-[#4F9A25] text-white font-bold py-3.5 px-4 rounded-2xl text-base shadow-md hover:scale-102 active:scale-98 transition-all font-fredoka flex items-center justify-center gap-2 mt-2"
          >
            <span>🚀</span>
            <span>¡GUARDAR Y EMPEZAR!</span>
            <span>⭐</span>
          </button>
        </form>

        {/* Existing Profiles List */}
        {existingProfiles.length > 0 && onSelectExistingProfile && (
          <div className="mt-3.5 border-t border-[#FFF3D9] pt-2.5">
            <p className="text-xs font-bold text-[#6B6280] mb-2 text-center font-fredoka">
              👥 O selecciona un perfil existente:
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {existingProfiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => {
                    playSound('click');
                    onSelectExistingProfile(profile);
                  }}
                  className="w-full bg-[#FFF9EC] hover:bg-[#FFF3D9] border border-[#FFC928]/40 rounded-xl px-3 py-2 text-left flex items-center justify-between transition-all hover:scale-101"
                >
                  <span className="text-xs font-bold text-[#35206F] font-nunito">
                    👤 {profile.firstName} {profile.lastName}
                  </span>
                  <span className="text-[10px] font-bold text-[#35206F] bg-[#FFC928] px-2 py-0.5 rounded-full font-fredoka">
                    🥚 {Object.values(profile.activityEggs || {}).reduce((a, b) => a + b, 0)} Misiones
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
