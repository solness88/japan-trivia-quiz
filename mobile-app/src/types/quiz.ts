// shared パッケージから型をインポート
export type {
  Quiz,
  QuizCategory,
  QuizDifficulty,
} from '@japan-trivia/shared';

// モバイルアプリ専用の型
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