export type GameMode = 'menu' | 'suma' | 'resta' | 'multiplicacion' | 'division' | 'completar' | 'comparar' | 'results';
export type Difficulty = 'facil' | 'medio' | 'dificil';
export type Screen = 'splash' | 'heroSelect' | 'menu' | 'game';

export interface Question {
  question: string;
  questionSpeech: string;
  options: number[];
  correctAnswer: number;
  emoji?: string;
  visual?: string;
  teachSpeech: string;
}

export interface ParentUser {
  email: string;
  isPaid: boolean;
  subscriptionStatus: string;
}

export interface PlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  totalStars: number;
  totalEggs?: number;
  activityEggs: Record<string, number>;
  unlockedRewards: string[];
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'coloring_pdf' | 'diploma_pdf' | 'puzzle' | 'crown' | 'trophy' | 'badge';
  badgeName?: string;
}
