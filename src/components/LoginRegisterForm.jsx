import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function LoginRegisterForm({ closeForm }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage login state

  const switchToRegister = () => setIsRegistering(true);
  const switchToLogin = () => setIsRegistering(false);

  return (
    <div className="wrapper active">
      {!isAuthenticated ? (
        !isRegistering ? (
          <LoginForm onSwitchToRegister={switchToRegister} setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )
      ) : (
        <div className="logged-in">You are logged in!</div>
      )}
      <button className="icon-close" onClick={closeForm}>X</button>
    </div>
  );
}

export default LoginRegisterForm;
