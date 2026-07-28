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
// =======================================
// Friendsbook 2026
// script.js Stable
// Part 1
// Authentication + Profile Load
// =======================================

import {

auth,
db,

signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendPasswordResetEmail,
signOut,
onAuthStateChanged,
updateProfile,

doc,
setDoc,
getDoc,

serverTimestamp

} from "./firebase.js";


// Helper

const $ = id => document.getElementById(id);


// App Data

let currentUser = null;
let userData = null;


// ==========================
// Login
// ==========================

$("loginBtn")?.addEventListener("click", async()=>{

const email = $("loginEmail").value.trim();

const password = $("loginPassword").value;


try{

await signInWithEmailAndPassword(
auth,
email,
password
);


}catch(error){

alert(error.message);

}

});


// ==========================
// Signup
// ==========================

$("signupBtn")?.addEventListener("click", async()=>{


const name = $("signupName").value.trim();

const email = $("signupEmail").value.trim();

const password = $("signupPassword").value;



try{


const result =
await createUserWithEmailAndPassword(
auth,
email,
password
);



await updateProfile(
result.user,
{
displayName:name
}
);



await setDoc(

doc(
db,
"users",
result.user.uid
),

{

uid:result.user.uid,

name:name,

email:email,

photo:"default-profile.png",

cover:"default-cover.jpg",

bio:"",

createdAt:serverTimestamp()

}

);



alert("Account Created");


}catch(error){

alert(error.message);

}


});


// ==========================
// Forgot Password
// ==========================

$("resetPasswordBtn")?.addEventListener("click",async()=>{


const email=$("forgotEmail").value.trim();


try{


await sendPasswordResetEmail(
auth,
email
);


alert("Reset email sent");


}catch(error){

alert(error.message);

}


});


// ==========================
// Auth State
// ==========================


onAuthStateChanged(auth,async(user)=>{


if(user){


currentUser=user;


const snap =
await getDoc(
doc(
db,
"users",
user.uid
)
);



if(snap.exists()){

userData=snap.data();

}


// Show Home

$("loginPage").style.display="none";

$("mainPage").style.display="block";



// Update Name

if($("userName")){

$("userName").innerText =
userData?.name || user.displayName;

}


// Update Photo

if($("profileImage")){

$("profileImage").src =
userData?.photo ||
"default-profile.png";

}


}else{


currentUser=null;

userData=null;


$("loginPage").style.display="block";

$("mainPage").style.display="none";


}


});


// ==========================
// Logout
// ==========================


$("logoutBtn")?.addEventListener("click",async()=>{


await signOut(auth);


});
