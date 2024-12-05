import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Correct import for getStorage
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDV4RgEHDH-JC_guGNm_tft4z5eD2PumIE",
  authDomain: "ewa-authentication-53d50.firebaseapp.com",
  projectId: "ewa-authentication-53d50",
  storageBucket: "ewa-authentication-53d50.firebasestorage.app",// Ensure this matches your Firebase project
  messagingSenderId: "926599817950",
  appId: "1:926599817950:web:d106da9e8093ca9583b04f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize Firebase Storage
export const database = getDatabase(app);
