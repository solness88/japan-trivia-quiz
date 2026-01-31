import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { getQuizzesByCategory } from '../data/quizData';
import { Quiz } from '../types/quiz';

type QuizScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

export default function QuizScreen({ navigation, route }: QuizScreenProps) {
  const { category } = route.params;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const categoryQuizzes = getQuizzesByCategory(category);
    const shuffled = [...categoryQuizzes].sort(() => Math.random() - 0.5);
    setQuizzes(shuffled.slice(0, Math.min(10, shuffled.length)));
  }, [category]);

  if (quizzes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  const isLastQuestion = currentIndex === quizzes.length - 1;

  const handleAnswerPress = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === currentQuiz.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // 結果画面へ遷移
      const finalScore = score + (selectedAnswer === currentQuiz.correctAnswer ? 1 : 0);
      navigation.navigate('Result', { 
        score: score, 
        total: quizzes.length 
      });
    } else {
      // 次の問題へ
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const getAnswerStyle = (index: number) => {
    if (!isAnswered) {
      return styles.answerButton;
    }
  
    // 選択した選択肢のみスタイルを変更
    if (index === selectedAnswer) {
      // 正解の場合
      if (index === currentQuiz.correctAnswer) {
        return [styles.answerButton, styles.correctAnswer];
      }
      // 不正解の場合
      return [styles.answerButton, styles.wrongAnswer];
    }
  
    // その他の選択肢は通常スタイル（グレーアウトしない）
    return styles.answerButton;
  };

  const getAnswerIcon = (index: number) => {
    if (!isAnswered) return null;
  
    // 選択した選択肢にのみアイコンを表示
    if (index === selectedAnswer) {
      if (index === currentQuiz.correctAnswer) {
        return '✅'; // 正解
      } else {
        return '❌'; // 不正解
      }
    }
  
    return null;
  };

  return (
    <View style={styles.container}>
      {/* プログレスバー */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / quizzes.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentIndex + 1} of {quizzes.length}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* 質問 */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuiz.question}</Text>
        </View>

        {/* 選択肢 */}
        <View style={styles.answersContainer}>
          {currentQuiz.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getAnswerStyle(index)}
              onPress={() => handleAnswerPress(index)}
              disabled={isAnswered}
              activeOpacity={0.7}
            >
              {getAnswerIcon(index) && (
                <Text style={styles.answerIcon}>{getAnswerIcon(index)}</Text>
              )}
              <Text style={styles.answerLabel}>{String.fromCharCode(65 + index)}</Text>
              <Text style={styles.answerText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>


        {/* フィードバックメッセージ */}
        {isAnswered && (
          <View style={selectedAnswer === currentQuiz.correctAnswer ? styles.correctFeedback : styles.wrongFeedback}>
            <Text style={styles.feedbackText}>
              {selectedAnswer === currentQuiz.correctAnswer 
                ? '🎉 Correct! Well done!' 
                : `❌ Incorrect. The correct answer is ${String.fromCharCode(65 + currentQuiz.correctAnswer)}.`}
            </Text>
          </View>
        )}

        {/* 解説（回答後に表示） */}
        {isAnswered && currentQuiz.explanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>💡 Explanation</Text>
            <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
          </View>
        )}

        {/* Next Question ボタン（解説の下に配置） */}
        {isAnswered && (
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNextQuestion}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question →'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#6b7280',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // 下に余白を追加
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 28,
  },
correctFeedback: {
  backgroundColor: 'transparent', // 背景なし
  padding: 16,
  marginBottom: 16,
  alignItems: 'center',
},
wrongFeedback: {
  backgroundColor: 'transparent', // 背景なし
  padding: 16,
  marginBottom: 16,
  alignItems: 'center',
},
feedbackText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1f2937',
  textAlign: 'center',
},
  answersContainer: {
    gap: 12,
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctAnswer: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
    borderWidth: 3,
  },
  wrongAnswer: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderWidth: 3,
  },
  disabledAnswer: {
    opacity: 0.5,
  },
  answerIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  answerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginRight: 12,
    minWidth: 24,
  },
  answerText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  explanationContainer: {
    backgroundColor: '#dbeafe',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});