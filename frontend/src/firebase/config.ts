// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// All values must be provided via environment variables
const getRequiredEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env file.`
    );
  }
  return value;
};

const firebaseConfig = {
  apiKey: getRequiredEnvVar("VITE_FIREBASE_API_KEY"),
  authDomain: getRequiredEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
  databaseURL: getRequiredEnvVar("VITE_FIREBASE_DATABASE_URL"),
  projectId: getRequiredEnvVar("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getRequiredEnvVar("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getRequiredEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getRequiredEnvVar("VITE_FIREBASE_APP_ID"),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
// Try different model names if one doesn't work
export const aiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

// Remove the test function that was causing the error
// async function run() {
//   const prompt = "Write a story about a magic backpack.";
//   const result = await aiModel.generateContent(prompt);
//   const response = result.response;
//   const text = response.text();
//   console.log(text);
// }
// run();
