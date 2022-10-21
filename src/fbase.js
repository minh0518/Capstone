import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyD4fwSdrym86WOnhXevclcNLuQ6F50H2k0",
  authDomain: "movieapp-bdcca.firebaseapp.com",
  projectId: "movieapp-bdcca",
  storageBucket: "movieapp-bdcca.appspot.com",
  messagingSenderId: "180215813000",
  appId: "1:180215813000:web:dde5c8c8ae1c6b8fa4203d"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
export const authService=getAuth(firebaseApp)
export const dbService=getFirestore(firebaseApp)
export const storageService=getStorage(firebaseApp)