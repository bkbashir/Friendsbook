// ======================================
// Friendsbook Mobile V1
// auth.js Part 1
// ======================================

import {

auth,

db

} from "./firebase.js";

import {

createUserWithEmailAndPassword,

signInWithEmailAndPassword,

GoogleAuthProvider,

signInWithPopup,

sendPasswordResetEmail,

onAuthStateChanged,

signOut,

updateProfile

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {

doc,

setDoc,

getDoc,

serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ======================================
// Google Provider
// ======================================

const provider = new GoogleAuthProvider();

// ======================================
// Elements
// ======================================

const loginBtn = document.getElementById("loginBtn");

const registerBtn = document.getElementById("registerBtn");

const googleLoginBtn = document.getElementById("googleLoginBtn");

const forgotPassword = document.getElementById("forgotPassword");

const loginEmail = document.getElementById("loginEmail");

const loginPassword = document.getElementById("loginPassword");

const registerName = document.getElementById("registerName");

const registerEmail = document.getElementById("registerEmail");

const registerPassword = document.getElementById("registerPassword");

const loginPage = document.getElementById("loginPage");

const registerPage = document.getElementById("registerPage");

const mainApp = document.getElementById("mainApp");

// ======================================
// Open Register
// ======================================

document.getElementById("openRegister").onclick = () => {

loginPage.style.display = "none";

registerPage.style.display = "flex";

};

// ======================================
// Open Login
// ======================================

document.getElementById("openLogin").onclick = () => {

registerPage.style.display = "none";

loginPage.style.display = "flex";

};
// ======================================
// Register
// ======================================

registerBtn.onclick = async () => {

const name = registerName.value.trim();

const email = registerEmail.value.trim();

const password = registerPassword.value;

if(name===""||email===""||password===""){

alert("সব তথ্য পূরণ করুন");

return;

}

try{

const userCredential = await createUserWithEmailAndPassword(

auth,

email,

password

);

const user = userCredential.user;

// Update Firebase Profile

await updateProfile(user,{

displayName:name

});

// Save Firestore

await setDoc(

doc(db,"users",user.uid),

{

uid:user.uid,

name:name,

email:email,

bio:"Hello! I am using Friendsbook.",

profile:"default-profile.png",

cover:"default-cover.jpg",

verified:false,

admin:false,

followers:0,

following:0,

friends:0,

posts:0,

createdAt:serverTimestamp()

}

);

alert("Account Created Successfully");

registerPage.style.display="none";

loginPage.style.display="flex";

}catch(error){

alert(error.message);

}

};
// ======================================
// Login
// ======================================

loginBtn.onclick = async () => {

const email = loginEmail.value.trim();

const password = loginPassword.value;

if(email===""||password===""){

alert("Enter Email & Password");

return;

}

try{

await signInWithEmailAndPassword(

auth,

email,

password

);

}catch(error){

alert(error.message);

}

};

// ======================================
// Auto Login
// ======================================

onAuthStateChanged(auth, async(user)=>{

if(user){

loginPage.style.display="none";

registerPage.style.display="none";

mainApp.style.display="block";

// Load User Data

const snap=await getDoc(

doc(db,"users",user.uid)

);

if(snap.exists()){

const data=snap.data();

// Feed

document.getElementById("profileName").innerHTML=data.name;

document.getElementById("myName").innerHTML=data.name;

// Bio

document.getElementById("profileBio").innerHTML=data.bio;

// Profile

document.getElementById("profileImage").src=data.profile;

document.getElementById("profilePhoto").src=data.profile;

// Cover

document.getElementById("coverPhoto").src=data.cover;

}

document.getElementById("feedPage").style.display="block";

}else{

mainApp.style.display="none";

loginPage.style.display="flex";

registerPage.style.display="none";

}

});
// ======================================
// Google Login
// ======================================

googleLoginBtn.onclick = async()=>{

try{

const result=await signInWithPopup(auth,provider);

const user=result.user;

const ref=doc(db,"users",user.uid);

const snap=await getDoc(ref);

if(!snap.exists()){

await setDoc(ref,{

uid:user.uid,

name:user.displayName,

email:user.email,

bio:"Hello! I am using Friendsbook.",

profile:user.photoURL || "default-profile.png",

cover:"default-cover.jpg",

verified:false,

admin:false,

followers:0,

following:0,

friends:0,

posts:0,

createdAt:serverTimestamp()

});

}

}catch(error){

alert(error.message);

}

};

// ======================================
// Forgot Password
// ======================================

forgotPassword.onclick=async()=>{

const email=loginEmail.value.trim();

if(email===""){

alert("Enter your Email");

return;

}

try{

await sendPasswordResetEmail(auth,email);

alert("Password Reset Email Sent");

}catch(error){

alert(error.message);

}

};

// ======================================
// Logout
// ======================================

document.getElementById("logoutBtn").onclick=async()=>{

try{

await signOut(auth);

location.reload();

}catch(error){

alert(error.message);

}

};

// ======================================
// Admin Panel
// ======================================

const ADMIN_EMAIL="bashirahmed0052@gmail.com";

const adminPanelBtn=document.getElementById("adminPanelBtn");

onAuthStateChanged(auth,(user)=>{

if(!adminPanelBtn)return;

if(user && user.email===ADMIN_EMAIL){

adminPanelBtn.style.display="flex";

}else{

adminPanelBtn.style.display="none";

}

});

adminPanelBtn?.addEventListener("click",()=>{

window.location.href="admin.html";

});

// ======================================
// End auth.js
// ======================================
