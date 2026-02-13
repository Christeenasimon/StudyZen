
import { RiskLevel, UserStats, BurnoutAssessment, RecoveryPlan } from '../types';

/**
 * SCORING FORMULA:
 * Total Risk Score (0-100) = 
 * (QuizScore * 0.4) + 
 * (Inverse Mood * 0.2) + 
 * (StudyOverload * 0.2) + 
 * (SleepDeficit * 0.2)
 */
export const calculateRisk = (stats: UserStats): BurnoutAssessment => {
  const { mood, sleepHours, studyHours, quizScore, taskLoad } = stats;

  // Inverse mood (10 = 0 points, 1 = 100 points)
  const moodScore = (10 - mood) * 10;
  
  // Sleep Deficit (>= 8 hrs = 0 pts, 0 hrs = 100 pts)
  const sleepScore = Math.max(0, (8 - sleepHours) * 12.5);
  
  // Study Overload (<= 5 hrs = 0 pts, >= 12 hrs = 100 pts)
  const studyScore = Math.max(0, Math.min(100, (studyHours - 5) * 14.2));

  // Task Load
  const taskScore = taskLoad * 10;

  const finalScore = (quizScore * 0.4) + (moodScore * 0.15) + (studyScore * 0.15) + (sleepScore * 0.2) + (taskScore * 0.1);
  const normalizedScore = Math.min(100, Math.max(0, finalScore));

  let level = RiskLevel.LOW;
  if (normalizedScore > 65) level = RiskLevel.HIGH;
  else if (normalizedScore > 35) level = RiskLevel.MODERATE;

  // Energy is inverse to score
  const energyPercent = 100 - normalizedScore;

  return {
    score: Math.round(normalizedScore),
    level,
    energyPercent: Math.round(energyPercent),
    lastUpdated: new Date().toISOString()
  };
};

export const generateRecoveryPlan = (assessment: BurnoutAssessment, stats: UserStats): RecoveryPlan => {
  const isHigh = assessment.level === RiskLevel.HIGH;
  const type = isHigh ? '7-DAY' : '3-DAY';
  
  const basePlan: RecoveryPlan = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    title: isHigh ? 'Burnout Recovery Protocol' : 'Maintenance & Reset Plan',
    activities: []
  };

  const days = isHigh ? 7 : 3;
  for (let i = 1; i <= days; i++) {
    const dayTasks: string[] = [];
    if (i === 1) {
      dayTasks.push("Digital detox: No screens 2 hours before bed.");
      dayTasks.push("Sleep priority: Aim for 9 hours tonight.");
      dayTasks.push("Work Reduction: Cut your to-do list by 50%.");
    } else if (i === 2) {
      dayTasks.push("Physical movement: 20 min light walk.");
      dayTasks.push("Nutrient dense meal: Focus on hydration and greens.");
      dayTasks.push("Social connection: Call one friend (no academic talk).");
    } else {
      dayTasks.push("Reflective journaling: 5 mins on what went well.");
      dayTasks.push("Slow study: Limit work blocks to 25 mins (Pomodoro).");
      dayTasks.push("Hobby time: 30 mins doing something purely for fun.");
    }
    
    // Custom adjustments
    if (stats.sleepHours < 5) dayTasks.push("Emergency power nap: 20 mins between 2-4 PM.");
    if (stats.mood < 4) dayTasks.push("Gratitude list: Write down 3 small wins.");

    basePlan.activities.push({ day: i, tasks: dayTasks });
  }

  return basePlan;
};
