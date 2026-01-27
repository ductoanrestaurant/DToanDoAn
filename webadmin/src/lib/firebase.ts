// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBERkUXJC2Ulrt5wOSq816u3ctf-UMlCro",
    authDomain: "ductoanchat.firebaseapp.com",
    databaseURL: "https://ductoanchat-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ductoanchat",
    storageBucket: "ductoanchat.appspot.com", // Sửa lại đuôi .appspot.com
    messagingSenderId: "578331888143",
    appId: "1:578331888143:web:f738fc7b16fb891c8af17a",
    measurementId: "G-L76HKG0M79"
};

// Initialize Firebase
// Sửa lại để tránh lỗi khởi tạo lại app khi hot-reload ở môi trường dev
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export firestore instance
const db = getFirestore(app);

// Export analytics if you need it
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, analytics };
