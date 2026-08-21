export interface Hero {
  id: string;
  name: string;
  movie: string;
  color: string;
  gradient: string;
  bgGradient: string;
  emoji: string;
  icon: string;
  avatarImage?: string;
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
    id: 'geni',
    name: 'Geni',
    movie: 'Compañero KidGenius Club',
    color: '#7AC943',
    gradient: 'from-[#7AC943] to-[#4F9A25]',
    bgGradient: 'from-[#35206F] via-[#4B2C99] to-[#7AC943]',
    emoji: '🌟',
    icon: '✨',
    avatarImage: '/geni-mascot.png',
    greeting: '¡Hola! Soy Geni, tu compañero de aventuras en KidGenius Club. ¡Vamos a descubrir lo divertido que es aprender matemáticas juntos!',
    encouragements: [
      '¡Tú puedes! Geni se queda contigo hasta que lo logres.',
      '¡Tómate tu tiempo y cuenta con calma, lo estás haciendo genial!',
      '¡Vas súper bien! Cada intento te hace más inteligente.',
    ],
    correctMessages: [
      '¡Bravo! ¡Respuesta genial! ¡Geni celebra contigo!',
      '¡Exacto! ¡Lo lograste con una gran sonrisa!',
      '¡Espectacular! Tienes un talento maravilloso para las matemáticas.',
    ],
    wrongMessages: [
      '¡Casi! Vamos a revisar el paso juntos. Tú puedes lograrlo.',
      '¡Tranquilo, sin prisa! Equivocarse es parte de aprender. ¡Vamos de nuevo!',
    ],
    teachMessages: {
      suma: 'Sumar es juntar dos cantidades y contar el total con alegría.',
      resta: 'Restar es quitar una parte para descubrir cuántos nos quedan.',
      multiplicacion: 'Multiplicar es sumar grupos iguales de forma rápida y entretenida.',
      division: 'Dividir es repartir y compartir en partes exactamente iguales.',
      completar: 'Cuenta paso a paso hasta descubrir el número mágico que nos falta.',
      comparar: 'Observa ambos grupos con atención y elige la cifra con mayor valor.',
    },
    victoryMessage: '¡Felicidades! ¡Completaste tu misión con honores en KidGenius Club!',
    defeatMessage: '¡Gran esfuerzo! Recuerda que practicando 15 minutos al día somos cada vez mejores. ¿Intentamos de nuevo?',
  },
  {
    id: 'dinosaurio',
    name: 'Dino Aventurero',
    movie: 'KidGenius • Era Prehistórica',
    color: '#38A9E8',
    gradient: 'from-[#38A9E8] to-[#2B78C5]',
    bgGradient: 'from-[#35206F] via-[#38A9E8] to-[#7AC943]',
    emoji: '🦖',
    icon: '🌴',
    avatarImage: '/images/dinosaurio-frente.png',
    greeting: '¡Hola, campeón! Soy tu amigo Dinosaurio Aventurero. ¡Prepárate para una expedición matemática inolvidable!',
    encouragements: [
      '¡Paso a paso con mucha energía y alegría!',
      '¡Confía en tu mente brillante, lo vas a resolver!',
      '¡Qué gran avance estás logrando hoy!',
    ],
    correctMessages: [
      '¡Rugido de victoria! ¡Respuesta 100% correcta!',
      '¡Genial trabajo en equipo! ¡Punto para el explorador!',
      '¡Increíble precisión! ¡Eres un súper genio!',
    ],
    wrongMessages: [
      '¡No te preocupes! El próximo reto lo resolveremos juntos.',
      '¡Ánimo! Respira hondo y verás que en el siguiente aciertas.',
    ],
    teachMessages: {
      suma: 'Reúne todos los elementos prehistóricos y cuéntalos juntos.',
      resta: 'Separa la cantidad que se fue y cuenta los que quedaron en el valle.',
      multiplicacion: 'Reúne grupos iguales de dinosaurios y súmalos con rapidez.',
      division: 'Reparte las frutas prehistóricas en partes iguales entre los amigos.',
      completar: 'Encuentra la huella o el número oculto que falta para completar la cuenta.',
      comparar: 'Identifica cuál de los dos números tiene más fuerza y valor.',
    },
    victoryMessage: '¡Fabuloso! ¡Conquistaste este reto matemático como un auténtico explorador!',
    defeatMessage: '¡Excelente intento! La perseverancia es el secreto de los grandes exploradores.',
  },
  {
    id: 'dinosauria',
    name: 'Dinosauria Aventurera',
    movie: 'KidGenius • Era Prehistórica',
    color: '#FF8A25',
    gradient: 'from-[#FF8A25] to-[#E05315]',
    bgGradient: 'from-[#4B2C99] via-[#FF8A25] to-[#FFC928]',
    emoji: '🦕',
    icon: '🌸',
    avatarImage: '/images/dinosauria.png',
    greeting: '¡Hola! Te doy la bienvenida con mucho cariño. Soy tu amiga Dinosauria Aventurera y estoy feliz de aprender matemáticas contigo.',
    encouragements: [
      '¡Qué lindo cómo estás pensando cada número!',
      '¡Tómate tu tiempo, aprender es una fiesta!',
      '¡Tu esfuerzo ilumina todo nuestro club!',
    ],
    correctMessages: [
      '¡Maravilloso! ¡Respuesta completamente perfecta!',
      '¡Qué destreza y rapidez! ¡Eres fantástica!',
      '¡Bravo! ¡Una estrella brillante más para ti!',
    ],
    wrongMessages: [
      '¡Tranquila, estás súper cerca! Vamos a contar despacito otra vez.',
      '¡Sin miedo a equivocarte! Así es como nuestro cerebro se hace más fuerte.',
    ],
    teachMessages: {
      suma: 'Une todas las flores y fósiles en un solo conjunto para saber el total.',
      resta: 'Resta lo indicado y observa la hermosa cantidad que permanece.',
      multiplicacion: 'Multiplica sumando conjuntos iguales de manera sencilla.',
      division: 'Comparte con tus amigos en porciones exactamente justas.',
      completar: 'Descubre el número que falta con calma y alegría.',
      comparar: 'Elige la cifra que tenga la cantidad más grande.',
    },
    victoryMessage: '¡Qué gran triunfo! ¡Eres una estrella matemática de KidGenius Club!',
    defeatMessage: '¡Hiciste un trabajo hermoso! Con una partidita más lo lograrás sin problemas.',
  },
  {
    id: 'rexy',
    name: 'Rexy el T-Rex',
    movie: 'Valle de los Dinosaurios',
    color: '#7AC943',
    gradient: 'from-[#7AC943] to-[#4F9A25]',
    bgGradient: 'from-[#35206F] via-[#4F9A25] to-[#7AC943]',
    emoji: '🦖',
    icon: '🌋',
    avatarImage: '/images/dino-rexy.png',
    greeting: '¡Hola! Soy Rexy el T-Rex. ¡Vamos a divertirnos y aprender matemáticas a lo grande!',
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
      '¡Ánimo! Sigue intentando, estoy seguro de que puedes lograrlo.',
    ],
    teachMessages: {
      suma: 'Sumar es juntar dos cantidades y contar el total con alegría.',
      resta: 'Restar es quitar una parte para descubrir cuántos nos quedan.',
      multiplicacion: 'Multiplicar es sumar grupos iguales de forma rápida y práctica.',
      division: 'Dividir es compartir y repartir en partes exactamente iguales.',
      completar: 'Cuenta paso a paso hasta descubrir el número que nos falta.',
      comparar: 'Observa ambos números con atención y elige la cifra mayor.',
    },
    victoryMessage: '¡Felicidades! ¡Completaste la misión y eres un gran Campeón!',
    defeatMessage: '¡Gran esfuerzo! Recuerda que practicando somos cada vez mejores. ¿Intentamos de nuevo?',
  },
  {
    id: 'tricy',
    name: 'Tricy Triceratops',
    movie: 'Valle de los Dinosaurios',
    color: '#38A9E8',
    gradient: 'from-[#38A9E8] to-[#1E6FA8]',
    bgGradient: 'from-[#35206F] via-[#38A9E8] to-[#7AC943]',
    emoji: '🦕',
    icon: '🌿',
    avatarImage: '/images/dino-tricy.png',
    greeting: '¡Hola, qué alegría saludarte! Soy Tricy Triceratops y te doy la bienvenida. ¡Vamos a aprender jugando!',
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
    movie: 'Valle de los Dinosaurios',
    color: '#FF8A25',
    gradient: 'from-[#FF8A25] to-[#E05315]',
    bgGradient: 'from-[#35206F] via-[#FF8A25] to-[#FFC928]',
    emoji: '🐊',
    icon: '🌾',
    avatarImage: '/images/dino-stego.png',
    greeting: '¡Hola! Junto a Stego Estegosaurio estamos listos para comenzar esta aventura matemática.',
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
];

export const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};
