// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjgircs1OZfvCnvo2GNA3y2-UYRcy-W4k",
  authDomain: "vizy-12155.firebaseapp.com",
  databaseURL:
    "https://vizy-12155-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vizy-12155",
  storageBucket: "vizy-12155.firebasestorage.app",
  messagingSenderId: "207196912841",
  appId: "1:207196912841:web:005f743a35c5149d882118",
  measurementId: "G-Q1JJF9C716",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Authentication and get a reference to the service
export const auth = getAuth(app);
 