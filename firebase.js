// ======================================
// Friendsbook 2026 V3
// Firebase Configuration
// Part 1/3
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

getAuth,
onAuthStateChanged,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendEmailVerification,
sendPasswordResetEmail,
signOut,
updateProfile

} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {

getFirestore,
doc,
setDoc,
getDoc,
updateDoc,
deleteDoc,
collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {

getStorage,
ref,
uploadBytes,
getDownloadURL,
deleteObject

} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

// ======================================
// Firebase Config
// ======================================

const firebaseConfig = {

apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",

authDomain: "friendsbook-4a40c.firebaseapp.com",

projectId: "friendsbook-4a40c",

storageBucket: "friendsbook-4a40c.firebasestorage.app",

messagingSenderId: "1000346329473",

appId: "1:1000346329473:web:9bd69019e2b09f971e8880"

};

// ======================================
// Initialize Firebase
// ======================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

// ======================================
// Admin Email
// ======================================

const ADMIN_EMAIL = "bashirahmed0052@gmail.com";
// ======================================
// Friendsbook 2026 V3
// Firebase Export
// Part 2/3
// ======================================

export {

app,

auth,
db,
storage,

ADMIN_EMAIL,

// Auth

onAuthStateChanged,

signInWithEmailAndPassword,

createUserWithEmailAndPassword,

sendEmailVerification,

sendPasswordResetEmail,

signOut,

updateProfile,

// Firestore

doc,

setDoc,

getDoc,

updateDoc,

deleteDoc,

collection,

addDoc,

serverTimestamp,

// Storage

ref,

uploadBytes,

getDownloadURL,

deleteObject

};

// ======================================
// Default User Data
// ======================================

export const DEFAULT_PROFILE={

profilePhoto:"default-profile.png",

coverPhoto:"default-cover.jpg",

bio:"Welcome to Friendsbook.",

role:"user",

verified:false,

premium:false,

coins:0,

followers:0,

following:0,

friends:0,

posts:0,

createdAt:null

};

// ======================================
// App Information
// ======================================

export const APP_INFO={

name:"Friendsbook",

version:"2026 V3",

theme:"Purple Premium"

};
// ======================================
// Friendsbook 2026 V3
// Firebase Helpers
// Part 3/3
// ======================================

export function createUserObject(user,name){

return{

uid:user.uid,

name:name,

email:user.email,

profilePhoto:DEFAULT_PROFILE.profilePhoto,

coverPhoto:DEFAULT_PROFILE.coverPhoto,

bio:DEFAULT_PROFILE.bio,

role:user.email===ADMIN_EMAIL?"admin":"user",

verified:user.emailVerified,

premium:DEFAULT_PROFILE.premium,

coins:DEFAULT_PROFILE.coins,

followers:DEFAULT_PROFILE.followers,

following:DEFAULT_PROFILE.following,

friends:DEFAULT_PROFILE.friends,

posts:DEFAULT_PROFILE.posts,

createdAt:serverTimestamp()

};

}

export function isAdmin(user){

if(!user) return false;

return user.email===ADMIN_EMAIL;

}

export function getDefaultProfile(){

return DEFAULT_PROFILE.profilePhoto;

}

export function getDefaultCover(){

return DEFAULT_PROFILE.coverPhoto;

}

export function getDefaultBio(){

return DEFAULT_PROFILE.bio;

}

export function appVersion(){

return APP_INFO.version;

}

export function appName(){

return APP_INFO.name;

}

// ======================================
// Firebase Ready
// ======================================

console.log(

APP_INFO.name+
" "+
APP_INFO.version+
" Firebase Ready"

);
alert("FIREBASE READY");
