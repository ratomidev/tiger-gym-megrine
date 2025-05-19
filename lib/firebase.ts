// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiA9O8jyl3-y6Ggwgkk5LqaKYfS4LL6K8",
  authDomain: "ryx-project.firebaseapp.com",
  projectId: "ryx-project",
  storageBucket: "ryx-project.firebasestorage.app",
  messagingSenderId: "767642620605",
  appId: "1:767642620605:web:a3d9799729d6fc5bceddd4",
  measurementId: "G-QT7SLC6HV9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { auth, db };
