'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz, QuizCategory, QuizDifficulty } from '@japan-trivia/shared';

const statusConfig = {
  reviewing: { label: 'レビュー中', emoji: '🔍', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: '承認済み', emoji: '✅', color: 'bg-green-100 text-green-800' },
};

const categoryLabels: Record<QuizCategory, string> = {
  culture: 'Culture',
  food: 'Food',
  region: 'Region',
  language: 'Language',
  manner: 'Manner',
  'anime-manga': 'Anime / Manga',
};

const difficultyLabels: Record<QuizDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export default function QuizEditForm({ 
    quiz,
    allQuizzes = [],
    currentFilter = 'all'
  }: { 
    quiz: Quiz;
    allQuizzes?: Quiz[];
    currentFilter?: 'reviewing' | 'approved' | 'all';
  }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ナビゲーションロジック
  const currentIndex = allQuizzes.findIndex(q => q.id === quiz.id);
  const previousQuiz = currentIndex > 0 ? allQuizzes[currentIndex - 1] : null;
  const nextQuiz = currentIndex < allQuizzes.length - 1 ? allQuizzes[currentIndex + 1] : null;

  console.log('QuizEditForm rendered, isEditing:', isEditing);

  // 編集可能なフィールド
  const [question, setQuestion] = useState(quiz.question);

  const [options, setOptions] = useState<string[]>(quiz.options);
  const [correctAnswer, setCorrectAnswer] = useState<number>(quiz.correctAnswer);
  const [explanation, setExplanation] = useState(quiz.explanation || '');
  const [category, setCategory] = useState<QuizCategory>(quiz.category);

  const [difficulty, setDifficulty] = useState<QuizDifficulty>(quiz.difficulty);

  const currentStatus = statusConfig[quiz.reviewStatus as keyof typeof statusConfig] || statusConfig.reviewing;

  // 変更があるかチェック
  const hasChanges = 
    question !== quiz.question ||
    JSON.stringify(options) !== JSON.stringify(quiz.options) ||
    correctAnswer !== quiz.correctAnswer ||
    explanation !== (quiz.explanation || '') ||
    category !== quiz.category ||
    difficulty !== quiz.difficulty;

  const saveChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
          explanation: explanation || undefined,
          category,
          difficulty,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      alert('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async () => {
    const newStatus = quiz.reviewStatus === 'approved' ? 'reviewing' : 'approved';
    setLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewStatus: newStatus,
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">クイズ編集</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
              {currentStatus.emoji} {currentStatus.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              quiz.hasSimilar 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {quiz.hasSimilar ? '❗ 類似クイズあり' : '✅ ユニーク'}
            </span>
            <span className="text-sm text-gray-500">
              作成: {new Date(quiz.createdAt).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>

        {/* クイズ内容編集フォーム */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {/* 質問 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              質問 <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
            ) : (
              <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                {question}
              </p>
            )}
          </div>

          {/* 選択肢 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選択肢 <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                      className="mt-1.5 cursor-pointer"
                      title="正解を選択"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`選択肢 ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    </div>
                    {correctAnswer === index && (
                      <span className="text-green-600 font-bold mt-2">✅ 正解</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {options.map((option, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-lg ${
                      index === correctAnswer
                        ? 'bg-green-50 border-2 border-green-500 font-semibold text-gray-900'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    {index === correctAnswer && '✅ '}
                    {String.fromCharCode(65 + index)}) {option}
                  </li>
                ))}
              </ul>
            )}
            {isEditing && (
              <p className="mt-2 text-sm text-gray-500">
                ラジオボタンで正解を選択してください
              </p>
            )}
          </div>

          {/* 解説 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              解説（オプション）
            </label>
            {isEditing ? (
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="正解の理由や補足情報"
              />
            ) : (
              <p className="text-gray-600 italic bg-gray-50 px-4 py-2 rounded-lg">
                {explanation || 'なし'}
              </p>
            )}
          </div>
          
          {/* カテゴリと難易度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as QuizCategory)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {categoryLabels[category]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                難易度 <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as QuizDifficulty)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {Object.entries(difficultyLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {difficultyLabels[difficulty]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {/* 編集モード切り替え */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              ✏️ 編集モードに入る
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={saveChanges}
                disabled={loading || !hasChanges}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
              >
                💾 変更を保存
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  // 変更を破棄
                  setQuestion(quiz.question);
                  setOptions(quiz.options);
                  setCorrectAnswer(quiz.correctAnswer);
                  setExplanation(quiz.explanation || '');
                  setCategory(quiz.category);
                  setDifficulty(quiz.difficulty);
                }}
                disabled={loading}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-gray-700"
              >
                キャンセル
              </button>
            </div>
          )}

          {/* 承認ボタン */}
          {!isEditing && (
            <>
              <div className="border-t pt-4">
                <button
                  onClick={toggleApproval}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg transition font-medium ${
                    quiz.reviewStatus === 'approved'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                >
                  {quiz.reviewStatus === 'approved' 
                    ? '🔍 レビュー中に戻す（JSON出力から除外）' 
                    : '✅ 承認する（JSON出力に含める）'}
                </button>
              </div>

              {/* 削除ボタン */}
              <div className="border-t pt-4">
                <button
                  onClick={deleteQuiz}
                  disabled={loading}
                  className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                >
                  🗑️ 削除
                </button>
              </div>
            </>
          )}


          {/* ナビゲーションボタン */}
          {!isEditing && allQuizzes.length > 1 && (
            <>
              <div className="border-t pt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => previousQuiz && router.push(`/quiz/${previousQuiz.id}?filter=${currentFilter}`)}
                    disabled={!previousQuiz}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
                  >
                    ← Previous Quiz
                  </button>
                  <button
                    onClick={() => nextQuiz && router.push(`/quiz/${nextQuiz.id}?filter=${currentFilter}`)}
                    disabled={!nextQuiz}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
                  >
                    Next Quiz →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 戻るボタン */}
          <div className="border-t pt-4">
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