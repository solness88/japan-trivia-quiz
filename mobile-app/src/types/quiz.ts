// 型定義を直接定義（shared パッケージの問題を回避）
export type QuizCategory = 
  | 'random'
  | 'culture'
  | 'food'
  | 'history'
  | 'geography'
  | 'language'
  | 'tradition'
  | 'pop-culture'
  | 'etiquette';

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