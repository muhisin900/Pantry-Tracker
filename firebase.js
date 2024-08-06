import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCVO2zivcQE7SRcOBNRmep2crjTjRNl_8U",
  authDomain: "pantry-tracker-62a07.firebaseapp.com",
  projectId: "pantry-tracker-62a07",
  storageBucket: "pantry-tracker-62a07.appspot.com",
  messagingSenderId: "645571955657",
  appId: "1:645571955657:web:e6d9101cd16710cca97618",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };