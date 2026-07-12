// ===============================
// Friendsbook V5
// admin.js Part 1
// ===============================

import { auth, db } from "./firebase.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Admin Email
// ===============================

const ADMIN_EMAIL="your_admin_email@gmail.com";

// উদাহরণ:
// const ADMIN_EMAIL="bashir@gmail.com";

// ===============================
// Admin Authentication
// ===============================

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="index.html";

return;

}

if(user.email!==ADMIN_EMAIL){

alert("Access Denied!");

location.href="index.html";

return;

}

loadDashboard();

});

// ===============================
// Dashboard
// ===============================

async function loadDashboard(){

loadUsers();

loadPosts();

loadStories();

loadReels();

}

// ===============================
// Users Count
// ===============================

async function loadUsers(){

const snap=

await getDocs(collection(db,"users"));

document.getElementById("totalUsers").innerText=snap.size;

}

// ===============================
// End Part 1
// ===============================// ===============================
// Friendsbook V5
// admin.js Part 2
// ===============================

import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Total Posts
// ===============================

async function loadPosts(){

const snap=

await getDocs(collection(db,"posts"));

document.getElementById("totalPosts").innerText=snap.size;

}

// ===============================
// Total Stories
// ===============================

async function loadStories(){

const snap=

await getDocs(collection(db,"stories"));

document.getElementById("totalStories").innerText=snap.size;

}

// ===============================
// Total Reels
// ===============================

async function loadReels(){

const snap=

await getDocs(collection(db,"reels"));

document.getElementById("totalReels").innerText=snap.size;

}

// ===============================
// Premium Users
// ===============================

async function loadPremiumUsers(){

const snap=

await getDocs(collection(db,"premium"));

const el=document.getElementById("premiumContainer");

if(!el) return;

el.innerHTML="";

snap.forEach((doc)=>{

const data=doc.data();

el.innerHTML+=`

<div class="friendCard">

<div class="friendInfo">

<div class="friendName">

${data.email || "Unknown User"}

</div>

</div>

</div>

`;

});

}

// ===============================
// Reports
// ===============================

async function loadReports(){

const snap=

await getDocs(collection(db,"reports"));

const el=document.getElementById("reportsContainer");

if(!el) return;

el.innerHTML="";

snap.forEach((doc)=>{

const data=doc.data();

el.innerHTML+=`

<div class="notificationCard">

<b>${data.type || "Report"}</b>

<p>${data.reason || ""}</p>

</div>

`;

});

}

// ===============================
// End Part 2
// ===============================// ===============================
// Friendsbook V5
// admin.js Part 3 (Final)
// ===============================

import {

doc,
deleteDoc,
updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Delete User
// ===============================

window.deleteUser=async(id)=>{

if(!confirm("Delete this user?")) return;

await deleteDoc(

doc(db,"users",id)

);

alert("User Deleted");

loadUsers();

};

// ===============================
// Delete Post
// ===============================

window.deletePost=async(id)=>{

if(!confirm("Delete this post?")) return;

await deleteDoc(

doc(db,"posts",id)

);

alert("Post Deleted");

loadPosts();

};

// ===============================
// Ban User
// ===============================

window.banUser=async(id)=>{

await updateDoc(

doc(db,"users",id),

{

status:"banned"

}

);

alert("User Banned");

};

// ===============================
// Unban User
// ===============================

window.unbanUser=async(id)=>{

await updateDoc(

doc(db,"users",id),

{

status:"active"

}

);

alert("User Unbanned");

};

// ===============================
// Refresh Dashboard
// ===============================

window.refreshDashboard=()=>{

loadDashboard();

loadPremiumUsers();

loadReports();

};

// ===============================
// Logout
// ===============================

window.logout=async()=>{

await auth.signOut();

location.href="index.html";

};

// ===============================
// Initialize
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

refreshDashboard();

console.log("Friendsbook Admin Ready");

});

// ===============================
// End admin.js
// ===============================
