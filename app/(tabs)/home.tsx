import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Modal, TouchableWithoutFeedback, Keyboard, Animated, Dimensions, PanResponder } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/home';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Home() {
  const [tasks, setTasks] = useState([
    { id: 1, mindDump: 'Feeling motivated today! Ready to tackle anything 💪', goal: 'Complete the app design', completed: false },
    { id: 2, mindDump: 'Need to focus more on deep work', goal: 'Read for 30 minutes', completed: false },
    { id: 3, mindDump: 'Coffee tastes extra good this morning ☕', goal: 'Call mom and catch up', completed: false },
    { id: 4, mindDump: 'Watched an inspiring documentary last night', goal: 'Go for a 20-minute walk', completed: false },
    { id: 5, mindDump: 'Feeling a bit overwhelmed with tasks', goal: 'Organize my workspace', completed: false },
    { id: 6, mindDump: 'Had a great conversation with a friend', goal: 'Practice guitar for 15 minutes', completed: false },
    { id: 7, mindDump: 'Weather is perfect today! 🌞', goal: 'Write in journal', completed: false },
    { id: 8, mindDump: 'Learning something new always excites me', goal: 'Cook a healthy dinner', completed: false },
    { id: 9, mindDump: 'Grateful for small moments of peace', goal: 'Meditate for 10 minutes', completed: false },
    { id: 10, mindDump: 'Thinking about future goals and dreams', goal: 'Plan weekend activities', completed: false },
    // Some completed tasks for history
    { id: 11, mindDump: 'Morning energy is the best!', goal: 'Morning workout routine', completed: true, completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 12, mindDump: 'Need to stay hydrated', goal: 'Drink 8 glasses of water', completed: true, completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 13, mindDump: 'Feeling creative today', goal: 'Sketch for 20 minutes', completed: true, completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    { id: 14, mindDump: 'Great morning coffee', goal: 'Plan the day ahead', completed: true, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 15, mindDump: 'Inspired by a good book', goal: 'Take notes on chapter 3', completed: true, completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [mindDump, setMindDump] = useState('');
  const [todayGoal, setTodayGoal] = useState('');
  
  // Tab state - 0 = Tasks, 1 = Tips, 2 = History
  const [activeTab, setActiveTab] = useState(0);
  const tabAnimation = useRef(new Animated.Value(0)).current;

  // Animation values for the expanding circle
  const expansionScale = useRef(new Animated.Value(0)).current;
  const expansionOpacity = useRef(new Animated.Value(0)).current;

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const allTasksCompleted = incompleteTasks.length === 0 && tasks.length > 0;

  // Trigger animation when all tasks are completed
  useEffect(() => {
    if (allTasksCompleted) {
      Animated.parallel([
        Animated.timing(expansionScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(expansionOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        })
      ]).start();
    } else {
      expansionScale.setValue(0);
      expansionOpacity.setValue(0);
    }
  }, [allTasksCompleted]);

  // Tab switching animation
  const switchTab = (tabIndex) => {
    setActiveTab(tabIndex);
    Animated.spring(tabAnimation, {
      toValue: tabIndex,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleAddTask = () => {
    if (mindDump.trim() || todayGoal.trim()) {
      const newTask = {
        id: Date.now(),
        mindDump: mindDump,
        goal: todayGoal,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setMindDump('');
      setTodayGoal('');
      setShowAddModal(false);
      // Switch to tasks tab when adding new task
      if (activeTab !== 0) {
        switchTab(0);
      }
    }
  };

  const markTaskCompleted = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: true, completedAt: new Date() } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return new Date(date).toLocaleDateString();
  };

  const closeModal = () => {
    Keyboard.dismiss();
    setShowAddModal(false);
  };

  // Generate consistent rotation and position for each card based on task ID
  const getCardStyle = (index, total, taskId) => {
    const seed = taskId % 1000;
    const rotation = ((seed * 0.1234) % 1 - 0.5) * 15;
    const translateX = ((seed * 0.5678) % 1 - 0.5) * 25;
    const translateY = ((seed * 0.9012) % 1 - 0.5) * 15;
    const scale = 1 - (index * 0.015);
    const zIndex = total - index;
    
    return {
      transform: [
        { rotate: `${rotation}deg` },
        { translateX },
        { translateY },
        { scale }
      ],
      zIndex,
    };
  };

  const SwipeableCard = ({ task, index, total, onSwipe, onDelete }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [isRemoving, setIsRemoving] = useState(false);

    const cardStyle = getCardStyle(index, total, task.id);

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return !isRemoving && (Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20);
      },
      onPanResponderGrant: () => {
        if (!isRemoving) {
          Animated.spring(scale, {
            toValue: 1.05,
            useNativeDriver: false,
            tension: 150,
            friction: 4,
          }).start();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isRemoving) {
          pan.setValue({ x: gestureState.dx, y: gestureState.dy });
          const swipeOpacity = Math.max(0.3, 1 - Math.abs(gestureState.dx) / (screenWidth * 0.8));
          opacity.setValue(swipeOpacity);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isRemoving) return;
        
        const swipeThreshold = screenWidth * 0.25;
        const velocity = Math.abs(gestureState.vx);
        
        if (Math.abs(gestureState.dx) > swipeThreshold || velocity > 0.5) {
          setIsRemoving(true);
          const direction = gestureState.dx > 0 ? 1 : -1;
          
          Animated.parallel([
            Animated.timing(pan, {
              toValue: { x: direction * screenWidth * 1.2, y: gestureState.dy * 0.5 },
              duration: 250,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 0.7,
              useNativeDriver: false,
              tension: 200,
              friction: 8,
            })
          ]).start(() => {
            setTimeout(() => {
              onSwipe(task.id);
            }, 50);
          });
        } else {
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              tension: 120,
              friction: 8,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: false,
              tension: 150,
              friction: 8,
            })
          ]).start();
        }
      },
    });

    return (
      <Animated.View
        style={[
          styles.swipeableCard,
          cardStyle,
          {
            opacity,
            transform: [
              ...cardStyle.transform,
              { translateX: pan.x },
              { translateY: pan.y },
              { scale }
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.taskHeader}>
          <View style={styles.swipeIndicator}>
            <Text style={styles.swipeText}>👈 Swipe to complete 👉</Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => !isRemoving && onDelete(task.id)}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        {task.mindDump ? (
          <View style={styles.taskSection}>
            <Text style={styles.taskLabel}>💭 Mind:</Text>
            <Text style={styles.taskText}>
              {task.mindDump}
            </Text>
          </View>
        ) : null}
        
        {task.goal ? (
          <View style={styles.taskSection}>
            <Text style={styles.taskLabel}>🎯 Goal:</Text>
            <Text style={styles.taskText}>
              {task.goal}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    );
  };

  // Group completed tasks by date
  const groupTasksByDate = (tasks) => {
    const groups = {};
    tasks.forEach(task => {
      const date = new Date(task.completedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });
    
    return groups;
  };

  const groupedTasks = groupTasksByDate(completedTasks);

  // Calculate completion stats for tips
  const todayCompleted = completedTasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.completedAt);
    return taskDate.toDateString() === today.toDateString();
  }).length;

  const weekCompleted = completedTasks.filter(task => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return new Date(task.completedAt) >= weekAgo;
  }).length;

  // Calculate the size needed to cover the entire screen from center
  const maxDimension = Math.max(screenWidth, screenHeight);
  const circleSize = maxDimension * 2;

  // Tips data
  const tips = [
    {
      icon: '🧠',
      title: 'Mind Dump First',
      description: 'Start by writing down whatever is in your head. This clears mental clutter and helps you focus on what really matters.',
    },
    {
      icon: '🎯',
      title: 'One Clear Goal',
      description: 'Each task should have one specific, actionable goal. "Exercise" becomes "Go for a 20-minute walk".',
    },
    {
      icon: '⏰',
      title: 'Time Boxing',
      description: 'Set a specific time limit for each task. This creates urgency and prevents perfectionism from slowing you down.',
    },
    {
      icon: '🔄',
      title: 'Small Wins Matter',
      description: 'Completing small tasks builds momentum. Each checkmark releases dopamine and motivates you for the next task.',
    },
    {
      icon: '📱',
      title: 'Digital Minimalism',
      description: 'Put your phone in another room while working on tasks. Physical distance is more effective than willpower.',
    },
    {
      icon: '🌅',
      title: 'Morning Momentum',
      description: 'Tackle your most important task first thing in the morning when your willpower is strongest.',
    },
  ];

  return (
    <View style={[styles.container, allTasksCompleted && styles.completedContainer]}>
      <StatusBar barStyle="light-content" backgroundColor={allTasksCompleted ? "#27ae60" : "#6c5ce7"} />
      
      {/* Animated expanding circle overlay */}
      <Animated.View
        style={[
          styles.expandingCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            opacity: expansionOpacity,
            transform: [
              {
                scale: expansionScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              }
            ],
            left: (screenWidth - circleSize) / 2,
            top: (screenHeight - circleSize) / 2,
          }
        ]}
        pointerEvents="none"
      />
      
      <View style={[styles.header, allTasksCompleted && styles.completedHeader]}>
        <Text style={styles.welcomeText}>Daily Focus ✨</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
            onPress={() => switchTab(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
              Tasks ({incompleteTasks.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
            onPress={() => switchTab(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
              Tips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 2 && styles.activeTab]}
            onPress={() => switchTab(2)}
          >
            <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
              History ({completedTasks.length})
            </Text>
          </TouchableOpacity>
          <Animated.View 
            style={[
              styles.tabIndicator,
              {
                transform: [{
                  translateX: tabAnimation.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, screenWidth * 0.33, screenWidth * 0.66],
                  })
                }]
              }
            ]} 
          />
        </View>
      </View>

      {/* Content Container with Smooth Transitions */}
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            {
              transform: [{
                translateX: tabAnimation.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, -screenWidth, -screenWidth * 2],
                })
              }]
            }
          ]}
        >
          {/* Tasks Tab */}
          <View style={styles.tabPanel}>
            <View style={styles.fixedCardStack}>
              {incompleteTasks.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>🎉</Text>
                  <Text style={styles.emptyStateTitle}>All Done!</Text>
                  <Text style={styles.emptyStateSubtitle}>You've completed all your tasks. Great job!</Text>
                </View>
              ) : (
                incompleteTasks.map((task, index) => (
                  <SwipeableCard
                    key={task.id}
                    task={task}
                    index={index}
                    total={incompleteTasks.length}
                    onSwipe={markTaskCompleted}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </View>
          </View>

          {/* Tips Tab */}
          <View style={styles.tabPanel}>
            <ScrollView style={styles.tipsScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{todayCompleted}</Text>
                  <Text style={styles.statLabel}>Today</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{weekCompleted}</Text>
                  <Text style={styles.statLabel}>This Week</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{incompleteTasks.length}</Text>
                  <Text style={styles.statLabel}>Remaining</Text>
                </View>
              </View>
              
              <Text style={styles.tipsTitle}>💡 Productivity Tips</Text>
              
              {tips.map((tip, index) => (
                <View key={index} style={styles.tipCard}>
                  <View style={styles.tipHeader}>
                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                  </View>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              ))}
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>

          {/* History Tab */}
          <View style={styles.tabPanel}>
            <ScrollView style={styles.historyScrollView} showsVerticalScrollIndicator={false}>
              {completedTasks.length === 0 ? (
                <View style={styles.emptyHistoryState}>
                  <Text style={styles.emptyHistoryIcon}>📝</Text>
                  <Text style={styles.emptyHistoryTitle}>No completed tasks yet</Text>
                  <Text style={styles.emptyHistorySubtitle}>Complete some tasks to see your history here</Text>
                </View>
              ) : (
                Object.entries(groupedTasks).map(([dateKey, tasks]) => (
                  <View key={dateKey} style={styles.historyGroup}>
                    <Text style={styles.historyGroupTitle}>{dateKey}</Text>
                    {tasks.map((task, index) => (
                      <View key={task.id} style={styles.historyCard}>
                        <View style={styles.historyCardHeader}>
                          <View style={styles.completedBadge}>
                            <Text style={styles.completedBadgeText}>✓</Text>
                          </View>
                          <Text style={styles.completedTime}>{getTimeAgo(task.completedAt)}</Text>
                        </View>
                        
                        {task.goal && (
                          <View style={styles.historyItem}>
                            <Text style={styles.historyLabel}>🎯</Text>
                            <Text style={styles.historyText}>{task.goal}</Text>
                          </View>
                        )}
                        
                        {task.mindDump && (
                          <View style={styles.historyItem}>
                            <Text style={styles.historyLabel}>💭</Text>
                            <Text style={styles.historyText}>{task.mindDump}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ))
              )}
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>
        </Animated.View>
      </View>

      <TouchableOpacity 
        style={[styles.addButton, allTasksCompleted && styles.completedAddButton]} 
        onPress={() => setShowAddModal(true)}
      >
        <Text style={[styles.addButtonText, allTasksCompleted && styles.completedAddButtonText]}>
          + Add New
        </Text>
      </TouchableOpacity>

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
                
                <Text style={styles.modalTitle}>✨ New Entry</Text>
                
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>💭 What's in your mind?</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Quick brain dump or thoughts..."
                    placeholderTextColor="#bdc3c7"
                    multiline={true}
                    numberOfLines={3}
                    value={mindDump}
                    onChangeText={setMindDump}
                    textAlignVertical="top"
                    autoCorrect={true}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🎯 What do you want to do?</Text>
                  <TextInput
                    style={styles.smallInput}
                    placeholder="Your goal for today..."
                    placeholderTextColor="#bdc3c7"
                    value={todayGoal}
                    onChangeText={setTodayGoal}
                    autoCorrect={true}
                    returnKeyType="done"
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
                    <Text style={styles.saveButtonText}>🚀 Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}