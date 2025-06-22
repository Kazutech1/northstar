import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions, FlatList } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 60) / 2; // 20px padding on sides + 20px gap between cards

interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

interface GoalSection {
  id: string;
  title: string;
  screenName: string;
  icon: string;
  description: string;
  emoji: string;
  gradient: string[];
}

export default function LongTerm() {
  const router = useRouter();

  const [goals, setGoals] = useState<{
    health: Goal[];
    mind: Goal[];
    career: Goal[];
    money: Goal[];
    relationships: Goal[];
    legacy: Goal[];
  }>({
    health: [],
    mind: [],
    career: [],
    money: [],
    relationships: [],
    legacy: [],
  });

  const [goalSections] = useState<GoalSection[]>([
    {
      id: 'health',
      title: 'Body & Health',
      screenName: 'health',
      icon: 'fitness-outline',
      description: 'Physical wellness',
      emoji: '💪',
      gradient: ['#ff6b6b', '#ff8e8e'],
    },
    {
      id: 'mind',
      title: 'Mind & Focus',
      screenName: 'mind',
      icon: 'bulb-outline',
      description: 'Mental clarity',
      emoji: '🧠',
      gradient: ['#4ecdc4', '#44b3aa'],
    },
    {
      id: 'career',
      title: 'Career',
      screenName: 'career',
      icon: 'briefcase-outline',
      description: 'Professional growth',
      emoji: '🚀',
      gradient: ['#45b7d1', '#3498db'],
    },
    {
      id: 'money',
      title: 'Financial',
      screenName: 'money',
      icon: 'card-outline',
      description: 'Wealth building',
      emoji: '💰',
      gradient: ['#f39c12', '#e67e22'],
    },
    {
      id: 'relationships',
      title: 'Relationships',
      screenName: 'relationships',
      icon: 'heart-outline',
      description: 'Connections',
      emoji: '❤️',
      gradient: ['#feca57', '#f39c12'],
    },
    {
      id: 'legacy',
      title: 'Legacy',
      screenName: 'legacy',
      icon: 'trophy-outline',
      description: 'Long-term impact',
      emoji: '🏆',
      gradient: ['#a55eea', '#8e44ad'],
    },
  ]);

  // Load goals from AsyncStorage
  const loadGoals = async () => {
    try {
      const categories = ['health', 'mind', 'career', 'money', 'relationships', 'legacy'];
      const updatedGoals = {
        health: [],
        mind: [],
        career: [],
        money: [],
        relationships: [],
        legacy: [],
      };

      // Load tasks for syncing completion
      const storedTasks = await AsyncStorage.getItem('@tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      console.log('LongTerm: Loaded tasks:', tasks);

      // Load goals for each category
      for (const category of categories) {
        const storageKey = `@${category}_goals`;
        const storedGoals = await AsyncStorage.getItem(storageKey);
        let categoryGoals = [];

        if (category === 'money') {
          // Handle money goals from @money_goals
          const moneyGoals = storedGoals
            ? JSON.parse(storedGoals).map((g: any) => ({
                id: g.id,
                text: g.name,
                completed: g.currentAmount >= g.targetAmount,
              }))
            : [];
          categoryGoals = moneyGoals;
        } else {
          // Handle other categories
          categoryGoals = storedGoals
            ? JSON.parse(storedGoals).map((g: any) => ({
                id: g.id,
                text: g.text || g.name,
                completed: g.completed || false,
              }))
            : [];
        }

        // Sync completion with tasks
        categoryGoals = categoryGoals.map((goal: Goal) => {
          const matchingTask = tasks.find(
            (task: any) => task.goal.toLowerCase() === goal.text.toLowerCase() && task.category === category
          );
          return {
            ...goal,
            completed: matchingTask ? matchingTask.completed : goal.completed,
          };
        });

        updatedGoals[category] = categoryGoals;
      }

      setGoals(updatedGoals);
      console.log('LongTerm: Loaded goals:', updatedGoals);
    } catch (error) {
      console.error('LongTerm: Error loading goals:', error);
      setGoals({
        health: [],
        mind: [],
        career: [],
        money: [],
        relationships: [],
        legacy: [],
      });
    }
  };

  // Reload goals when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const navigateToSection = (section: GoalSection) => {
    router.push(`/(long)/${section.screenName}`);
  };

  // Calculate overall progress
  const totalGoals = Object.values(goals).flat().length;
  const completedGoals = Object.values(goals).flat().filter(g => g.completed).length;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const renderGoalCard = ({ item }: { item: GoalSection }) => {
    const sectionGoals = goals[item.id] || [];
    const completedCount = sectionGoals.filter(g => g.completed).length;
    const progressPercentage = sectionGoals.length > 0 ? (completedCount / sectionGoals.length) * 100 : 0;

    return (
      <TouchableOpacity
        style={[styles.goalCard, { backgroundColor: item.gradient[0] }]}
        onPress={() => navigateToSection(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionEmoji}>{item.emoji}</Text>
            <View style={styles.goalCounter}>
              <Text style={styles.goalCountText}>{sectionGoals.length}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
          </View>

          <View style={styles.cardFooter}>
            {sectionGoals.length > 0 ? (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedCount}/{sectionGoals.length}
                </Text>
              </View>
            ) : (
              <Text style={styles.startText}>Tap to start</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProgressBar = ({ item }: { item: GoalSection }) => {
    const sectionGoals = goals[item.id] || [];
    const completedCount = sectionGoals.filter(g => g.completed).length;
    const progressPercentage = sectionGoals.length > 0 ? (completedCount / sectionGoals.length) * 100 : 0;

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarHeader}>
          <View style={styles.progressBarTitle}>
            <Text style={styles.progressBarEmoji}>{item.emoji}</Text>
            <Text style={styles.progressBarText}>{item.title}</Text>
          </View>
          <Text style={styles.progressBarPercentage}>{Math.round(progressPercentage)}%</Text>
        </View>
        <View style={styles.bigProgressBar}>
          <View
            style={[
              styles.bigProgressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: item.gradient[0],
              },
            ]}
          />
        </View>
        <Text style={styles.progressBarSubtext}>
          {completedCount} of {sectionGoals.length} goals completed
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Long Term Goals 🎯</Text>
        <Text style={styles.dateText}>Shape your future, one goal at a time</Text>
        <Text style={styles.counterText}>
          {totalGoals} total goals • {completedGoals} completed • {Math.round(overallProgress)}% done
        </Text>
      </View>

      <ScrollView
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsContainer}>
          <FlatList
            data={goalSections}
            renderItem={renderGoalCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
            columnWrapperStyle={styles.row}
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressSectionTitle}>📊 Goal Progress</Text>
          {goalSections.map((section) => (
            <View key={section.id}>{renderProgressBar({ item: section })}</View>
          ))}
        </View>

        <View style={styles.overallProgressSection}>
          <Text style={styles.overallProgressTitle}>🏆 Overall Progress</Text>
          <View style={styles.overallProgressContainer}>
            <View style={styles.overallProgressBar}>
              <View
                style={[styles.overallProgressFill, { width: `${overallProgress}%` }]}
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStatsText}>
                {completedGoals} of {totalGoals} goals completed
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(overallProgress)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#2c3e50',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 10,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bdc3c7',
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardSeparator: {
    height: 20,
  },
  goalCard: {
    width: cardWidth,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionEmoji: {
    fontSize: 24,
  },
  goalCounter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardBody: {
    flex: 1,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  cardFooter: {
    alignItems: 'flex-start',
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  startText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 15,
  },
  progressBarContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBarTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  progressBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBarPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  bigProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  bigProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressBarSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  overallProgressSection: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
  },
  overallProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 15,
  },
  overallProgressContainer: {
    width: '100%',
  },
  overallProgressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 5,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatsText: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 20,
  },
});