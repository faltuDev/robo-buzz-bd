import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD6NFyBzFRLB4jKkUgAnO6SF9sJ2CKHTOQ",
  authDomain: "robo-buzz-bd.firebaseapp.com",
  projectId: "robo-buzz-bd",
  storageBucket: "robo-buzz-bd.firebasestorage.app",
  messagingSenderId: "563055810596",
  appId: "1:563055810596:web:0cf1be41d7e2fbd018a0b1",
  measurementId: "G-ZQP79YDCXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;