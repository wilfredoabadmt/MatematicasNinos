import React, { useEffect, useState } from 'react';
import { PlayerProfile } from '../types';
import { speakAndWait, stopSpeaking, playSound } from '../utils/speech';
import HeroAvatar from './HeroAvatar';

interface SplashScreenProps {
  onContinue: (firstName: string, lastName: string, parentEmail: string) => void;
  activeProfile?: PlayerProfile | null;
  existingProfiles?: PlayerProfile[];
  onSelectExistingProfile?: (profile: PlayerProfile) => void;
  parentEmail?: string;
  isPaidParent?: boolean;
  onVerifyParentEmail?: (email: string) => Promise<{ isPaid: boolean; email: string }>;
  onTogglePaidStatus?: (email: string, isPaid: boolean) => Promise<void>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onContinue,
  activeProfile,
  existingProfiles = [],
  onSelectExistingProfile,
  parentEmail: initialParentEmail = '',
  isPaidParent: initialIsPaid = false,
  onVerifyParentEmail,
  onTogglePaidStatus,
}) => {
  const [step, setStep] = useState(0);
  const [parentEmail, setParentEmail] = useState(initialParentEmail);
  const [isPaid, setIsPaid] = useState(initialIsPaid);
  const [isEmailVerified, setIsEmailVerified] = useState(Boolean(initialParentEmail && initialIsPaid));
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const [firstName, setFirstName] = useState(activeProfile?.firstName || '');
  const [lastName, setLastName] = useState(activeProfile?.lastName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 600),
      setTimeout(() => setStep(3), 1200),
      setTimeout(() => {
        setStep(4);
        const nameMsg = activeProfile
          ? `¡Hola de nuevo, ${activeProfile.firstName}! Qué gran alegría tenerte de regreso en KidGenius Club.`
          : '¡Te damos la bienvenida a KidGenius Club! Por favor, ingresa el correo de tu padre o tutor para comenzar tu aventura matemática.';
        speakAndWait(nameMsg);
      }, 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentEmail.trim() || !parentEmail.includes('@')) {
      setError('¡Por favor ingresa un correo electrónico válido!');
      return;
    }
    setError('');
    setVerifyingEmail(true);
    try {
      if (onVerifyParentEmail) {
        const res = await onVerifyParentEmail(parentEmail.trim());
        setIsPaid(res.isPaid);
        setIsEmailVerified(true);
        if (res.isPaid) {
          playSound('victory');
          speakAndWait('¡Excelente! Acceso a KidGenius Club confirmado. Ahora ingresa el nombre de tu campeón para comenzar.');
        } else {
          playSound('wrong');
          speakAndWait('Tu cuenta aún no registra acceso activo. Puedes activarla para disfrutar de todas las misiones.');
        }
      } else {
        setIsPaid(true);
        setIsEmailVerified(true);
      }
    } catch (_err) {
      setError('Error al verificar el correo. Intenta nuevamente.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleTogglePaidDemo = async () => {
    if (!parentEmail.trim() || !onTogglePaidStatus) return;
    try {
      await onTogglePaidStatus(parentEmail.trim(), true);
      setIsPaid(true);
      setIsEmailVerified(true);
      playSound('magic');
      speakAndWait('¡Fantástico! Acceso completo activado con éxito. ¡Aprenderemos matemáticas con una gran sonrisa!');
    } catch (_e) {}
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('¡Escribe el nombre del niño/a para guardar sus logros y diplomas!');
      return;
    }
    playSound('magic');
    stopSpeaking();
    onContinue(firstName.trim(), lastName.trim(), parentEmail.trim());
  };

  return (
    <div className="min-h-screen bg-[#FFF9EC] relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 text-[#241A3D]">
      {/* Background Shapes and Soft Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FFC928]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#7AC943]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-[#38A9E8]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full px-2 my-auto">
        {/* Character Row with Geni in center and Dinosaurs */}
        <div className={`flex justify-center items-end gap-3 sm:gap-5 mb-3 transition-all duration-1000 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex justify-center"><HeroAvatar heroId="dinosauria" size={55} /></div>
          <div className="flex justify-center transform scale-110"><HeroAvatar heroId="geni" size={80} talking celebrating /></div>
          <div className="flex justify-center"><HeroAvatar heroId="dinosaurio" size={60} /></div>
        </div>

        {/* Title & Brand Header */}
        <div className={`transition-all duration-1000 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="inline-flex items-center gap-1.5 bg-[#35206F] text-white px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold shadow-md mb-2 font-nunito">
            <span>✨</span>
            <span>KIDGENIUS CLUB</span>
            <span>✨</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-[#35206F] font-fredoka leading-tight">
            Convierte las Matemáticas en una <span className="text-[#7AC943]">Aventura</span> 🚀
          </h1>
          <p className="text-sm sm:text-base text-[#554A6D] font-bold font-nunito max-w-md mx-auto mb-3">
            Sin lágrimas, sin peleas: solo matemáticas con sonrisa junto a Geni y sus amigos.
          </p>
        </div>

        {/* PASO 1: Verificación de Correo Electrónico del Padre */}
        {!isEmailVerified || !isPaid ? (
          <div className={`my-2 bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#FFC928]/60 shadow-kg transition-all duration-1000 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="flex items-center justify-center gap-2 mb-3 text-[#35206F] font-bold text-sm sm:text-base font-fredoka">
              <span className="text-lg">📧</span>
              <span>ACCESO DE PADRE O TUTOR</span>
            </div>

            <form onSubmit={handleVerifyEmail} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-[#241A3D] mb-1 font-nunito">
                  ✉️ Correo Registrado en la Compra:
                </label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={e => { setParentEmail(e.target.value); setError(''); }}
                  placeholder="Ej: papa@ejemplo.com"
                  className="w-full bg-[#FFF9EC] border-2 border-[#FFC928]/50 focus:border-[#7AC943] rounded-2xl py-3 px-4 text-sm font-bold text-[#241A3D] shadow-inner outline-none transition-all font-nunito"
                  required
                />
              </div>

              {error && (
                <p className="text-xs sm:text-sm text-red-500 font-extrabold text-center animate-shake font-nunito">
                  {error}
                </p>
              )}

              {isEmailVerified && !isPaid && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-center text-red-900 space-y-2">
                  <p className="text-sm font-bold font-fredoka">
                    ⚠️ ACCESO PENDIENTE DE ACTIVACIÓN
                  </p>
                  <p className="text-xs font-semibold font-nunito leading-tight text-[#554A6D]">
                    El correo <span className="font-extrabold text-[#241A3D]">{parentEmail}</span> aún no registra membresía activa.
                  </p>
                  <button
                    type="button"
                    onClick={handleTogglePaidDemo}
                    className="w-full bg-[#7AC943] hover:bg-[#4F9A25] text-white rounded-xl py-2.5 text-xs sm:text-sm font-extrabold shadow-md hover:scale-102 active:scale-98 transition-all font-nunito"
                  >
                    ⚡ ACTIVAR ACCESO COMPLETO (MODO DEMO)
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={verifyingEmail}
                className="w-full bg-[#7AC943] hover:bg-[#4F9A25] text-white rounded-2xl py-3.5 text-sm sm:text-base font-extrabold
                  transform hover:scale-102 active:scale-98 transition-all shadow-md font-nunito
                  flex items-center justify-center gap-2"
              >
                <span>🔎</span>
                <span>{verifyingEmail ? 'VERIFICANDO...' : 'VERIFICAR Y ENTRAR A LA AVENTURA'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* PASO 2: Formulario de Registro de Niño/a */
          <div className={`my-2 bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#7AC943]/60 shadow-kg transition-all duration-1000 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="flex items-center justify-between gap-2 mb-3.5 text-[#35206F] font-bold text-sm sm:text-base border-b border-[#FFF3D9] pb-2 font-fredoka">
              <div className="flex items-center gap-1.5">
                <span>🌟</span>
                <span>PERFIL DE CAMPEÓN MATEMÁTICO</span>
              </div>
              <span className="text-xs bg-[#7AC943]/20 text-[#2F6B12] rounded-full px-3 py-0.5 font-extrabold border border-[#7AC943]/40 font-nunito">
                ✔ {parentEmail} (ACTIVO)
              </span>
            </div>

            <form onSubmit={handleStart} className="space-y-3.5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-extrabold text-[#241A3D] mb-1 font-nunito">
                    👤 Nombre del Niño/a:
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => { setFirstName(e.target.value); setError(''); }}
                    placeholder="Ej: Mateo"
                    className="w-full bg-[#FFF9EC] border-2 border-[#FFC928]/50 focus:border-[#7AC943] rounded-2xl py-3 px-4 text-sm font-bold text-[#241A3D] shadow-inner outline-none transition-all font-nunito"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-extrabold text-[#241A3D] mb-1 font-nunito">
                    🎒 Apellido:
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Ej: Ramírez"
                    className="w-full bg-[#FFF9EC] border-2 border-[#FFC928]/50 focus:border-[#7AC943] rounded-2xl py-3 px-4 text-sm font-bold text-[#241A3D] shadow-inner outline-none transition-all font-nunito"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs sm:text-sm text-red-500 font-extrabold text-center animate-shake font-nunito">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFC928] via-[#FF8A25] to-[#7AC943] text-white rounded-2xl py-3.5 px-4 text-base font-extrabold
                  transform hover:scale-102 active:scale-98 transition-all shadow-md font-nunito
                  flex items-center justify-center gap-2 mt-2"
              >
                <span>🚀</span>
                <span>¡GUARDAR Y EMPEZAR CON GENI!</span>
                <span>⭐</span>
              </button>
            </form>

            {/* Selección de Jugador Existente */}
            {existingProfiles.length > 0 && onSelectExistingProfile && (
              <div className="mt-4 border-t border-[#FFF3D9] pt-3 text-left">
                <p className="text-xs sm:text-sm font-extrabold text-[#554A6D] mb-2 font-nunito">
                  👥 O continúa con un perfil guardado:
                </p>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                  {existingProfiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { playSound('click'); onSelectExistingProfile(p); }}
                      className="bg-[#FFF9EC] hover:bg-[#FFF3D9] text-[#35206F] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold shadow-2xs flex items-center gap-1.5 border border-[#FFC928]/60 font-nunito"
                    >
                      <span>👤</span>
                      <span>{p.firstName} {p.lastName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature & Bonus Pill matching Landing Page */}
        <div className={`mt-3 bg-white/90 backdrop-blur-sm rounded-2xl py-2.5 px-4 border border-[#FFC928]/50 shadow-2xs transition-all duration-1000 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <p className="text-xs sm:text-sm text-[#35206F] flex items-center justify-center gap-2 text-center font-nunito">
            <span className="font-extrabold">🎁 Bonos Incluidos:</span>
            <span className="text-[#554A6D] font-bold">Láminas PDF • Rompecabezas • Diploma Oficial • Garantía</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
