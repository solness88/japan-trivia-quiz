import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { getQuizzesByCategory, getRandomQuizzes } from '../data/quizData';  // getRandomQuizzes を追加

type QuizCountScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QuizCount'>;
  route: RouteProp<RootStackParamList, 'QuizCount'>;
};

const quizOptions = [
  {
    count: 5,
    title: 'Quick',
    emoji: '⚡',
    description: 'Perfect for a short break',
    duration: '~3 min',
  },
  {
    count: 10,
    title: 'Standard',
    emoji: '📚',
    description: 'Balanced learning session',
    duration: '~5 min',
  },
  {
    count: 20,
    title: 'Challenge',
    emoji: '🏆',
    description: 'Test your knowledge deeply',
    duration: '~10 min',
  },
];

export default function QuizCountScreen({ navigation, route }: QuizCountScreenProps) {
  const { category } = route.params;
  
  // ランダムの場合とカテゴリの場合で処理を分ける
  const availableQuizzes = category === 'random' 
    ? getRandomQuizzes(100)  // ランダムは全問題から取得（数は調整可能）
    : getQuizzesByCategory(category);

  const handleSelectCount = (count: number) => {
    if (count > availableQuizzes.length) {
      alert(`Only ${availableQuizzes.length} questions available in this category.`);
      return;
    }
  
    // ランダムの場合は毎回シャッフル、カテゴリの場合は順番通り
    const selectedQuizzes = category === 'random'
      ? getRandomQuizzes(count)
      : availableQuizzes.slice(0, count);
    
    navigation.navigate('Quiz', { quizzes: selectedQuizzes });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>
          How many questions would you like to answer?
        </Text>
        <Text style={styles.subHeaderText}>
          {category === 'random' 
            ? 'Random questions from all categories'
            : `${availableQuizzes.length} questions available in this category`
          }
        </Text>

        <View style={styles.optionsContainer}>
          {quizOptions.map((option) => {
            const isAvailable = option.count <= availableQuizzes.length;

            return (
              <TouchableOpacity
                key={option.count}
                style={[
                  styles.optionCard,
                  !isAvailable && styles.optionCardDisabled,
                ]}
                onPress={() => handleSelectCount(option.count)}
                disabled={!isAvailable}
                activeOpacity={0.7}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <View style={styles.optionTitleContainer}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionCount}>{option.count} Questions</Text>
                  </View>
                  <Text style={styles.optionDuration}>{option.duration}</Text>
                </View>
                <Text style={styles.optionDescription}>{option.description}</Text>
                {!isAvailable && (
                  <View style={styles.unavailableBadge}>
                    <Text style={styles.unavailableText}>Not enough questions</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Option */}
        <View style={styles.customSection}>
          <Text style={styles.customTitle}>Want a different number?</Text>

          <TouchableOpacity
            style={styles.customButton}
            onPress={() => {
              const selectedQuizzes = category === 'random'
                ? getRandomQuizzes(availableQuizzes.length)
                : availableQuizzes;
              
              navigation.navigate('Quiz', { 
                quizzes: selectedQuizzes
              });
            }}
          >
            <Text style={styles.customButtonText}>
              All {availableQuizzes.length} Questions
            </Text>
          </TouchableOpacity>
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
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  optionCardDisabled: {
    opacity: 0.5,
    borderLeftColor: '#9ca3af',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  optionTitleContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  optionCount: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  optionDuration: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  unavailableBadge: {
    marginTop: 8,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  unavailableText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  customSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  customButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});