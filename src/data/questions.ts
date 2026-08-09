import { Question, Difficulty, GameMode } from '../types';

const getMaxNumber = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'facil': return 8;
    case 'medio': return 15;
    case 'dificil': return 30;
  }
};

const getMultMax = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'facil': return 4;
    case 'medio': return 6;
    case 'dificil': return 10;
  }
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateWrongAnswers = (correct: number, count: number, min: number = 0): number[] => {
  const wrongs = new Set<number>();
  let attempts = 0;
  while (wrongs.size < count && attempts < 100) {
    attempts++;
    let wrong = correct + Math.floor(Math.random() * 6) - 3;
    if (wrong === correct || wrong < min) wrong = correct + Math.floor(Math.random() * 4) + 1;
    if (wrong !== correct && wrong >= min) wrongs.add(wrong);
  }
  return Array.from(wrongs);
};

const getEmoji = (mode: string): string => {
  const map: Record<string, string[]> = {
    suma: ['🥚', '🌿', '🐾', '⭐'],
    resta: ['🦴', '🍖', '🥚', '🐾'],
    multiplicacion: ['🌿', '🌋', '💎', '🥚'],
    division: ['🍖', '🥚', '🦴', '🌿'],
    completar: ['🥚', '🦴', '🌿', '🐾'],
    comparar: ['🐾', '🥚', '🦴', '🌿'],
  };
  const arr = map[mode] || ['🥚', '🦴', '🌿'];
  return arr[Math.floor(Math.random() * arr.length)];
};

const makeVisual = (emoji: string, count: number, maxLine: number = 10): string => {
  if (count <= 0) return '';
  if (count <= maxLine) return Array(count).fill(emoji).join(' ');
  // Para números más grandes, organizar en filas de maxLine
  const fullRows = Math.floor(count / maxLine);
  const remainder = count % maxLine;
  const rows: string[] = [];
  for (let i = 0; i < fullRows; i++) {
    rows.push(Array(maxLine).fill(emoji).join(' '));
  }
  if (remainder > 0) {
    rows.push(Array(remainder).fill(emoji).join(' '));
  }
  return rows.join('\n');
};

export const generateQuestion = (mode: GameMode, difficulty: Difficulty): Question => {
  const max = getMaxNumber(difficulty);
  const multMax = getMultMax(difficulty);
  const emoji = getEmoji(mode);

  switch (mode) {
    case 'suma': {
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      const correct = a + b;
      const wrongs = generateWrongAnswers(correct, 3, 0);
      const visual = `${makeVisual(emoji, a)}\n➕\n${makeVisual(emoji, b)}`;

      return {
        question: `${a} + ${b} = ?`,
        questionSpeech: `¡Vamos a sumar! ¿Cuánto es ${a} más ${b}?`,
        options: shuffleArray([correct, ...wrongs]),
        correctAnswer: correct,
        emoji,
        visual,
        teachSpeech: `¡Mira! A ${a} le sumas ${b} y nos da ${correct} en total.`,
      };
    }
    case 'resta': {
      const b = Math.floor(Math.random() * max) + 1;
      const a = b + Math.floor(Math.random() * max) + 1;
      const correct = a - b;
      const wrongs = generateWrongAnswers(correct, 3, 0);
      const visual = `${makeVisual(emoji, a)}\n➖\n${makeVisual(emoji, b)}`;

      return {
        question: `${a} - ${b} = ?`,
        questionSpeech: `¡A restar objetos! ¿Cuánto es ${a} menos ${b}?`,
        options: shuffleArray([correct, ...wrongs]),
        correctAnswer: correct,
        emoji,
        visual,
        teachSpeech: `¡Súper fácil! Si a ${a} le quitas ${b}, te quedan ${correct}.`,
      };
    }
    case 'multiplicacion': {
      const a = Math.floor(Math.random() * multMax) + 1;
      const b = Math.floor(Math.random() * multMax) + 1;
      const correct = a * b;
      const wrongs = generateWrongAnswers(correct, 3, 0);
      const visual = Array(a).fill(makeVisual(emoji, b)).join('\n');

      return {
        question: `${a} × ${b} = ?`,
        questionSpeech: `¡Multipliquemos nidos! ¿Cuánto es ${a} por ${b}?`,
        options: shuffleArray([correct, ...wrongs]),
        correctAnswer: correct,
        emoji,
        visual,
        teachSpeech: `¡Sumamos por grupos! ${a} veces el ${b} es igual a ${correct}.`,
      };
    }
    case 'division': {
      const b = Math.floor(Math.random() * multMax) + 1;
      const correct = Math.floor(Math.random() * multMax) + 1;
      const a = b * correct;
      const wrongs = generateWrongAnswers(correct, 3, 1);
      const groups: string[] = [];
      for (let i = 0; i < b; i++) {
        groups.push(`( ${Array(correct).fill(emoji).join(' ')} )`);
      }
      const visual = groups.join('  ');

      return {
        question: `${a} ÷ ${b} = ?`,
        questionSpeech: `¡Vamos a repartir frutas! ¿Cuánto es ${a} entre ${b}?`,
        options: shuffleArray([correct, ...wrongs]),
        correctAnswer: correct,
        emoji,
        visual,
        teachSpeech: `¡Repartimos por igual! Si divides ${a} entre ${b}, le tocan ${correct} a cada uno.`,
      };
    }
    case 'completar': {
      const a = Math.floor(Math.random() * max) + 1;
      const correct = Math.floor(Math.random() * max) + 1;
      const result = a + correct;
      const wrongs = generateWrongAnswers(correct, 3, 1);
      const visual = `${makeVisual(emoji, a)}  ➕  ❓  =  ${makeVisual(emoji, result)}`;

      return {
        question: `${a} + __ = ${result}`,
        questionSpeech: `¡Descubre el número oculto! Si tenemos ${a}, ¿cuánto falta para llegar a ${result}?`,
        options: shuffleArray([correct, ...wrongs]),
        correctAnswer: correct,
        emoji,
        visual,
        teachSpeech: `¡Exacto! Tienes ${a} y te faltan ${correct} para sumar ${result}.`,
      };
    }
    case 'comparar': {
      let a = Math.floor(Math.random() * max) + 1;
      let b = Math.floor(Math.random() * max) + 1;
      while (b === a) b = Math.floor(Math.random() * max) + 1;
      const bigger = Math.max(a, b);
      const smaller = Math.min(a, b);
      const wrongSet = generateWrongAnswers(bigger, 3, 1).filter(w => w !== smaller && w !== bigger);
      while (wrongSet.length < 3) wrongSet.push(bigger + Math.floor(Math.random() * 4) + 1);

      const visual = `A: ${makeVisual(emoji, a)} (${a})\nB: ${makeVisual(emoji, b)} (${b})`;

      return {
        question: `¿Cuál es MAYOR?\n${a}   ó   ${b}`,
        questionSpeech: `¡Desafío jurásico! ¿Cuál número es más grande: ${a} ó ${b}?`,
        options: shuffleArray([bigger, ...wrongSet.slice(0, 3)]),
        correctAnswer: bigger,
        emoji: '⚖️',
        visual,
        teachSpeech: `¡Genial! El número ${bigger} es mayor que ${smaller}.`,
      };
    }
    default:
      return generateQuestion('suma', difficulty);
  }
};
