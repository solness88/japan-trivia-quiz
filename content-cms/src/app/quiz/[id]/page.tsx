import { notFound } from 'next/navigation';
import { getQuizById, loadQuizzes } from '@/lib/quiz-storage';
import QuizEditForm from '@/components/QuizEditForm';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ filter?: 'reviewing' | 'approved' | 'all' }>;
}

export default async function QuizEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { filter = 'all' } = await searchParams;
  
  const quiz = await getQuizById(id);
  
  if (!quiz) {
    notFound();
  }
  
  // 全クイズを取得
  const allQuizzes = await loadQuizzes();
  
  // フィルタリング（現在のタブに応じて）
  const filteredQuizzes = allQuizzes
    .filter(q => {
      if (filter === 'reviewing') return q.reviewStatus === 'reviewing';
      if (filter === 'approved') return q.reviewStatus === 'approved';
      return true;
    })
    .sort((a, b) => {
      // カテゴリー順にソート
      const categoryOrder = ['culture', 'food', 'geography', 'language', 'manner', 'anime-manga'];
      const categoryA = categoryOrder.indexOf(a.category);
      const categoryB = categoryOrder.indexOf(b.category);
      
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }
      
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  
  return <QuizEditForm quiz={quiz} allQuizzes={filteredQuizzes} currentFilter={filter} />;
}