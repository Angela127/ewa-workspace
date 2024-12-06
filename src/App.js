import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthContextProvider, AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import MainPage from "./pages/Mainpage";
import Chats from "./pages/Chatpage";
import Moments from "./pages/Moments";
import VirtualWorkspace from "./pages/VirtualWorkspace";
import Profile from "./pages/Profile";
import ProtectedRoute from "./context/ProtectedRoute";
import RiveAvatarComponent from "./components-virtual/RiveAvatarComponent";
import { AvatarStateProvider } from "./context/avatarState";

function AppContent() {
  const location = useLocation(); 

  // Dynamic body styles based on route
  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.minHeight = "300vh"; // Main page body height
    } else {
      document.body.style.minHeight = "100vh"; 
    }
  }, [location]);

  return (
    <>
      <Header />
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />

          {/* Protected Routes */}
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/moments"
            element={
              <ProtectedRoute>
                <Moments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/virtual-workspace"
            element={
              <ProtectedRoute>
                <AvatarStateProvider>
                  <VirtualWorkspace />
                  <RiveAvatarComponent />
                </AvatarStateProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<MainPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
