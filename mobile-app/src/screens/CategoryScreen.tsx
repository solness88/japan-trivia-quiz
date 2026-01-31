import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getAllCategories, getQuizzesByCategory } from '../data/quizData';
import { QuizCategory } from '../types/quiz';

type CategoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Category'>;
};

// カテゴリの表示情報
const categoryInfo: Record<QuizCategory, { emoji: string; label: string; description: string }> = {
  culture: {
    emoji: '🎎',
    label: 'Culture',
    description: 'Traditions, festivals, and customs'
  },
  food: {
    emoji: '🍣',
    label: 'Food',
    description: 'Cuisine, ingredients, and dining'
  },
  history: {
    emoji: '🏯',
    label: 'History',
    description: 'Historical events and periods'
  },
  geography: {
    emoji: '🗾',
    label: 'Geography',
    description: 'Places, landmarks, and regions'
  },
  language: {
    emoji: '🈴',
    label: 'Language',
    description: 'Japanese language and writing'
  },
  tradition: {
    emoji: '⛩️',
    label: 'Tradition',
    description: 'Traditional arts and practices'
  },
  'pop-culture': {
    emoji: '🎌',
    label: 'Pop Culture',
    description: 'Anime, manga, and modern culture'
  },
  etiquette: {
    emoji: '🙏',
    label: 'Etiquette',
    description: 'Manners and social customs'
  },
};

export default function CategoryScreen({ navigation }: CategoryScreenProps) {
  const categories = getAllCategories();

  const handleCategoryPress = (category: QuizCategory) => {
    const quizCount = getQuizzesByCategory(category).length;
    
    if (quizCount === 0) {
      alert('No quizzes available in this category yet!');
      return;
    }
    
    // クイズ画面へ遷移
    navigation.navigate('Quiz', { category });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Choose a category to start your quiz</Text>
        
        <View style={styles.categoryGrid}>
          {categories.map((category) => {
            const info = categoryInfo[category];
            const quizCount = getQuizzesByCategory(category).length;
            
            return (
              <TouchableOpacity
                key={category}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryEmoji}>{info.emoji}</Text>
                <Text style={styles.categoryLabel}>{info.label}</Text>
                <Text style={styles.categoryDescription}>{info.description}</Text>
                <View style={styles.quizCount}>
                  <Text style={styles.quizCountText}>{quizCount} questions</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {categories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No categories available</Text>
            <Text style={styles.emptySubtext}>
              Please add some quizzes from the CMS
            </Text>
          </View>
        )}
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
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryGrid: {
    gap: 16,
  },
  categoryCard: {
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
  categoryEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  quizCount: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  quizCountText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});