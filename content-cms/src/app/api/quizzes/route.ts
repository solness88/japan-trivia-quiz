import { NextRequest, NextResponse } from 'next/server';
import { loadQuizzes, addQuiz } from '@/lib/quiz-storage';
import { validateQuizInput } from '@japan-trivia/shared';
import { checkSimilarity } from '@/lib/similarity-checker';
import type { QuizInput } from '@japan-trivia/shared';

/**
 * GET /api/quizzes
 * 全てのクイズを取得
 */
export async function GET() {
  try {
    const quizzes = await loadQuizzes();
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Failed to load quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to load quizzes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quizzes
 * 新しいクイズを作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as QuizInput & { hasSimilar?: boolean };
    
    // バリデーション
    const validation = validateQuizInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    
    // 類似度チェック（hasSimilarが未設定の場合のみ実行）
    if (body.hasSimilar === undefined) {
      const existingQuizzes = await loadQuizzes();
      body.hasSimilar = checkSimilarity(body.question, existingQuizzes);
    }
    
    // クイズを追加
    const newQuiz = await addQuiz(body);
    
    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error('Failed to create quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}