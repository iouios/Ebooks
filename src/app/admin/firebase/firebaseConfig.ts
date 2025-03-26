import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZ3apDRoROVtTfNfvenLMjHoGEVKcAzgo",
  authDomain: "ebook-16a3d.firebaseapp.com",
  projectId: "ebook-16a3d",
  storageBucket: "ebook-16a3d.firebasestorage.app",
  messagingSenderId: "285550856611",
  appId: "1:285550856611:web:41b2c05eb7e750aa807216",
  measurementId: "G-NWP9S87MBX",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
