// Import the functions you need from the SDKs you need


import { initializeApp } from "firebase/app";



import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc,getDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA9sI868DV-mvAivGpFPldu3yIzflkM6e4",
  authDomain: "budgetbuddy-a66d2.firebaseapp.com",
  projectId: "budgetbuddy-a66d2",
  storageBucket: "budgetbuddy-a66d2.appspot.com",
  messagingSenderId: "221762885801",
  appId: "1:221762885801:web:f688e030178da1cc1b31b8",
  measurementId: "G-8J95MF5BFQ"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
//export default {app,db}
// export   {app, db, auth, provider, doc, setDoc,getDoc };