// constants/api.ts
import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',        // ✅ Tambah /api
  android: 'http://10.0.2.2:3000/api',     // ✅ Tambah /api
  default: 'http://192.168.1.2:3000/api',  // ✅ Tambah /api
});

export const API_TIMEOUT = 15000;