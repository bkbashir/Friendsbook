// ======================================
// Friendsbook 2026
// Firebase.js
// Part 1/3
// Stable Foundation
// ======================================

// Firebase Core
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

// Authentication
import {

getAuth,
onAuthStateChanged,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendEmailVerification,
sendPasswordResetEmail,
signOut,
updateProfile

}
from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Firestore
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

}
from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Storage
import {

getStorage,
ref,
uploadBytes,
getDownloadURL,
deleteObject

}
from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// ======================================
// Firebase Config
// ======================================

const firebaseConfig={

apiKey:"AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",

authDomain:"friendsbook-4a40c.firebaseapp.com",

projectId:"friendsbook-4a40c",

storageBucket:"friendsbook-4a40c.firebasestorage.app",

messagingSenderId:"1000346329473",

appId:"1:1000346329473:web:9bd69019e2b09f971e8880"

};

// ======================================
// Initialize
// ======================================

const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

const db=getFirestore(app);

const storage=getStorage(app);

// ======================================
// Admin
// ======================================

const ADMIN_EMAIL="bashirahmed0052@gmail.com";
// ======================================
// Firebase Export
// Part 2/3
// ======================================

export{

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
// Default User Profile
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

version:"2026",

theme:"Purple Premium"

};

// ======================================
// Create User Object
// ======================================

export function createUserObject(user,name){

return{

uid:user.uid,

name,

email:user.email,

profilePhoto:DEFAULT_PROFILE.profilePhoto,

coverPhoto:DEFAULT_PROFILE.coverPhoto,

bio:DEFAULT_PROFILE.bio,

role:user.email===ADMIN_EMAIL?"admin":"user",

verified:user.emailVerified,

premium:false,

coins:0,

followers:0,

following:0,

friends:0,

posts:0,

createdAt:serverTimestamp()

};

}
// ======================================
// Friendsbook 2026
// Firebase.js
// Part 3/3
// Final Helpers
// ======================================

// Check Admin
export function isAdmin(user){

if(!user) return false;

return user.email===ADMIN_EMAIL;

}

// Default Values

export function getDefaultProfile(){

return DEFAULT_PROFILE.profilePhoto;

}

export function getDefaultCover(){

return DEFAULT_PROFILE.coverPhoto;

}

export function getDefaultBio(){

return DEFAULT_PROFILE.bio;

}

// App Information

export function appName(){

return APP_INFO.name;

}

export function appVersion(){

return APP_INFO.version;

}

export function appTheme(){

return APP_INFO.theme;

}

// Firebase Ready

console.log(

APP_INFO.name+
" "+
APP_INFO.version+
" Ready"

);
