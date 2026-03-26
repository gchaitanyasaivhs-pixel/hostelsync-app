import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          } else {
            setRole('student');
          }
        } catch (e) {
          console.error("Error fetching user role", e);
          setRole('student');
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (email, password, name, selectedRole = 'student') => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      email,
      displayName: name,
      role: selectedRole,
      createdAt: new Date()
    });
    return res;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, role, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
