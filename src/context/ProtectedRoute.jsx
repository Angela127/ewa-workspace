import React, { useState, useEffect, createContext, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"; // Import your Firebase auth instance
import { onAuthStateChanged } from "firebase/auth";

// Create AuthContext
const AuthContext = createContext();

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth); // React Firebase Hook for auth state
  const [currentUser, setCurrentUser] = useState(null); // Local state to track current user
  const [showAlert, setShowAlert] = useState(false); // Flag to prevent multiple alerts

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Sync local state with Firebase auth state
    });

    return () => unsub(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    if (!loading && !user && !showAlert) {
      setShowAlert(true); // Show the alert only once
      alert("You must be logged in to access this page.");
    }
  }, [loading, user, showAlert]);

  if (loading) {
    return <div>Loading...</div>; // Optional: Replace with a spinner or custom loader
  }

  if (!user) {
    return <Navigate to="/" replace />; // Redirect unauthenticated users to home page
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children} {/* Render protected content if authenticated */}
    </AuthContext.Provider>
  );
};

export default ProtectedRoute;
