import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="orderTracking/[id]" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}