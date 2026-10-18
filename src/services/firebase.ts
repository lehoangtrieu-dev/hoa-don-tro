import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  type DocumentData,
} from "firebase/firestore";
import { type RentalData } from "./../type";

const firebaseConfig = {
  apiKey: "AIzaSyAKE9orZTVWe57LMfP3XZlFzBdm7I9WmXs",
  authDomain: "hoadontro.firebaseapp.com",
  projectId: "hoadontro",
  storageBucket: "hoadontro.firebasestorage.app",
  messagingSenderId: "699809692911",
  appId: "1:699809692911:web:6a6f9bd6ce82e3980c6f1a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const saveToFirestore = async <T extends DocumentData>(
  uid: string,
  data: T,
) => {
  if (!uid) throw new Error("A valid User UID is required.");
  const userDocRef = doc(db, "users", uid);
  const sanitizedData = JSON.parse(JSON.stringify(data));
  await setDoc(userDocRef, sanitizedData, { merge: true });
};

export const loadFromFirestore = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const snap = await getDoc(userDocRef);
  if (snap.exists()) {
    return snap.data() as RentalData;
  }
  return null;
};
