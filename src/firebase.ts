// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvNfV-2wZelRgAWnOegMPD-J_pZYQv3uQ",
  authDomain: "driveproject-1fae1.firebaseapp.com",
  projectId: "driveproject-1fae1",
  storageBucket: "driveproject-1fae1.firebasestorage.app",
  messagingSenderId: "729708000732",
  appId: "1:729708000732:web:0f011ba68a3ceebbb64b19",
  measurementId: "G-DTMQKYZ1XW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const googleprovider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleprovider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-in error:", error);
    return null;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
  }
};
