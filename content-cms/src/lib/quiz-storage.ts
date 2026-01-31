import fs from 'fs/promises';
import path from 'path';
import { Quiz, QuizInput } from '@japan-trivia/shared';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'quizzes.json');

/**
 * クイズデータを全て読み込む
 */
export async function loadQuizzes(): Promise<Quiz[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない場合は空配列を返す
    return [];
  }
}

/**
 * クイズデータを保存する
 */
export async function saveQuizzes(quizzes: Quiz[]): Promise<void> {
  // data ディレクトリが存在しない場合は作成
  const dataDir = path.dirname(DATA_FILE);
  await fs.mkdir(dataDir, { recursive: true });
  
  // JSONを整形して保存
  await fs.writeFile(DATA_FILE, JSON.stringify(quizzes, null, 2), 'utf-8');
}

/**
 * 新しいクイズを追加
 */
export async function addQuiz(input: QuizInput): Promise<Quiz> {
  const quizzes = await loadQuizzes();
  
  const now = new Date().toISOString();
  const newQuiz: Quiz = {
    id: uuidv4(),
    ...input,
    reviewStatus: 'draft',
    createdAt: now,
    updatedAt: now,
  };
  
  quizzes.push(newQuiz);
  await saveQuizzes(quizzes);
  
  return newQuiz;
}

/**
 * クイズを更新
 */
// export async function updateQuiz(id: string, updates: Partial<QuizInput>): Promise<Quiz | null> {
//   const quizzes = await loadQuizzes();
//   const index = quizzes.findIndex(q => q.id === id);
  
//   if (index === -1) {
//     return null;
//   }
  
//   const updatedQuiz: Quiz = {
//     ...quizzes[index],
//     ...updates,
//     updatedAt: new Date().toISOString(),
//   };
  
//   quizzes[index] = updatedQuiz;
//   await saveQuizzes(quizzes);
  
//   return updatedQuiz;
// }

/**
 * クイズを更新
 */
export async function updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz | null> {
  const quizzes = await loadQuizzes();
  const index = quizzes.findIndex(q => q.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedQuiz: Quiz = {
    ...quizzes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  quizzes[index] = updatedQuiz;
  await saveQuizzes(quizzes);
  
  return updatedQuiz;
}

/**
 * クイズを削除
 */
export async function deleteQuiz(id: string): Promise<boolean> {
  const quizzes = await loadQuizzes();
  const filteredQuizzes = quizzes.filter(q => q.id !== id);
  
  if (filteredQuizzes.length === quizzes.length) {
    return false; // 見つからなかった
  }
  
  await saveQuizzes(filteredQuizzes);
  return true;
}

/**
 * IDでクイズを取得
 */
export async function getQuizById(id: string): Promise<Quiz | null> {
  const quizzes = await loadQuizzes();
  return quizzes.find(q => q.id === id) || null;
}