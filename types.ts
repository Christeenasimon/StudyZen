
export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH'
}

export interface UserStats {
  mood: number; // 1-10
  sleepHours: number;
  studyHours: number;
  taskLoad: number; // 1-10
  quizScore: number; // 0-100
  timestamp: string;
}

export interface BurnoutAssessment {
  score: number;
  level: RiskLevel;
  energyPercent: number;
  lastUpdated: string;
}

export interface RecoveryPlan {
  id: string;
  type: '3-DAY' | '7-DAY';
  title: string;
  activities: { day: number; tasks: string[] }[];
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  category?: 'STRESS' | 'MOTIVATION' | 'OVERTHINKING' | 'GENERAL';
}
