import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase-config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
      });
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error; // Optional: rethrow to handle elsewhere
    }
  }

  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password).catch((error) => {
      console.error('Error signing in:', error.message);
      throw error; // Optional: rethrow to handle elsewhere
    });
  }

  function signOutUser() {
    return signOut(auth).catch((error) => {
      console.error('Error signing out:', error.message);
      throw error; // Optional: rethrow to handle elsewhere
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ ...user, ...docSnap.data() });
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signUp,
    signIn,
    signOut: signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
