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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const auth = getAuth(app);
const db = getFirestore(app);

// (Optional) If you use Analytics, you can import and initialize it here as well:
// import { getAnalytics } from 'firebase/analytics';
// const analytics = getAnalytics(app);

// Export the necessary services
export { auth, db };
export default app;
