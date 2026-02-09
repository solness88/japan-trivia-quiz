import type { Quiz } from '@japan-trivia/shared';

/**
 * 2つのテキストの類似度を計算（0-1の範囲）
 */
function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '');
  const words1 = normalize(text1).split(/\s+/).filter(w => w.length > 3);
  const words2 = normalize(text2).split(/\s+/).filter(w => w.length > 3);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(w => words2.includes(w)).length;
  const similarity = commonWords / Math.max(words1.length, words2.length);
  
  return similarity;
}

/**
 * 既存クイズの中に類似したものがあるかチェック
 * @param question チェックする質問文
 * @param existingQuizzes 既存クイズのリスト
 * @param excludeId チェック対象から除外するID（編集時に自分自身を除外）
 * @returns 類似クイズがあれば true
 */
export function checkSimilarity(
  question: string,
  existingQuizzes: Quiz[],
  excludeId?: string
): boolean {
  const SIMILARITY_THRESHOLD = 0.6; // 60%以上で類似と判定
  
  for (const existing of existingQuizzes) {
    // 自分自身は除外
    if (excludeId && existing.id === excludeId) {
      continue;
    }
    
    const similarity = calculateSimilarity(question, existing.question);
    if (similarity >= SIMILARITY_THRESHOLD) {
      return true;
    }
  }
  
  return false;
}