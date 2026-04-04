// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { QuizCategory, UserProgress, Title, CategoryProgress } from '../types/quiz';

// const STORAGE_KEY = '@user_progress';

// // 初期データ
// const initialCategoryProgress: CategoryProgress = {
//   correctQuizIds: [],
//   incorrectQuizIds: [],
//   isCompleted: false,
// };

// const initialUserProgress: UserProgress = {
//   completedCategories: [],
//   currentTitle: 'none',
//   categoryProgress: {
//     'culture': { ...initialCategoryProgress },
//     'food': { ...initialCategoryProgress },
//     'region': { ...initialCategoryProgress },
//     'language': { ...initialCategoryProgress },
//     'manner': { ...initialCategoryProgress },
//     'anime-manga': { ...initialCategoryProgress },
//   },
// };

// // UserProgress を取得
// export async function getUserProgress(): Promise<UserProgress> {
//   try {
//     const data = await AsyncStorage.getItem(STORAGE_KEY);
//     if (data) {
//       return JSON.parse(data);
//     }
//     return initialUserProgress;
//   } catch (error) {
//     console.error('Failed to load user progress:', error);
//     return initialUserProgress;
//   }
// }

// // UserProgress を保存
// export async function saveUserProgress(progress: UserProgress): Promise<void> {
//   try {
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
//   } catch (error) {
//     console.error('Failed to save user progress:', error);
//   }
// }

// // 称号を計算
// export function calculateTitle(completedCategories: QuizCategory[]): Title {
//   const count = completedCategories.length;
  
//   if (count === 0) return 'none';
//   if (count === 1) return 'BUSHI';
//   if (count === 2) return 'NINJA';
//   if (count === 3) return 'SAMURAI';
//   if (count === 4) return 'DAIMYO';
//   if (count === 5) return 'SHOGUN';
//   if (count === 6) return 'SENSEI';
  
//   return 'none';
// }

// // クイズ結果を記録
// export async function recordQuizResult(
//   category: QuizCategory,
//   quizId: string,
//   isCorrect: boolean
// ): Promise<UserProgress> {
//   const progress = await getUserProgress();
//   const categoryProgress = progress.categoryProgress[category];
  
//   if (isCorrect) {
//     // 正解した場合
//     if (!categoryProgress.correctQuizIds.includes(quizId)) {
//       categoryProgress.correctQuizIds.push(quizId);
//     }
    
//     // 不正解リストから削除（以前不正解だった場合）
//     const incorrectIndex = categoryProgress.incorrectQuizIds.indexOf(quizId);
//     if (incorrectIndex > -1) {
//       categoryProgress.incorrectQuizIds.splice(incorrectIndex, 1);
//     }
//   } else {
//     // 不正解の場合
//     if (!categoryProgress.incorrectQuizIds.includes(quizId)) {
//       categoryProgress.incorrectQuizIds.push(quizId);
//     }
//   }
  
//   // 50問完走チェック
//   const isCompleted = categoryProgress.correctQuizIds.length >= 50;
//   categoryProgress.isCompleted = isCompleted;
  
//   // 完走したカテゴリーリストを更新
//   if (isCompleted && !progress.completedCategories.includes(category)) {
//     progress.completedCategories.push(category);
//   }
  
//   // 称号を再計算
//   progress.currentTitle = calculateTitle(progress.completedCategories);
  
//   // 保存
//   await saveUserProgress(progress);
  
//   return progress;
// }

// // カテゴリーの進捗を取得
// export function getCategoryProgress(
//   progress: UserProgress,
//   category: QuizCategory
// ): { correct: number; total: number; percentage: number; isCompleted: boolean } {
//   const categoryProgress = progress.categoryProgress[category];
//   const correct = categoryProgress.correctQuizIds.length;
//   const total = 50;
//   const percentage = Math.round((correct / total) * 100);
  
//   return {
//     correct,
//     total,
//     percentage,
//     isCompleted: categoryProgress.isCompleted,
//   };
// }

// // 進捗をリセット（デバッグ用）
// export async function resetUserProgress(): Promise<void> {
//   await saveUserProgress(initialUserProgress);
// }

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizCategory, UserProgress, Title, CategoryProgress } from '../types/quiz';

