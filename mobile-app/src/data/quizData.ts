import quizData from '../../assets/data/quizzes.json';
import { Quiz, QuizCategory, QuizDifficulty } from '../types/quiz';

// JSONデータを型付き配列として読み込む
export const quizzes: Quiz[] = quizData as Quiz[];

// カテゴリ別にクイズを取得
export function getQuizzesByCategory(category: QuizCategory): Quiz[] {
  return quizzes.filter(quiz => quiz.category === category);
}

// 難易度別にクイズを取得
export function getQuizzesByDifficulty(difficulty: QuizDifficulty): Quiz[] {
  return quizzes.filter(quiz => quiz.difficulty === difficulty);
}

// ランダムにクイズを取得
export function getRandomQuizzes(count: number): Quiz[] {
  const shuffled = [...quizzes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 全カテゴリを取得
export function getAllCategories(): QuizCategory[] {
  const categories = new Set(quizzes.map(q => q.category));
  return Array.from(categories);
}