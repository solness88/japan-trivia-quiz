import { NextResponse } from 'next/server';
import { loadQuizzes } from '@/lib/quiz-storage';

export async function GET() {
  try {
    const quizzes = await loadQuizzes();
    
    // 承認済みのクイズだけをフィルタリング
    const approvedQuizzes = quizzes.filter(q => q.reviewStatus === 'approved');
    
    // クライアント用のフォーマットに変換（reviewStatusなど不要な情報を除外）
    const exportData = approvedQuizzes.map(quiz => ({
      id: quiz.id,
      question: quiz.question,
      options: quiz.options,
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation,
      difficulty: quiz.difficulty,
      category: quiz.category,
      tags: quiz.tags,
    }));
    
    // JSONとして返す
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="quizzes.json"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export quizzes' },
      { status: 500 }
    );
  }
}