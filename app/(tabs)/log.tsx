import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, Dimensions } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Task {
  id: number;
  mindDump: string;
  goal: string;
  completed: boolean;
  completedAt?: Date;
  category?: string;
  amount?: number;
  targetAmount?: number;
}

interface RecentActivity {
  id: number;
  action: string;
  time: string;
  category?: string;
}

const CATEGORIES = {
  'body&health': { 
    name: 'Body & Health', 
    color: '#e74c3c', 
    emoji: '💪',
    lightColor: 'rgba(231, 76, 60, 0.1)'
  },
  'mind&focus': { 
    name: 'Mind & Focus', 
    color: '#9b59b6', 
    emoji: '🧠',
    lightColor: 'rgba(155, 89, 182, 0.1)'
  },
  'career': { 
    name: 'Career', 
    color: '#3498db', 
    emoji: '💼',
    lightColor: 'rgba(52, 152, 219, 0.1)'
  },
  'financial': { 
    name: 'Financial', 
    color: '#f39c12', 
    emoji: '💰',
    lightColor: 'rgba(243, 156, 18, 0.1)'
  },
  'relationships': { 
    name: 'Relationships', 
    color: '#f39c12', 
    emoji: '❤️',
    lightColor: 'rgba(243, 156, 18, 0.1)'
  },
  'legacy': { 
    name: 'Legacy', 
    color: '#8e44ad', 
    emoji: '🌟',
    lightColor: 'rgba(142, 68, 173, 0.1)'
  },
};

type CategoryKey = keyof typeof CATEGORIES;

