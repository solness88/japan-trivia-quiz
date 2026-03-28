import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants';
import { QuizQuestion } from '../utils/quizReview';
import { recordQuizResult, getUserProgress } from '../utils/userProgress';
import { QuizCategory } from '../types/quiz';

export default function QuizScreen({ route, navigation }: any) {
  const { quizzes, selectedCategory } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [questionRecords, setQuestionRecords] = useState<QuizQuestion[]>([]);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [categoryCorrectCount, setCategoryCorrectCount] = useState(0);

  const category: QuizCategory = selectedCategory || 'culture';

  useEffect(() => {
    loadCategoryProgress();
  }, []);
  
  const loadCategoryProgress = async () => {
    const progress = await getUserProgress();
    const categoryProgress = progress.categoryProgress[category];
    setCategoryCorrectCount(categoryProgress.correctQuizIds.length);
  };

  if (!quizzes || quizzes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg }}>
          <Text style={{ fontSize: FontSize.xl, color: Colors.text.primary, marginBottom: Spacing.md }}>
            No quiz data found
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')}
            style={{ padding: Spacing.lg, backgroundColor: Colors.primary.main, borderRadius: BorderRadius.md }}
          >
            <Text style={{ color: Colors.primary.contrast, fontSize: FontSize.md }}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  const progress = ((currentIndex + 1) / quizzes.length) * 100;

  // const handleAnswer = async (index: number) => {
  //   if (isAnswered) return;
  
  //   setSelectedAnswer(index);
  //   setIsAnswered(true);
  
  //   const isCorrect = index === currentQuiz.correctAnswer;
    
  //   if (isCorrect) {
  //     setScore(score + 1);
  //   }

  // // UserProgress に記録
  // const updatedProgress = await recordQuizResult(
  //   currentQuiz.category,
  //   currentQuiz.id,
  //   isCorrect
  // );

  // // 進捗カウントを更新
  // if (isCorrect) {
  //   const newCount = updatedProgress.categoryProgress[category].correctQuizIds.length;
  //   setCategoryCorrectCount(newCount);
  // }

  //   // UserProgress に記録
  //   await recordQuizResult(
  //     currentQuiz.category,
  //     currentQuiz.id,
  //     isCorrect
  //   );
    
  //   // 回答を記録（既存のレビュー機能用）
  //   const questionRecord: QuizQuestion = {
  //     questionId: currentQuiz.id,
  //     question: currentQuiz.question,
  //     options: [...currentQuiz.options],
  //     userAnswer: index,
  //     correctAnswer: currentQuiz.correctAnswer,
  //     explanation: currentQuiz.explanation,
  //     isCorrect,
  //   };
    
  //   setQuestionRecords([...questionRecords, questionRecord]);
    
  //   // タイマーをキャンセル（前のタイマーがあれば）
  //   if (scrollTimerRef.current) {
  //     clearTimeout(scrollTimerRef.current);
  //   }
    
  //   // 解説まで自動スクロール（タイマーIDを保存）
  //   scrollTimerRef.current = setTimeout(() => {
  //     scrollViewRef.current?.scrollTo({ 
  //       y: 1000000,
  //       animated: true 
  //     });
  //     scrollTimerRef.current = null;  // 実行後にクリア
  //   }, 800);
  // };

  const handleAnswer = async (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuiz.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // UserProgress に記録
    const updatedProgress = await recordQuizResult(
      category,
      currentQuiz.id,
      isCorrect
    );
    
    // 進捗カウントを更新
    if (isCorrect) {
      const newCount = updatedProgress.categoryProgress[category].correctQuizIds.length;
      setCategoryCorrectCount(newCount);
    }
    
    // 回答を記録（既存のレビュー機能用）
    const questionRecord: QuizQuestion = {
      questionId: currentQuiz.id,
      question: currentQuiz.question,
      options: [...currentQuiz.options],
      userAnswer: index,
      correctAnswer: currentQuiz.correctAnswer,
      explanation: currentQuiz.explanation,
      isCorrect,
    };
    
    setQuestionRecords([...questionRecords, questionRecord]);
    
    // タイマーをキャンセル（前のタイマーがあれば）
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    // 解説まで自動スクロール（タイマーIDを保存）
    scrollTimerRef.current = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ 
        y: 1000000,
        animated: true 
      });
      scrollTimerRef.current = null;  // 実行後にクリア
    }, 800);
  };

  const handleNext = () => {
    // スクロールタイマーをキャンセル
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
    
    // スキップの場合も記録
    if (!isAnswered) {
      const questionRecord: QuizQuestion = {
        questionId: currentQuiz.id,
        question: currentQuiz.question,
        options: [...currentQuiz.options],
        userAnswer: null,
        correctAnswer: currentQuiz.correctAnswer,
        explanation: currentQuiz.explanation,
        isCorrect: false,
      };
      
      setQuestionRecords([...questionRecords, questionRecord]);
      setSkipped(skipped + 1);
    }
  
    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      
      scrollViewRef.current?.scrollTo({ 
        y: 0, 
        animated: false
      });
    } else {
      navigation.replace('Result', { 
        score, 
        total: quizzes.length, 
        skipped,
        category: selectedCategory,
        questionRecords
      });
    }
  };
  
  const isCorrectAnswer = selectedAnswer === currentQuiz.correctAnswer;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Progress: {categoryCorrectCount}/50
        </Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
      >
        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {currentIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuiz.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuiz.options.map((option: string, index: number) => {
            const isCorrect = index === currentQuiz.correctAnswer;
            const isSelected = index === selectedAnswer;

            let buttonStyle: ViewStyle = styles.optionButton;
            let textStyle: TextStyle = styles.optionText;

            if (isAnswered && isSelected && isCorrect) {
              buttonStyle = styles.optionButtonCorrect;
            }
            else if (isAnswered && isSelected && !isCorrect) {
              buttonStyle = styles.optionButtonWrong;
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handleAnswer(index)}
                disabled={isAnswered}
              >
                {isAnswered && isSelected && isCorrect && (
                  <Text style={styles.icon}>✓</Text>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <Text style={styles.iconWrong}>✕</Text>
                )}
                
                <Text style={textStyle}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback Message */}
        {isAnswered && (
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackText, isCorrectAnswer ? styles.feedbackCorrect : styles.feedbackWrong]}>
              {isCorrectAnswer 
                ? '✓ Correct!' 
                : '✕ Incorrect! Please try again later.'
              }
            </Text>
          </View>
        )}

        {/* Explanation */}
        {isAnswered && isCorrectAnswer && currentQuiz.explanation && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>💡 Explanation</Text>
            <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
          </View>
        )}

        {/* 下部ボタンのスペース確保 */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Fixed Next Button at Bottom */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex + 1 < quizzes.length ? 'Next Question →' : 'See Results 🎯'}
            </Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  progressContainer: {
    backgroundColor: Colors.background.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.background.dark,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.round,
  },
  progressText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  questionCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.main,
    ...Shadow.md,
    opacity: 1,
  },
  questionNumber: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary.main,
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    lineHeight: FontSize.lg * 1.5,
  },
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  optionButton: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadow.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButtonCorrect: {
    backgroundColor: Colors.background.card,
    borderColor: Colors.success,
    borderWidth: 3,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadow.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButtonWrong: {
    backgroundColor: Colors.background.card,
    borderColor: Colors.error,
    borderWidth: 3,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadow.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: Colors.success,
    fontWeight: FontWeight.bold,
    marginRight: Spacing.sm,
  },
  iconWrong: {
    fontSize: 24,
    color: Colors.error,
    fontWeight: FontWeight.bold,
    marginRight: Spacing.sm,
  },
  optionText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  feedbackContainer: {
    marginBottom: Spacing.lg,
  },
  feedbackText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  feedbackCorrect: {
    color: Colors.success,
  },
  feedbackWrong: {
    color: Colors.error,
  },
  explanationCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    ...Shadow.sm,
    marginBottom: Spacing.lg,
  },
  explanationTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.info,
    marginBottom: Spacing.sm,
  },
  explanationText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    lineHeight: FontSize.md * 1.6,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.main,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  nextButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.md,
  },
  nextButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary.contrast,
  },
});