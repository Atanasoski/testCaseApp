import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1tgQa_5hGtgaAF3IJp0jTQaexmv0m04Q",
  authDomain: "testcase-89d6c.firebaseapp.com",
  projectId: "testcase-89d6c",
  storageBucket: "testcase-89d6c.appspot.com",
  messagingSenderId: "584670232512",
  appId: "1:584670232512:web:5ee26c20ab5d7f2762d225",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
