import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants/styles';

const categories = [
  { id: 'culture', name: '文化', emoji: '🎎', color: Colors.category.culture },
  { id: 'food', name: '食べ物', emoji: '🍣', color: Colors.category.food },
  { id: 'history', name: '歴史', emoji: '🏯', color: Colors.category.history },
  { id: 'geography', name: '地理', emoji: '🗾', color: Colors.category.geography },
  { id: 'language', name: '言語', emoji: '🈷️', color: Colors.category.language },
  { id: 'tradition', name: '伝統', emoji: '⛩️', color: Colors.category.tradition },
];

export default function CategorySelectionScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>カテゴリを選択</Text>
        <Text style={styles.subtitle}>興味のある分野を選んでください</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { borderLeftColor: category.color, borderLeftWidth: 4 }]}
              onPress={() => navigation.navigate('QuizCount', { category: category.id })}
            >
              <Text style={styles.emoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ランダムオプション */}
        <TouchableOpacity
          style={styles.randomButton}
          onPress={() => navigation.navigate('QuizCount', { category: 'random' })}
        >
          <Text style={styles.randomEmoji}>🎲</Text>
          <Text style={styles.randomButtonText}>ランダム</Text>
          <Text style={styles.randomButtonSubtext}>すべてのカテゴリから出題</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    backgroundColor: Colors.background.card,
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  randomButton: {
    backgroundColor: Colors.accent.main,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.md,
  },
  randomEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  randomButtonText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.accent.contrast,
    marginBottom: Spacing.xs,
  },
  randomButtonSubtext: {
    fontSize: FontSize.sm,
    color: Colors.accent.contrast,
    opacity: 0.9,
  },
});