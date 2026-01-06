import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        {/* Tambahkan ini */}
        <Stack.Screen 
          name="admindashboard" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="event-approval" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="all-wild-spots" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="add-wild-spot" 
          options={{ headerShown: false,
          presentation: 'modal' }} 
        />
        <Stack.Screen 
          name="edit-wild-spot" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="competition-poster" 
          options={{ headerShown: false,
          presentation: 'modal' }} 
        />
        <Stack.Screen 
          name="laporan" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="owner-approval" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="owner-detail" 
          options={{ headerShown: false,
          presentation: 'modal' }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}