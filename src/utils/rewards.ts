import { RewardItem } from '../types';

export const surpriseRewardsPool: RewardItem[] = [
  {
    id: 'pdf_sheet',
    title: 'Lámina PDF para Colorear',
    description: '¡Lámina imprimible para pintar por números a tu dinosaurio favorito!',
    icon: '🎨📄',
    type: 'coloring_pdf',
  },
  {
    id: 'diploma_cert',
    title: 'Diploma Oficial en PDF',
    description: '¡Certificado impreso con tu nombre y el sello de oro del T-Rex!',
    icon: '📜🏆',
    type: 'diploma_pdf',
  },
  {
    id: 'puzzle_game',
    title: 'Juego de Rompecabezas',
    description: '¡Desafío interactivo de piezas 3x3 de tu personaje jurásico!',
    icon: '🧩🦖',
    type: 'puzzle',
  },
  {
    id: 'rex_crown',
    title: 'Corona Dorada Rey Rex',
    description: '¡Viste a tu amiguito dinosaurio con la brillante Corona Real!',
    icon: '👑🦕',
    type: 'crown',
  },
  {
    id: 'gold_trophy',
    title: 'Copa de Oro T-Rex',
    description: '¡Gran Trofeo de Brillantes para el Campeón del Valle!',
    icon: '🏆✨',
    type: 'trophy',
  },
  {
    id: 'badge_sumas',
    title: 'Insignia: Maestro de las Sumas',
    description: '¡Medalla especial por resolver sumas jurásicas a gran velocidad!',
    icon: '🏷️➕',
    type: 'badge',
    badgeName: 'Maestro de las Sumas',
  },
  {
    id: 'badge_restas',
    title: 'Insignia: Cazador de Restas',
    description: '¡Premio de honor por encontrar los números faltantes!',
    icon: '🏷️➖',
    type: 'badge',
    badgeName: 'Cazador de Restas',
  },
  {
    id: 'badge_veloz',
    title: 'Insignia: Velociraptor Veloz',
    description: '¡Condecoración por rachas perfectas de respuestas correctas!',
    icon: '🏷️⚡',
    type: 'badge',
    badgeName: 'Velociraptor Veloz',
  },
  {
    id: 'badge_campeon',
    title: 'Insignia: Rey Supremo Jurásico',
    description: '¡El más grande título del Valle para los mejores sabios!',
    icon: '🏷️🦖',
    type: 'badge',
    badgeName: 'Rey Supremo Jurásico',
  },
];

// Obtener un premio aleatorio no desbloqueado previamente o seleccionar uno al azar
export const getRandomSurpriseReward = (unlockedIds: string[] = []): RewardItem => {
  const locked = surpriseRewardsPool.filter(r => !unlockedIds.includes(r.id));
  if (locked.length > 0) {
    const randomIndex = Math.floor(Math.random() * locked.length);
    return locked[randomIndex];
  }
  // Si ya tiene todos, entregar uno al azar del pool
  const randomIndex = Math.floor(Math.random() * surpriseRewardsPool.length);
  return surpriseRewardsPool[randomIndex];
};
