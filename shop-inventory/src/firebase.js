import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your new V2 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXtuJxMzoOVuwR-MHyHtmZeBQ55YzmfpQ",
  authDomain: "vinod-enterprise.firebaseapp.com",
  projectId: "vinod-enterprise",
  storageBucket: "vinod-enterprise.firebasestorage.app",
  messagingSenderId: "19464405689",
  appId: "1:19464405689:web:e9ce9ae38f9645b5361168"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the tools your app needs
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;