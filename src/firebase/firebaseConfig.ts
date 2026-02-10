import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  // Use indexed access or check alternate exports if lint persists
} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Robust Auth Singleton with Persistence - Ensure initializeAuth is called correctly
const authInstance = (() => {
  const existingApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  // Important: initializeAuth must be called BEFORE getAuth to set persistence
  try {
    return initializeAuth(existingApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } catch (e) {
    // If already initialized (common during hot reload), return existing auth
    return getAuth(existingApp);
  }
})();

export const auth = authInstance;
export const db = getFirestore(app);

export default app;
