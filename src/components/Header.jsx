import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import LoginRegisterForm from "./LoginRegisterForm";

function Header() {
  const [isFormVisible, setFormVisible] = useState(false); // Controls form visibility
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication state

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set authenticated state
      if (user) setFormVisible(false); // Close the form if the user logs in
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLoginClick = () => setFormVisible(true); // Show form
  const closeForm = () => setFormVisible(false); // Hide form

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully");
      })
      .catch((error) => console.error("Error logging out:", error.message));
  };

  return (
    <header>
      <h1 className="logo">Ewa Workspace</h1>
      <nav className="navigation">
        <Link to="/">Home</Link>
        <Link to="/chats">Chats</Link>
        <Link to="moments">Moments</Link>
        <Link to="/virtual-workspace">Virtual Workspace</Link>
        <Link to="/profile">Profile</Link>

        {/* Toggle Login and Logout buttons based on authentication status */}
        {isAuthenticated ? (
          <button className="btnLogout-popup" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <button className="btnLogin-popup" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </nav>

      {/* Render login/register form only when isFormVisible is true */}
      {isFormVisible && !isAuthenticated && (
        <div className="form-popup-overlay">
          <LoginRegisterForm closeForm={closeForm} />
        </div>
      )}
    </header>
  );
}

export default Header;
