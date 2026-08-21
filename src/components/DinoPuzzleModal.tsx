import React, { useState, useEffect } from 'react';
import { Hero } from '../data/heroes';
import { playSound, speakAndWait } from '../utils/speech';

interface DinoPuzzleModalProps {
  hero: Hero;
  onClose: () => void;
}

const DinoPuzzleModal: React.FC<DinoPuzzleModalProps> = ({ hero, onClose }) => {
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const imgSrc = hero.avatarImage || '/geni-mascot.png';

  // Mezclar rompecabezas al abrir
  useEffect(() => {
    shufflePuzzle();
    speakAndWait(
      `¡Te presento el Desafío de Rompecabezas con ${hero.name}! Toca dos piezas para intercambiarlas de lugar y armar la figura completa.`
    );
  }, [hero]);

  const shufflePuzzle = () => {
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Mezclar aleatoriamente
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setTiles(arr);
    setSelectedIdx(null);
    setSolved(false);
  };

  const handleTileClick = (index: number) => {
    if (solved) return;
    playSound('click');

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      if (selectedIdx !== index) {
        const newTiles = [...tiles];
        [newTiles[selectedIdx], newTiles[index]] = [newTiles[index], newTiles[selectedIdx]];
        setTiles(newTiles);

        // Verificar si está resuelto
        const isSolvedNow = newTiles.every((val, i) => val === i);
        if (isSolvedNow) {
          setSolved(true);
          playSound('victory');
          speakAndWait(
            `¡Espectacular! Completaste exitosamente el rompecabezas de KidGenius Club con ${hero.name}. ¡Gran demostración de talento!`
          );
        }
      }
      setSelectedIdx(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border-4 border-[#FFC928] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-black text-[#6B6280] hover:text-[#35206F] hover:scale-110 transition-transform"
        >
          ✕
        </button>

        <div className="inline-flex items-center gap-1.5 bg-[#35206F] text-white px-3 py-0.5 rounded-full text-xs font-bold font-fredoka mb-2">
          <span>🧩</span>
          <span>KIDGENIUS CLUB</span>
          <span>✨</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#35206F] mb-1 font-fredoka">
          Rompecabezas de {hero.name} 🌟
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6280] font-bold mb-3 font-nunito">
          {solved ? '🎉 ¡ROMPECABEZAS COMPLETADO CON ÉXITO!' : 'Toca una pieza y luego otra para intercambiarlas'}
        </p>

        {/* Tablero 3x3 de Rompecabezas */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto grid grid-cols-3 gap-1 bg-[#35206F] p-1.5 rounded-2xl shadow-inner border-2 border-[#FFC928] mb-4 overflow-hidden">
          {tiles.map((tileVal, currentIdx) => {
            const correctRow = Math.floor(tileVal / 3);
            const correctCol = tileVal % 3;

            return (
              <button
                key={currentIdx}
                onClick={() => handleTileClick(currentIdx)}
                className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedIdx === currentIdx
                    ? 'border-[#FFC928] ring-4 ring-[#FFC928]/60 scale-95 z-10'
                    : tileVal === currentIdx
                    ? 'border-[#7AC943]/80'
                    : 'border-[#4B2C99]/60 hover:scale-103'
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url(${imgSrc})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${(correctCol / 2) * 100}% ${(correctRow / 2) * 100}%`,
                  }}
                />
                {!solved && (
                  <span className="absolute top-1 left-1 bg-black/60 text-[#FFC928] text-[10px] font-bold px-1.5 rounded-full border border-white/30 font-fredoka">
                    {tileVal + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={shufflePuzzle}
            className="bg-[#FFC928] hover:bg-[#E0A800] text-[#35206F] font-bold px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-xs hover:scale-103 active:scale-97 transition-all font-fredoka"
          >
            🔀 Mezclar de nuevo
          </button>
          <button
            onClick={onClose}
            className="bg-[#7AC943] hover:bg-[#4F9A25] text-white font-bold px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-xs hover:scale-103 active:scale-97 transition-all font-fredoka"
          >
            ✅ Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DinoPuzzleModal;
