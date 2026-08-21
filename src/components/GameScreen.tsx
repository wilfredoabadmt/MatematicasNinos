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
  suma: '➕ Sumas Divertidas',
  resta: '➖ Restas Ágiles',
  multiplicacion: '✖️ Multiplicar en Grupos',
  division: '➗ Repartir en Partes Iguales',
  completar: '🧩 Número Escondido',
  comparar: '⚖️ ¿Quién es Mayor?',
};

const modeInstructions: Record<string, string> = {
  suma: 'Hoy vamos a practicar Sumas Divertidas. Sumar es juntar dos cantidades para saber el total. Cuenta las figuras en pantalla, suma ambas partes y selecciona la respuesta correcta. ¡Sé que te irá genial!',
  resta: 'Hoy vamos a practicar Restas Ágiles. Restar es quitar una cantidad para saber cuántos nos quedan. Cuenta cuántos elementos permanecen y marca tu respuesta. ¡Tú puedes!',
  multiplicacion: 'Hoy te voy a enseñar cómo Multiplicar en Grupos. Multiplicar es sumar grupos que tienen la misma cantidad de elementos. Cuenta los grupos y multiplica. ¡Es fácil y entretenido!',
  division: 'Hoy te voy a explicar cómo Repartir en Partes Iguales. Dividir es distribuir todo equitativamente entre los amigos. Descubre cuántos le tocan a cada uno.',
  completar: 'Hoy vamos a descubrir el Número Escondido. Tu misión es encontrar la cifra que falta para completar la ecuación. ¡Cuenta con atención!',
  comparar: 'Hoy vamos a comparar números. Mira los dos grupos en pantalla y elige la cifra con mayor valor. ¡Adelante con toda tu confianza!',
};

