import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function LogDashboard() {
  const router = useRouter();
  const [showWeeklyReport, setShowWeeklyReport] = useState(false)

  // Sample data - replace with real data from your state management
  const categories = [
    { id: 1, name: 'Body & Health', emoji: '💪', color: '#e74c3c', streak: 7, completedToday: 2, totalGoals: 5 },
    { id: 2, name: 'Mind & Focus', emoji: '🧠', color: '#4ecdc4', streak: 12, completedToday: 1, totalGoals: 3 },
    { id: 3, name: 'Career', emoji: '💼', color: '#3498db', streak: 5, completedToday: 3, totalGoals: 4 },
    { id: 4, name: 'Financial', emoji: '💰', color: '#f39c12', streak: 15, completedToday: 1, totalGoals: 2 },
    { id: 5, name: 'Relationship', emoji: '❤️', color: '#e91e63', streak: 3, completedToday: 0, totalGoals: 3 },
    { id: 6, name: 'Legacy', emoji: '🌟', color: '#9b59b6', streak: 8, completedToday: 1, totalGoals: 2 },
  ]

  const recentActivities = [
    { id: 1, category: 'Body & Health', emoji: '💪', action: 'Completed morning workout', time: '2 hours ago', color: '#e74c3c' },
    { id: 2, category: 'Mind & Focus', emoji: '🧠', action: 'Finished reading chapter 5', time: '4 hours ago', color: '#4ecdc4' },
    { id: 3, category: 'Career', emoji: '💼', action: 'Completed project milestone', time: '6 hours ago', color: '#3498db' },
    { id: 4, category: 'Financial', emoji: '💰', action: 'Updated budget spreadsheet', time: '1 day ago', color: '#f39c12' },
    { id: 5, category: 'Relationship', emoji: '❤️', action: 'Called family member', time: '1 day ago', color: '#e91e63' },
    { id: 6, category: 'Legacy', emoji: '🌟', action: 'Volunteered at local charity', time: '2 days ago', color: '#9b59b6' },
  ]

  const weeklyStats = {
    totalGoalsCompleted: 24,
    bestStreak: 15,
    mostActiveCategory: 'Mind & Focus',
    completionRate: 78
  }

  const todayStats = {
    completed: categories.reduce((sum, cat) => sum + cat.completedToday, 0),
    total: categories.reduce((sum, cat) => sum + cat.totalGoals, 0),
    activeStreaks: categories.filter(cat => cat.streak > 0).length
  }

  const generateWeeklyReport = () => {
    return `🎯 WEEKLY GOAL REPORT
${new Date().toLocaleDateString()} - ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

📊 OVERVIEW
• Goals Completed: ${weeklyStats.totalGoalsCompleted}
• Completion Rate: ${weeklyStats.completionRate}%
• Best Streak: ${weeklyStats.bestStreak} days
• Most Active: ${weeklyStats.mostActiveCategory}

🏆 CATEGORY BREAKDOWN
${categories.map(cat => `${cat.emoji} ${cat.name}: ${cat.streak} day streak`).join('\n')}

💪 ACHIEVEMENTS
• Maintained ${categories.filter(cat => cat.streak >= 7).length} weekly streaks
• Completed goals in ${categories.filter(cat => cat.completedToday > 0).length}/6 categories today
• Total active streaks: ${todayStats.activeStreaks}

🎉 HIGHLIGHTS
• Longest streak: ${Math.max(...categories.map(cat => cat.streak))} days
• Most productive day: Today (${todayStats.completed} goals completed)
• Consistency score: ${Math.round((weeklyStats.completionRate + (todayStats.activeStreaks / categories.length * 100)) / 2)}%

Keep up the amazing work! 🌟`
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Top Navigation */}
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

      <ScrollView 
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats Cards */}
        <View style={styles.quickStatsSection}>
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatCard}>
              <View style={styles.quickStatHeader}>
                <Text style={styles.quickStatEmoji}>🏆</Text>
                <Text style={styles.quickStatValue}>{Math.max(...categories.map(cat => cat.streak))}</Text>
              </View>
              <Text style={styles.quickStatLabel}>Longest Streak</Text>
              <Text style={styles.quickStatCategory}>{categories.find(cat => cat.streak === Math.max(...categories.map(c => c.streak)))?.name}</Text>
            </View>
            
            <View style={styles.quickStatCard}>
              <View style={styles.quickStatHeader}>
                <Text style={styles.quickStatEmoji}>⚡</Text>
                <Text style={styles.quickStatValue}>{todayStats.completed}/{todayStats.total}</Text>
              </View>
              <Text style={styles.quickStatLabel}>Today's Progress</Text>
              <Text style={styles.quickStatCategory}>{Math.round((todayStats.completed / todayStats.total) * 100)}% Complete</Text>
            </View>
          </View>
          
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatCard}>
              <View style={styles.quickStatHeader}>
                <Text style={styles.quickStatEmoji}>🔥</Text>
                <Text style={styles.quickStatValue}>{todayStats.activeStreaks}</Text>
              </View>
              <Text style={styles.quickStatLabel}>Active Streaks</Text>
              <Text style={styles.quickStatCategory}>of {categories.length} categories</Text>
            </View>
            
            <View style={styles.quickStatCard}>
              <View style={styles.quickStatHeader}>
                <Text style={styles.quickStatEmoji}>📈</Text>
                <Text style={styles.quickStatValue}>{weeklyStats.completionRate}%</Text>
              </View>
              <Text style={styles.quickStatLabel}>Weekly Rate</Text>
              <Text style={styles.quickStatCategory}>{weeklyStats.totalGoalsCompleted} goals done</Text>
            </View>
          </View>
        </View>

        {/* Category Streaks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Category Streaks</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryHeader, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakNumber}>{category.streak}</Text>
                    <Text style={styles.streakLabel}>days</Text>
                  </View>
                </View>
                <View style={styles.categoryBody}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryProgress}>
                    {category.completedToday}/{category.totalGoals} completed today
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Recent Activities</Text>
          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                  <Text style={styles.activityEmoji}>{activity.emoji}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityMeta}>
                    {activity.category} • {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Insights */}
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
              <Text style={styles.insightNumber}>{weeklyStats.completionRate}%</Text>
              <Text style={styles.insightLabel}>Completion Rate</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightEmoji}>🔥</Text>
              <Text style={styles.insightNumber}>{weeklyStats.bestStreak}</Text>
              <Text style={styles.insightLabel}>Best Streak</Text>
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

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Weekly Report Modal */}
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
  )
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  reportButton: {
    padding: 8,
  },

  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  quickStatsSection: {
    marginBottom: 25,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickStatEmoji: {
    fontSize: 22,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  quickStatLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  quickStatCategory: {
    fontSize: 11,
    color: '#95a5a6',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 15,
  },

  section: {
    marginBottom: 25,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  streakLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  categoryBody: {
    padding: 15,
    paddingTop: 10,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  categoryProgress: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  activityMeta: {
    fontSize: 12,
    color: '#95a5a6',
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  insightEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  insightNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 11,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  generateReportButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  generateReportText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  reportModal: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  reportContent: {
    padding: 20,
    maxHeight: 400,
  },
  reportText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  reportActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  shareButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})