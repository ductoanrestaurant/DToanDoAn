import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBERkUXJC2Ulrt5wOSq816u3ctf-UMlCro",
    authDomain: "ductoanchat.firebaseapp.com",
    databaseURL: "https://ductoanchat-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ductoanchat",
    storageBucket: "ductoanchat.appspot.com",
    messagingSenderId: "578331888143",
    appId: "1:578331888143:web:f738fc7b16fb891c8af17a",
    measurementId: "G-L76HKG0M79"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export firestore instance
const db = getFirestore(app);

export { db };
