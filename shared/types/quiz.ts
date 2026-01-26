/**
 * クイズのレビューステータス
 */
export type ReviewStatus = 'draft' | 'reviewing' | 'approved' | 'rejected';

/**
 * クイズのカテゴリ
 */
export type QuizCategory = 
  | 'culture'      // 文化
  | 'food'         // 食べ物
  | 'history'      // 歴史
  | 'geography'    // 地理
  | 'language'     // 言語
  | 'tradition'    // 伝統
  | 'pop-culture'  // ポップカルチャー
  | 'etiquette';   // マナー・エチケット

/**
 * クイズの難易度
 */
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

/**
 * クイズデータの基本構造
 */
export interface Quiz {
  /** 一意のID（UUIDまたはタイムスタンプベース） */
  id: string;
  
  /** 質問文 */
  question: string;
  
  /** 4つの選択肢 */
  options: [string, string, string, string];
  
  /** 正解のインデックス（0-3） */
  correctAnswer: 0 | 1 | 2 | 3;
  
  /** 正解後に表示する解説（オプション） */
  explanation?: string;
  
  /** 難易度 */
  difficulty: QuizDifficulty;
  
  /** カテゴリ */
  category: QuizCategory;
  
  /** タグ（検索・フィルタリング用） */
  tags: string[];
  
  /** レビューステータス */
  reviewStatus: ReviewStatus;
  
  /** 作成日時（ISO 8601形式） */
  createdAt: string;
  
  /** 更新日時（ISO 8601形式） */
  updatedAt: string;
  
  /** レビュー担当者のメモ（オプション） */
  reviewNotes?: string;
}

/**
 * クイズ作成時の入力データ（IDや日時は自動生成）
 */
export interface QuizInput {
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation?: string;
  difficulty: QuizDifficulty;
  category: QuizCategory;
  tags: string[];
}

/**
 * クイズのフィルタリング条件
 */
export interface QuizFilter {
  category?: QuizCategory;
  difficulty?: QuizDifficulty;
  reviewStatus?: ReviewStatus;
  searchQuery?: string;
}

/**
 * AI生成のリクエストパラメータ
 */
export interface AIGenerationRequest {
  category: QuizCategory;
  difficulty: QuizDifficulty;
  count: number; // 生成する問題数
}