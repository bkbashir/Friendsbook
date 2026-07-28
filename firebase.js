// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
  authDomain: "friendsbook-4a40c.firebaseapp.com",
  projectId: "friendsbook-4a40c",
  storageBucket: "friendsbook-4a40c.firebasestorage.app",
  messagingSenderId: "1000346329473",
  appId: "1:1000346329473:web:9bd69019e2b09f971e8880"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

function createUserObject(user, name) {
  return {
    uid: user.uid,
    name: name,
    email: user.email,
    photo: "default-profile.png",
    cover: "default-cover.jpg",
    bio: "",
    createdAt: Date.now()
  };
}

function isAdmin(email) {
  return email === "bashirahmed0052@gmail.com";
}

export {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  createUserObject,
  isAdmin
};