export default function LogDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'categories'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const normalizeCategory = (category: string | undefined): CategoryKey => {
    if (!category) return 'mind&focus';
    const lowerCategory = category.toLowerCase();
    if (['money', 'money_expense', 'money_earning'].includes(lowerCategory)) {
      return 'financial';
    }
    return (lowerCategory in CATEGORIES ? lowerCategory : 'mind&focus') as CategoryKey;
  };

  const getCategoryFromGoal = (text: string): CategoryKey => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('health') || lowerText.includes('fitness') || lowerText.includes('exercise') || lowerText.includes('diet')) {
      return 'body&health';
    }
    if (lowerText.includes('learn') || lowerText.includes('study') || lowerText.includes('read') || lowerText.includes('focus')) {
      return 'mind&focus';
    }
    if (lowerText.includes('work') || lowerText.includes('career') || lowerText.includes('job') || lowerText.includes('business')) {
      return 'career';
    }
    if (lowerText.includes('money') || lowerText.includes('budget') || lowerText.includes('save') || lowerText.includes('invest')) {
      return 'financial';
    }
    if (lowerText.includes('family') || lowerText.includes('friend') || lowerText.includes('relationship') || lowerText.includes('love')) {
      return 'relationships';
    }
    if (lowerText.includes('legacy') || lowerText.includes('impact') || lowerText.includes('contribute') || lowerText.includes('give back')) {
      return 'legacy';
    }
    return 'mind&focus';
  };

  const loadTasks = async () => {
    try {
      // Load tasks from @tasks and 'tasks' (merge both)
      const [storedTasks, oldTasks] = await AsyncStorage.multiGet(['@tasks', 'tasks']);
      let taskList: Task[] = [];
      
      // Merge tasks from both keys
      if (storedTasks[1]) {
        const parsedTasks = JSON.parse(storedTasks[1] || '[]');
        if (Array.isArray(parsedTasks)) {
          taskList = [...taskList, ...parsedTasks];
        }
      }
      if (oldTasks[1]) {
        const parsedOldTasks = JSON.parse(oldTasks[1] || '[]');
        if (Array.isArray(parsedOldTasks)) {
          taskList = [...taskList, ...parsedOldTasks];
        }
      }
      console.log('LogDashboard: Loaded tasks:', taskList);

      // Load savings goals from @money_goals
      const storedMoneyGoals = await AsyncStorage.getItem('@money_goals');
      const moneyGoals = storedMoneyGoals ? JSON.parse(storedMoneyGoals) : [];
      console.log('LogDashboard: Loaded money goals:', moneyGoals);

      // Map savings goals to tasks
      const savingsTasks: Task[] = moneyGoals.map((goal: any) => ({
        id: goal.id,
        mindDump: '',
        goal: `${goal.name}, ${formatCurrency(goal.currentAmount)}/${formatCurrency(goal.targetAmount)}`,
        completed: goal.currentAmount >= goal.targetAmount,
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        category: 'financial',
        amount: goal.currentAmount,
        targetAmount: goal.targetAmount,
      }));

      // Load other category goals
      const categories = ['health', 'mind', 'career', 'relationships', 'legacy'];
      const otherGoalsTasks: Task[] = [];
      for (const cat of categories) {
        const storageKey = `@${cat}_goals`;
        const storedGoals = await AsyncStorage.getItem(storageKey);
        const goals = storedGoals ? JSON.parse(storedGoals) : [];
        console.log(`LogDashboard: Loaded ${cat} goals:`, goals);
        otherGoalsTasks.push(
          ...goals.map((goal: any) => ({
            id: goal.id,
            mindDump: '',
            goal: goal.text || goal.name,
            completed: goal.completed || false,
            completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
            category: cat === 'relationships' ? 'relationships' : `${cat}&${cat === 'health' ? 'health' : 'focus'}`,
          }))
        );
      }

      // Merge and normalize tasks
      taskList = [
        ...savingsTasks,
        ...otherGoalsTasks,
        ...taskList.map((task: any) => ({
          ...task,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          category: normalizeCategory(task.category || getCategoryFromGoal(task.goal || task.mindDump || '')),
          amount: task.amount,
        })),
      ];

      // Remove duplicates by id
      const uniqueTasks = Array.from(new Map(taskList.map(t => [t.id, t])).values());
      setTasks(uniqueTasks);
      console.log('LogDashboard: Final tasks:', uniqueTasks);

      // Migrate old 'tasks' to '@tasks' and clear 'tasks'
      await AsyncStorage.setItem('@tasks', JSON.stringify(uniqueTasks));
      await AsyncStorage.removeItem('tasks');
    } catch (error) {
      console.error('LogDashboard: Error loading tasks:', error);
      setTasks([]);
    }
  };

  const loadStreak = async () => {
    try {
      const lastVisit = await AsyncStorage.getItem('lastVisit');
      const currentStreak = await AsyncStorage.getItem('streak');
      const visitHistory = await AsyncStorage.getItem('visitHistory');
      const today = new Date().toDateString();
      let newStreak = parseInt(currentStreak || '0');
      let visitDates = visitHistory ? JSON.parse(visitHistory) : [];
      let longest = newStreak || 1;

      if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastVisitDate = lastVisit ? new Date(lastVisit) : null;

        if (!lastVisitDate) {
          newStreak = 1;
          visitDates = [today];
        } else if (lastVisitDate.toDateString() === yesterday.toDateString()) {
          newStreak += 1;
          visitDates.push(today);
        } else {
          newStreak = 1;
          visitDates = [today];
        }

        visitDates = [...new Set(visitDates)].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        let current = 1;
        for (let i = 1; i < visitDates.length; i++) {
          const prevDate = new Date(visitDates[i - 1]);
          const currDate = new Date(visitDates[i]);
          const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) {
            current += 1;
            longest = Math.max(longest, current);
          } else {
            current = 1;
          }
        }

        await AsyncStorage.setItem('lastVisit', today);
        await AsyncStorage.setItem('streak', newStreak.toString());
        await AsyncStorage.setItem('visitHistory', JSON.stringify(visitDates));
      }

      setStreak(newStreak);
      setLongestStreak(longest);
    } catch (error) {
      console.error('LogDashboard: Error loading streak:', error);
      setStreak(0);
      setLongestStreak(0);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
      loadStreak();
    }, [])
  );

  const getTimeAgo = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Unknown time';
    }
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const todayStats = {
    completed: tasks.filter(task => {
      const taskDate = task.completedAt ? new Date(task.completedAt) : null;
      return task.completed && taskDate && taskDate.toDateString() === new Date().toDateString();
    }).length,
    total: tasks.filter(task => {
      const taskDate = task.completedAt ? new Date(task.completedAt) : new Date();
      return taskDate.toDateString() === new Date().toDateString() || !task.completed;
    }).length,
  };

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyStats = {
    totalGoalsCompleted: tasks.filter(task => task.completed && task.completedAt && new Date(task.completedAt) >= weekAgo).length,
    totalGoals: tasks.filter(task => {
      const taskDate = task.completedAt ? new Date(task.completedAt) : new Date();
      return taskDate >= weekAgo;
    }).length,
  };
  const completionRate = weeklyStats.totalGoals > 0 ? Math.round((weeklyStats.totalGoalsCompleted / weeklyStats.totalGoals) * 100) : 0;

  const recentActivities: RecentActivity[] = tasks
    .filter(task => task.completed && task.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 6)
    .map(task => ({
      id: task.id,
      action: task.goal || task.mindDump,
      time: getTimeAgo(task.completedAt!),
      category: task.category,
    }));

  const getCategoryStats = (categoryKey: CategoryKey) => {
    const categoryTasks = tasks.filter(task => task.category === categoryKey);
    const completedTasks = categoryTasks.filter(task => task.completed);
    const weeklyCompleted = completedTasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= weekAgo
    );
    
    return {
      total: categoryTasks.length,
      completed: completedTasks.length,
      weeklyCompleted: weeklyCompleted.length,
      completionRate: categoryTasks.length > 0 ? Math.round((completedTasks.length / categoryTasks.length) * 100) : 0,
      recentTasks: categoryTasks
        .filter(task => task.completed || task.completedAt)
        .sort((a, b) => {
          const aDate = a.completedAt || new Date();
          const bDate = b.completedAt || new Date();
          return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 10)
    };
  };

  const generateWeeklyReport = (): string => {
    return `🎯 WEEKLY GOAL REPORT
${new Date().toLocaleDateString()} - ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

📊 OVERVIEW
• Goals Completed: ${weeklyStats.totalGoalsCompleted}
• Completion Rate: ${completionRate}%
• Current Streak: ${streak} days
• Longest Streak: ${longestStreak} days

💪 ACHIEVEMENTS
• Completed ${todayStats.completed} of ${todayStats.total} tasks today
• Total active streaks: ${streak} days
• Consistency score: ${longestStreak > 0 ? Math.round((completionRate + (streak / longestStreak * 100)) / 2) : completionRate}%

🎉 HIGHLIGHTS
• Longest streak: ${longestStreak} days
• Most productive day: Today (${todayStats.completed} goals completed)
• Recent activities: 
${recentActivities.map(activity => `  • ${activity.action} (${activity.time})`).join('\n')}

Keep up the amazing work! 🌟`;
  };

  const renderOverviewTab = () => (
    <>
      <View style={styles.quickStatsSection}>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatEmoji}>🏆</Text>
              <Text style={styles.quickStatValue}>{longestStreak}</Text>
            </View>
            <Text style={styles.quickStatLabel}>Longest Streak</Text>
            <Text style={styles.quickStatCategory}>App Usage</Text>
          </View>
          <View style={styles.quickStatCard}>
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatEmoji}>⚡</Text>
              <Text style={styles.quickStatValue}>{todayStats.completed}/{todayStats.total}</Text>
            </View>
            <Text style={styles.quickStatLabel}>Today's Progress</Text>
            <Text style={styles.quickStatCategory}>{todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}% Complete</Text>
          </View>
        </View>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatEmoji}>🔥</Text>
              <Text style={styles.quickStatValue}>{streak}</Text>
            </View>
            <Text style={styles.quickStatLabel}>Current Streak</Text>
            <Text style={styles.quickStatCategory}>Days Visited</Text>
          </View>
          <View style={styles.quickStatCard}>
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatEmoji}>📈</Text>
              <Text style={styles.quickStatValue}>{completionRate}%</Text>
            </View>
            <Text style={styles.quickStatLabel}>Weekly Rate</Text>
            <Text style={styles.quickStatCategory}>{weeklyStats.totalGoalsCompleted} goals done</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Recent Activities</Text>
        <View style={styles.activitiesList}>
          {recentActivities.length === 0 ? (
            <Text style={styles.noActivitiesText}>No recent activities</Text>
          ) : (
            recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={[styles.activityIcon, { 
                  backgroundColor: activity.category && CATEGORIES[activity.category as CategoryKey] 
                    ? CATEGORIES[activity.category as CategoryKey].color 
                    : '#3498db' 
                }]}>
                  <Text style={styles.activityEmoji}>✅</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <View style={styles.activityMeta}>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                    {activity.category && CATEGORIES[activity.category as CategoryKey] && (
                      <Text style={[styles.activityCategory, { 
                        color: CATEGORIES[activity.category as CategoryKey].color 
                      }]}>
                        {CATEGORIES[activity.category as CategoryKey].emoji} {CATEGORIES[activity.category as CategoryKey].name}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Weekly Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>🎯</Text>
            <Text style={styles.insightNumber}>{weeklyStats.totalGoalsCompleted}</Text>
            <Text style={styles.insightLabel}>Goals This Week</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>📊</Text>
            <Text style={styles.insightNumber}>{completionRate}%</Text>
            <Text style={styles.insightLabel}>Completion Rate</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>🔥</Text>
            <Text style={styles.insightNumber}>{streak}</Text>
            <Text style={styles.insightLabel}>Current Streak</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.generateReportButton}
          onPress={() => setShowWeeklyReport(true)}
        >
          <Ionicons name="document-text" size={20} color="#ffffff" />
          <Text style={styles.generateReportText}>Generate Weekly Report</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderCategoriesTab = () => {
    if (selectedCategory) {
      const categoryData = CATEGORIES[selectedCategory];
      const stats = getCategoryStats(selectedCategory);
      
      return (
        <View style={styles.categoryDetailContainer}>
          <TouchableOpacity 
            style={styles.backToCategoriesButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.backToCategoriesText}>Back to Categories</Text>
          </TouchableOpacity>
          
          <View style={[styles.categoryDetailHeader, { backgroundColor: categoryData.lightColor }]}>
            <Text style={styles.categoryDetailEmoji}>{categoryData.emoji}</Text>
            <Text style={styles.categoryDetailTitle}>{categoryData.name}</Text>
            <Text style={styles.categoryDetailSubtitle}>{stats.completed} of {stats.total} goals completed</Text>
          </View>

          <View style={styles.categoryStatsGrid}>
            <View style={styles.categoryStatCard}>
              <Text style={styles.categoryStatNumber}>{stats.completed}</Text>
              <Text style={styles.categoryStatLabel}>Completed</Text>
            </View>
            <View style={styles.categoryStatCard}>
              <Text style={styles.categoryStatNumber}>{stats.completionRate}%</Text>
              <Text style={styles.categoryStatLabel}>Success Rate</Text>
            </View>
            <View style={styles.categoryStatCard}>
              <Text style={styles.categoryStatNumber}>{stats.weeklyCompleted}</Text>
              <Text style={styles.categoryStatLabel}>This Week</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Goal History</Text>
            <View style={styles.goalHistoryList}>
              {stats.recentTasks.length === 0 ? (
                <Text style={styles.noActivitiesText}>No goals in this category yet</Text>
              ) : (
                stats.recentTasks.map((task) => (
                  <View key={task.id} style={styles.goalHistoryCard}>
                    <View style={[styles.goalStatusIcon, { 
                      backgroundColor: task.completed ? categoryData.color : '#95a5a6' 
                    }]}>
                      <Ionicons 
                        name={task.completed ? "checkmark" : "time"} 
                        size={16} 
                        color="#ffffff" 
                      />
                    </View>
                    <View style={styles.goalHistoryContent}>
                      <Text style={styles.goalHistoryText}>
                        {task.goal || task.mindDump}
                        {task.amount && task.targetAmount ? `, ${formatCurrency(task.amount)}/${formatCurrency(task.targetAmount)}` : ''}
                      </Text>
                      <Text style={styles.goalHistoryMeta}>
                        {task.completed && task.completedAt
                          ? `Completed ${getTimeAgo(task.completedAt)}`
                          : 'In progress'
                        }
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.categoriesGrid}>
        {Object.entries(CATEGORIES).map(([key, category]) => {
          const stats = getCategoryStats(key as CategoryKey);
          return (
            <TouchableOpacity 
              key={key}
              style={[styles.categoryCard, { backgroundColor: category.lightColor }]}
              onPress={() => setSelectedCategory(key as CategoryKey)}
            >
              <View style={styles.categoryCardHeader}>
                <Text style={styles.categoryCardEmoji}>{category.emoji}</Text>
                <View style={[styles.categoryProgressRing, { borderColor: category.color }]}>
                  <Text style={[styles.categoryProgressText, { color: category.color }]}>
                    {stats.completionRate}%
                  </Text>
                </View>
              </View>
              <Text style={styles.categoryCardTitle}>{category.name}</Text>
              <Text style={styles.categoryCardStats}>
                {stats.completed} of {stats.total} completed
              </Text>
              <Text style={styles.categoryCardWeekly}>
                {stats.weeklyCompleted} this week
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <View style={styles.topNav}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => setShowWeeklyReport(true)}
        >
          <Ionicons name="document-text-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabNav}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={activeTab === 'overview' ? '#3498db' : '#95a5a6'} 
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
          onPress={() => setActiveTab('categories')}
        >
          <Ionicons 
            name="grid-outline" 
            size={20} 
            color={activeTab === 'categories' ? '#3498db' : '#95a5a6'} 
          />
          <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>
            Categories
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'overview' ? renderOverviewTab() : renderCategoriesTab()}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showWeeklyReport}
        onRequestClose={() => setShowWeeklyReport(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportModal}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>📊 Weekly Report</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowWeeklyReport(false)}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.reportContent}>
              <Text style={styles.reportText}>{generateWeeklyReport()}</Text>
            </ScrollView>
            <View style={styles.reportActions}>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={20} color="#ffffff" />
                <Text style={styles.shareButtonText}>Share Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  Delia: {
    padding: 8,
  },
  reportButton: {
    padding: 8,
  },
  tabNav: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#3a3a3a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#3498db',
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickStatsSection: {
    marginBottom: 20,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quickStatCard: {
    width: (width - 60) / 2,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
  },
  quickStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  quickStatEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  quickStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bdc3c7',
  },
  quickStatCategory: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 15,
  },
  activitiesList: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    color: '#95a5a6',
    marginRight: 10,
  },
  activityCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  noActivitiesText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  insightEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  insightNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
  },
  insightLabel: {
    fontSize: 12,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  generateReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 12,
  },
  generateReportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryCardEmoji: {
    fontSize: 24,
  },
  categoryProgressRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
  },
  categoryProgressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  categoryCardStats: {
    fontSize: 12,
    color: '#bdc3c7',
    marginBottom: 5,
  },
  categoryCardWeekly: {
    fontSize: 12,
    color: '#95a5a6',
  },
  categoryDetailContainer: {
    flex: 1,
  },
  backToCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backToCategoriesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  categoryDetailHeader: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryDetailEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  categoryDetailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
  },
  categoryDetailSubtitle: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  categoryStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryStatCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  categoryStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
  },
  categoryStatLabel: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  goalHistoryList: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
  },
  goalHistoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalStatusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalHistoryContent: {
    flex: 1,
  },
  goalHistoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalHistoryMeta: {
    fontSize: 12,
    color: '#95a5a6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  reportModal: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  reportContent: {
    flex: 1,
  },
  reportText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  reportActions: {
    marginTop: 15,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 12,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});