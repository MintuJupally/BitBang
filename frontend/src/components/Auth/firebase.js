import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqBYkpzpmbKLc2OiChEhBUpZojSyRAmIE",
  authDomain: "bitbang2022.firebaseapp.com",
  projectId: "bitbang2022",
  storageBucket: "bitbang2022.appspot.com",
  messagingSenderId: "151195052671",
  appId: "1:151195052671:web:630a2e8a87174eee4a6d4a",
  measurementId: "G-1N9KBC6235",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};
// var provider = new firebase.auth.GoogleAuthProvider();
export { auth, signInWithGoogle, db };
