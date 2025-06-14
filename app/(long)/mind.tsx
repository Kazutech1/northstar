import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function MindGoals() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [goals, setGoals] = useState([
    // Example goals - remove these in production
    { id: 1, text: 'Read 24 books this year', completed: false, createdAt: new Date() },
    { id: 2, text: 'Practice meditation for 10 minutes daily', completed: true, createdAt: new Date() },
    { id: 3, text: 'Learn a new language (Spanish)', completed: false, createdAt: new Date() },
  ])

  const sectionInfo = {
    title: 'Mind & Focus Goals',
    emoji: '🧠',
    description: 'Mental clarity, learning, and personal growth',
    color: '#4ecdc4'
  }

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals(prev => [...prev, {
        id: Date.now(),
        text: newGoal,
        completed: false,
        createdAt: new Date()
      }])
      setNewGoal('')
      setShowAddModal(false)
    }
  }

  const toggleGoalComplete = (goalId) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    )
  }

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId))
  }

  const closeModal = () => {
    Keyboard.dismiss()
    setShowAddModal(false)
    setNewGoal('')
  }

  const completedCount = goals.filter(g => g.completed).length
  const progressPercentage = goals.length > 0 ? (completedCount / goals.length) * 100 : 0

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={sectionInfo.color} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: sectionInfo.color }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>{sectionInfo.emoji}</Text>
          <Text style={styles.headerTitle}>{sectionInfo.title}</Text>
          <Text style={styles.headerDescription}>{sectionInfo.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{goals.length}</Text>
              <Text style={styles.statLabel}>Total Goals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round(progressPercentage)}%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Goals List */}
      <ScrollView 
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🧠</Text>
            <Text style={styles.emptyStateTitle}>No mind goals yet</Text>
            <Text style={styles.emptyStateDescription}>
              Expand your mental horizons by setting your first learning and growth goal!
            </Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: sectionInfo.color }]}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.emptyStateButtonText}>Add First Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <TouchableOpacity 
                  style={[styles.goalCheckbox, goal.completed && styles.goalCheckboxCompleted]}
                  onPress={() => toggleGoalComplete(goal.id)}
                >
                  {goal.completed && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </TouchableOpacity>
                
                <View style={styles.goalContent}>
                  <Text style={[styles.goalText, goal.completed && styles.goalTextCompleted]}>
                    {goal.text}
                  </Text>
                  <Text style={styles.goalDate}>
                    Added {goal.createdAt.toLocaleDateString()}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.deleteGoalButton}
                  onPress={() => deleteGoal(goal.id)}
                >
                  <Ionicons name="trash-outline" size={18} color={sectionInfo.color} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Mind & Focus Tips Section */}
        {goals.length > 0 && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Mind & Focus Tips</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>📚</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Daily Learning</Text>
                <Text style={styles.tipDescription}>Dedicate 20-30 minutes daily to learning something new</Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🧘</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Mindfulness Practice</Text>
                <Text style={styles.tipDescription}>Regular meditation improves focus and mental clarity</Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🎯</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Focus Sessions</Text>
                <Text style={styles.tipDescription}>Use the Pomodoro technique for deep work sessions</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.bottomSheet}>
                <View style={styles.bottomSheetHandle} />
                
                <Text style={[styles.modalTitle, { color: sectionInfo.color }]}>
                  {sectionInfo.emoji} New Mind & Focus Goal
                </Text>
                
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🎯 What mental goal do you want to achieve?</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Read 12 books this year, Learn programming, Practice meditation daily, Master a new skill..."
                    placeholderTextColor="#bdc3c7"
                    multiline={true}
                    numberOfLines={4}
                    value={newGoal}
                    onChangeText={setNewGoal}
                    textAlignVertical="top"
                    autoCorrect={true}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.quickSuggestions}>
                  <Text style={styles.suggestionsTitle}>💭 Quick Ideas:</Text>
                  <View style={styles.suggestionsContainer}>
                    {[
                      'Read 1 book per month',
                      'Learn a new language',
                      'Practice daily meditation',
                      'Take an online course',
                      'Write in a journal daily',
                      'Learn a musical instrument'
                    ].map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionChip}
                        onPress={() => setNewGoal(suggestion)}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: sectionInfo.color }]} 
                    onPress={handleAddGoal}
                  >
                    <Text style={styles.saveButtonText}>🧠 Add Goal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 15,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalsList: {
    gap: 15,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckboxCompleted: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
    marginBottom: 4,
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  goalDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  deleteGoalButton: {
    padding: 8,
    marginLeft: 10,
  },
  tipsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#bdc3c7',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  quickSuggestions: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 5,
  },
  suggestionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 0.45,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 0.45,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
})