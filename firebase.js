import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE_pKOsSBq098GXhYNMWSfTreuF0t8q7c",
  authDomain: "todo-with-firebase-2faf8.firebaseapp.com",
  projectId: "todo-with-firebase-2faf8",
  storageBucket: "todo-with-firebase-2faf8.appspot.com",
  messagingSenderId: "562699961495",
  appId: "1:562699961495:web:bc27f8a220eec4a3be55d2",
  measurementId: "G-38N3RP6HEZ",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);

export {
  app,
  auth,
  createUserWithEmailAndPassword,
  storage,
  uploadBytes,
  ref,
  getDownloadURL,
  db,
  collection,
  addDoc,
  getDocs,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};
