import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 60) / 2; // 20px padding on sides + 20px gap between cards

export default function LongTerm() {
  const router = useRouter();
  
  const [goals, setGoals] = useState({
    health: [
      { id: 1, text: 'Exercise 4x per week', completed: false },
      { id: 2, text: 'Drink 8 glasses of water daily', completed: true },
      { id: 3, text: 'Sleep 8 hours nightly', completed: true },
      { id: 4, text: 'Take daily vitamins', completed: false },
    ],
    mind: [
      { id: 1, text: 'Read 12 books this year', completed: false },
      { id: 2, text: 'Meditate 10 minutes daily', completed: true },
      { id: 3, text: 'Learn Spanish', completed: false },
      { id: 4, text: 'Complete online course', completed: true },
      { id: 5, text: 'Journal weekly', completed: true },
    ],
    career: [
      { id: 1, text: 'Get promoted to senior role', completed: false },
      { id: 2, text: 'Complete certification', completed: true },
      { id: 3, text: 'Attend 5 networking events', completed: false },
    ],
    money: [
      { id: 1, text: 'Save $10,000 emergency fund', completed: true },
      { id: 2, text: 'Invest in index funds', completed: false },
      { id: 3, text: 'Pay off credit card debt', completed: true },
      { id: 4, text: 'Create monthly budget', completed: true },
    ],
    relationships: [
      { id: 1, text: 'Call family weekly', completed: true },
      { id: 2, text: 'Plan monthly date nights', completed: false },
      { id: 3, text: 'Reconnect with old friends', completed: true },
    ],
    legacy: [
      { id: 1, text: 'Volunteer monthly', completed: false },
      { id: 2, text: 'Mentor someone', completed: true },
      { id: 3, text: 'Start a blog', completed: false },
    ]
  })

  const [goalSections, setGoalSections] = useState([
    {
      id: 'health',
      title: 'Body & Health',
      screenName: 'health',
      icon: 'fitness-outline',
      description: 'Physical wellness',
      emoji: '💪',
      gradient: ['#ff6b6b', '#ff8e8e']
    },
    {
      id: 'mind',
      title: 'Mind & Focus', 
      screenName: 'mind',
      icon: 'bulb-outline',
      description: 'Mental clarity',
      emoji: '🧠',
      gradient: ['#4ecdc4', '#44b3aa']
    },
    {
      id: 'career',
      title: 'Career',
      screenName: 'career',
      icon: 'briefcase-outline', 
      description: 'Professional growth',
      emoji: '🚀',
      gradient: ['#45b7d1', '#3498db']
    },
    {
      id: 'money',
      title: 'Financial',
      screenName: 'money',
      icon: 'card-outline',
      description: 'Wealth building',
      emoji: '💰',
      gradient: ['#96ceb4', '#27ae60']
    },
    {
      id: 'relationships',
      title: 'Relationships',
      screenName: 'relationships',
      icon: 'heart-outline',
      description: 'Connections',
      emoji: '❤️',
      gradient: ['#feca57', '#f39c12']
    },
    {
      id: 'legacy',
      title: 'Legacy',
      screenName: 'legacy',
      icon: 'trophy-outline',
      description: 'Long-term impact',
      emoji: '🏆',
      gradient: ['#a55eea', '#8e44ad']
    }
  ])

  const navigateToSection = (section) => {
    router.push(`/(long)/${section.screenName}`)
  }

  // Calculate overall progress
  const totalGoals = Object.values(goals).flat().length
  const completedGoals = Object.values(goals).flat().filter(g => g.completed).length
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

  const renderGoalCard = ({ item }) => {
    const sectionGoals = goals[item.id] || []
    const completedCount = sectionGoals.filter(g => g.completed).length
    const progressPercentage = sectionGoals.length > 0 ? (completedCount / sectionGoals.length) * 100 : 0
    
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
                    style={[
                      styles.progressFill, 
                      { width: `${progressPercentage}%` }
                    ]} 
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
    )
  }

  const renderProgressBar = ({ item }) => {
    const sectionGoals = goals[item.id] || []
    const completedCount = sectionGoals.filter(g => g.completed).length
    const progressPercentage = sectionGoals.length > 0 ? (completedCount / sectionGoals.length) * 100 : 0
    
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
                backgroundColor: item.gradient[0]
              }
            ]} 
          />
        </View>
        <Text style={styles.progressBarSubtext}>
          {completedCount} of {sectionGoals.length} goals completed
        </Text>
      </View>
    )
  }

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
        {/* Goal Cards Grid */}
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

        {/* Individual Progress Bars */}
        <View style={styles.progressSection}>
          <Text style={styles.progressSectionTitle}>📊 Goal Progress</Text>
          {goalSections.map((section, index) => (
            <View key={section.id}>
              {renderProgressBar({ item: section })}
            </View>
          ))}
        </View>

        {/* Overall Progress Summary */}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 25,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 5,
  },
  counterText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardsContainer: {
    marginBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardSeparator: {
    height: 1,
  },
  goalCard: {
    width: cardWidth,
    height: 150,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionEmoji: {
    fontSize: 28,
  },
  goalCounter: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  goalCountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 14,
  },
  cardFooter: {
    marginTop: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  startText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarContainer: {
    backgroundColor: '#34495e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 18,
    marginRight: 8,
  },
  progressBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBarPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ecdc4',
  },
  bigProgressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  bigProgressFill: {
    height: '100%',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  progressBarSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  overallProgressSection: {
    backgroundColor: '#34495e',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  overallProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  overallProgressContainer: {
    marginBottom: 10,
  },
  overallProgressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    marginBottom: 12,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    borderRadius: 5,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatsText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    color: '#4ecdc4',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 20,
  },
})