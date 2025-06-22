import React, { createContext, useState, useContext } from 'react';

interface SavingsGoal {
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  createdAt: Date;
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

interface FinanceContextType {
  savingsGoals: SavingsGoal[];
  expenses: Expense[];
  earnings: Earning[];
  setSavingsGoals: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setEarnings: React.Dispatch<React.SetStateAction<Earning[]>>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { id: 1, name: 'Emergency Fund', currentAmount: 150000, targetAmount: 300000, createdAt: new Date('2024-12-01') },
    { id: 2, name: 'New Car', currentAmount: 100000, targetAmount: 500000, createdAt: new Date('2024-12-02') },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, description: 'Groceries', amount: 25000, date: new Date('2024-12-02'), category: '🛒' },
    { id: 2, description: 'Transportation', amount: 15000, date: new Date('2024-12-03'), category: '🚗' },
    { id: 3, description: 'Utilities', amount: 30000, date: new Date('2024-12-04'), category: '💡' },
  ]);

  const [earnings, setEarnings] = useState<Earning[]>([
    { id: 1, description: 'Salary', amount: 200000, date: new Date('2024-12-02'), category: '💼' },
    { id: 2, description: 'Freelance', amount: 50000, date: new Date('2024-12-03'), category: '💻' },
    { id: 3, description: 'Investment', amount: 25000, date: new Date('2024-12-04'), category: '📈' },
  ]);

  return (
    <FinanceContext.Provider
      value={{
        savingsGoals,
        expenses,
        earnings,
        setSavingsGoals,
        setExpenses,
        setEarnings,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};