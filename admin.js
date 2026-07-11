// ===============================
// Friendsbook V5
// admin.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const adminEmail="admin@friendsbook.com";

const adminPanel=document.getElementById("adminPanel");

const totalUsers=document.getElementById("totalUsers");

const totalPosts=document.getElementById("totalPosts");

const totalGroups=document.getElementById("totalGroups");

const totalPages=document.getElementById("totalPages");

// ===============================
// Check Admin
// ===============================

window.checkAdmin=()=>{

if(auth.currentUser.email===adminEmail){

adminPanel.style.display="block";

}else{

adminPanel.style.display="none";

}

};

// ===============================
// Total Users
// ===============================

const usersQuery=query(

collection(db,"users"),

orderBy("name")

);

onSnapshot(usersQuery,(snapshot)=>{

totalUsers.innerHTML=snapshot.size;

});

// ===============================
// Total Posts
// ===============================

const postsQuery=query(

collection(db,"posts"),

orderBy("createdAt")

);

onSnapshot(postsQuery,(snapshot)=>{

totalPosts.innerHTML=snapshot.size;

});

// ===============================
// Total Groups
// ===============================

const groupsQuery=query(

collection(db,"groups")

);

onSnapshot(groupsQuery,(snapshot)=>{

totalGroups.innerHTML=snapshot.size;

});

// ===============================
// Total Pages
// ===============================

const pagesQuery=query(

collection(db,"pages")

);

onSnapshot(pagesQuery,(snapshot)=>{

totalPages.innerHTML=snapshot.size;

});// ===============================
// Friendsbook V5
// admin.js Part 2
// ===============================

import {

doc,
deleteDoc,
updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Delete Any Post
// ===============================

window.adminDeletePost=async(postId)=>{

if(!confirm("Delete this post?")) return;

await deleteDoc(

doc(db,"posts",postId)

);

alert("Post Deleted");

};

// ===============================
// Delete Any User
// ===============================

window.adminDeleteUser=async(uid)=>{

if(!confirm("Delete this user?")) return;

await deleteDoc(

doc(db,"users",uid)

);

alert("User Deleted");

};

// ===============================
// Ban User
// ===============================

window.banUser=async(uid)=>{

await updateDoc(

doc(db,"users",uid),

{

banned:true

}

);

alert("User Banned");

};

// ===============================
// Unban User
// ===============================

window.unbanUser=async(uid)=>{

await updateDoc(

doc(db,"users",uid),

{

banned:false

}

);

alert("User Unbanned");

};

// ===============================
// Verify User
// ===============================

window.verifyUser=async(uid)=>{

await updateDoc(

doc(db,"users",uid),

{

verified:true

}

);

alert("User Verified");

};// ===============================
// Friendsbook V5
// admin.js Part 3 (Final)
// ===============================

import {

addDoc,
collection,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Send Notice
// ===============================

window.sendNotice=async()=>{

const text=prompt("Enter Notice");

if(!text) return;

await addDoc(

collection(db,"notices"),

{

message:text,

admin:auth.currentUser.email,

createdAt:serverTimestamp()

}

);

alert("Notice Published");

};

// ===============================
// Admin Logout
// ===============================

window.adminLogout=async()=>{

await auth.signOut();

location.href="index.html";

};

// ===============================
// Dashboard Refresh
// ===============================

window.refreshDashboard=()=>{

location.reload();

};

// ===============================
// System Information
// ===============================

window.systemInfo=()=>{

alert(

"Friendsbook V5\n"+

"Admin Panel\n"+

"Status : Running"

);

};

// ===============================
// End admin.js
// ===============================
