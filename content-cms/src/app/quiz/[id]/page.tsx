import { notFound } from 'next/navigation';
import { getQuizById } from '@/lib/quiz-storage';
import QuizEditForm from '@/components/QuizEditForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizEditPage({ params }: PageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);
  
  if (!quiz) {
    notFound();
  }
  
  return <QuizEditForm quiz={quiz} />;
}