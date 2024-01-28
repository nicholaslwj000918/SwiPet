// Import the functions from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDzFj79bINmPUk8P1qzFHFWL8jRWzYn14c",
  authDomain: "swipet-89d36.firebaseapp.com",
  projectId: "swipet-89d36",
  storageBucket: "swipet-89d36.appspot.com",
  messagingSenderId: "813307543520",
  appId: "1:813307543520:web:7c27c4a57350b8b9cd3585",
  measurementId: "G-BJXW2Z3LPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


export {app, db, auth}