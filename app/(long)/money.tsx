import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavingsGoal {
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: Date;
  category: string;
}

interface Earning {
  id: number;
  description: string;
  amount: number;
  date: Date;
  category: string;
}

export default function MoneyGoals() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('savings'); // 'savings', 'expenses', 'earnings'
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'main', 'saving', 'expense', 'earning', 'addToSaving'
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [currentSavings, setCurrentSavings] = useState(0); // Main savings goal
  const mainSavingsGoal = 1000000; // 1M NGN

  const sectionInfo = {
    title: 'Money & Finance',
    emoji: '💰',
    description: 'Track savings, expenses, and earnings',
    color: '#f39c12',
  };

  // Load data from AsyncStorage
  const loadData = async () => {
    try {
      // Load main savings
      const storedMainSavings = await AsyncStorage.getItem('@money_main_savings');
      setCurrentSavings(storedMainSavings ? parseFloat(storedMainSavings) : 0);
      console.log('Money: Loaded main savings:', storedMainSavings);

      // Load savings goals
      const storedGoals = await AsyncStorage.getItem('@money_goals');
      const loadedGoals = storedGoals
        ? JSON.parse(storedGoals).map((g: any) => ({
            ...g,
            createdAt: new Date(g.createdAt),
            completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
          }))
        : [];
      setSavingsGoals(loadedGoals);
      console.log('Money: Loaded savings goals:', loadedGoals);

      // Load expenses and earnings from @tasks
      const storedTasks = await AsyncStorage.getItem('@tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const moneyTasks = tasks.filter((t: any) => t.category === 'money');
      const expenseTasks = tasks.filter((t: any) => t.category === 'money_expense');
      const earningTasks = tasks.filter((t: any) => t.category === 'money_earning');

      setExpenses(
        expenseTasks.map((t: any) => ({
          id: t.id,
          description: t.goal,
          amount: t.amount,
          date: new Date(t.createdAt),
          category: '💳',
        }))
      );
      setEarnings(
        earningTasks.map((t: any) => ({
          id: t.id,
          description: t.goal,
          amount: t.amount,
          date: new Date(t.createdAt),
          category: '💰',
        }))
      );
      console.log('Money: Loaded expenses:', expenseTasks);
      console.log('Money: Loaded earnings:', earningTasks);

      // Sync savings goals to @tasks
      const otherTasks = tasks.filter((t: any) => t.category !== 'money');
      const goalTasks = loadedGoals.map((goal: SavingsGoal) => ({
        id: goal.id,
        mindDump: '',
        goal: goal.name,
        completed: goal.currentAmount >= goal.targetAmount,
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : undefined,
        category: 'money',
        createdAt: goal.createdAt.toISOString(),
      }));
      await AsyncStorage.setItem('@tasks', JSON.stringify([...otherTasks, ...goalTasks, ...expenseTasks, ...earningTasks]));
      console.log('Money: Synced tasks:', [...otherTasks, ...goalTasks, ...expenseTasks, ...earningTasks]);
    } catch (error) {
      console.error('Money: Error loading data:', error);
      setSavingsGoals([]);
      setExpenses([]);
      setEarnings([]);
      setCurrentSavings(0);
    }
  };

  // Save data to AsyncStorage
  const saveData = async (
    updatedGoals: SavingsGoal[] = savingsGoals,
    updatedExpenses: Expense[] = expenses,
    updatedEarnings: Earning[] = earnings,
    updatedMainSavings: number = currentSavings
  ) => {
    try {
      // Save main savings
      await AsyncStorage.setItem('@money_main_savings', updatedMainSavings.toString());
      console.log('Money: Saved main savings:', updatedMainSavings);

      // Save savings goals
      const serializedGoals = updatedGoals.map(goal => ({
        ...goal,
        createdAt: goal.createdAt.toISOString(),
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : undefined,
      }));
      await AsyncStorage.setItem('@money_goals', JSON.stringify(serializedGoals));
      console.log('Money: Saved savings goals:', serializedGoals);

      // Sync to @tasks
      const storedTasks = await AsyncStorage.getItem('@tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const otherTasks = tasks.filter((t: any) => t.category !== 'money' && t.category !== 'money_expense' && t.category !== 'money_earning');
      const goalTasks = updatedGoals.map(goal => ({
        id: goal.id,
        mindDump: '',
        goal: goal.name,
        completed: goal.currentAmount >= goal.targetAmount,
        completedAt: goal.currentAmount >= goal.targetAmount && !goal.completedAt ? new Date().toISOString() : goal.completedAt ? goal.completedAt.toISOString() : undefined,
        category: 'money',
        createdAt: goal.createdAt.toISOString(),
      }));
      const expenseTasks = updatedExpenses.map(expense => ({
        id: expense.id,
        mindDump: '',
        goal: expense.description,
        amount: expense.amount,
        completed: true,
        completedAt: expense.date.toISOString(),
        category: 'money_expense',
        createdAt: expense.date.toISOString(),
      }));
      const earningTasks = updatedEarnings.map(earning => ({
        id: earning.id,
        mindDump: '',
        goal: earning.description,
        amount: earning.amount,
        completed: true,
        completedAt: earning.date.toISOString(),
        category: 'money_earning',
        createdAt: earning.date.toISOString(),
      }));
      tasks = [...otherTasks, ...goalTasks, ...expenseTasks, ...earningTasks];
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
      console.log('Money: Saved tasks:', tasks);
    } catch (error) {
      console.error('Money: Error saving data:', error);
    }
  };

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddItem = () => {
    const amount = parseFloat(newAmount.replace(/[^0-9.-]+/g, ''));
    if (!amount || amount <= 0) return;

    if (modalType === 'main') {
      const newSavings = currentSavings + amount;
      setCurrentSavings(newSavings);
      saveData(undefined, undefined, undefined, newSavings);
    } else if (modalType === 'saving') {
      if (!newItem.trim()) return;
      const newGoal: SavingsGoal = {
        id: Date.now(),
        name: newItem,
        currentAmount: amount,
        targetAmount: amount * 2,
        createdAt: new Date(),
      };
      const updatedGoals = [...savingsGoals, newGoal];
      setSavingsGoals(updatedGoals);
      saveData(updatedGoals);
    } else if (modalType === 'expense') {
      if (!newItem.trim()) return;
      const newExpense: Expense = {
        id: Date.now(),
        description: newItem,
        amount: amount,
        date: new Date(),
        category: '💳',
      };
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      saveData(undefined, updatedExpenses);
    } else if (modalType === 'earning') {
      if (!newItem.trim()) return;
      const newEarning: Earning = {
        id: Date.now(),
        description: newItem,
        amount: amount,
        date: new Date(),
        category: '💰',
      };
      const updatedEarnings = [...earnings, newEarning];
      setEarnings(updatedEarnings);
      saveData(undefined, undefined, updatedEarnings);
    } else if (modalType === 'addToSaving' && selectedGoalId !== null) {
      const updatedGoals = savingsGoals.map(goal =>
        goal.id === selectedGoalId
          ? {
              ...goal,
              currentAmount: goal.currentAmount + amount,
              completedAt: goal.currentAmount + amount >= goal.targetAmount && !goal.completedAt ? new Date() : goal.completedAt,
            }
          : goal
      );
      setSavingsGoals(updatedGoals);
      saveData(updatedGoals);
    }

    closeModal();
  };

  const addToSavings = (goalId: number) => {
    setModalType('addToSaving');
    setSelectedGoalId(goalId);
    setShowAddModal(true);
  };

  const openAddModal = (type: string) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const closeModal = () => {
    Keyboard.dismiss();
    setShowAddModal(false);
    setNewItem('');
    setNewAmount('');
    setModalType('');
    setSelectedGoalId(null);
  };

  const deleteItem = (type: string, itemId: number) => {
    if (type === 'saving') {
      const updatedGoals = savingsGoals.filter(goal => goal.id !== itemId);
      setSavingsGoals(updatedGoals);
      saveData(updatedGoals);
    } else if (type === 'expense') {
      const updatedExpenses = expenses.filter(expense => expense.id !== itemId);
      setExpenses(updatedExpenses);
      saveData(undefined, updatedExpenses);
    } else if (type === 'earning') {
      const updatedEarnings = earnings.filter(earning => earning.id !== itemId);
      setEarnings(updatedEarnings);
      saveData(undefined, undefined, updatedEarnings);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const progressPercentage = (currentSavings / mainSavingsGoal) * 100;

  const handleSummary = () => {
    console.log('Navigating to Summary Screen!');
    router.push('./summary');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={sectionInfo.color} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: sectionInfo.color }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.mainSavingsButton} onPress={() => openAddModal('main')}>
              <Ionicons name="wallet" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainSavingsButton} onPress={handleSummary}>
              <Ionicons name="stats-chart" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                if (activeTab === 'savings') openAddModal('saving');
                else if (activeTab === 'expenses') openAddModal('expense');
                else if (activeTab === 'earnings') openAddModal('earning');
              }}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>{sectionInfo.emoji}</Text>
          <Text style={styles.headerTitle}>{sectionInfo.title}</Text>
          <Text style={styles.headerDescription}>{sectionInfo.description}</Text>
          <View style={styles.progressContainer}>
            <Svg width="200" height="120" style={styles.progressSvg} viewBox="0 0 200 120">
              <Path
                d="M 20 100 A 80 80 0 0 1 180 100"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
              />
              <Path
                d="M 20 100 A 80 80 0 0 1 180 100"
                stroke="#ffffff"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={Math.PI * 80}
                strokeDashoffset={(1 - progressPercentage / 100) * Math.PI * 80}
                strokeLinecap="round"
              />
            </Svg>
            <View style={styles.progressContent}>
              <Text style={styles.progressAmount}>{formatCurrency(currentSavings)}</Text>
              <Text style={styles.progressGoal}>of {formatCurrency(mainSavingsGoal)}</Text>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'savings' && styles.activeTab]} onPress={() => setActiveTab('savings')}>
          <Text style={[styles.tabText, activeTab === 'savings' && styles.activeTabText]}>💰 Savings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'expenses' && styles.activeTab]} onPress={() => setActiveTab('expenses')}>
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>💸 Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'earnings' && styles.activeTab]} onPress={() => setActiveTab('earnings')}>
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.activeTabText]}>💵 Earnings</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'savings' && (
          <View style={styles.contentSection}>
            {savingsGoals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>🎯</Text>
                <Text style={styles.emptyStateTitle}>No savings goals yet</Text>
                <Text style={styles.emptyStateDescription}>Start your financial journey by creating your first savings goal!</Text>
                <TouchableOpacity style={[styles.emptyStateButton, { backgroundColor: sectionInfo.color }]} onPress={() => openAddModal('saving')}>
                  <Text style={styles.emptyStateButtonText}>Create Savings Goal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {savingsGoals.map((goal) => {
                  const goalProgress = (goal.currentAmount / goal.targetAmount) * 100;
                  const isCompleted = goalProgress >= 100;
                  return (
                    <View key={goal.id} style={[styles.savingsCard, isCompleted && styles.completedSavingsCard]}>
                      <View style={styles.savingsHeader}>
                        <View style={styles.savingsNameContainer}>
                          <Text style={styles.savingsName}>{goal.name}</Text>
                          {isCompleted && (
                            <View style={styles.completedBadge}>
                              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                              <Text style={styles.completedText}>Completed!</Text>
                            </View>
                          )}
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem('saving', goal.id)}>
                          <Ionicons name="trash-outline" size={18} color={sectionInfo.color} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.savingsProgress}>
                        <Text style={styles.savingsAmount}>
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </Text>
                        <Text style={[styles.savingsPercentage, isCompleted && styles.completedPercentage]}>
                          {Math.round(goalProgress)}%
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[styles.progressFill, { width: `${Math.min(goalProgress, 100)}%`, backgroundColor: isCompleted ? '#27ae60' : sectionInfo.color }]}
                        />
                      </View>
                      {!isCompleted && (
                        <TouchableOpacity style={[styles.addToSavingsButton, { backgroundColor: sectionInfo.color }]} onPress={() => addToSavings(goal.id)}>
                          <Text style={styles.addToSavingsText}>+ Add to Savings</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {activeTab === 'expenses' && (
          <View style={styles.contentSection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Expenses</Text>
              <Text style={[styles.summaryAmount, { color: '#e74c3c' }]}>{formatCurrency(totalExpenses)}</Text>
            </View>
            {expenses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>💸</Text>
                <Text style={styles.emptyStateTitle}>No expenses tracked</Text>
                <Text style={styles.emptyStateDescription}>Start tracking your expenses to better manage your finances</Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {expenses.map((expense) => (
                  <View key={expense.id} style={styles.itemCard}>
                    <Text style={styles.itemEmoji}>{expense.category}</Text>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemDescription}>{expense.description}</Text>
                      <Text style={styles.itemDate}>{expense.date.toLocaleDateString()}</Text>
                    </View>
                    <Text style={[styles.itemAmount, { color: '#e74c3c' }]}>-{formatCurrency(expense.amount)}</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem('expense', expense.id)}>
                      <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'earnings' && (
          <View style={styles.contentSection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Earnings</Text>
              <Text style={[styles.summaryAmount, { color: '#27ae60' }]}>{formatCurrency(totalEarnings)}</Text>
            </View>
            {earnings.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>💵</Text>
                <Text style={styles.emptyStateTitle}>No earnings tracked</Text>
                <Text style={styles.emptyStateDescription}>Track your income sources to see your financial growth</Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {earnings.map((earning) => (
                  <View key={earning.id} style={styles.itemCard}>
                    <Text style={styles.itemEmoji}>{earning.category}</Text>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemDescription}>{earning.description}</Text>
                      <Text style={styles.itemDate}>{earning.date.toLocaleDateString()}</Text>
                    </View>
                    <Text style={[styles.itemAmount, { color: '#27ae60' }]}>+{formatCurrency(earning.amount)}</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem('earning', earning.id)}>
                      <Ionicons name="trash-outline" size={18} color="#27ae60" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Modal */}
      <Modal animationType="slide" transparent={true} visible={showAddModal} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.bottomSheet}>
                <View style={styles.bottomSheetHandle} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
                  <Text style={[styles.modalTitle, { color: sectionInfo.color }]}>
                    {modalType === 'main' && '🎯 Add to Main Savings'}
                    {modalType === 'saving' && '💰 New Savings Goal'}
                    {modalType === 'expense' && '💸 New Expense'}
                    {modalType === 'earning' && '💵 New Earning'}
                    {modalType === 'addToSaving' && '💰 Add to Savings Goal'}
                  </Text>

                  {modalType !== 'main' && modalType !== 'addToSaving' && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {modalType === 'saving' ? '🎯 What are you saving for?' : modalType === 'expense' ? '💳 What did you spend on?' : '💼 What did you earn from?'}
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder={
                          modalType === 'saving'
                            ? 'e.g., New laptop, Vacation, Emergency fund...'
                            : modalType === 'expense'
                            ? 'e.g., Groceries, Transportation, Utilities...'
                            : 'e.g., Salary, Freelance, Investment...'
                        }
                        placeholderTextColor="#bdc3c7"
                        value={newItem}
                        onChangeText={setNewItem}
                        autoCorrect={true}
                      />
                    </View>
                  )}

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {modalType === 'main' ? '🎯 How much to add to your 1M goal?' : modalType === 'addToSaving' ? '💰 Amount to Add (₦)' : '💰 Amount (₦)'}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter amount..."
                      placeholderTextColor="#bdc3c7"
                      value={newAmount}
                      onChangeText={setNewAmount}
                      keyboardType="numeric"
                    />
                  </View>

                  {(modalType === 'main' || modalType === 'addToSaving') && (
                    <View style={styles.quickAmountSection}>
                      <Text style={styles.suggestionsTitle}>💡 Quick amounts:</Text>
                      <View style={styles.suggestionsContainer}>
                        {[5000, 10000, 25000, 50000, 100000].map((amount) => (
                          <TouchableOpacity key={amount} style={styles.suggestionChip} onPress={() => setNewAmount(amount.toString())}>
                            <Text style={[styles.suggestionText, { color: sectionInfo.color }]}>₦{amount.toLocaleString()}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.saveButton, { backgroundColor: sectionInfo.color }]} onPress={handleAddItem}>
                      <Text style={styles.saveButtonText}>
                        {modalType === 'main' && '🎯 Add to Savings'}
                        {modalType === 'saving' && '💰 Add Goal'}
                        {modalType === 'expense' && '💸 Add Expense'}
                        {modalType === 'earning' && '💵 Add Earning'}
                        {modalType === 'addToSaving' && '💰 Add to Goal'}
                      </Text>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainSavingsButton: {
    padding: 8,
    marginRight: 10,
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
  progressContainer: {
    position: 'relative',
    width: 200,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSvg: {
    position: 'absolute',
  },
  progressContent: {
    alignItems: 'center',
  },
  progressAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  progressGoal: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentSection: {
    marginBottom: 20,
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
  summaryCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  itemsList: {
    gap: 10,
  },
  savingsCard: {
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
  completedSavingsCard: {
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  savingsNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 10,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(39,174,96,0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#27ae60',
    marginLeft: 4,
  },
  savingsProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  savingsAmount: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  savingsPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  completedPercentage: {
    color: '#27ae60',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  addToSavingsButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addToSavingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  itemCard: {
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
  itemEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  itemDate: {
    fontSize: 12,
    color: '#bdc3c7',
    marginTop: 4,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  deleteButton: {
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
    paddingBottom: 10,
    maxHeight: '90%',
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
    paddingBottom: 20,
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
  },
  quickAmountSection: {
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
    borderColor: '#f39c12',
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
    paddingBottom: 10,
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