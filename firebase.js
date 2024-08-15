import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVO2zivcQE7SRcOBNRmep2crjTjRNl_8U",
  authDomain: "pantry-tracker-62a07.firebaseapp.com",
  projectId: "pantry-tracker-62a07",
  storageBucket: "pantry-tracker-62a07.appspot.com",
  messagingSenderId: "645571955657",
  appId: "1:645571955657:web:e6d9101cd16710cca97618",
  measurementId: "G-JHS38X1FD6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage, collection, onSnapshot, doc, setDoc, deleteDoc, ref, uploadBytes, getDownloadURL };