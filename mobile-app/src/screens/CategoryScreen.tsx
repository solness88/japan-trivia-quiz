import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants/styles';
import { getQuizzesByCategory, getRandomQuizzes } from '../data/quizData';
import { getDefaultQuestionCount, QuestionCountOption } from '../utils/settings';
import { QuizCategory } from '../types/quiz';
import { getUserProgress, getCategoryProgress } from '../utils/userProgress';
import { UserProgress } from '../types/quiz';

type Category = {
  id: QuizCategory;
  name: string;
  emoji: string;
  color: string;
  description: string;
};

const categories: Category[] = [
  { id: 'culture', name: 'Culture', emoji: '🏯', color: Colors.category.culture, description: 'Traditional and modern culture' },
  { id: 'food', name: 'Food', emoji: '🍣', color: Colors.category.food, description: 'Japanese cuisine' },
  { id: 'geography', name: 'Geography', emoji: '🗾', color: Colors.category.geography, description: 'Places and landmarks' },
  { id: 'language', name: 'Language', emoji: '🈷️', color: Colors.category.language, description: 'Japanese language basics' },
  { id: 'manner', name: 'Manner', emoji: '🙏', color: Colors.category.manner, description: 'Etiquette and manners' },
  { id: 'anime-manga', name: 'Anime / Manga', emoji: '🎌', color: Colors.category.animeManga, description: 'Japanese pop culture' },
];

export default function CategorySelectionScreen({ navigation }: any) {
  const [defaultCount, setDefaultCount] = useState<QuestionCountOption>(10);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null); // ← 追加

  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const count = await getDefaultQuestionCount();
    setDefaultCount(count);
    
    const progress = await getUserProgress();
    setUserProgress(progress);
  };

  const handleCategoryPress = async (categoryId: QuizCategory) => {
    const progress = await getUserProgress();
    const categoryProgress = progress.categoryProgress[categoryId];
    
    // すべての問題を取得
    const allQuizzes = getQuizzesByCategory(categoryId);
    
    // 未回答の問題のみフィルター
    const unansweredQuizzes = allQuizzes.filter(
      quiz => !categoryProgress.correctQuizIds.includes(quiz.id)
    );
    
    if (unansweredQuizzes.length === 0) {
      // 全問正解済み
      alert('🎉 Congratulations! You have completed all 50 questions in this category!');
      return;
    }
    
    navigation.navigate('Quiz', { 
      quizzes: unansweredQuizzes, 
      selectedCategory: categoryId 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Category</Text>
        <Text style={styles.subtitle}>
          {defaultCount === 'all' ? 'All questions' : `${defaultCount} questions per quiz`}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoriesContainer}>
        {categories.map((category) => {
  const progress = userProgress 
    ? getCategoryProgress(userProgress, category.id)
    : { correct: 0, total: 50, percentage: 0, isCompleted: false };
  
  return (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard, 
        { borderLeftColor: category.color, borderLeftWidth: 4 }
      ]}
      onPress={() => handleCategoryPress(category.id)}
    >
      <Text style={styles.emoji}>{category.emoji}</Text>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
        <Text style={styles.categoryProgress}>
          {progress.correct}/50 {progress.isCompleted ? '✅' : '⭐'}
        </Text>
      </View>
    </TouchableOpacity>
  );
})}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// styles は変更なし
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  categoriesContainer: {
    gap: Spacing.md,
  },
  categoryCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  emoji: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  categoryDescription: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  categoryProgress: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary.main,
    marginTop: Spacing.xs,
  },
});