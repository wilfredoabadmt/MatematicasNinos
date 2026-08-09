import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, Difficulty, Question, PlayerProfile, RewardItem } from '../types';
import { Hero, getRandomMessage } from '../data/heroes';
import { generateQuestion } from '../data/questions';
import { speakAndWait, playSound, stopSpeaking } from '../utils/speech';
import HeroAvatar from './HeroAvatar';
import ResultsScreen from './ResultsScreen';
import EggHatchModal from './EggHatchModal';
import { getRandomSurpriseReward } from '../utils/rewards';

interface GameScreenProps {
  mode: GameMode;
  difficulty: Difficulty;
  hero: Hero;
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
  activityEggs?: Record<string, number>;
  totalEggs?: number;
  onAddEgg?: (mode: GameMode) => void;
  onOpenPuzzle?: () => void;
  activeProfile?: PlayerProfile | null;
}

const TOTAL_QUESTIONS = 10;
const INITIAL_LIVES = 3;

const modeNames: Record<string, string> = {
  suma: '➕ Sumas Jurásicas', resta: '➖ Restas de Dinosaurio', multiplicacion: '✖️ Multiplicar Nidos',
  division: '➗ Repartir Frutas', completar: '🧩 Huevos Escondidos', comparar: '⚖️ ¿Quién es Mayor?',
};

const modeColors: Record<string, string> = {
  suma: 'from-emerald-800 via-teal-900 to-amber-950', resta: 'from-amber-800 via-orange-900 to-yellow-950',
  multiplicacion: 'from-purple-900 via-indigo-950 to-emerald-950', division: 'from-teal-800 via-emerald-900 to-cyan-950',
  completar: 'from-rose-900 via-pink-950 to-amber-950', comparar: 'from-yellow-800 via-amber-900 to-emerald-950',
};

const modeInstructions: Record<string, string> = {
  suma: 'Hoy te voy a explicar cómo resolver Sumas Jurásicas. Sumar es juntar dos cantidades para conocer el total. Cuenta los objetos en pantalla, suma ambas partes y selecciona la respuesta correcta. ¡Sé que te irá genial!',
  resta: 'Hoy te voy a explicar cómo resolver Restas de Dinosaurio. Restar es retirar una cantidad para saber cuántos nos quedan. Cuenta cuántos elementos permanecen al final y marca tu respuesta. ¡Acompañame!',
  multiplicacion: 'Hoy te voy a enseñar cómo Multiplicar Nidos. Multiplicar es sumar grupos que contienen la misma cantidad de elementos. Cuenta los grupos y multiplica. ¡Es fácil y divertido!',
  division: 'Hoy te voy a explicar cómo Repartir Frutas. Dividir es distribuir todo en partes exactamente iguales entre los dinosaurios. Descubre cuántos le tocan a cada uno.',
  completar: 'Hoy te enseñaré a descubrir los Huevos Escondidos. Tu misión es encontrar el número oculto que falta para completar la suma. ¡Cuenta con atención!',
  comparar: 'Hoy vamos a comparar números. Mira los dos grupos en pantalla y elige la cifra de mayor valor. ¡Adelante con toda tu confianza!',
};

