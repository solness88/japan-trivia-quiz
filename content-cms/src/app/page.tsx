import Link from 'next/link';
import { loadQuizzes } from '@/lib/quiz-storage';
import type { Quiz } from '@japan-trivia/shared';

// カテゴリ名を日本語に変換
const categoryLabels: Record<string, string> = {
  culture: '文化',
  food: '食べ物',
  history: '歴史',
  geography: '地理',
  language: '言語',
  tradition: '伝統',
  'pop-culture': 'ポップカルチャー',
  etiquette: 'マナー',
};

// ステータスのラベルとスタイル
const statusConfig = {
  draft: { label: '下書き', emoji: '📝', color: 'text-gray-600' },
  reviewing: { label: 'レビュー中', emoji: '🔍', color: 'text-yellow-600' },
  approved: { label: '承認済み', emoji: '✅', color: 'text-green-600' },
  rejected: { label: '却下', emoji: '❌', color: 'text-red-600' },
};

export default async function HomePage() {
  const quizzes = await loadQuizzes();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Japan Trivia Quiz - 管理ツール
          </h1>
          <p className="text-gray-600">
            クイズの作成・管理を行います
          </p>
        </div>
        
        {/* アクションボタン */}
        <div className="mb-6 flex gap-4">
          <Link
            href="/quiz/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ 新規作成
          </Link>
          <Link
            href="/generate"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition inline-block"
          >
            🤖 AI生成
          </Link>
          {/* <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            disabled
          >
            📥 JSONエクスポート
          </button> */}

          <a
            href="/api/export"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-block text-center"
            download
          >
            📥 JSONエクスポート
          </a>

        </div>
        
        {/* 統計情報 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">総数</p>
            <p className="text-2xl font-bold text-blue-500">{quizzes.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">承認済み</p>
            <p className="text-2xl font-bold text-green-600">
              {quizzes.filter(q => q.reviewStatus === 'approved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">レビュー中</p>
            <p className="text-2xl font-bold text-yellow-600">
              {quizzes.filter(q => q.reviewStatus === 'reviewing').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">下書き</p>
            <p className="text-2xl font-bold text-gray-600">
              {quizzes.filter(q => q.reviewStatus === 'draft').length}
            </p>
          </div>
        </div>
        
        {/* クイズ一覧 */}
        {quizzes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              まだクイズがありません
            </p>
            <Link
              href="/quiz/new"
              className="text-blue-600 hover:underline"
            >
              最初のクイズを作成する
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    質問
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    難易度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quizzes.map((quiz) => {
                  const status = statusConfig[quiz.reviewStatus];
                  return (
                    <tr key={quiz.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {quiz.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {quiz.question.substring(0, 50)}
                        {quiz.question.length > 50 && '...'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {categoryLabels[quiz.category]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {quiz.difficulty}
                      </td>
                      <td className={`px-6 py-4 text-sm ${status.color}`}>
                        {status.emoji} {status.label}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/quiz/${quiz.id}`}
                          className="text-blue-600 hover:underline mr-4"
                        >
                          編集
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}