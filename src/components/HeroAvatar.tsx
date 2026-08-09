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
  rexy: '/images/dino-rexy.png',
  tricy: '/images/dino-tricy.png',
  stego: '/images/dino-stego.png',
  bronto: '/images/dino-bronto.png',
  ptero: '/images/dino-ptero.png',
  rapto: '/images/dino-rapto.png',
};

const dinoNames: Record<string, string> = {
  rexy: 'Rexy el T-Rex Pixar 3D',
  tricy: 'Tricy Triceratops Pixar 3D',
  stego: 'Stego Estegosaurio Pixar 3D',
  bronto: 'Bronto Brontosaurio Pixar 3D',
  ptero: 'Ptero Pterodáctilo Pixar 3D',
  rapto: 'Rapto Velociraptor Pixar 3D',
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
  const imgSrc = dinoImages[heroId] || dinoImages.rexy;

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
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
      }}
    >
      {/* Corona Dorada de Rey Rex para 20 Huevos */}
      {hasCrown && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl z-20 animate-bounce filter drop-shadow-md">
          👑
        </div>
      )}

      {/* Pixar 3D Rendered Dinosaur Image - Clean display */}
      <img
        src={imgSrc}
        alt={dinoNames[heroId] || 'Dinosaurio Pixar'}
        className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
        style={{ borderRadius: '24px' }}
      />

      {/* Speech effect indicator */}
      {talking && (
        <div className="absolute -top-1 -right-1 bg-emerald-400 text-emerald-950 rounded-full p-1.5 shadow-lg animate-bounce text-xs font-bold border border-white/50 z-10">
          🔊
        </div>
      )}

      {/* Celebration sparkles */}
      {celebrating && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl animate-pulse z-10">
          ✨ ⭐ ✨
        </div>
      )}
    </div>
  );
};

export default HeroAvatar;
