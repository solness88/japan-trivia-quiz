import { NextRequest, NextResponse } from 'next/server';
import { loadQuizzes, saveQuizzes } from '@/lib/quiz-storage';

// export async function POST(request: NextRequest) {
//   try {
//     const { quizId, direction } = await request.json();
    
//     const quizzes = await loadQuizzes();
    
//     // カテゴリー順にソート
//     const categoryOrder = ['culture', 'food', 'region', 'language', 'manner', 'anime-manga'];
    
//     const sortedQuizzes = quizzes.sort((a, b) => {
//       const categoryA = categoryOrder.indexOf(a.category);
//       const categoryB = categoryOrder.indexOf(b.category);
      
//       if (categoryA !== categoryB) {
//         return categoryA - categoryB;
//       }
      
//       // sortOrder があれば優先
//       if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
//         return a.sortOrder - b.sortOrder;
//       }
      
//       // sortOrder が片方だけある場合
//       if (a.sortOrder !== undefined) return -1;
//       if (b.sortOrder !== undefined) return 1;
      
//       return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
//     });
    
//     // 対象のクイズを探す
//     const currentIndex = sortedQuizzes.findIndex(q => q.id === quizId);
//     if (currentIndex === -1) {
//       return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
//     }
    
//     const currentQuiz = sortedQuizzes[currentIndex];
    
//     // 移動先のインデックスを計算
//     const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
//     // 範囲チェック
//     if (targetIndex < 0 || targetIndex >= sortedQuizzes.length) {
//       return NextResponse.json({ error: 'Cannot move further' }, { status: 400 });
//     }
    
//     const targetQuiz = sortedQuizzes[targetIndex];
    
//     // 同じカテゴリー内でのみ移動可能
//     if (currentQuiz.category !== targetQuiz.category) {
//       return NextResponse.json({ error: 'Cannot move across categories' }, { status: 400 });
//     }
    
//     // sortOrder を設定（まだない場合は初期化）
//     if (currentQuiz.sortOrder === undefined) {
//       currentQuiz.sortOrder = currentIndex;
//     }
//     if (targetQuiz.sortOrder === undefined) {
//       targetQuiz.sortOrder = targetIndex;
//     }
    
//     // sortOrder を入れ替え
//     const tempOrder = currentQuiz.sortOrder;
//     currentQuiz.sortOrder = targetQuiz.sortOrder;
//     targetQuiz.sortOrder = tempOrder;
    
//     // 保存
//     await saveQuizzes(quizzes);
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Reorder error:', error);
//     return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const { quizId, direction } = await request.json();
    
    console.log('=== REORDER START ===');
    console.log('Quiz ID:', quizId);
    console.log('Direction:', direction);
    
    const quizzes = await loadQuizzes();
    console.log('Total quizzes loaded:', quizzes.length);
    
    // カテゴリー順にソート
    const categoryOrder = ['culture', 'food', 'region', 'language', 'manner', 'anime-manga'];
    
    const sortedQuizzes = quizzes.sort((a, b) => {
      const categoryA = categoryOrder.indexOf(a.category);
      const categoryB = categoryOrder.indexOf(b.category);
      
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }
      
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      
      if (a.sortOrder !== undefined) return -1;
      if (b.sortOrder !== undefined) return 1;
      
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    
    // 対象のクイズを探す
    const currentIndex = sortedQuizzes.findIndex(q => q.id === quizId);
    console.log('Current index:', currentIndex);
    
    if (currentIndex === -1) {
      console.log('Quiz not found!');
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    const currentQuiz = sortedQuizzes[currentIndex];
    console.log('Current quiz category:', currentQuiz.category);
    
    // 移動先のインデックスを計算
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    console.log('Target index:', targetIndex);
    
    // 範囲チェック
    if (targetIndex < 0 || targetIndex >= sortedQuizzes.length) {
      console.log('Cannot move further');
      return NextResponse.json({ error: 'Cannot move further' }, { status: 400 });
    }
    
    const targetQuiz = sortedQuizzes[targetIndex];
    console.log('Target quiz category:', targetQuiz.category);
    
    // 同じカテゴリー内でのみ移動可能
    if (currentQuiz.category !== targetQuiz.category) {
      console.log('Cannot move across categories');
      return NextResponse.json({ error: 'Cannot move across categories' }, { status: 400 });
    }
    
    // sortOrder を設定（まだない場合は初期化）
    if (currentQuiz.sortOrder === undefined) {
      currentQuiz.sortOrder = currentIndex;
      console.log('Initialized current sortOrder:', currentIndex);
    }
    if (targetQuiz.sortOrder === undefined) {
      targetQuiz.sortOrder = targetIndex;
      console.log('Initialized target sortOrder:', targetIndex);
    }
    
    // sortOrder を入れ替え
    const tempOrder = currentQuiz.sortOrder;
    currentQuiz.sortOrder = targetQuiz.sortOrder;
    targetQuiz.sortOrder = tempOrder;
    
    console.log('Swapped sortOrder:', currentQuiz.sortOrder, '<->', targetQuiz.sortOrder);
    
    // 保存
    console.log('Saving quizzes...');
    await saveQuizzes(quizzes);
    console.log('=== REORDER COMPLETE ===');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}