const GameScreen: React.FC<GameScreenProps> = ({ mode, difficulty, hero, onBackToMenu, onAddStars, activityEggs = {}, totalEggs = 0, onAddEgg, onOpenPuzzle, activeProfile }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [question, setQuestion] = useState<Question>(generateQuestion(mode, difficulty));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [heroTalking, setHeroTalking] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [hatchMilestone, setHatchMilestone] = useState<5 | 12 | 15 | 20 | null>(null);
  const [surpriseReward, setSurpriseReward] = useState<RewardItem | undefined>(undefined);
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;
    return () => { unmountedRef.current = true; stopSpeaking(); };
  }, []);

  const safeSpeak = useCallback(async (text: string) => {
    if (unmountedRef.current) return;
    setHeroTalking(true);
    setMessage(text);
    await speakAndWait(text);
    if (!unmountedRef.current) setHeroTalking(false);
  }, []);

  const generateNewQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowMessage(false);
    setWaiting(false);
    setQuestion(generateQuestion(mode, difficulty));
  }, [mode, difficulty]);

  useEffect(() => {
    if (showIntro) {
      const greetingName = activeProfile ? `${activeProfile.firstName}` : 'amigo';
      const introText = `¡Hola, ${greetingName}! Te saluda Daniela. Junto a ${hero.name} te acompañaremos en esta misión. ${modeInstructions[mode] || ''}`;
      safeSpeak(introText);
    }
  }, [showIntro, hero.name, mode, safeSpeak, activeProfile]);

  const handleStartQuestionsNow = () => {
    stopSpeaking();
    setShowIntro(false);
    safeSpeak(question.questionSpeech);
  };

  const handleAnswer = async (answer: number) => {
    if (selectedAnswer !== null || waiting) return;
    setSelectedAnswer(answer);
    stopSpeaking();
    setWaiting(true);

    try {
      const correct = answer === question.correctAnswer;
      setIsCorrect(correct);

      if (correct) {
        const bonus = 100 + (streak * 20);
        setScore(prev => prev + bonus);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        setCorrectAnswers(prev => prev + 1);
        playSound('correct');

        const prevEggs = activityEggs[mode] || 0;
        onAddEgg?.(mode);

        const nextModeEggs = prevEggs + 1;
        const nextTotalEggs = totalEggs + 1;

        if (nextModeEggs === 5 || nextTotalEggs === 12 || nextTotalEggs === 15 || nextTotalEggs === 20) {
          const reward = getRandomSurpriseReward(activeProfile?.unlockedRewards || []);
          setSurpriseReward(reward);
          const milestoneVal = (nextModeEggs === 5 ? 5 : nextTotalEggs === 12 ? 12 : nextTotalEggs === 15 ? 15 : 20) as 5 | 12 | 15 | 20;
          setHatchMilestone(milestoneVal);
        } else {
          const msg = getRandomMessage(hero.correctMessages);
          setShowMessage(true);
          await safeSpeak(`¡Sí! ${msg}`);
        }
      } else {
        setStreak(0);
        setLives(prev => prev - 1);
        playSound('wrong');
        setShakeWrong(true);
        setTimeout(() => setShakeWrong(false), 500);

        const wrongMsg = getRandomMessage(hero.wrongMessages);
        setShowMessage(true);

        const teachText = `Era el ${question.correctAnswer}. ${wrongMsg}`;
        await safeSpeak(teachText);
      }

      await new Promise(r => setTimeout(r, 400));

      const newLives = lives - (correct ? 0 : 1);
      if (currentQ + 1 >= TOTAL_QUESTIONS || newLives <= 0) {
        setShowResults(true);
      } else {
        setCurrentQ(prev => prev + 1);
        generateNewQuestion();
      }
    } finally {
      setWaiting(false);
    }
  };

  const handleRepeat = () => {
    stopSpeaking();
    playSound('click');
    setIsCorrect(null);
    setShowMessage(true);
    setHeroTalking(true);
    setMessage(question.questionSpeech);
    speakAndWait(question.questionSpeech).then(() => {
      if (!unmountedRef.current) setHeroTalking(false);
    });
  };

  const handleTeachMe = async () => {
    stopSpeaking();
    playSound('magic');
    setIsCorrect(null);
    setShowMessage(true);
    const hintText = question.teachSpeech ? `💡 Pista: ${question.teachSpeech}` : '💡 Pista: cuenta los objetos para responder.';
    await safeSpeak(hintText);
  };

  if (showResults) {
    const earnedStars = correctAnswers >= 9 ? 3 : correctAnswers >= 7 ? 2 : correctAnswers >= 5 ? 1 : 0;
    return (
      <ResultsScreen score={score} correctAnswers={correctAnswers} totalQuestions={TOTAL_QUESTIONS}
        bestStreak={bestStreak} earnedStars={earnedStars} hero={hero} mode={mode} activityEggs={activityEggs} totalEggs={totalEggs}
        activeProfile={activeProfile}
        onOpenPuzzle={onOpenPuzzle}
        onPlayAgain={() => {
          onAddStars(earnedStars);
          setCurrentQ(0); setScore(0); setLives(INITIAL_LIVES); setStreak(0); setBestStreak(0);
          setCorrectAnswers(0); setShowResults(false); setShowIntro(false);
          generateNewQuestion();
        }}
        onBackToMenu={() => { onAddStars(earnedStars); stopSpeaking(); onBackToMenu(); }}
      />
    );
  }

  const progress = (currentQ / TOTAL_QUESTIONS) * 100;

  if (showIntro) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${modeColors[mode]} relative overflow-hidden flex items-center justify-center p-4`}>
        <div className="relative z-10 text-center animate-[bounceIn_0.8s_ease-out]">
          <HeroAvatar heroId={hero.id} size={140} talking={heroTalking} />
          <div className="mt-3 bg-amber-50/95 rounded-3xl px-6 py-5 shadow-2xl max-w-md mx-auto border-4 border-amber-300">
            <h2 className="text-2xl font-bold text-emerald-950 mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>{modeNames[mode]}</h2>
            <p className="text-xs text-amber-900 font-bold mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
              🌟 ¡{hero.name} te enseña a resolver!
            </p>
            <p className="text-xs text-emerald-900 bg-emerald-100/90 rounded-2xl px-4 py-3 mb-4 font-bold border border-emerald-300 leading-relaxed shadow-inner" style={{ fontFamily: "'Nunito', sans-serif" }}>
              🔊 {message || 'Escuchando la lección jurásica...'}
            </p>

            <button onClick={handleStartQuestionsNow}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white rounded-2xl py-3.5 px-4 text-base sm:text-lg font-bold
                transform hover:scale-105 active:scale-95 transition-all shadow-xl animate-pulse border border-white/30
                inline-flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ fontFamily: "'Fredoka One', cursive" }}>
              <span>🚀</span>
              <span>¡IR A LAS PREGUNTAS!</span>
              <span>🚀</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${modeColors[mode]} relative overflow-hidden`}>
      {/* Modal de Eclosión de Huevo Interactivo */}
      {hatchMilestone !== null && (
        <EggHatchModal
          hero={hero}
          milestone={hatchMilestone}
          playerName={activeProfile ? `${activeProfile.firstName}` : undefined}
          surpriseReward={surpriseReward}
          onClose={() => { setHatchMilestone(null); setSurpriseReward(undefined); }}
          onAction={() => {
            if ((hatchMilestone === 12 || surpriseReward?.type === 'puzzle') && onOpenPuzzle) {
              onOpenPuzzle();
            }
          }}
        />
      )}

      {/* Hábitat natural Jurásico en el fondo de la pantalla de operaciones */}
      <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: 'url(/images/dino-bg.png)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-teal-950/60 to-amber-950/80" />

      <div className="relative z-10 min-h-screen flex flex-col p-3 md:p-5">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => { stopSpeaking(); onBackToMenu(); }}
            className="bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 rounded-full px-3 py-1.5 font-bold transition-all text-sm border border-emerald-500/40"
            style={{ fontFamily: "'Nunito', sans-serif" }}>← Menú Jurásico</button>
          <div className="flex items-center gap-2 bg-amber-500/90 rounded-full px-3 py-1.5 border border-amber-300">
            <span className="text-lg">🏆</span>
            <span className="text-amber-950 font-bold text-base" style={{ fontFamily: "'Fredoka One', cursive" }}>{score}</span>
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(INITIAL_LIVES)].map((_, i) => (
              <span key={i} className={`text-xl transition-all duration-300 ${i < lives ? 'scale-100' : 'scale-50 opacity-20 grayscale'}`}>❤️</span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/30 rounded-full h-3 mb-1 overflow-hidden border border-white/20">
          <div className="h-full bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-amber-200/80 text-xs font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Pregunta {currentQ + 1}/{TOTAL_QUESTIONS} • {modeNames[mode]}
          </p>
          {streak >= 2 && (
            <div className="bg-amber-400/90 rounded-full px-3 py-0.5 flex items-center gap-1 animate-bounce shadow-lg border border-amber-200">
              <span className="text-sm">🔥</span>
              <span className="font-bold text-amber-950 text-xs" style={{ fontFamily: "'Fredoka One', cursive" }}>Racha Jurásica x{streak}!</span>
            </div>
          )}
        </div>

        {/* Tracker de 5 Huevos para Liberar Nuevo Desafío */}
        {(() => {
          const currentEggs = activityEggs[mode] || 0;
          const isUnlocked = currentEggs >= 5;
          return (
            <div className="bg-amber-950/85 backdrop-blur-md rounded-2xl px-3 py-1.5 mb-2 border border-amber-400/60 shadow-lg flex items-center justify-between max-w-lg mx-auto w-full">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg animate-pulse">🥚</span>
                <div>
                  <p className="text-[11px] font-bold text-amber-200 leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    Desafío Jurásico
                  </p>
                  <p className="text-[9px] text-emerald-300 font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {isUnlocked ? '🔓 ¡DESAFÍO COMPLETO Y LIBERADO! 🏆' : `Reúne 5 huevos para liberar el desafío (${currentEggs}/5)`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(step => (
                  <span key={step} className={`text-sm sm:text-lg transition-all duration-500 transform ${step <= currentEggs ? 'scale-110 opacity-100 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]' : 'scale-90 opacity-20 grayscale'}`}>
                    🥚
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
          {/* Tarjeta con la foto del dinosaurio elegido en su hábitat natural */}
          <div className="flex items-center sm:items-start gap-2.5 mb-2 w-full">
            <div className="flex-shrink-0 relative group">
              <div className="bg-gradient-to-br from-amber-400/80 via-emerald-600/60 to-teal-800/80 p-1.5 rounded-2xl shadow-xl border-2 border-amber-300 backdrop-blur-xs">
                <HeroAvatar heroId={hero.id} size={90} talking={heroTalking} celebrating={isCorrect === true} sad={isCorrect === false} />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/40" style={{ fontFamily: "'Fredoka One', cursive" }}>
                {hero.name.split(' ')[0]}
              </span>
            </div>

            <div className="flex-1 relative">
              <div className={`bg-amber-50/95 backdrop-blur-sm rounded-2xl rounded-bl-sm px-3 py-2 shadow-lg border-2
                ${showMessage ? (isCorrect ? 'border-green-500 ring-2 ring-green-300' : isCorrect === false ? 'border-red-500 ring-2 ring-red-300' : 'border-amber-300') : 'border-amber-300'}`}>
                <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {heroTalking && <span className="text-amber-600 mr-1 animate-pulse">🔊</span>}
                  {showMessage ? (
                    <span className={isCorrect === true ? 'text-green-700' : isCorrect === false ? 'text-red-600' : 'text-emerald-950'}>
                      {isCorrect === true ? '✅ ' : isCorrect === false ? '❌ ' : ''}{message}
                    </span>
                  ) : (
                    <span>{message || getRandomMessage(hero.encouragements)}</span>
                  )}
                </p>
              </div>

              <div className="flex gap-1 mt-1.5">
                <button onClick={handleRepeat}
                  className="bg-emerald-800/90 hover:bg-emerald-700 text-amber-100 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1"
                  style={{ fontFamily: "'Nunito', sans-serif" }}>
                  🔊 Repetir
                </button>
                <button onClick={handleTeachMe}
                  className="bg-amber-400 hover:bg-amber-300 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-950 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1"
                  style={{ fontFamily: "'Nunito', sans-serif" }}>
                  💡 ¡Pista!
                </button>
              </div>
            </div>
          </div>

          {/* Elementos visuales de conteo (Huevos, Huesos, Hojas) para ayudar al niño */}
          {question.visual && (
            <div className="bg-amber-100/90 border-2 border-amber-300 rounded-2xl px-4 py-2 sm:py-3 mb-2 sm:mb-3 w-full text-center shadow-md animate-[fadeIn_0.4s_ease-out]">
              <p className="text-xs text-amber-950 font-bold mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                🐾 ¡Cuenta las figuras para responder!
              </p>
              <p className="text-lg sm:text-2xl font-bold leading-relaxed whitespace-pre-line text-emerald-950 tracking-wider">
                {question.visual}
              </p>
            </div>
          )}

          {/* Question card */}
          <div className={`bg-amber-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 w-full mb-2 sm:mb-3 relative overflow-hidden
            ${shakeWrong ? 'animate-[shake_0.5s_ease-in-out]' : 'animate-[fadeInUp_0.4s_ease-out]'}
            border-3 sm:border-4 ${isCorrect === true ? 'border-green-500' : isCorrect === false ? 'border-red-500' : 'border-amber-300'}`}>
            <div className="absolute top-2 right-3 text-2xl sm:text-3xl opacity-20">{hero.emoji}</div>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl mb-1 block">{question.emoji}</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-950 whitespace-pre-line leading-tight"
                style={{ fontFamily: "'Fredoka One', cursive" }}>{question.question}</h2>
            </div>
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === question.correctAnswer;
              let cls = 'bg-amber-50 hover:bg-amber-100 text-emerald-950 border-2 border-amber-300 hover:border-amber-400 hover:scale-105';
              if (selectedAnswer !== null) {
                if (isCorrectAnswer) cls = 'bg-emerald-600 text-white scale-105 border-2 border-green-300 ring-4 ring-green-300/50';
                else if (isSelected) cls = 'bg-red-600 text-white scale-95 border-2 border-red-300 ring-4 ring-red-300/50';
                else cls = 'bg-gray-300/50 text-gray-400 scale-90 border-2 border-transparent';
              }
              return (
                <button key={index} onClick={() => handleAnswer(option)} disabled={selectedAnswer !== null || waiting}
                  className={`${cls} rounded-2xl py-3.5 sm:py-5 px-2 sm:px-3 text-xl sm:text-3xl font-bold shadow-lg transform transition-all duration-300 active:scale-95 disabled:cursor-not-allowed relative overflow-hidden`}
                  style={{ fontFamily: "'Fredoka One', cursive", animation: `fadeInUp 0.3s ease-out ${index * 0.08}s both` }}>
                  {isCorrectAnswer && selectedAnswer !== null && <span className="absolute top-1 right-2 text-sm sm:text-lg">✅</span>}
                  {isSelected && !isCorrectAnswer && selectedAnswer !== null && <span className="absolute top-1 right-2 text-sm sm:text-lg">❌</span>}
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
