import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { getQuizReviewById, QuizReview } from '../utils/quizReview';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants/styles';

type ReviewScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Review'>;
  route: RouteProp<RootStackParamList, 'Review'>;
};

export default function ReviewScreen({ navigation, route }: ReviewScreenProps) {
  const { reviewId } = route.params;
  const [review, setReview] = useState<QuizReview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    const data = await getQuizReviewById(reviewId);
    setReview(data);
  };

  if (!review) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = review.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / review.questions.length) * 100;

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < review.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {review.questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option: string, index: number) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isUserAnswer = index === currentQuestion.userAnswer;
            const wasSkipped = currentQuestion.userAnswer === null;

            let optionStyle: ViewStyle = styles.optionButton;
            
            if (isUserAnswer && isCorrect) {
              // 正解を選んだ
              optionStyle = styles.optionButtonCorrect;
            } else if (isUserAnswer && !isCorrect) {
              // 不正解を選んだ
              optionStyle = styles.optionButtonWrong;
            } else if (isCorrect && wasSkipped) {
              // スキップした問題の正解
              optionStyle = styles.optionButtonCorrectAnswer;
            }

            return (
              <View key={index} style={optionStyle}>
                {/* Icon */}
                {isUserAnswer && isCorrect && (
                  <Text style={styles.iconCorrect}>✓</Text>
                )}
                {isUserAnswer && !isCorrect && (
                  <Text style={styles.iconWrong}>✕</Text>
                )}
                {isCorrect && wasSkipped && (
                  <Text style={styles.iconCorrectAnswer}>✓</Text>
                )}
                
                {/* Option Text */}
                <Text style={styles.optionText}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Result Message */}
        <View style={styles.resultContainer}>
          {currentQuestion.userAnswer === null ? (
            <Text style={styles.resultSkipped}>— Skipped</Text>
          ) : currentQuestion.isCorrect ? (
            <Text style={styles.resultCorrect}>✓ Correct!</Text>
          ) : (
            <Text style={styles.resultWrong}>
              ✕ Incorrect. The correct answer is {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
            </Text>
          )}
        </View>

        {/* Explanation */}
        {currentQuestion.explanation && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>💡 Explanation</Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        {currentQuestionIndex < review.questions.length - 1 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
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
  optionButtonCorrectAnswer: {
    backgroundColor: Colors.background.card,
    borderColor: Colors.success,
    borderWidth: 3,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadow.sm,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
  },
  iconCorrect: {
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
  iconCorrectAnswer: {
    fontSize: 24,
    color: Colors.success,
    fontWeight: FontWeight.bold,
    marginRight: Spacing.sm,
  },
  optionText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  resultContainer: {
    marginBottom: Spacing.lg,
  },
  resultCorrect: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.success,
    textAlign: 'center',
  },
  resultWrong: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.error,
    textAlign: 'center',
  },
  resultSkipped: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.secondary,
    textAlign: 'center',
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
  navigationButtons: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background.card,
  },
  navButton: {
    flex: 1,
    backgroundColor: Colors.primary.main,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.md,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: Colors.primary.contrast,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  closeButton: {
    flex: 1,
    backgroundColor: Colors.accent.main,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.md,
  },
  closeButtonText: {
    color: Colors.accent.contrast,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});