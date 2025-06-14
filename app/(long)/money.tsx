import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'

export default function MoneyGoals() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('savings') // 'savings', 'expenses', 'earnings'
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'saving', 'expense', 'earning', 'main'
  const [newItem, setNewItem] = useState('')
  const [newAmount, setNewAmount] = useState('')
  
  // Main savings goal (1 million naira) - separate from individual savings
  const [mainSavingsGoal] = useState(1000000)
  const [currentSavings, setCurrentSavings] = useState(250000) // Only updated by wallet modal
  
  // Savings goals
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: 'Emergency Fund', currentAmount: 150000, targetAmount: 300000, createdAt: new Date() },
    { id: 2, name: 'New Car', currentAmount: 100000, targetAmount: 500000, createdAt: new Date() },
  ])
  
  // Expenses
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Groceries', amount: 25000, date: new Date(), category: '🛒' },
    { id: 2, description: 'Transportation', amount: 15000, date: new Date(), category: '🚗' },
    { id: 3, description: 'Utilities', amount: 30000, date: new Date(), category: '💡' },
  ])
  
  // Earnings
  const [earnings, setEarnings] = useState([
    { id: 1, description: 'Salary', amount: 200000, date: new Date(), category: '💼' },
    { id: 2, description: 'Freelance', amount: 50000, date: new Date(), category: '💻' },
    { id: 3, description: 'Investment', amount: 25000, date: new Date(), category: '📈' },
  ])

  const sectionInfo = {
    title: 'Money & Finance',
    emoji: '💰',
    description: 'Track savings, expenses, and earnings',
    color: '#f39c12'
  }

  // Calculate progress percentage for main goal
  const progressPercentage = (currentSavings / mainSavingsGoal) * 100

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddItem = () => {
    const amount = parseFloat(newAmount.replace(/[^0-9.-]+/g, ''))
    if (!amount || amount <= 0) return

    if (modalType === 'main') {
      // Only the wallet modal updates the main savings progress
      setCurrentSavings(prev => prev + amount)
    } else if (modalType === 'saving') {
      if (!newItem.trim()) return
      setSavingsGoals(prev => [...prev, {
        id: Date.now(),
        name: newItem,
        currentAmount: amount,
        targetAmount: amount * 2, // Default target is 2x current
        createdAt: new Date()
      }])
    } else if (modalType === 'expense') {
      if (!newItem.trim()) return
      setExpenses(prev => [...prev, {
        id: Date.now(),
        description: newItem,
        amount: amount,
        date: new Date(),
        category: '💳'
      }])
    } else if (modalType === 'earning') {
      if (!newItem.trim()) return
      setEarnings(prev => [...prev, {
        id: Date.now(),
        description: newItem,
        amount: amount,
        date: new Date(),
        category: '💰'
      }])
    }

    closeModal()
  }

  const addToSavings = (goalId, amount) => {
    setSavingsGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    )
  }

  const openAddModal = (type) => {
    setModalType(type)
    setShowAddModal(true)
  }

  const closeModal = () => {
    Keyboard.dismiss()
    setShowAddModal(false)
    setNewItem('')
    setNewAmount('')
    setModalType('')
  }

  const deleteItem = (type, itemId) => {
    if (type === 'saving') {
      setSavingsGoals(prev => prev.filter(goal => goal.id !== itemId))
    } else if (type === 'expense') {
      setExpenses(prev => prev.filter(expense => expense.id !== itemId))
    } else if (type === 'earning') {
      setEarnings(prev => prev.filter(earning => earning.id !== itemId))
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0)

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
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.mainSavingsButton}
              onPress={() => openAddModal('main')}
            >
              <Ionicons name="wallet" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                if (activeTab === 'savings') openAddModal('saving')
                else if (activeTab === 'expenses') openAddModal('expense')
                else if (activeTab === 'earnings') openAddModal('earning')
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
          
          {/* Circular Progress Bar */}
          <View style={styles.progressContainer}>
            <Svg width="200" height="120" style={styles.progressSvg} viewBox="0 0 200 120">
              {/* Background semi-circle */}
              <Path
                d="M 20 100 A 80 80 0 0 1 180 100"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
              />
              {/* Progress semi-circle */}
              <Path
                d="M 20 100 A 80 80 0 0 1 180 100"
                stroke="#ffffff"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={Math.PI * 80} // Half circumference
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
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'savings' && styles.activeTab]}
          onPress={() => setActiveTab('savings')}
        >
          <Text style={[styles.tabText, activeTab === 'savings' && styles.activeTabText]}>
            💰 Savings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            💸 Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'earnings' && styles.activeTab]}
          onPress={() => setActiveTab('earnings')}
        >
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.activeTabText]}>
            💵 Earnings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'savings' && (
          <View style={styles.contentSection}>
            {savingsGoals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>🎯</Text>
                <Text style={styles.emptyStateTitle}>No savings goals yet</Text>
                <Text style={styles.emptyStateDescription}>
                  Start your financial journey by creating your first savings goal!
                </Text>
                <TouchableOpacity 
                  style={[styles.emptyStateButton, { backgroundColor: sectionInfo.color }]}
                  onPress={() => openAddModal('saving')}
                >
                  <Text style={styles.emptyStateButtonText}>Create Savings Goal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {savingsGoals.map((goal) => {
                  const goalProgress = (goal.currentAmount / goal.targetAmount) * 100
                  const isCompleted = goalProgress >= 100
                  return (
                    <View key={goal.id} style={[
                      styles.savingsCard,
                      isCompleted && styles.completedSavingsCard
                    ]}>
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
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => deleteItem('saving', goal.id)}
                        >
                          <Ionicons name="trash-outline" size={18} color={sectionInfo.color} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.savingsProgress}>
                        <Text style={styles.savingsAmount}>
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </Text>
                        <Text style={[
                          styles.savingsPercentage,
                          isCompleted && styles.completedPercentage
                        ]}>
                          {Math.round(goalProgress)}%
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${Math.min(goalProgress, 100)}%`, 
                              backgroundColor: isCompleted ? '#27ae60' : sectionInfo.color 
                            }
                          ]} 
                        />
                      </View>
                      {!isCompleted && (
                        <TouchableOpacity 
                          style={[styles.addToSavingsButton, { backgroundColor: sectionInfo.color }]}
                          onPress={() => {
                            // Quick add 10k to savings
                            addToSavings(goal.id, 10000)
                          }}
                        >
                          <Text style={styles.addToSavingsText}>+ Add ₦10,000</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        )}

        {activeTab === 'expenses' && (
          <View style={styles.contentSection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Expenses</Text>
              <Text style={[styles.summaryAmount, { color: '#e74c3c' }]}>
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
            {expenses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>💸</Text>
                <Text style={styles.emptyStateTitle}>No expenses tracked</Text>
                <Text style={styles.emptyStateDescription}>
                  Start tracking your expenses to better manage your finances
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {expenses.map((expense) => (
                  <View key={expense.id} style={styles.itemCard}>
                    <Text style={styles.itemEmoji}>{expense.category}</Text>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemDescription}>{expense.description}</Text>
                      <Text style={styles.itemDate}>
                        {expense.date.toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={[styles.itemAmount, { color: '#e74c3c' }]}>
                      -{formatCurrency(expense.amount)}
                    </Text>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteItem('expense', expense.id)}
                    >
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
              <Text style={[styles.summaryAmount, { color: '#27ae60' }]}>
                {formatCurrency(totalEarnings)}
              </Text>
            </View>
            {earnings.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>💵</Text>
                <Text style={styles.emptyStateTitle}>No earnings tracked</Text>
                <Text style={styles.emptyStateDescription}>
                  Track your income sources to see your financial growth
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {earnings.map((earning) => (
                  <View key={earning.id} style={styles.itemCard}>
                    <Text style={styles.itemEmoji}>{earning.category}</Text>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemDescription}>{earning.description}</Text>
                      <Text style={styles.itemDate}>
                        {earning.date.toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={[styles.itemAmount, { color: '#27ae60' }]}>
                      +{formatCurrency(earning.amount)}
                    </Text>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteItem('earning', earning.id)}
                    >
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
                  {modalType === 'main' && '🎯 Add to Main Savings'}
                  {modalType === 'saving' && '💰 New Savings Goal'}
                  {modalType === 'expense' && '💸 New Expense'}
                  {modalType === 'earning' && '💵 New Earning'}
                </Text>
                
                {modalType !== 'main' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {modalType === 'saving' && '🎯 What are you saving for?'}
                      {modalType === 'expense' && '💳 What did you spend on?'}
                      {modalType === 'earning' && '💼 What did you earn from?'}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={
                        modalType === 'saving' ? 'e.g., New laptop, Vacation, Emergency fund...' :
                        modalType === 'expense' ? 'e.g., Groceries, Transportation, Utilities...' :
                        'e.g., Salary, Freelance, Investment...'
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
                    {modalType === 'main' ? '🎯 How much to add to your 1M goal?' : '💰 Amount (₦)'}
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

                {modalType === 'main' && (
                  <View style={styles.quickAmountSection}>
                    <Text style={styles.suggestionsTitle}>💡 Quick amounts:</Text>
                    <View style={styles.suggestionsContainer}>
                      {[5000, 10000, 25000, 50000, 100000].map((amount) => (
                        <TouchableOpacity
                          key={amount}
                          style={styles.suggestionChip}
                          onPress={() => setNewAmount(amount.toString())}
                        >
                          <Text style={styles.suggestionText}>₦{amount.toLocaleString()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: sectionInfo.color }]} 
                    onPress={handleAddItem}
                  >
                    <Text style={styles.saveButtonText}>
                      {modalType === 'main' && '🎯 Add to Savings'}
                      {modalType === 'saving' && '💰 Add Goal'}
                      {modalType === 'expense' && '💸 Add Expense'}
                      {modalType === 'earning' && '💵 Add Earning'}
                    </Text>
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
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  mainSavingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  addButton: {
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',

  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    transform: [{ rotate: '0deg' }],
  },
  progressContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  progressAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  progressGoal: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#f39c12',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollableContent: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    padding: 20,
  },
  contentSection: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '700',
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
  itemsList: {
    gap: 15,
  },
  savingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  savingsName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  savingsProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  savingsAmount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  savingsPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f39c12',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  addToSavingsButton: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToSavingsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCard: {
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
  itemEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  deleteButton: {
    padding: 8,
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
    maxHeight: '70%',
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
    borderWidth: 2,
    borderColor: '#ecf0f1',
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
  quickAmountSection: {
    marginBottom: 20,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#f39c12',
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
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  }, 
  completedSavingsCard: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)', // Light green tint
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  
  savingsNameContainer: {
    flex: 1,
  },
  
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  
  completedText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
    marginLeft: 4,
  },
  
  completedPercentage: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
})