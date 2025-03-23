import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore, CollectionReference, collection as firestoreCollection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmJYwz7DhNcFZeIo8Olj0adQ0N_f49tkg",
  authDomain: "medimerge-e9dc8.firebaseapp.com",
  projectId: "medimerge-e9dc8",
  storageBucket: "medimerge-e9dc8.firebasestorage.app",
  messagingSenderId: "798110384453",
  appId: "1:798110384453:web:547978b315bca924957e2c",
  measurementId: "G-TGS8GEBBMT"
};    

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

function collection(db: Firestore, collectionName: string): CollectionReference {
  return firestoreCollection(db, collectionName);
}

const usersCollection = collection(db, 'users');
const medicineRemindersCollection = collection(db, 'medicineReminders');
const medicalHistoryCollection = collection(db, 'medicalHistory');

export { app, auth, db, usersCollection, medicineRemindersCollection, medicalHistoryCollection };
