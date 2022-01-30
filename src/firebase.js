// import firebase from "firebase/compat/app"
// import "firebase/compat/auth"
// import "firebase/compat/firestore"

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBswfe0A32odHaCyDH344NQ1-aEeP9CovE",
  authDomain: "online-code-editor-c79d5.firebaseapp.com",
  projectId: "online-code-editor-c79d5",
  storageBucket: "online-code-editor-c79d5.appspot.com",
  messagingSenderId: "306746432025",
  appId: "1:306746432025:web:ad49eadef7f4937df96888",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);