import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Active Firebase Production Credentials
const firebaseConfig = {
  apiKey: "AIzaSyCsTNQJ0suqYKeiNeMifhYkCV2F4MoauAQ",
  authDomain: "hostelsync-9d84e.firebaseapp.com",
  projectId: "hostelsync-9d84e",
  storageBucket: "hostelsync-9d84e.firebasestorage.app",
  messagingSenderId: "999663170120",
  appId: "1:999663170120:web:7ca7b271768136b2e75e7d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
