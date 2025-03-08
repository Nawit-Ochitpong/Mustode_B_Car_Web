// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCX42VILyE1HIVILxuE2uvrBMpSPYAZgEA",
  authDomain: "mustodebcar-ac28a.firebaseapp.com",
  databaseURL: "https://mustodebcar-ac28a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mustodebcar-ac28a",
  storageBucket: "mustodebcar-ac28a.firebasestorage.app",
  messagingSenderId: "773381728190",
  appId: "1:773381728190:web:45815916d786753935fbef",
  measurementId: "G-BT22K761KZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
