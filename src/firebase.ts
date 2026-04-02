import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDiRIJkvrpf6kXKuy2R20ElaFkfcByS7Ko",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taskrival.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taskrival",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taskrival.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1060083062610",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1060083062610:web:5f841940c3841f91ad8c8b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8L9H66ZBXK"
};

// Only initialize if we have a valid-looking API key
const isValidApiKey = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey.length > 20 && 
                      !firebaseConfig.apiKey.includes("demo") &&
                      !firebaseConfig.apiKey.includes("TODO") &&
                      !firebaseConfig.apiKey.includes("your");

const app = isValidApiKey ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;

export const isFirebaseConfigured = !!app;
