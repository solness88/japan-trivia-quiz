// 型定義を直接定義（shared パッケージの問題を回避）
export type QuizCategory = 
  | 'culture'
  | 'food'
  | 'region'
  | 'language'
  | 'manner'
  | 'anime-manga';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface Quiz {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation?: string;
  difficulty: QuizDifficulty;
  category: QuizCategory;
  tags: string[];
}

export interface QuizResult {
  quizId: string;
  isCorrect: boolean;
  userAnswer: number;
  timestamp: Date;
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  results: QuizResult[];
}

// 称号
export type Title = 'none' | 'BUSHI' | 'NINJA' | 'SAMURAI' | 'DAIMYO' | 'SHOGUN' | 'SENSEI';

// カテゴリーごとの進捗
export interface CategoryProgress {
  correctQuizIds: string[];     // 正解した問題のID配列
  incorrectQuizIds: string[];   // 不正解の問題のID配列
  isCompleted: boolean;          // 50問完走したか
}

// ユーザー全体の進捗
export interface UserProgress {
  completedCategories: QuizCategory[];  // 完走したカテゴリー配列
  currentTitle: Title;                   // 現在の称号
  categoryProgress: {
    [key in QuizCategory]: CategoryProgress;
  };
}