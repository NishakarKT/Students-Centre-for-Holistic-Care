import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB3G2ChpQFdKzSyM--a2EAejAnTOZwFbI8",
    authDomain: "cc-task-iwg.firebaseapp.com",
    projectId: "cc-task-iwg",
    storageBucket: "cc-task-iwg.appspot.com",
    messagingSenderId: "884772249240",
    appId: "1:884772249240:web:eaf4dd4a4817c3272ebaed",
    measurementId: "G-8LZV46NZL4"
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);