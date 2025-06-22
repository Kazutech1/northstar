import { Stack } from 'expo-router';
import { FinanceProvider } from './FinanceContext';

export default function LongLayout() {
  return (
    <FinanceProvider>
      <Stack>
        <Stack.Screen name="money" options={{ headerShown: false }} />
        <Stack.Screen name="summary" options={{ headerShown: false }} />
        <Stack.Screen name="health" options={{ headerShown: false }} />
        <Stack.Screen name="mind" options={{ headerShown: false }} />
        <Stack.Screen name="relationships" options={{ headerShown: false }} />
        <Stack.Screen name="legacy" options={{ headerShown: false }} />
        <Stack.Screen name="career" options={{ headerShown: false }} />




      </Stack>
    </FinanceProvider>
  );
}