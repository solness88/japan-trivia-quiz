'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz, ReviewStatus } from '@japan-trivia/shared';

const statusConfig = {
  draft: { label: '下書き', emoji: '📝', color: 'bg-gray-100 text-gray-800' },
  reviewing: { label: 'レビュー中', emoji: '🔍', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: '承認済み', emoji: '✅', color: 'bg-green-100 text-green-800' },
  rejected: { label: '却下', emoji: '❌', color: 'bg-red-100 text-red-800' },
};

export default function QuizEditForm({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(quiz.reviewNotes || '');

  const updateStatus = async (newStatus: ReviewStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewStatus: newStatus,
          reviewNotes: reviewNotes || undefined
        }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      router.push('/');
      router.refresh();
    } catch (error) {
      alert('更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async () => {
    if (!confirm('本当に削除しますか？')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');
      
      router.push('/');
      router.refresh();
    } catch (error) {
      alert('削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = statusConfig[quiz.reviewStatus];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">クイズレビュー</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
              {currentStatus.emoji} {currentStatus.label}
            </span>
            <span className="text-sm text-gray-500">
              作成: {new Date(quiz.createdAt).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>

        {/* クイズ内容 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">質問</h3>
            <p className="text-lg text-gray-900">{quiz.question}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">選択肢</h3>
            <ul className="space-y-2">
              {quiz.options.map((option, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg ${
                    index === quiz.correctAnswer
                      ? 'bg-green-50 border-2 border-green-500 font-semibold text-gray-900'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                >
                  {index === quiz.correctAnswer && '✅ '}
                  {String.fromCharCode(65 + index)}) {option}
                </li>
              ))}
            </ul>
          </div>

          {quiz.explanation && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">解説</h3>
              <p className="text-gray-600 italic">{quiz.explanation}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">カテゴリ: </span>
              <span className="font-medium text-gray-900">{quiz.category}</span>
            </div>
            <div>
              <span className="text-gray-600">難易度: </span>
              <span className="font-medium text-gray-900">{quiz.difficulty}</span>
            </div>
          </div>
        </div>

        {/* レビューメモ */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            レビューメモ（オプション）
          </label>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
            rows={3}
            placeholder="修正が必要な点や、却下理由などを記入"
          />
        </div>

        {/* アクションボタン */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">ステータス変更</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => updateStatus('approved')}
              disabled={loading || quiz.reviewStatus === 'approved'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              ✅ 承認
            </button>
            <button
              onClick={() => updateStatus('rejected')}
              disabled={loading || quiz.reviewStatus === 'rejected'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              ❌ 却下
            </button>
            <button
              onClick={() => updateStatus('reviewing')}
              disabled={loading || quiz.reviewStatus === 'reviewing'}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              🔍 レビュー中
            </button>
            <button
              onClick={() => updateStatus('draft')}
              disabled={loading || quiz.reviewStatus === 'draft'}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              📝 下書きに戻す
            </button>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={deleteQuiz}
              disabled={loading}
              className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            >
              🗑️ 削除
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => router.push('/')}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-gray-900"
            >
              ← 一覧に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}