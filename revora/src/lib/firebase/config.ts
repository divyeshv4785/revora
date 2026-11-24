// Firebase Client SDK Configuration for REVORA
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key_here'
  );
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== 'undefined' || isFirebaseConfigured()) {
  try {
    if (isFirebaseConfigured()) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    } else {
      // Fallback placeholder during build or before .env.local configuration
      const fallbackConfig = {
        apiKey: 'demo-api-key',
        authDomain: 'revora-preview.firebaseapp.com',
        projectId: 'revora-preview',
        storageBucket: 'revora-preview.appspot.com',
        messagingSenderId: '123456789',
        appId: '1:123456789:web:abcdef',
      };
      app = getApps().length > 0 ? getApp() : initializeApp(fallbackConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    }
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
  }
}

export { app, auth, db, storage };
