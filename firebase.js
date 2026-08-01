// =======================================
// Friendsbook 2026
// firebase.js v2
// Part 1
// =======================================

// Firebase App
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

// Authentication
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Firestore
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    increment,
arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Storage
import {
    getStorage,
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// =======================================
// Firebase Config
// =======================================

const firebaseConfig = {

    apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",

    authDomain: "friendsbook-4a40c.firebaseapp.com",

    projectId: "friendsbook-4a40c",

    storageBucket: "friendsbook-4a40c.firebasestorage.app",

    messagingSenderId: "1000346329473",

    appId: "1:1000346329473:web:9bd69019e2b09f971e8880"

};

// =======================================
// Initialize Firebase
// =======================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);
// =======================================
// Friendsbook 2026
// firebase.js v2
// Part 2 (Final)
// =======================================

// Default User Object
function createUserObject(user, name) {

    return {

        uid: user.uid,

        name: name,

        email: user.email,

        photo: "default-profile.png",

        cover: "default-cover.jpg",

        bio: "",

        verified: user.emailVerified,

        premium: false,

        followers: 0,

        following: 0,

        friends: 0,

        posts: 0,

        createdAt: serverTimestamp()

    };

}

// Admin Check
function isAdmin(email) {

    return email === "bashirahmed0052@gmail.com";

}

// =======================================
// Export
// =======================================

export {

    auth,
    db,
    storage,

    onAuthStateChanged,

    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,

    sendPasswordResetEmail,
    sendEmailVerification,

    signOut,

    updateProfile,

    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,

    query,
    where,
    orderBy,
    limit,

    onSnapshot,

    serverTimestamp,

    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,

    createUserObject,

    isAdmin

};
