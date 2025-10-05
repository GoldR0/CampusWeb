// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmHfF_rxekXqHCWPGrCXElP4zxQD_A1S0",
  authDomain: "campusweb-6cd91.firebaseapp.com",
  projectId: "campusweb-6cd91",
  storageBucket: "campusweb-6cd91.firebasestorage.app",
  messagingSenderId: "738008487160",
  appId: "1:738008487160:web:a1af0d87eee2177200970d",
  measurementId: "G-YG8DR4VE22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);