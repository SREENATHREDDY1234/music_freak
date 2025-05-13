import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // For Realtime DatabaseOR for Firestore:
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBZEbGC-xSk1S1QL8iTzzNPD4g2QRv3XtE",
    authDomain: "music-freak-8f60d.firebaseapp.com",
    projectId: "music-freak-8f60d",
    storageBucket: "music-freak-8f60d.firebasestorage.app",
    messagingSenderId: "175795053458",
    appId: "1:175795053458:web:b56df62539aba9f641d74b",
    measurementId: "G-98Y7FDMN5F"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app); // For Realtime Database OR for Firestore:
const db = getFirestore(app);


export { auth, googleProvider,database };