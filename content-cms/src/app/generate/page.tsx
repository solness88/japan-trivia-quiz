'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { QuizInput, QuizCategory, QuizDifficulty } from '@japan-trivia/shared';

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuizzes, setGeneratedQuizzes] = useState<QuizInput[]>([]);

  const [params, setParams] = useState({
    category: 'culture' as QuizCategory,
    difficulty: 'medium' as QuizDifficulty,
    count: 10,
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedQuizzes([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quizzes');
      }

      const quizzes = await response.json();
      setGeneratedQuizzes(quizzes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // 各クイズを順番に保存
      for (const quiz of generatedQuizzes) {
        await fetch('/api/quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quiz),
        });
      }
      
      // 成功したら一覧ページへ
      router.push('/');
    } catch (err) {
      setError('Failed to save quizzes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">🤖 AI クイズ生成</h1>
          <p className="text-gray-600 mt-2">Google Gemini でクイズを自動生成します</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* 設定フォーム */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 bg-white">生成設定</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                value={params.category}
                onChange={(e) => setParams({ ...params, category: e.target.value as QuizCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                disabled={loading}
              >
                <option value="culture">Culture</option>
                <option value="food">Food</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
                <option value="language">Language</option>
                <option value="tradition">Tradition</option>
                <option value="pop-culture">Pop Culture</option>
                <option value="etiquette">Etiquette</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                難易度
              </label>
              <select
                value={params.difficulty}
                onChange={(e) => setParams({ ...params, difficulty: e.target.value as QuizDifficulty })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                disabled={loading}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生成数
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={params.count}
                onChange={(e) => setParams({ ...params, count: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                disabled={loading}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? '生成中...' : '🤖 生成開始'}
          </button>
        </div>

        {/* 生成結果 */}
        {generatedQuizzes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                生成完了！{generatedQuizzes.length}問
              </h2>
              <button
                onClick={handleSaveAll}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {loading ? '保存中...' : '✅ 全て保存'}
              </button>
            </div>

            <div className="space-y-4">
              {generatedQuizzes.map((quiz, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Q{index + 1}: {quiz.question}</h3>
                  <ul className="space-y-1 mb-2">
                    {quiz.options.map((option, optIndex) => (
                      <li
                        key={optIndex}
                        className={`pl-4 ${
                          optIndex === quiz.correctAnswer
                            ? 'text-green-600 font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        {optIndex === quiz.correctAnswer && '✅ '}
                        {String.fromCharCode(65 + optIndex)}) {option}
                      </li>
                    ))}
                  </ul>
                  {quiz.explanation && (
                    <p className="text-sm text-gray-500 italic">
                      💡 {quiz.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}