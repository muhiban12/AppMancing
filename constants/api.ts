// constants/api.ts
import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000',        // iOS Simulator
  android: 'http://10.0.2.2:3000',     // Android Emulator
  default: 'http://192.168.1.2:3000',  // Device fisik (IP kamu)
});

export const API_TIMEOUT = 15000;