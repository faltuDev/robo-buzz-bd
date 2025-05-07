import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { User } from '../types';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from database
        try {
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const userSnapshot = await get(userRef);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL || userData.photoURL,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone
            });
          } else {
            // If user doesn't exist in DB but exists in auth
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL
          });
        }
      } else {
        setCurrentUser(null);
        Cookies.remove('auth_token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email
  async function signUp(email: string, password: string, userData: Partial<User>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      // Save additional user data to database
      await set(ref(database, `users/${firebaseUser.uid}`), {
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        photoURL: userData.photoURL,
        createdAt: new Date().toISOString()
      });
      
      // Sign out the user until email is verified
      await signOut(auth);
      
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  }

  // Login with email
  async function loginWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        toast.error('Please verify your email before logging in');
        return;
      }
      
      // Set auth cookie
      Cookies.set('auth_token', await userCredential.user.getIdToken(), { expires: 7 });
      
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Set auth cookie
      Cookies.set('auth_token', await user.getIdToken(), { expires: 7 });
      
      // Check if user exists in database
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // First time Google login, save user to database
        await set(userRef, {
          email: user.email,
          firstName: user.displayName?.split(' ')[0],
          lastName: user.displayName?.split(' ').slice(1).join(' '),
          photoURL: user.photoURL,
          createdAt: new Date().toISOString()
        });
      }
      
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  }

  // Update user profile
  async function updateUserProfile(data: Partial<User>) {
    try {
      if (!currentUser?.uid) throw new Error('No user logged in');
      
      const userRef = ref(database, `users/${currentUser.uid}`);
      await update(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
      Cookies.remove('auth_token');
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
      throw error;
    }
  }

  const value = {
    currentUser,
    loading,
    signUp,
    loginWithEmail,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}