// ======================================
// Friendsbook Official
// auth.js
// ======================================

import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
updateProfile,
onAuthStateChanged,
signOut,
sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =============================
// Register
// =============================

document.getElementById("registerBtn")?.addEventListener("click", async()=>{

const name=document.getElementById("registerName").value.trim();

const email=document.getElementById("registerEmail").value.trim();

const password=document.getElementById("registerPassword").value;

if(!name||!email||!password){

alert("সব তথ্য পূরণ করুন");

return;

}

try{

const userCredential=await createUserWithEmailAndPassword(auth,email,password);

await updateProfile(userCredential.user,{

displayName:name

});

await setDoc(doc(db,"users",userCredential.user.uid),{

uid:userCredential.user.uid,

name:name,

email:email,

bio:"",

profile:"images/default-profile.png",

cover:"images/default-cover.jpg",

createdAt:Date.now()

});
  await sendEmailVerification(userCredential.user);

alert("Account Created!\n\nVerification email sent. Please verify your email.");

await signOut(auth);

location.href="index.html";

}catch(err){

alert(err.message);

}

});

// =============================
// Login
// =============================

document.getElementById("loginBtn")?.addEventListener("click",async()=>{

const email=document.getElementById("loginEmail").value.trim();

const password=document.getElementById("loginPassword").value;

try{

const userCredential = await signInWithEmailAndPassword(auth,email,password);

if(!userCredential.user.emailVerified){

alert("Please verify your email first.");

await signOut(auth);

return;

}

location.href="index.html";

}catch(err){

alert(err.message);

}

});

// =============================
// Auto Login
// =============================

onAuthStateChanged(auth,(user)=>{

if(user){

console.log("Logged In:",user.email);

}

});

// =============================
// Logout
// =============================

document.getElementById("logoutBtn")?.addEventListener("click",async()=>{

await signOut(auth);

location.href="login.html";

});

console.log("auth.js Loaded");
import {
sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// =============================
// Forgot Password
// =============================

document.getElementById("forgotPasswordBtn")?.addEventListener("click",async()=>{

const email=document.getElementById("loginEmail").value.trim();

if(email==""){

alert("Enter your email first");

return;

}

try{

await sendPasswordResetEmail(auth,email);

alert("Password reset link sent to your email.");

}catch(err){

alert(err.message);

}

});
