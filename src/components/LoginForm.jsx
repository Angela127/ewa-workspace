import React, { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';  
import { auth } from '../firebase';  
import { sendPasswordResetEmail } from 'firebase/auth';  // Import Firebase reset password function

function LoginForm({ onSwitchToRegister, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password); // Firebase signIn function
      alert('User logged in successfully');
      setIsAuthenticated(true); // Update parent component when logged in
    } catch (error) {
      const errorCode = error.code;
      // Handle errors based on error code
      if (errorCode === 'auth/invalid-email') {
        alert('Invalid email address format. Please enter a valid email.');
      } else if (errorCode === 'auth/invalid-credential') {
        alert('Invalid email or password.');
      } else {
        alert('Account does not exist.');
      }
    }
  }
      

  // Handle forgot password
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address to reset the password.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("A password reset link has been sent to your email.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/invalid-email') {
          alert("Invalid email format. Please enter a valid email.");
        } else {
          alert("Error: " + errorMessage);
        }
      });
  };

  return (
    <div className="form-box1 login">
      <h2>Welcome</h2>
      <form onSubmit={handleLogin}>
        <div className="input-box">
          <span className="material-symbols-outlined icon-1">mail</span>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label>Email</label>
        </div>

        <div className="input-box">
          <span className="material-symbols-outlined icon-1">key</span>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label>Password</label>
        </div>

        <div className="remember-forgot">
  <label>
    <input type="checkbox" id="rememberMe" /> Remember me
  </label>
  <label
    id="forgotpasslabel"
    style={{ cursor: "pointer" }}
  >
    <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
  </label>
</div>


        <button type="submit" className="btn">Login</button>
      </form>

      <div className="login-register">
        <p>
          Don't have an account?{" "}
          <a href="#" onClick={onSwitchToRegister}>Register now!</a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
