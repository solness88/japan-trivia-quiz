import { NextRequest, NextResponse } from 'next/server';
import { getQuizById, updateQuiz, deleteQuiz } from '@/lib/quiz-storage';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/quizzes/:id
 * 特定のクイズを取得
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;  // ← await を追加
    console.log('GET quiz:', id);
    
    const quiz = await getQuizById(id);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Failed to get quiz:', error);
    return NextResponse.json(
      { error: 'Failed to get quiz' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/quizzes/:id
 * クイズを更新
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;  // ← await を追加
    const body = await request.json();
    
    console.log('PUT quiz:', id);
    console.log('Update data:', body);
    
    const updatedQuiz = await updateQuiz(id, body);
    
    if (!updatedQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error('Failed to update quiz:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update quiz',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/quizzes/:id
 * クイズを削除
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;  // ← await を追加
    console.log('DELETE quiz:', id);
    
    const success = await deleteQuiz(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Failed to delete quiz:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}