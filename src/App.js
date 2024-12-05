import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider, AuthContext } from "./context/AuthContext"; // Import the provider here
import Header from "./components/Header";
import MainPage from "./pages/Mainpage";
import Chats from "./pages/Chatpage";
import Moments from "./pages/Moments";
import VirtualWorkspace from "./pages/VirtualWorkspace";
import Profile from "./pages/Profile";
import ProtectedRoute from "./context/ProtectedRoute";
import RiveAvatarComponent from "./components-virtual/RiveAvatarComponent";
import { AvatarStateProvider } from "./context/avatarState";  //Make sure the RiveAvatarContext is imported

function App() {
  const { currentUser } = useContext(AuthContext); // Get currentUser from AuthContext

  return (
    <AuthContextProvider>
      <Router>
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
      </Router>
    </AuthContextProvider>
  );
}

export default App;
