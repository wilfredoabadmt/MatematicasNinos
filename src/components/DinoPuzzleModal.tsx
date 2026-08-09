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

  // Mezclar rompecabezas al abrir
  useEffect(() => {
    shufflePuzzle();
    speakAndWait(`¡Te presento el Desafío de Rompecabezas de ${hero.name}! Toca dos piezas para intercambiarlas de lugar y completar la imagen.`);
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
          speakAndWait(`¡Espectacular! Completaste exitosamente el rompecabezas jurásico de ${hero.name}. ¡Gran demostración de talento!`);
        }
      }
      setSelectedIdx(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-amber-50 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border-4 border-amber-400 text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl font-black text-amber-900 hover:scale-125 transition-transform">
          ❌
        </button>

        <h2 className="text-xl sm:text-3xl font-extrabold text-emerald-950 mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
          🧩 Rompecabezas de {hero.name} 🦖
        </h2>
        <p className="text-xs sm:text-sm text-emerald-800 font-bold mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {solved ? '🎉 ¡ROMPECABEZAS COMPLETADO CON ÉXITO!' : 'Toca una pieza y luego otra para intercambiarlas'}
        </p>

        {/* Tablero 3x3 de Rompecabezas */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto grid grid-cols-3 gap-1 bg-amber-900 p-1.5 rounded-2xl shadow-inner border-2 border-amber-500 mb-4 overflow-hidden">
          {tiles.map((tileVal, currentIdx) => {
            const correctRow = Math.floor(tileVal / 3);
            const correctCol = tileVal % 3;

            return (
              <button
                key={currentIdx}
                onClick={() => handleTileClick(currentIdx)}
                className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedIdx === currentIdx
                    ? 'border-yellow-400 ring-4 ring-yellow-300 scale-95 z-10'
                    : tileVal === currentIdx
                    ? 'border-emerald-400/80'
                    : 'border-amber-700/60 hover:scale-105'
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url(/images/dino-${hero.id}.png)`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${(correctCol / 2) * 100}% ${(correctRow / 2) * 100}%`,
                  }}
                />
                {!solved && (
                  <span className="absolute top-1 left-1 bg-black/60 text-amber-200 text-[10px] font-bold px-1.5 rounded-full border border-white/30">
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
            className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            🔀 Mezclar de nuevo
          </button>
          <button
            onClick={onClose}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            ✅ Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DinoPuzzleModal;
