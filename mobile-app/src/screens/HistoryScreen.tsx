import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getQuizReviews, QuizReview } from '../utils/quizReview';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants/styles';

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const [allReviews, setAllReviews] = useState<QuizReview[]>([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const reviews = await getQuizReviews();
    setAllReviews(reviews);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 10, allReviews.length));
  };

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

  const displayedReviews = allReviews.slice(0, displayCount);
  const hasMore = displayCount < allReviews.length;

  if (allReviews.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyTitle}>No Quiz History Yet</Text>
          <Text style={styles.emptyText}>
            Complete a quiz to see your history here
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.emptyButtonText}>Start a Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz History</Text>
        <Text style={styles.subtitle}>
          {allReviews.length} {allReviews.length === 1 ? 'quiz' : 'quizzes'} completed
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.listContainer}>
          {displayedReviews.map((review) => (
            <TouchableOpacity
              key={review.id}
              style={styles.historyCard}
              onPress={() => navigation.navigate('Review', { reviewId: review.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.categoryEmoji}>{getCategoryEmoji(review.category)}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.categoryName}>{getCategoryName(review.category)}</Text>
                  <Text style={styles.dateText}>{formatDate(review.date)}</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{review.score}/{review.total}</Text>
                  <Text style={[
                    styles.percentageText,
                    review.percentage >= 80 ? styles.percentageGood :
                    review.percentage >= 60 ? styles.percentageMedium :
                    styles.percentageLow
                  ]}>
                    {review.percentage}%
                  </Text>
                </View>
              </View>

              {review.skipped > 0 && (
                <Text style={styles.skippedText}>
                  {review.skipped} {review.skipped === 1 ? 'question' : 'questions'} skipped
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Load More Button */}
        {hasMore && (
          <View style={styles.loadMoreContainer}>
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadMore}
            >
              <Text style={styles.loadMoreText}>
                Load More ({allReviews.length - displayCount} remaining)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* End Message */}
        {!hasMore && allReviews.length > 10 && (
          <View style={styles.endContainer}>
            <Text style={styles.endText}>— End of history —</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  historyCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadow.sm,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  percentageText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
  percentageGood: {
    color: Colors.success,
  },
  percentageMedium: {
    color: Colors.warning,
  },
  percentageLow: {
    color: Colors.error,
  },
  skippedText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  loadMoreContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.md,
  },
  loadMoreText: {
    color: Colors.primary.contrast,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  endContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  endText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.md,
  },
  emptyButtonText: {
    color: Colors.primary.contrast,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});