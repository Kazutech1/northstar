import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export default function MindGoals() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);

  const sectionInfo = {
    title: 'Mind & Focus Goals',
    emoji: '🧠',
    description: 'Mental clarity, learning, and personal growth',
    color: '#4ecdc4',
  };

  // Load goals from AsyncStorage
  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('@mind_goals');
      const mindGoals = storedGoals
        ? JSON.parse(storedGoals).map((g: any) => ({
            ...g,
            createdAt: new Date(g.createdAt),
            completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
          }))
        : [];
      setGoals(mindGoals);
      console.log('MindGoals: Loaded mind goals:', mindGoals);

      // Sync with @tasks for LogDashboard
      const storedTasks = await AsyncStorage.getItem('@tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const otherTasks = tasks.filter((t: any) => t.category !== 'mind&focus');
      const mindTasks = mindGoals.map((goal: Goal) => ({
        id: goal.id,
        mindDump: '',
        goal: goal.text,
        completed: goal.completed,
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : undefined,
        category: 'mind&focus',
        createdAt: goal.createdAt.toISOString(),
      }));
      tasks = [...otherTasks, ...mindTasks];
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
      console.log('MindGoals: Synced tasks:', tasks);
    } catch (error) {
      console.error('MindGoals: Error loading goals:', error);
      setGoals([]);
    }
  };

  // Save goals to AsyncStorage
  const saveGoals = async (updatedGoals: Goal[]) => {
    try {
      // Save to @mind_goals
      const serializedGoals = updatedGoals.map(goal => ({
        ...goal,
        createdAt: goal.createdAt.toISOString(),
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : undefined,
      }));
      await AsyncStorage.setItem('@mind_goals', JSON.stringify(serializedGoals));
      console.log('MindGoals: Saved mind goals:', serializedGoals);

      // Sync with @tasks
      const storedTasks = await AsyncStorage.getItem('@tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const otherTasks = tasks.filter((t: any) => t.category !== 'mind&focus');
      const mindTasks = updatedGoals.map(goal => ({
        id: goal.id,
        mindDump: '',
        goal: goal.text,
        completed: goal.completed,
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : undefined,
        category: 'mind&focus',
        createdAt: goal.createdAt.toISOString(),
      }));
      tasks = [...otherTasks, ...mindTasks];
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
      console.log('MindGoals: Saved tasks:', tasks);
    } catch (error) {
      console.error('MindGoals: Error saving goals:', error);
    }
  };

  // Reload goals when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const newGoalObj: Goal = {
        id: Date.now(),
        text: newGoal,
        completed: false,
        createdAt: new Date(),
      };
      const updatedGoals = [...goals, newGoalObj];
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      setNewGoal('');
      setShowAddModal(false);
    }
  };

  const toggleGoalComplete = (goalId: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            completed: !goal.completed,
            completedAt: !goal.completed ? new Date() : undefined,
          }
        : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId: number) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const closeModal = () => {
    Keyboard.dismiss();
    setShowAddModal(false);
    setNewGoal('');
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercentage = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

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
                  style={[styles.goalCheckbox, goal.completed && { backgroundColor: sectionInfo.color, borderColor: sectionInfo.color }]}
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
            <TouchableWithoutFeedback>
              <View style={styles.bottomSheet}>
                <View style={styles.bottomSheetHandle} />
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
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
                        'Learn a musical instrument',
                      ].map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.suggestionChip, { borderColor: sectionInfo.color }]}
                          onPress={() => setNewGoal(suggestion)}
                        >
                          <Text style={[styles.suggestionText, { color: sectionInfo.color }]}>{suggestion}</Text>
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
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: '100%',
    marginHorizontal: 10,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyStateEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  goalsList: {
    marginTop: 10,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#bdc3c7',
  },
  goalDate: {
    fontSize: 12,
    color: '#bdc3c7',
    marginTop: 4,
  },
  deleteGoalButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10, // Reduced to save space
    maxHeight: '90%', // Increased for more content
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#bdc3c7',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalScrollContent: {
    paddingBottom: 20, // Ensure content has padding at bottom
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 120,
  },
  quickSuggestions: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 10, // Ensure buttons have space at bottom
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 20,
  },
});