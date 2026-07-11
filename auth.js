// ===============================
// Friendsbook V4
// auth.js
// ===============================

import { auth, db } from "./firebase.js";

import {

createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {

doc,
setDoc,
getDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const loginPage = document.getElementById("loginPage");
const mainApp = document.getElementById("mainApp");

const loginName = document.getElementById("loginName");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

registerBtn.onclick = async () => {

const name = loginName.value.trim();
const email = loginEmail.value.trim();
const password = loginPassword.value;

if(name==="" || email==="" || password===""){

alert("সব তথ্য দিন");

return;

}

try{

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);

await setDoc(
doc(db,"users",email),
{

name:name,

email:email,

bio:"",

profile:"",

cover:"",

friends:0,

followers:0,

following:0,

createdAt:Date.now()

}
);

alert("Account Created Successfully");

}catch(error){

alert(error.message);

}

};// ===============================
// Login
// ===============================

loginBtn.onclick = async () => {

const email = loginEmail.value.trim();
const password = loginPassword.value;

if(email==="" || password===""){

alert("Email এবং Password দিন");

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

// ===============================
// Auto Login
// ===============================

onAuthStateChanged(auth, async(user)=>{

if(user){

loginPage.style.display="none";

mainApp.style.display="block";

const snap = await getDoc(

doc(db,"users",user.email)

);

if(snap.exists()){

const data = snap.data();

document.getElementById("myName").innerHTML = data.name;

document.getElementById("profileName").innerHTML = data.name;

document.getElementById("profileBio").innerHTML = data.bio || "";

if(data.profile){

document.getElementById("profileImage").src = data.profile;

document.getElementById("profilePhoto").src = data.profile;

}

if(data.cover){

document.getElementById("coverPhoto").src = data.cover;

}

}

}else{

loginPage.style.display="flex";

mainApp.style.display="none";

}

});

// ===============================
// Logout
// ===============================

document.getElementById("logoutBtn").onclick = async()=>{

await signOut(auth);

};
