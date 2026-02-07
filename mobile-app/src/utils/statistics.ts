import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizCategory } from '../types/quiz';

const HISTORY_KEY = '@quiz_history';

export interface QuizHistory {
  id: string;
  category: QuizCategory;
  score: number;
  total: number;
  skipped: number;
  date: string; // ISO format
  percentage: number;
}

export interface CategoryStats {
  quizzes: number;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizStatistics {
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  averagePercentage: number;
  byCategory: {
    [key in QuizCategory]?: CategoryStats;
  };
}

// クイズ履歴を保存
export const saveQuizResult = async (
  category: QuizCategory,
  score: number,
  total: number,
  skipped: number
): Promise<void> => {
  try {
    const newHistory: QuizHistory = {
      id: Date.now().toString(),
      category,
      score,
      total,
      skipped,
      date: new Date().toISOString(),
      percentage: Math.round((score / total) * 100),
    };

    const existingHistory = await getQuizHistory();
    const updatedHistory = [newHistory, ...existingHistory];
    const limitedHistory = updatedHistory.slice(0, 100);
    
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (e) {
    console.error('Failed to save quiz result:', e);
  }
};

// クイズ履歴を取得
export const getQuizHistory = async (): Promise<QuizHistory[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load quiz history:', e);
    return [];
  }
};

// 統計を計算
export const calculateStatistics = async (): Promise<QuizStatistics> => {
  const history = await getQuizHistory();
  
  if (history.length === 0) {
    return {
      totalQuizzes: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      averagePercentage: 0,
      byCategory: {},
    };
  }

  const stats: QuizStatistics = {
    totalQuizzes: history.length,
    totalCorrect: 0,
    totalQuestions: 0,
    averagePercentage: 0,
    byCategory: {},
  };

  history.forEach((item) => {
    stats.totalCorrect += item.score;
    stats.totalQuestions += item.total;

    if (!stats.byCategory[item.category]) {
      stats.byCategory[item.category] = {
        quizzes: 0,
        correct: 0,
        total: 0,
        percentage: 0,
      };
    }

    const categoryStats = stats.byCategory[item.category]!;
    categoryStats.quizzes += 1;
    categoryStats.correct += item.score;
    categoryStats.total += item.total;
  });

  stats.averagePercentage = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);
  
  Object.keys(stats.byCategory).forEach((category) => {
    const categoryStats = stats.byCategory[category as QuizCategory]!;
    categoryStats.percentage = Math.round((categoryStats.correct / categoryStats.total) * 100);
  });

  return stats;
};

// 最近のゲームを取得
export const getRecentGames = async (limit: number = 5): Promise<QuizHistory[]> => {
  const history = await getQuizHistory();
  return history.slice(0, limit);
};

// 統計をリセット
export const clearStatistics = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear statistics:', e);
  }
};