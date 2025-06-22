import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import React, { useState, useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

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

interface DailyData {
  day: string;
  date: number;
  earnings: number;
  expenses: number;
  savings: number;
}

interface WeekData {
  weekNumber: number;
  weekRange: string;
  days: DailyData[];
}

export default function WeeklyFinance() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<'earnings' | 'expenses' | 'savings'>('earnings');
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const sections = [
    { key: 'earnings', title: 'Earnings', icon: '💰', color: '#4ecdc4' },
    { key: 'expenses', title: 'Expenses', icon: '💸', color: '#ff6b6b' },
    { key: 'savings', title: 'Savings', icon: '💵', color: '#f39c12' }
  ];

  // Load data from AsyncStorage
  const loadData = async () => {
    try {
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
      console.log('WeeklyFinance: Loaded savings goals:', loadedGoals);

      // Load expenses and earnings from @tasks
      const storedTasks = await AsyncStorage.getItem('@tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const expenseTasks = tasks.filter((t: any) => t.category === 'money_expense');
      const earningTasks = tasks.filter((t: any) => t.category === 'money_earning');

      setExpenses(
        expenseTasks.map((t: any) => ({
          id: t.id,
          description: t.goal,
          amount: t.amount || 0,
          date: new Date(t.createdAt),
          category: '💳',
        }))
      );
      setEarnings(
        earningTasks.map((t: any) => ({
          id: t.id,
          description: t.goal,
          amount: t.amount || 0,
          date: new Date(t.createdAt),
          category: '💰',
        }))
      );
      console.log('WeeklyFinance: Loaded expenses:', expenseTasks);
      console.log('WeeklyFinance: Loaded earnings:', earningTasks);
    } catch (error) {
      console.error('WeeklyFinance: Error loading data:', error);
      setSavingsGoals([]);
      setExpenses([]);
      setEarnings([]);
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

  // Compute weekly data
  const weeklyData: WeekData[] = useMemo(() => {
    // Filter data for the selected month and year
    const filteredSavings = savingsGoals.filter(item => {
      const date = new Date(item.createdAt);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
    const filteredExpenses = expenses.filter(item => {
      const date = new Date(item.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
    const filteredEarnings = earnings.filter(item => {
      const date = new Date(item.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    // Get the first and last day of the selected month
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const weeks: WeekData[] = [];

    // Iterate through weeks
    let currentDate = new Date(firstDay);
    let weekNumber = 1;

    while (currentDate <= lastDay) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Adjust week end if it exceeds the month
      const actualWeekEnd = weekEnd > lastDay ? lastDay : weekEnd;

      const days: DailyData[] = [];
      for (let d = new Date(weekStart); d <= actualWeekEnd; d.setDate(d.getDate() + 1)) {
        const dayStr = d.toLocaleString('en-US', { weekday: 'short' });
        const dateNum = d.getDate();

        // Calculate daily totals in NGN
        const dailyEarnings = filteredEarnings
          .filter(e => new Date(e.date).toDateString() === d.toDateString())
          .reduce((sum, e) => sum + e.amount, 0);

        const dailyExpenses = filteredExpenses
          .filter(e => new Date(e.date).toDateString() === d.toDateString())
          .reduce((sum, e) => sum + e.amount, 0);

        const dailySavings = filteredSavings
          .filter(s => new Date(s.createdAt).toDateString() === d.toDateString())
          .reduce((sum, s) => sum + s.currentAmount, 0);

        days.push({
          day: dayStr,
          date: dateNum,
          earnings: Math.round(dailyEarnings),
          expenses: Math.round(dailyExpenses),
          savings: Math.round(dailySavings),
        });
      }

      // Only add weeks with at least one day
      if (days.length > 0) {
        weeks.push({
          weekNumber,
          weekRange: `${weekStart.toLocaleString('en-US', { month: 'short' })} ${weekStart.getDate()} - ${actualWeekEnd.toLocaleString('en-US', { month: 'short' })} ${actualWeekEnd.getDate()}`,
          days,
        });
        weekNumber++;
      }

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  }, [savingsGoals, expenses, earnings, selectedMonth, selectedYear]);

  // Reset currentWeekIndex if it exceeds available weeks
  const validWeekIndex = Math.min(currentWeekIndex, weeklyData.length - 1);
  const currentWeek = weeklyData[validWeekIndex] || { weekNumber: 1, weekRange: '', days: [] };
  const activeColor = sections.find(s => s.key === activeSection)?.color || '#4ecdc4';

  // Get max value for chart scaling
  const getMaxValue = () => {
    if (weeklyData.length === 0) return 1000; // Default scale for NGN
    const allValues = weeklyData.flatMap(week => 
      week.days.flatMap(day => [day.earnings, day.expenses, Math.abs(day.savings)])
    );
    return Math.max(...allValues, 1000); // Ensure minimum scale
  };

  // Month selector component
  const MonthSelector = () => (
    <View style={styles.monthSelector}>
      <TouchableOpacity
        style={styles.monthArrow}
        onPress={() => {
          if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
            setCurrentWeekIndex(0);
          } else {
            setSelectedMonth(selectedMonth - 1);
            setCurrentWeekIndex(0);
          }
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#ffffff" />
      </TouchableOpacity>
      
      <View style={styles.monthInfo}>
        <Text style={styles.monthText}>{months[selectedMonth]} {selectedYear}</Text>
        <Text style={styles.monthSubtext}>{weeklyData.length} weeks</Text>
      </View>
      
      <TouchableOpacity
        style={styles.monthArrow}
        onPress={() => {
          if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
            setCurrentWeekIndex(0);
          } else {
            setSelectedMonth(selectedMonth + 1);
            setCurrentWeekIndex(0);
          }
        }}
      >
        <Ionicons name="chevron-forward" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  // Section selector
  const SectionSelector = () => (
    <View style={styles.sectionSelector}>
      {sections.map((section) => (
        <TouchableOpacity
          key={section.key}
          style={[
            styles.sectionButton,
            activeSection === section.key && [styles.sectionButtonActive, { backgroundColor: section.color }]
          ]}
          onPress={() => setActiveSection(section.key as any)}
        >
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <Text style={[
            styles.sectionTitle,
            activeSection === section.key && styles.sectionTitleActive
          ]}>
            {section.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Daily bar chart component
  const DailyChart = ({ weekData }: { weekData: WeekData }) => {
    const maxValue = getMaxValue();
    const chartHeight = 200;

    if (weekData.days.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>No Data Available</Text>
          <Text style={styles.emptyChartText}>No {activeSection} recorded for this week.</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          Week {weekData.weekNumber} • {weekData.weekRange}
        </Text>
        
        <View style={styles.chart}>
          <View style={styles.yAxis}>
            {[4, 3, 2, 1, 0].map(i => (
              <Text key={i} style={styles.yAxisLabel}>
                {formatCurrency((maxValue * i) / 4)}
              </Text>
            ))}
          </View>
          
          <View style={styles.barsContainer}>
            {weekData.days.map((day, index) => {
              const value = day[activeSection];
              const isNegative = value < 0;
              const barHeight = Math.max(10, (Math.abs(value) / maxValue) * chartHeight);
              
              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: barHeight, 
                          backgroundColor: isNegative ? '#ff4757' : activeColor,
                          opacity: isNegative ? 0.8 : 1
                        }
                      ]}
                    >
                      <Text style={styles.barValue}>
                        {isNegative ? '-' : ''}{formatCurrency(Math.abs(value))}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.barLabelContainer}>
                    <Text style={styles.dayLabel}>{day.day}</Text>
                    <Text style={styles.dateLabel}>{day.date}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  // Week navigation
  const WeekNavigation = () => (
    <View style={styles.weekNavigation}>
      <TouchableOpacity
        style={[styles.weekArrow, currentWeekIndex === 0 && styles.weekArrowDisabled]}
        onPress={() => setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1))}
        disabled={currentWeekIndex === 0}
      >
        <Ionicons name="chevron-back" size={20} color={currentWeekIndex === 0 ? "#666" : "#ffffff"} />
      </TouchableOpacity>
      
      <View style={styles.weekIndicators}>
        {weeklyData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.weekDot,
              index === currentWeekIndex && styles.weekDotActive
            ]}
            onPress={() => setCurrentWeekIndex(index)}
          />
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.weekArrow, currentWeekIndex === weeklyData.length - 1 && styles.weekArrowDisabled]}
        onPress={() => setCurrentWeekIndex(Math.min(weeklyData.length - 1, currentWeekIndex + 1))}
        disabled={currentWeekIndex === weeklyData.length - 1}
      >
        <Ionicons name="chevron-forward" size={20} color={currentWeekIndex === weeklyData.length - 1 ? "#666" : "#ffffff"} />
      </TouchableOpacity>
    </View>
  );

  // Weekly summary
  const WeeklySummary = () => {
    if (currentWeek.days.length === 0) {
      return (
        <View style={[styles.summaryContainer, { borderLeftColor: activeColor }]}>
          <Text style={styles.summaryTitle}>
            {sections.find(s => s.key === activeSection)?.icon} Week {currentWeek.weekNumber} Summary
          </Text>
          <Text style={styles.emptySummaryText}>No data available for this week.</Text>
        </View>
      );
    }

    const weekTotal = currentWeek.days.reduce((sum, day) => sum + day[activeSection], 0);
    const avgDaily = weekTotal / currentWeek.days.length;
    const bestDay = currentWeek.days.reduce((best, day) => 
      day[activeSection] > best[activeSection] ? day : best
    );
    const worstDay = currentWeek.days.reduce((worst, day) => 
      day[activeSection] < worst[activeSection] ? day : worst
    );

    return (
      <View style={[styles.summaryContainer, { borderLeftColor: activeColor }]}>
        <Text style={styles.summaryTitle}>
          {sections.find(s => s.key === activeSection)?.icon} Week {currentWeek.weekNumber} Summary
        </Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={[styles.summaryValue, { color: activeColor }]}>
              {formatCurrency(Math.abs(weekTotal))}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Daily Avg</Text>
            <Text style={[styles.summaryValue, { color: activeColor }]}>
              {formatCurrency(Math.abs(avgDaily))}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Best Day</Text>
            <Text style={styles.summarySub}>{bestDay.day} {bestDay.date}</Text>
            <Text style={[styles.summaryValue, { color: activeColor }]}>
              {formatCurrency(bestDay[activeSection])}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Worst Day</Text>
            <Text style={styles.summarySub}>{worstDay.day} {worstDay.date}</Text>
            <Text style={[styles.summaryValue, { color: activeColor }]}>
              {formatCurrency(worstDay[activeSection])}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Daily Finance 📊</Text>
        <Text style={styles.dateText}>Track your daily financial patterns</Text>
      </View>

      <ScrollView
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MonthSelector />
        <SectionSelector />
        <WeekNavigation />
        <DailyChart weekData={currentWeek} />
        <WeeklySummary />
        
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
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  monthArrow: {
    padding: 8,
  },
  monthInfo: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  monthSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
    marginTop: 4,
  },
  sectionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  sectionButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bdc3c7',
  },
  sectionTitleActive: {
    color: '#ffffff',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weekArrow: {
    padding: 8,
  },
  weekArrowDisabled: {
    opacity: 0.5,
  },
  weekIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 4,
  },
  weekDotActive: {
    backgroundColor: '#ffffff',
    width: 12,
    height: 12,
  },
  chartContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    marginTop: 20,
  },
  chart: {
    flexDirection: 'row',
    height: 240,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 10,
    marginTop: 20,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: screenWidth / 10,
  },
  bar: {
    width: screenWidth / 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  barValue: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  barLabelContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  emptySummaryText: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#bdc3c7',
    marginBottom: 2,
  },
  summarySub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});