const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  difficulty,
  hero,
  onBackToMenu,
  onAddStars,
  activityEggs = {},
  totalEggs = 0,
  onAddEgg,
  onOpenPuzzle,
  activeProfile,
}) => {
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
    return () => {
      unmountedRef.current = true;
      stopSpeaking();
    };
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
      const introText = `¡Hola, ${greetingName}! Soy ${hero.name}. ${modeInstructions[mode] || ''}`;
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
        const bonus = 100 + streak * 20;
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
    const hintText = question.teachSpeech
      ? `💡 Pista de ${hero.name.split(' ')[0]}: ${question.teachSpeech}`
      : '💡 Pista: cuenta las figuras con calma para responder.';
    await safeSpeak(hintText);
  };

  if (showResults) {
    const earnedStars = correctAnswers >= 9 ? 3 : correctAnswers >= 7 ? 2 : correctAnswers >= 5 ? 1 : 0;
    return (
      <ResultsScreen
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={TOTAL_QUESTIONS}
        bestStreak={bestStreak}
        earnedStars={earnedStars}
        hero={hero}
        mode={mode}
        activityEggs={activityEggs}
        totalEggs={totalEggs}
        activeProfile={activeProfile}
        onOpenPuzzle={onOpenPuzzle}
        onPlayAgain={() => {
          onAddStars(earnedStars);
          setCurrentQ(0);
          setScore(0);
          setLives(INITIAL_LIVES);
          setStreak(0);
          setBestStreak(0);
          setCorrectAnswers(0);
          setShowResults(false);
          setShowIntro(false);
          generateNewQuestion();
        }}
        onBackToMenu={() => {
          onAddStars(earnedStars);
          stopSpeaking();
          onBackToMenu();
        }}
      />
    );
  }

  const progress = (currentQ / TOTAL_QUESTIONS) * 100;

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#FFF9EC] relative overflow-hidden flex items-center justify-center p-4">
        <div className="relative z-10 text-center max-w-md w-full animate-[bounceIn_0.6s_ease-out]">
          <div className="flex justify-center mb-3">
            <HeroAvatar heroId={hero.id} size={120} talking={heroTalking} />
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-kg border-2 border-[#FFC928]/50">
            <div className="inline-flex items-center gap-1.5 bg-[#35206F] text-white px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold font-nunito mb-2.5">
              <span>🚀</span> <span>{modeNames[mode]}</span>
            </div>

            <h2 className="text-2xl font-bold text-[#35206F] font-fredoka mb-1.5">
              ¡{hero.name} te explica la misión!
            </h2>

            <p className="text-sm sm:text-base text-[#241A3D] bg-[#FFF9EC] rounded-2xl p-4 mb-5 font-bold border border-[#FFC928]/50 leading-relaxed font-nunito text-left">
              🔊 {message || 'Escuchando la lección de tu compañero...'}
            </p>

            <button
              onClick={handleStartQuestionsNow}
              className="w-full bg-[#7AC943] hover:bg-[#4F9A25] text-white rounded-2xl py-3.5 px-4 text-base sm:text-lg font-extrabold
                transform hover:scale-102 active:scale-98 transition-all shadow-md font-nunito
                inline-flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              <span>¡COMENZAR LA MISIÓN DE 15 MIN!</span>
              <span>⭐</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9EC] relative overflow-hidden flex flex-col justify-between p-3 md:p-5">
      {/* Interactive Milestone Modal */}
      {hatchMilestone !== null && (
        <EggHatchModal
          hero={hero}
          milestone={hatchMilestone}
          playerName={activeProfile ? `${activeProfile.firstName}` : undefined}
          surpriseReward={surpriseReward}
          onClose={() => {
            setHatchMilestone(null);
            setSurpriseReward(undefined);
          }}
          onAction={() => {
            if ((hatchMilestone === 12 || surpriseReward?.type === 'puzzle') && onOpenPuzzle) {
              onOpenPuzzle();
            }
          }}
        />
      )}

      {/* Top Navbar */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              stopSpeaking();
              onBackToMenu();
            }}
            className="bg-white hover:bg-[#FFF3D9] text-[#35206F] rounded-full px-4 py-1.5 text-xs sm:text-sm font-extrabold transition-all border-2 border-[#FFC928]/50 shadow-2xs font-nunito"
          >
            ← Menú KidGenius
          </button>

          <div className="flex items-center gap-1.5 bg-[#FFC928] text-[#35206F] rounded-full px-3.5 py-1 border border-white font-nunito text-xs sm:text-sm font-extrabold shadow-2xs">
            <span>🏆</span>
            <span>{score} Puntos</span>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(INITIAL_LIVES)].map((_, i) => (
              <span
                key={i}
                className={`text-xl transition-all duration-300 ${i < lives ? 'scale-100' : 'scale-50 opacity-20 grayscale'}`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#FFF3D9] rounded-full h-3 overflow-hidden border border-[#FFC928]/40">
          <div
            className="h-full bg-gradient-to-r from-[#FFC928] to-[#7AC943] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold text-[#554A6D] font-nunito">
          <span>Pregunta {currentQ + 1}/{TOTAL_QUESTIONS} • {modeNames[mode]}</span>
          {streak >= 2 && (
            <span className="bg-[#FF8A25] text-white rounded-full px-3 py-0.5 text-xs font-extrabold font-nunito animate-bounce shadow-2xs">
              🔥 Racha x{streak}!
            </span>
          )}
        </div>
      </div>

      {/* Main Play Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full my-auto">
        {/* Companion Avatar & Speech Bubble */}
        <div className="flex items-center gap-3 mb-3 w-full">
          <div className="flex-shrink-0 relative">
            <div className="bg-white p-1 rounded-2xl shadow-xs border-2 border-[#FFC928]/40">
              <HeroAvatar
                heroId={hero.id}
                size={80}
                talking={heroTalking}
                celebrating={isCorrect === true}
                sad={isCorrect === false}
              />
            </div>
          </div>

          <div className="flex-1 relative">
            <div
              className={`bg-white rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-xs border-2 transition-all
              ${
                showMessage
                  ? isCorrect
                    ? 'border-[#7AC943] bg-[#7AC943]/10'
                    : isCorrect === false
                    ? 'border-red-400 bg-red-50'
                    : 'border-[#FFC928]/50'
                  : 'border-[#FFC928]/50'
              }`}
            >
              <p className="text-sm sm:text-base font-bold text-[#241A3D] leading-snug font-nunito">
                {heroTalking && <span className="text-[#FF8A25] mr-1.5 animate-pulse">🔊</span>}
                {showMessage ? (
                  <span className={isCorrect === true ? 'text-[#4F9A25]' : isCorrect === false ? 'text-red-600' : 'text-[#241A3D]'}>
                    {isCorrect === true ? '✅ ' : isCorrect === false ? '💡 ' : ''}
                    {message}
                  </span>
                ) : (
                  <span>{message || getRandomMessage(hero.encouragements)}</span>
                )}
              </p>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleRepeat}
                className="bg-white hover:bg-[#FFF3D9] text-[#35206F] rounded-full px-3.5 py-1 text-xs sm:text-sm font-extrabold border-2 border-[#FFC928]/50 font-nunito flex items-center gap-1 shadow-2xs"
              >
                🔊 Repetir
              </button>
              <button
                onClick={handleTeachMe}
                className="bg-[#FFC928] hover:bg-[#E0A800] text-[#35206F] rounded-full px-3.5 py-1 text-xs sm:text-sm font-extrabold font-nunito flex items-center gap-1 shadow-2xs"
              >
                💡 ¡Pista!
              </button>
            </div>
          </div>
        </div>

        {/* Visual Count Figures */}
        {question.visual && (
          <div className="bg-white border-2 border-[#FFC928]/40 rounded-2xl px-5 py-2.5 mb-2.5 w-full text-center shadow-xs animate-[fadeIn_0.3s_ease-out]">
            <p className="text-xs sm:text-sm text-[#554A6D] font-extrabold mb-1 font-nunito">
              ✨ ¡Cuenta las figuras para responder con facilidad!
            </p>
            <p className="text-2xl sm:text-3xl font-bold leading-snug text-[#35206F] tracking-widest font-fredoka">
              {question.visual}
            </p>
          </div>
        )}

        {/* Question Card */}
        <div
          className={`bg-white rounded-3xl shadow-kg p-5 sm:p-6 w-full mb-3.5 text-center relative overflow-hidden transition-all
          ${shakeWrong ? 'animate-[shake_0.5s_ease-in-out]' : 'animate-[fadeInUp_0.3s_ease-out]'}
          border-3 ${isCorrect === true ? 'border-[#7AC943]' : isCorrect === false ? 'border-red-400' : 'border-[#FFC928]/50'}`}
        >
          <span className="text-3xl sm:text-4xl mb-1 block">{question.emoji}</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#35206F] font-fredoka leading-tight">
            {question.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.correctAnswer;
            let btnStyle = 'bg-white hover:bg-[#FFF3D9] text-[#35206F] border-2 border-[#FFC928]/60 hover:border-[#7AC943] hover:scale-103';
            if (selectedAnswer !== null) {
              if (isCorrectAnswer) btnStyle = 'bg-[#7AC943] text-white scale-103 border-2 border-white ring-4 ring-[#7AC943]/40';
              else if (isSelected) btnStyle = 'bg-red-500 text-white scale-97 border-2 border-white ring-4 ring-red-300';
              else btnStyle = 'bg-gray-100 text-gray-400 scale-95 border-2 border-transparent';
            }
            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null || waiting}
                className={`${btnStyle} rounded-2xl py-4 sm:py-5 px-3 text-3xl sm:text-4xl font-bold shadow-xs transform transition-all duration-200 active:scale-95 disabled:cursor-not-allowed font-fredoka relative`}
                style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.06}s both` }}
              >
                {isCorrectAnswer && selectedAnswer !== null && <span className="absolute top-2 right-3 text-base">✅</span>}
                {isSelected && !isCorrectAnswer && selectedAnswer !== null && <span className="absolute top-2 right-3 text-base">❌</span>}
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="relative z-10 text-center text-xs text-[#554A6D] font-bold font-nunito mt-1">
        KidGenius Club • Práctica deliberada con refuerzo positivo
      </div>
    </div>
  );
};

export default GameScreen;