const STORAGE_KEY = '@user_progress';

// 初期データ
const initialCategoryProgress: CategoryProgress = {
  correctQuizIds: [],
  incorrectQuizIds: [],
  isCompleted: false,
};

const initialUserProgress: UserProgress = {
  completedCategories: [],
  currentTitle: 'none',
  categoryProgress: {
    'culture': { ...initialCategoryProgress },
    'food': { ...initialCategoryProgress },
    'region': { ...initialCategoryProgress },
    'language': { ...initialCategoryProgress },
    'manner': { ...initialCategoryProgress },
    'anime-manga': { ...initialCategoryProgress },
  },
};

// UserProgress を取得
export async function getUserProgress(): Promise<UserProgress> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (data) {
      const progress: UserProgress = JSON.parse(data);
      
      // マイグレーション：region カテゴリーがない場合は追加
      if (!progress.categoryProgress.region) {
        progress.categoryProgress.region = { ...initialCategoryProgress };
        await saveUserProgress(progress);
      }
      
      return progress;
    }
    
    // 初回起動
    await saveUserProgress(initialUserProgress);
    return initialUserProgress;
  } catch (error) {
    console.error('Failed to load user progress:', error);
    return initialUserProgress;
  }
}

// UserProgress を保存
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
}

// 称号を計算
export function calculateTitle(completedCategories: QuizCategory[]): Title {
  const count = completedCategories.length;
  
  if (count === 0) return 'none';
  if (count === 1) return 'BUSHI';
  if (count === 2) return 'NINJA';
  if (count === 3) return 'SAMURAI';
  if (count === 4) return 'DAIMYO';
  if (count === 5) return 'SHOGUN';
  if (count === 6) return 'SENSEI';
  
  return 'none';
}

// クイズ結果を記録
export async function recordQuizResult(
  category: QuizCategory,
  quizId: string,
  isCorrect: boolean
): Promise<UserProgress> {
  const progress = await getUserProgress();
  
  // ガード：カテゴリーが存在しない場合は初期化
  if (!progress.categoryProgress[category]) {
    progress.categoryProgress[category] = { ...initialCategoryProgress };
  }
  
  const categoryProgress = progress.categoryProgress[category];
  
  if (isCorrect) {
    // 正解した場合
    if (!categoryProgress.correctQuizIds.includes(quizId)) {
      categoryProgress.correctQuizIds.push(quizId);
    }
    
    // 不正解リストから削除（以前不正解だった場合）
    const incorrectIndex = categoryProgress.incorrectQuizIds.indexOf(quizId);
    if (incorrectIndex > -1) {
      categoryProgress.incorrectQuizIds.splice(incorrectIndex, 1);
    }
  } else {
    // 不正解の場合
    if (!categoryProgress.incorrectQuizIds.includes(quizId)) {
      categoryProgress.incorrectQuizIds.push(quizId);
    }
  }
  
  // 50問完走チェック
  const isCompleted = categoryProgress.correctQuizIds.length >= 50;
  categoryProgress.isCompleted = isCompleted;
  
  // 完走したカテゴリーリストを更新
  if (isCompleted && !progress.completedCategories.includes(category)) {
    progress.completedCategories.push(category);
  }
  
  // 称号を再計算
  progress.currentTitle = calculateTitle(progress.completedCategories);
  
  // 保存
  await saveUserProgress(progress);
  
  return progress;
}

// カテゴリーの進捗を取得
export function getCategoryProgress(
  progress: UserProgress,
  category: QuizCategory
): { correct: number; total: number; percentage: number; isCompleted: boolean } {
  // ガード：カテゴリーが存在しない場合
  if (!progress.categoryProgress[category]) {
    return { correct: 0, total: 50, percentage: 0, isCompleted: false };
  }
  
  const categoryProgress = progress.categoryProgress[category];
  const correct = categoryProgress.correctQuizIds.length;
  const total = 50;
  const percentage = Math.round((correct / total) * 100);
  
  return {
    correct,
    total,
    percentage,
    isCompleted: categoryProgress.isCompleted,
  };
}

// 進捗をリセット（デバッグ用）
export async function resetUserProgress(): Promise<void> {
  await saveUserProgress(initialUserProgress);
}