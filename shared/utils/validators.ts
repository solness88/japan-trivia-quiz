import { Quiz, QuizInput } from '../types/quiz';

/**
 * クイズデータのバリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * クイズの質問文をバリデーション
 */
export function validateQuestion(question: string): ValidationResult {
  const errors: string[] = [];
  
  if (!question || question.trim().length === 0) {
    errors.push('質問文が空です');
  }
  
  if (question.length > 200) {
    errors.push('質問文が長すぎます（200文字以内）');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 選択肢をバリデーション
 */
export function validateOptions(options: string[]): ValidationResult {
  const errors: string[] = [];
  
  if (options.length !== 4) {
    errors.push('選択肢は4つ必要です');
  }
  
  options.forEach((option, index) => {
    if (!option || option.trim().length === 0) {
      errors.push(`選択肢${index + 1}が空です`);
    }
    if (option.length > 100) {
      errors.push(`選択肢${index + 1}が長すぎます（100文字以内）`);
    }
  });
  
  // 重複チェック
  const uniqueOptions = new Set(options.map(o => o.trim().toLowerCase()));
  if (uniqueOptions.size !== options.length) {
    errors.push('選択肢に重複があります');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * センシティブなキーワードのチェック
 * ※これは基本的なリスト。実際はもっと包括的なリストが必要
 */
const SENSITIVE_KEYWORDS = [
  // 人種差別
  'racist', 'racial slur',
  // 宗教的に攻撃的
  'religious hatred',
  // 性的
  'explicit sexual',
  // 暴力的
  'violence', 'killing',
  // 日本語の不適切な表現
  '差別', '暴力', '殺',
];

/**
 * センシティブなコンテンツのチェック
 */
export function checkSensitiveContent(text: string): ValidationResult {
  const errors: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const keyword of SENSITIVE_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      errors.push(`センシティブなキーワードが含まれています: ${keyword}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * QuizInput全体のバリデーション
 */
export function validateQuizInput(input: QuizInput): ValidationResult {
  const allErrors: string[] = [];
  
  // 質問文のバリデーション
  const questionResult = validateQuestion(input.question);
  allErrors.push(...questionResult.errors);
  
  // 選択肢のバリデーション
  const optionsResult = validateOptions(input.options);
  allErrors.push(...optionsResult.errors);
  
  // 正解インデックスのバリデーション
  if (input.correctAnswer < 0 || input.correctAnswer > 3) {
    allErrors.push('正解のインデックスは0-3の範囲である必要があります');
  }
  
  // センシティブコンテンツチェック
  const sensitiveCheck = checkSensitiveContent(
    `${input.question} ${input.options.join(' ')} ${input.explanation || ''}`
  );
  allErrors.push(...sensitiveCheck.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

/**
 * 既存のクイズとの重複チェック
 */
export function checkDuplicate(
  newQuiz: QuizInput,
  existingQuizzes: Quiz[]
): boolean {
  const newQuestion = newQuiz.question.trim().toLowerCase();
  
  return existingQuizzes.some(quiz => 
    quiz.question.trim().toLowerCase() === newQuestion
  );
}