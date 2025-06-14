import { View, Text,  TouchableOpacity, StyleSheet, StatusBar, Modal, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function Legacy() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [goals, setGoals] = useState([
    // Example goals - remove these in production
    { id: 1, text: 'Write a book about my life experiences', completed: false, createdAt: new Date() },
    { id: 2, text: 'Start a scholarship fund for students', completed: false, createdAt: new Date() },
    { id: 3, text: 'Create family traditions for future generations', completed: true, createdAt: new Date() },
    { id: 4, text: 'Mentor young professionals in my field', completed: false, createdAt: new Date() },
    { id: 5, text: 'Plant a tree for each family member', completed: true, createdAt: new Date() },
  ])

  const sectionInfo = {
    title: 'Legacy & Impact',
    emoji: '🌟',
    description: 'Creating lasting impact and meaningful contributions for future generations',
    color: '#8e44ad'
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
              <Text style={styles.statLabel}>Legacy Goals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Established</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round(progressPercentage)}%</Text>
              <Text style={styles.statLabel}>Impact</Text>
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
            <Text style={styles.emptyStateEmoji}>🌟</Text>
            <Text style={styles.emptyStateTitle}>No legacy goals yet</Text>
            <Text style={styles.emptyStateDescription}>
              Start building your lasting impact and create something meaningful for future generations!
            </Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: sectionInfo.color }]}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.emptyStateButtonText}>Create First Legacy</Text>
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
                    <Ionicons name="star" size={14} color="#ffffff" />
                  )}
                </TouchableOpacity>
                
                <View style={styles.goalContent}>
                  <Text style={[styles.goalText, goal.completed && styles.goalTextCompleted]}>
                    {goal.text}
                  </Text>
                  <Text style={styles.goalDate}>
                    Started {goal.createdAt.toLocaleDateString()}
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

      
        {goals.length > 0 && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Legacy Building Wisdom</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>📖</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Document Your Story</Text>
                <Text style={styles.tipDescription}>Write, record, or create something that captures your experiences and wisdom</Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🌱</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Invest in Others</Text>
                <Text style={styles.tipDescription}>Mentor, teach, and support the next generation in meaningful ways</Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🏛️</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Build Something Lasting</Text>
                <Text style={styles.tipDescription}>Create institutions, traditions, or works that will outlive you</Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>💝</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Give Generously</Text>
                <Text style={styles.tipDescription}>Share your resources, knowledge, and time to make a positive difference</Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🔗</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Connect Generations</Text>
                <Text style={styles.tipDescription}>Bridge the gap between past wisdom and future possibilities</Text>
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
                  {sectionInfo.emoji} New Legacy Goal
                </Text>
                
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>✨ What lasting impact do you want to create?</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Write memoirs, Start a foundation, Create family traditions, Mentor others, Build something meaningful, Leave knowledge for others..."
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
                  <Text style={styles.suggestionsTitle}>💭 Legacy Ideas:</Text>
                  <View style={styles.suggestionsContainer}>
                    {[
                      'Write family history',
                      'Start a scholarship',
                      'Create art or music',
                      'Plant a garden',
                      'Mentor someone',
                      'Build a business',
                      'Teach skills',
                      'Document recipes',
                      'Start traditions',
                      'Volunteer regularly'
                    ].map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.suggestionChip, { backgroundColor: sectionInfo.color }]}
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
                    <Text style={styles.saveButtonText}>🌟 Create Legacy</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    fontSize: 40,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 5,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyStateEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  goalsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  goalCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  goalCheckboxCompleted: {
    backgroundColor: '#8e44ad',
    borderColor: '#8e44ad',
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
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
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    maxHeight: '90%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#bdc3c7',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  quickSuggestions: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#ffffff',
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
})