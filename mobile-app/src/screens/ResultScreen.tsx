import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
  const { score, total, skipped } = route.params;  // add skipped
  const incorrect = total - score - skipped;  // count incorrect
  const percentage = Math.round((score / total) * 100);

  // パフォーマンスメッセージ
  const getPerformanceMessage = () => {
    if (percentage === 100) return { emoji: '🏆', title: 'Perfect!', message: 'Amazing! You got all questions correct!' };
    if (percentage >= 80) return { emoji: '🌟', title: 'Excellent!', message: 'Great job! You really know Japan well!' };
    if (percentage >= 60) return { emoji: '👍', title: 'Good Job!', message: 'Nice work! Keep learning!' };
    if (percentage >= 40) return { emoji: '📚', title: 'Not Bad!', message: 'You\'re getting there. Keep practicing!' };
    return { emoji: '💪', title: 'Keep Trying!', message: 'Don\'t give up! Practice makes perfect!' };
  };

  const performance = getPerformanceMessage();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* スコア表示 */}
        <View style={styles.scoreContainer}>
          <Text style={styles.emoji}>{performance.emoji}</Text>
          <Text style={styles.title}>{performance.title}</Text>
          <Text style={styles.message}>{performance.message}</Text>

          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{score}</Text>
            <View style={styles.scoreDivider} />
            <Text style={styles.totalText}>{total}</Text>
          </View>

          <Text style={styles.percentage}>{percentage}% Correct</Text>
        </View>

        {/* 統計情報 */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{incorrect}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{skipped}</Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
        </View>

        {/* アクションボタン */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Category')}
          >
            <Text style={styles.primaryButtonText}>Try Another Category</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* 励ましのメッセージ */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            {percentage >= 80
              ? 'You\'re ready for your Japan trip! Keep exploring more categories.'
              : 'Try reviewing the explanations and take the quiz again to improve your score!'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
  },
  scoreContainer: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#2563eb',
    paddingVertical: 20,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  scoreDivider: {
    width: 80,
    height: 4,
    backgroundColor: '#2563eb',
    marginVertical: 4,
  },
  totalText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  percentage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2563eb',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipContainer: {
    backgroundColor: '#fef3c7',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
});