export interface Hero {
  id: string;
  name: string;
  movie: string;
  color: string;
  gradient: string;
  bgGradient: string;
  emoji: string;
  icon: string;
  greeting: string;
  encouragements: string[];
  correctMessages: string[];
  wrongMessages: string[];
  teachMessages: Record<string, string>;
  victoryMessage: string;
  defeatMessage: string;
}

export const heroes: Hero[] = [
  {
    id: 'rexy',
    name: 'Rexy el T-Rex',
    movie: 'Era de los Dinosaurios',
    color: '#48BB78',
    gradient: 'from-emerald-500 to-green-600',
    bgGradient: 'from-green-600 via-emerald-500 to-teal-700',
    emoji: '🦖',
    icon: '🌋',
    greeting: '¡Hola amiguito! Soy Daniela y aquí estoy con Rexy el T-Rex. ¡Vamos a aprender juntos!',
    encouragements: [
      '¡Tú puedes, dino-amigo!',
      '¡Cuenta con calma!',
      '¡Vas súper bien!',
    ],
    correctMessages: [
      '¡Excelente! ¡Respuesta correcta!',
      '¡Genial! ¡Lo lograste con Rexy!',
      '¡Bravo! ¡Qué inteligente eres!',
    ],
    wrongMessages: [
      '¡Ánimo! La siguiente te saldrá increíble.',
      '¡Sigue intentando, tú puedes!',
    ],
    teachMessages: {
      suma: 'Sumar es juntar y contar todo.',
      resta: 'Restar es quitar y ver cuántos quedan.',
      multiplicacion: 'Multiplicar es sumar varias veces.',
      division: 'Dividir es repartir en partes iguales.',
      completar: 'Cuenta hasta llegar al resultado.',
      comparar: 'Elige el número más grande.',
    },
    victoryMessage: '¡Lo lograste! ¡Eres un Campeón Jurásico!',
    defeatMessage: '¡Buen intento! ¿Jugamos otra vez?',
  },
  {
    id: 'tricy',
    name: 'Tricy Triceratops',
    movie: 'Era de los Dinosaurios',
    color: '#319795',
    gradient: 'from-teal-400 to-cyan-600',
    bgGradient: 'from-cyan-500 via-teal-600 to-emerald-700',
    emoji: '🦕',
    icon: '🌿',
    greeting: '¡Hola pequeñito! Soy Daniela junto a Tricy Triceratops. ¡Aprendamos jugando!',
    encouragements: [
      '¡Fíjate bien!',
      '¡Tómate tu tiempo!',
      '¡Eres súper listo!',
    ],
    correctMessages: [
      '¡Muy bien hecho!',
      '¡Respuesta perfecta!',
      '¡Fabuloso trabajo!',
    ],
    wrongMessages: [
      '¡Tranquilo! La próxima es tuya.',
      '¡Ánimo, sigamos contando!',
    ],
    teachMessages: {
      suma: 'Cuenta todos los objetos juntos.',
      resta: 'Quita los sobrantes y mira el resto.',
      multiplicacion: 'Suma grupos iguales.',
      division: 'Reparte en partes iguales.',
      completar: 'Busca el número que falta.',
      comparar: 'El número más alto es el mayor.',
    },
    victoryMessage: '¡Ganaste! ¡Puntaje increíble!',
    defeatMessage: '¡Sigue practicando! ¡Lo harás genial!',
  },
  {
    id: 'stego',
    name: 'Stego Estegosaurio',
    movie: 'Era de los Dinosaurios',
    color: '#DD6B20',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-orange-500 via-amber-600 to-yellow-600',
    emoji: '🐊',
    icon: '🌾',
    greeting: '¡Hola! Soy Daniela con Stego Estegosaurio. ¡Vamos a contar juntos!',
    encouragements: [
      '¡Paso a paso!',
      '¡Cuenta despacito!',
      '¡Tú sabes la respuesta!',
    ],
    correctMessages: [
      '¡Súper correcto!',
      '¡Excelente trabajo!',
      '¡Fantástico!',
    ],
    wrongMessages: [
      '¡Sin miedo! Intentemos de nuevo.',
      '¡Vas a aprender mucho!',
    ],
    teachMessages: {
      suma: 'Junta los números y cuenta.',
      resta: 'Resta lo que quitaste.',
      multiplicacion: 'Suma el mismo número.',
      division: 'Comparte por igual.',
      completar: 'Descubre el número escondido.',
      comparar: 'Elige la cifra más grande.',
    },
    victoryMessage: '¡Excelente! ¡Eres súper sabio!',
    defeatMessage: '¡Gran esfuerzo! ¿Jugamos de nuevo?',
  },
  {
    id: 'bronto',
    name: 'Bronto Brontosaurio',
    movie: 'Era de los Dinosaurios',
    color: '#805AD5',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-600 via-indigo-500 to-pink-600',
    emoji: '🦕',
    icon: '🌴',
    greeting: '¡Hola! Soy Daniela y Bronto Brontosaurio te enseñaremos con mucho cariño.',
    encouragements: [
      '¡Con calma y alegría!',
      '¡Tú puedes resolverlo!',
      '¡Muy buena idea!',
    ],
    correctMessages: [
      '¡Exacto y perfecto!',
      '¡Maravilloso!',
      '¡Estupendo!',
    ],
    wrongMessages: [
      '¡No te apures! Con calma sale.',
      '¡Ánimo pequeñín!',
    ],
    teachMessages: {
      suma: 'Une todo en un solo montón.',
      resta: 'Retira lo sobrante y cuenta.',
      multiplicacion: 'Suma bloques iguales.',
      division: 'Divide en partes iguales.',
      completar: 'Encuentra la pieza que falta.',
      comparar: 'El número más alto gana.',
    },
    victoryMessage: '¡Completado! ¡Puntaje gigante!',
    defeatMessage: '¡Sigue así! ¿Una vez más?',
  },
  {
    id: 'ptero',
    name: 'Ptero Pterodáctilo',
    movie: 'Era de los Dinosaurios',
    color: '#E53E3E',
    gradient: 'from-rose-500 to-red-600',
    bgGradient: 'from-red-500 via-rose-600 to-pink-600',
    emoji: '🦅',
    icon: '☁️',
    greeting: '¡Hola! Soy Daniela y junto a Ptero volaremos por las matemáticas.',
    encouragements: [
      '¡Vuela alto y atento!',
      '¡Tu mente es brillante!',
      '¡Apunta a la respuesta!',
    ],
    correctMessages: [
      '¡Acierto perfecto!',
      '¡Lo hiciste genial!',
      '¡Increíble!',
    ],
    wrongMessages: [
      '¡Reajustamos el vuelo!',
      '¡El próximo será mejor!',
    ],
    teachMessages: {
      suma: 'Suma las dos cifras.',
      resta: 'Quita la parte restada.',
      multiplicacion: 'Suma varias veces.',
      division: 'Reparte en partes iguales.',
      completar: 'Descubre el oculto.',
      comparar: 'Elige el mayor.',
    },
    victoryMessage: '¡Vuelo victorioso! ¡Lo lograste!',
    defeatMessage: '¡A intentar de nuevo volando!',
  },
  {
    id: 'rapto',
    name: 'Rapto Velociraptor',
    movie: 'Era de los Dinosaurios',
    color: '#D69E2E',
    gradient: 'from-amber-400 to-yellow-600',
    bgGradient: 'from-yellow-500 via-amber-500 to-orange-600',
    emoji: '⚡',
    icon: '🐾',
    greeting: '¡Hola! Soy Daniela y con Rapto vamos a contar super veloz.',
    encouragements: [
      '¡Reflejos veloces!',
      '¡Acierta rápido!',
      '¡Tú tienes el súper poder!',
    ],
    correctMessages: [
      '¡Veloz y correcto!',
      '¡Superacierto!',
      '¡Impresionante!',
    ],
    wrongMessages: [
      '¡Recalculamos rápido!',
      '¡Sin miedo, sigue!',
    ],
    teachMessages: {
      suma: 'Suma rápido ambos grupos.',
      resta: 'Resta lo indicado.',
      multiplicacion: 'Suma bloques iguales.',
      division: 'Reparte por igual.',
      completar: 'Encuentra el número rápido.',
      comparar: 'Apunta al número mayor.',
    },
    victoryMessage: '¡Súper velocidad! ¡Ganaste!',
    defeatMessage: '¡Persevera siempre! ¿Otra carrera?',
  },
];

export const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};
