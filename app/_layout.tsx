import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Use native stack for smooth iOS-like animations
        presentation: 'card',
        animationTypeForReplace: 'push',
        animation: 'default', // Uses native platform animations
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    />
  );
}