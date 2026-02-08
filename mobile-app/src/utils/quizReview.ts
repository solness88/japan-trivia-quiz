import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizCategory } from '../types/quiz';

const REVIEW_KEY = '@quiz_reviews';

export interface QuizQuestion {
  questionId: string;
  question: string;
  options: string[];
  userAnswer: number | null;  // スキップの場合null
  correctAnswer: number;
  explanation?: string;
  isCorrect: boolean;
}

export interface QuizReview {
  id: string;
  category: QuizCategory;
  date: string;
  score: number;
  total: number;
  skipped: number;
  percentage: number;
  questions: QuizQuestion[];
}

// レビューを保存
export const saveQuizReview = async (
  category: QuizCategory,
  score: number,
  total: number,
  skipped: number,
  questions: QuizQuestion[]
): Promise<void> => {
  try {
    const newReview: QuizReview = {
      id: Date.now().toString(),
      category,
      date: new Date().toISOString(),
      score,
      total,
      skipped,
      percentage: Math.round((score / total) * 100),
      questions,
    };

    const existingReviews = await getQuizReviews();
    const updatedReviews = [newReview, ...existingReviews];
    
    // 最大100件まで保存
    const limitedReviews = updatedReviews.slice(0, 100);
    
    await AsyncStorage.setItem(REVIEW_KEY, JSON.stringify(limitedReviews));
  } catch (e) {
    console.error('Failed to save quiz review:', e);
  }
};

// レビューを取得
export const getQuizReviews = async (): Promise<QuizReview[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(REVIEW_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load quiz reviews:', e);
    return [];
  }
};

// 特定のレビューを取得
export const getQuizReviewById = async (id: string): Promise<QuizReview | null> => {
  const reviews = await getQuizReviews();
  return reviews.find(r => r.id === id) || null;
};

// レビューを削除
export const clearQuizReviews = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REVIEW_KEY);
  } catch (e) {
    console.error('Failed to clear quiz reviews:', e);
  }
};