import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // Ensure your Firebase instance is properly initialized
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firebase Firestore
import { useNavigate } from "react-router-dom";

function RegisterForm({ onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);

  // Initialize navigate function
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Initialize Firestore
    const db = getFirestore();

    try {
      // Create user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password);

      let downloadURL = null;

      if (file) {
        // Set up Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${res.user.uid}_${Date.now()}`);

        // Upload file using uploadBytesResumable
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Handle file upload progress and completion
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload failed:", error);
            setError(true);
          },
          async () => {
            try {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at", downloadURL);

              // Update user profile with avatar
              await updateProfile(res.user, {
                displayName: username,
                photoURL: downloadURL || "",
              });

              // Add user data to Firestore with avatar URL
              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: username,
                email,
                photoURL: downloadURL || "", // If there's no avatar, save empty string
                createdAt: new Date().toISOString(),
              });

              alert("User created successfully with avatar uploaded!");
              navigate("/");

              await setDoc(doc(db, "userChats", res.user.uid),{})

            } catch (profileError) {
              console.error("Error updating profile:", profileError);
              setError(true);
            }
          }
        );
      } else {
        
        alert("Please add an avatar.");
      return;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        alert("Email Address Already Exists!!!");
      } else if (errorCode === "auth/invalid-email") {
        alert("Please enter the correct email address.");
      } else if (errorCode === "auth/missing-password") {
        alert("Please enter your password");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="form-box2 register">
      <h2>Registration</h2>
      <form onSubmit={handleRegister}>
        <div className="input-box">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <span className="material-symbols-outlined icon-1">person</span>
          <label>Username</label>
        </div>
        <div className="input-box">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span className="material-symbols-outlined icon-1">mail</span>
          <label>Email</label>
        </div>
        <div className="input-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="material-symbols-outlined icon-1">key</span>
          <label>Password</label>
        </div>
        <div className="avatar">
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}required
          />
          <label htmlFor="file">
            <img src="/images/add image.png" alt="" />
            <span>Add your avatar</span>
            {!file && <p style={{ color: "red", fontSize: "12px" }}>Avatar is required</p>}  {/* Show error message if no file is selected */}
          </label>
        </div>

        {/* Terms and conditions checkbox */}
        <div className="remember-forgot">
          <label>
            <input type="checkbox" required /> I agree to the terms & conditions
          </label>
        </div>

        <button type="submit" id="submitData" name="submitData" className="btn">
          Register
        </button>
      </form>
      <div className="login-register">
        <p>
          Already have an account?{" "}
          <a href="#" onClick={onSwitchToLogin}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
