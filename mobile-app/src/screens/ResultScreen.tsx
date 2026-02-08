import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { saveQuizResult, calculateStatistics, getRecentGames, QuizStatistics, QuizHistory } from '../utils/statistics';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants/styles';

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
  const { score, total, skipped, category } = route.params;
  const incorrect = total - score - skipped;
  const percentage = Math.round((score / total) * 100);
  
  const [statistics, setStatistics] = useState<QuizStatistics | null>(null);
  const [recentGames, setRecentGames] = useState<QuizHistory[]>([]);
  const [hasStats, setHasStats] = useState(false);

  useEffect(() => {
    saveAndLoadStatistics();
  }, []);

  const saveAndLoadStatistics = async () => {
    // 現在の結果を保存
    await saveQuizResult(category, score, total, skipped);
    
    // 統計を読み込み
    const stats = await calculateStatistics();
    const recent = await getRecentGames(5);
    
    setStatistics(stats);
    setRecentGames(recent);
    setHasStats(stats.totalQuizzes > 0);
  };

  const getPerformanceMessage = () => {
    if (percentage === 100) return { emoji: '🏆', title: 'Perfect!', message: 'Amazing! You got all questions correct!' };
    if (percentage >= 80) return { emoji: '🌟', title: 'Excellent!', message: 'Great job! You really know Japan well!' };
    if (percentage >= 60) return { emoji: '👍', title: 'Good Job!', message: 'Nice work! Keep learning!' };
    if (percentage >= 40) return { emoji: '📚', title: 'Not Bad!', message: 'You\'re getting there. Keep practicing!' };
    return { emoji: '💪', title: 'Keep Trying!', message: 'Don\'t give up! Practice makes perfect!' };
  };

  const performance = getPerformanceMessage();

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      random: '🎲',
      culture: '🎎',
      food: '🍣',
      history: '🏯',
      geography: '🗾',
      language: '🈷️',
      tradition: '⛩️',
    };
    return emojiMap[category] || '📚';
  };

  const getCategoryName = (category: string) => {
    const nameMap: { [key: string]: string } = {
      random: 'Random',
      culture: 'Culture',
      food: 'Food',
      history: 'History',
      geography: 'Geography',
      language: 'Language',
      tradition: 'Tradition',
    };
    return nameMap[category] || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Current Score */}
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

        {/* Stats */}
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

        {/* Buttons */}
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

        {/* Statistics Section - Only show if there's data */}
        {hasStats && statistics && (
          <>
            <View style={styles.divider} />
            
            {/* Statistics Header */}
            <View style={styles.statisticsHeader}>
              <Text style={styles.statisticsTitle}>📊 Your Statistics</Text>
            </View>

            {/* Overall Performance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Performance</Text>
              <View style={styles.card}>
                <View style={styles.overallRow}>
                  <Text style={styles.overallLabel}>Total Quizzes</Text>
                  <Text style={styles.overallValue}>{statistics.totalQuizzes}</Text>
                </View>
                <View style={styles.overallRow}>
                  <Text style={styles.overallLabel}>Average Score</Text>
                  <Text style={styles.overallValue}>{statistics.averagePercentage}%</Text>
                </View>
                <View style={styles.overallRow}>
                  <Text style={styles.overallLabel}>Total Questions</Text>
                  <Text style={styles.overallValue}>{statistics.totalQuestions}</Text>
                </View>
              </View>
            </View>

            {/* Recent Games */}
            {recentGames.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Games</Text>
                <View style={styles.card}>
                  {recentGames.map((game, index) => (
                    <View key={game.id} style={styles.historyRow}>
                      <Text style={styles.historyEmoji}>{getCategoryEmoji(game.category)}</Text>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyCategory}>{getCategoryName(game.category)}</Text>
                        <Text style={styles.historyDate}>{formatDate(game.date)}</Text>
                      </View>
                      <Text style={styles.historyScore}>{game.score}/{game.total}</Text>
                      <Text style={[
                        styles.historyPercentage,
                        game.percentage >= 80 ? styles.historyPercentageGood : 
                        game.percentage >= 60 ? styles.historyPercentageMedium : 
                        styles.historyPercentageLow
                      ]}>
                        {game.percentage}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  content: {
    padding: Spacing.lg,
  },
  scoreContainer: {
    backgroundColor: Colors.background.card,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 4,
    borderColor: Colors.primary.main,
    paddingVertical: Spacing.lg,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
    color: Colors.primary.main,
  },
  scoreDivider: {
    width: 80,
    height: 4,
    backgroundColor: Colors.primary.main,
    marginVertical: Spacing.xs,
  },
  totalText: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
    color: Colors.primary.main,
  },
  percentage: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.primary.main,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.background.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.sm,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  buttonsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary.main,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.md,
  },
  primaryButtonText: {
    color: Colors.primary.contrast,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  secondaryButton: {
    backgroundColor: Colors.background.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  secondaryButtonText: {
    color: Colors.primary.main,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  statisticsHeader: {
    marginBottom: Spacing.lg,
  },
  statisticsTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  overallLabel: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
  },
  overallValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  historyInfo: {
    flex: 1,
  },
  historyCategory: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  historyDate: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  historyScore: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  historyPercentage: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    minWidth: 45,
    textAlign: 'right',
  },
  historyPercentageGood: {
    color: Colors.success,
  },
  historyPercentageMedium: {
    color: Colors.warning,
  },
  historyPercentageLow: {
    color: Colors.error,
  },
});