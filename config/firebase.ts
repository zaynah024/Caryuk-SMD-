import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhm1fxQyjmRWwCa1bBqJJHNdtDG26quYI",
  authDomain: "caryuk-23c3d.firebaseapp.com",
  projectId: "caryuk-23c3d",
  storageBucket: "caryuk-23c3d.firebasestorage.app",
  messagingSenderId: "607528532648",
  appId: "1:607528532648:web:216a05a3a3ca611e61a09d",
  measurementId: "G-R2HJWEWN3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with platform-specific persistence
const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? browserLocalPersistence 
    : getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
