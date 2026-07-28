// =======================================
// Friendsbook 2026
// firebase.js Stable
// =======================================

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
 getAuth,
 signInWithEmailAndPassword,
 createUserWithEmailAndPassword,
 sendPasswordResetEmail,
 signOut,
 onAuthStateChanged,
 updateProfile
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


import {
 getFirestore,
 collection,
 doc,
 setDoc,
 getDoc,
 addDoc,
 updateDoc,
 deleteDoc,
 query,
 orderBy,
 onSnapshot,
 serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


import {
 getStorage,
 ref,
 uploadBytes,
 getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";


// Firebase Config

const firebaseConfig = {

apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",

authDomain: "friendsbook-4a40c.firebaseapp.com",

projectId: "friendsbook-4a40c",

storageBucket: "friendsbook-4a40c.firebasestorage.app",

messagingSenderId: "1000346329473",

appId: "1:1000346329473:web:9bd69019e2b09f971e8880"

};


// Initialize

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// Export

export {

auth,
db,
storage,

signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendPasswordResetEmail,
signOut,
onAuthStateChanged,
updateProfile,

collection,
doc,
setDoc,
getDoc,
addDoc,
updateDoc,
deleteDoc,

query,
orderBy,
onSnapshot,
serverTimestamp,

ref,
uploadBytes,
getDownloadURL

};
