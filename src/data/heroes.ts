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
    greeting: '¡Hola! Te da la bienvenida Daniela. Hoy estoy muy feliz de acompañarte junto a Rexy el T-Rex. ¡Vamos a aprender y divertirnos mucho juntos!',
    encouragements: [
      '¡Tú puedes, lo estás haciendo increíble!',
      '¡Tómate tu tiempo y cuenta con calma!',
      '¡Vas súper bien, sigamos adelante!',
    ],
    correctMessages: [
      '¡Excelente! ¡Respuesta completamente correcta!',
      '¡Genial! ¡Lo lograste junto a Rexy!',
      '¡Bravo! ¡Qué gran talento tienes para las matemáticas!',
    ],
    wrongMessages: [
      '¡No te preocupes! La siguiente oportunidad te saldrá genial.',
      '¡Ánimo! Sigue intentando, estoy segura de que puedes lograrlo.',
    ],
    teachMessages: {
      suma: 'Sumar es juntar dos cantidades y contar el total con alegría.',
      resta: 'Restar es quitar una parte para descubrir cuántos nos quedan.',
      multiplicacion: 'Multiplicar es sumar grupos iguales de forma rápida y práctica.',
      division: 'Dividir es compartir y repartir en partes exactamente iguales.',
      completar: 'Cuenta paso a paso hasta descubrir el número que nos falta.',
      comparar: 'Observa ambos números con atención y elige la cifra mayor.',
    },
    victoryMessage: '¡Felicidades! ¡Completaste la misión y eres un gran Campeón Jurásico!',
    defeatMessage: '¡Gran esfuerzo! Recuerda que practicando somos cada vez mejores. ¿Intentamos de nuevo?',
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
    greeting: '¡Hola, qué alegría saludarte! Soy Daniela y junto a Tricy Triceratops te damos la bienvenida. ¡Vamos a aprender jugando!',
    encouragements: [
      '¡Observa muy bien, lo vas a resolver!',
      '¡Cuenta con tranquilidad, vas excelente!',
      '¡Tienes una mente brillante y súper ágil!',
    ],
    correctMessages: [
      '¡Muy bien hecho! ¡Espléndido resultado!',
      '¡Respuesta totalmente exacta y perfecta!',
      '¡Fabuloso trabajo, lo hiciste genial!',
    ],
    wrongMessages: [
      '¡Tranquilo, sin prisa! La próxima pregunta es tuya.',
      '¡Ánimo! Sigamos contando juntos, vas a aprender mucho.',
    ],
    teachMessages: {
      suma: 'Simplemente reúne todos los elementos y cuéntalos juntos.',
      resta: 'Separa la cantidad restada y observa con atención el sobrante.',
      multiplicacion: 'Reúne grupos iguales y súmalos con entusiasmo.',
      division: 'Reparte en partes exactamente iguales entre todos.',
      completar: 'Encuentra la cifra oculta que falta para llegar al total.',
      comparar: 'Identifica cuál de los dos números tiene mayor valor.',
    },
    victoryMessage: '¡Felicidades! ¡Lograste un puntaje increíble y un gran triunfo!',
    defeatMessage: '¡Excelente intento! Sigue adelante y verás cómo superas tu récord.',
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
    greeting: '¡Hola! Te habla Daniela. Junto a Stego Estegosaurio estamos listos para comenzar esta aventura matemática.',
    encouragements: [
      '¡Paso a paso con mucha confianza!',
      '¡Tómate tu tiempo y cuenta despacio!',
      '¡Yo confío en ti, tú sabes la respuesta!',
    ],
    correctMessages: [
      '¡Súper correcto! ¡Qué gran precisión!',
      '¡Excelente trabajo, felicitaciones!',
      '¡Fantástico! Respuesta impecable.',
    ],
    wrongMessages: [
      '¡Sin miedo a equivocarnos! Aprendemos mucho cada vez.',
      '¡Ánimo! Respira profundo e intentémoslo una vez más.',
    ],
    teachMessages: {
      suma: 'Agrupa los números y suma con calma.',
      resta: 'Resta lo indicado para conocer la diferencia.',
      multiplicacion: 'Suma el mismo número tantas veces como se indica.',
      division: 'Divide de forma equitativa y justa.',
      completar: 'Descubre el número escondido detrás del desafío.',
      comparar: 'Compara y selecciona la cifra con el valor más alto.',
    },
    victoryMessage: '¡Fantástico! Completaste el desafío con la sabiduría de un gran experto.',
    defeatMessage: '¡Qué gran energía demostraste! ¿Jugamos una partida más?',
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
    greeting: '¡Hola, qué gusto tenerte aquí! Soy tu anfitriona Daniela y con Bronto Brontosaurio te acompañaremos con mucho cariño.',
    encouragements: [
      '¡Con calma y mucha energía positiva!',
      '¡Sé que puedes resolver este reto perfectamente!',
      '¡Qué brillante idea, sigue así!',
    ],
    correctMessages: [
      '¡Exacto y perfecto! ¡Una respuesta maravillosa!',
      '¡Qué maravilla de resultado!',
      '¡Estupendo! Lo resolviste impecablemente.',
    ],
    wrongMessages: [
      '¡No hay prisa! Con paciencia todo se resuelve.',
      '¡Ánimo! Vamos a intentarlo juntos una vez más.',
    ],
    teachMessages: {
      suma: 'Une todas las piezas en un solo grupo y cuéntalas.',
      resta: 'Retira la parte restada y cuenta lo que permanece.',
      multiplicacion: 'Suma los bloques de igual valor de manera rápida.',
      division: 'Reparte en porciones iguales entre el grupo.',
      completar: 'Descubre la pieza matemática que nos falta.',
      comparar: 'Elige la cantidad de mayor volumen o valor.',
    },
    victoryMessage: '¡Completado con éxito! Obtuviste una puntuación gigante.',
    defeatMessage: '¡Gran esfuerzo! Estás muy cerca de lograrlo. ¿Jugamos otra vez?',
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
    greeting: '¡Hola! Te saluda Daniela. Hoy, con Ptero Pterodáctilo, volaremos muy alto en el mundo de las matemáticas.',
    encouragements: [
      '¡Mantén tu mente enfocada y vuela alto!',
      '¡Tu inteligencia brilla mucho!',
      '¡Visualiza la respuesta y adelante!',
    ],
    correctMessages: [
      '¡Acierto perfecto! ¡Un despegue increíble!',
      '¡Lo hiciste de manera excepcional!',
      '¡Increíble precisión, qué genial!',
    ],
    wrongMessages: [
      '¡Ajustamos la trayectoria! El próximo intento será excelente.',
      '¡Sigue volando alto, no te rindas!',
    ],
    teachMessages: {
      suma: 'Combina ambas cifras para encontrar el total.',
      resta: 'Descuenta la porción requerida con agilidad.',
      multiplicacion: 'Multiplica sumando iterativamente cada conjunto.',
      division: 'Distribuye equitativamente entre las partes.',
      completar: 'Revela el valor oculto en la ecuación.',
      comparar: 'Señala la cifra que sea mayor.',
    },
    victoryMessage: '¡Un vuelo sumamente victorioso! ¡Alcanzaste la cima!',
    defeatMessage: '¡Muy bien intentado! Levantemos el vuelo de nuevo.',
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
    greeting: '¡Hola! Te habla Daniela. Junto al veloz Rapto estamos listos para un entrenamiento matemático súper dinámico.',
    encouragements: [
      '¡Mantén tus mente activa y tus reflejos listos!',
      '¡Demuestra toda tu agilidad mental!',
      '¡Tienes un talento fantástico para esto!',
    ],
    correctMessages: [
      '¡Súper veloz y 100% correcto!',
      '¡Un acierto verdaderamente impresionante!',
      '¡Espectacular! Tu rapidez es formidable.',
    ],
    wrongMessages: [
      '¡Recalculamos con energía! Vamos de nuevo.',
      '¡Sigue adelante con entusiasmo, vas bien!',
    ],
    teachMessages: {
      suma: 'Suma rápidamente ambos conjuntos.',
      resta: 'Sustrae la cantidad correspondiente sin dudar.',
      multiplicacion: 'Calcula el producto de los grupos iguales.',
      division: 'Distribuye las proporciones exactas.',
      completar: 'Encuentra el número escondido al instante.',
      comparar: 'Identifica la opción con mayor valor numérico.',
    },
    victoryMessage: '¡Demostraste máxima velocidad y precisión! ¡Puntaje de Campeón!',
    defeatMessage: '¡Excelente energía! Con perseverancia serás invencible. ¿Jugamos otra vez?',
  },
];

export const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};
