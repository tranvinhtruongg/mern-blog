// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-872e3.firebaseapp.com",
  projectId: "mern-blog-872e3",
  storageBucket: "mern-blog-872e3.appspot.com",
  messagingSenderId: "1055101951820",
  appId: "1:1055101951820:web:e7abe9369ec999fd3f39e9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);