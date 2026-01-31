import { NextRequest, NextResponse } from 'next/server';
import { generateQuizzes } from '@/lib/ai-generator';
import type { QuizCategory, QuizDifficulty } from '@japan-trivia/shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, difficulty, count } = body;

    // バリデーション
    if (!category || !difficulty || !count) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 20' },
        { status: 400 }
      );
    }

    // AI生成
    const quizzes = await generateQuizzes({
      category: category as QuizCategory,
      difficulty: difficulty as QuizDifficulty,
      count: Number(count),
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quizzes' },
      { status: 500 }
    );
  }
}