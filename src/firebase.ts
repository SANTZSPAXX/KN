import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Allow environment variable overrides for custom production hosting outside of AI Studio (e.g., Cloudflare Pages, Vercel)
const metaEnv = (import.meta as any).env || {};

const config = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId
};

const app = initializeApp(config);

const dbId = metaEnv.VITE_FIREBASE_DATABASE_ID || (firebaseConfig as any).firestoreDatabaseId;

// If database ID is empty, "(default)" or unspecified, default to standard initialization
export const db = dbId && dbId !== "(default)" 
  ? getFirestore(app, dbId) 
  : getFirestore(app);

export const auth = getAuth(app);

