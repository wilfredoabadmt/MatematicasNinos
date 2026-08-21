import React from 'react';

interface HeroAvatarProps {
  heroId: string;
  size?: number;
  className?: string;
  talking?: boolean;
  celebrating?: boolean;
  sad?: boolean;
  hasCrown?: boolean;
}

const dinoImages: Record<string, string> = {
  geni: '/geni-mascot.png',
  dinosaurio: '/images/dinosaurio-frente.png',
  dinosauria: '/images/dinosauria.png',
  rexy: '/images/dino-rexy.png',
  tricy: '/images/dino-tricy.png',
  stego: '/images/dino-stego.png',
  bronto: '/images/dino-bronto.png',
  ptero: '/images/dino-ptero.png',
  rapto: '/images/dino-rapto.png',
};

const dinoNames: Record<string, string> = {
  geni: 'Geni Mascota KidGenius Club',
  dinosaurio: 'Dinosaurio Aventurero',
  dinosauria: 'Dinosauria Aventurera',
  rexy: 'Rexy el T-Rex',
  tricy: 'Tricy Triceratops',
  stego: 'Stego Estegosaurio',
  bronto: 'Bronto Brontosaurio',
  ptero: 'Ptero Pterodáctilo',
  rapto: 'Rapto Velociraptor',
};

const HeroAvatar: React.FC<HeroAvatarProps> = ({
  heroId,
  size = 130,
  className = '',
  talking = false,
  celebrating = false,
  sad = false,
  hasCrown = false,
}) => {
  const imgSrc = dinoImages[heroId] || dinoImages.geni || dinoImages.dinosaurio;

  const animClass = celebrating
    ? 'animate-bounce'
    : talking
    ? 'animate-[float_1.5s_ease-in-out_infinite]'
    : sad
    ? 'animate-[shake_0.5s_ease-in-out]'
    : '';

  return (
    <div
      className={`relative inline-block ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 20px rgba(53, 32, 111, 0.25))',
      }}
    >
      {/* Corona Dorada de Campeón KidGenius para 20 Logros */}
      {hasCrown && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl z-20 animate-bounce filter drop-shadow-md">
          👑
        </div>
      )}

      {/* Imagen del Personaje / Mascota */}
      <img
        src={imgSrc}
        alt={dinoNames[heroId] || 'Compañero KidGenius'}
        className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
        style={{ borderRadius: '20px' }}
      />

      {/* Speech effect indicator */}
      {talking && (
        <div className="absolute -top-1 -right-1 bg-[#FFC928] text-[#35206F] rounded-full p-1.5 shadow-lg animate-bounce text-xs font-bold border-2 border-white z-10">
          🔊
        </div>
      )}

      {/* Celebration sparkles */}
      {celebrating && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl animate-pulse z-10 whitespace-nowrap">
          ✨ 🌟 ✨
        </div>
      )}
    </div>
  );
};

export default HeroAvatar;
