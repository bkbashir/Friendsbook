// ======================================
// Friendsbook Admin
// admin.js Part 1
// ======================================

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==========================
// Admin Email
// ==========================

const ADMIN_EMAIL="bashirahmed0052@gmail.com";

// ==========================
// Auth Check
// ==========================

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="index.html";

return;

}

if(user.email!==ADMIN_EMAIL){

alert("Access Denied");

location.href="index.html";

return;

}

loadDashboard();

});

// ==========================
// Dashboard
// ==========================

async function loadDashboard(){

const users=await getDocs(collection(db,"users"));

const posts=await getDocs(collection(db,"posts"));

const stories=await getDocs(collection(db,"stories"));

const reels=await getDocs(collection(db,"reels"));

document.getElementById("totalUsers").innerText=users.size;

document.getElementById("totalPosts").innerText=posts.size;

document.getElementById("totalStories").innerText=stories.size;

document.getElementById("totalReels").innerText=reels.size;

}

// ==========================
// Logout
// ==========================

document.getElementById("logoutAdmin")?.addEventListener("click",async()=>{

await signOut(auth);

location.href="index.html";

});

console.log("Admin Part 1 Loaded");
// ======================================
// Friendsbook Admin
// admin.js Part 2
// Users + Delete + Ban
// ======================================

// ==========================
// Load Users
// ==========================

async function loadUsers(){

const adminContent=document.getElementById("adminContent");

adminContent.innerHTML="";

const snap=await getDocs(collection(db,"users"));

snap.forEach(userDoc=>{

const data=userDoc.data();

adminContent.innerHTML+=`

<div class="userCard">

<div class="userInfo">

<img src="${data.profile||'default-profile.png'}">

<div>

<h3>${data.name}</h3>

<p>${data.email}</p>

</div>

</div>

<div>

<button
class="banBtn"
data-id="${userDoc.id}">
Ban
</button>

<button
class="deleteBtn"
data-id="${userDoc.id}">
Delete
</button>

</div>

</div>

`;

});

bindAdminButtons();

}

// ==========================
// Users Button
// ==========================

document.getElementById("usersBtn")?.addEventListener("click",()=>{

loadUsers();

});

// ==========================
// Delete / Ban
// ==========================

function bindAdminButtons(){

document.querySelectorAll(".deleteBtn").forEach(btn=>{

btn.onclick=async()=>{

if(!confirm("Delete User?")) return;

await deleteDoc(doc(db,"users",btn.dataset.id));

loadUsers();
loadDashboard();

};

});

document.querySelectorAll(".banBtn").forEach(btn=>{

btn.onclick=async()=>{

await updateDoc(

doc(db,"users",btn.dataset.id),

{

banned:true

}

);

alert("User Banned");

loadUsers();

};

});

}

console.log("Admin Part 2 Loaded");
// ======================================
// Friendsbook Admin
// admin.js Part 3
// Posts + Stories + Reels
// ======================================

// ==========================
// Posts
// ==========================

async function loadPostsAdmin(){

const adminContent=document.getElementById("adminContent");

adminContent.innerHTML="";

const snap=await getDocs(collection(db,"posts"));

snap.forEach(postDoc=>{

const data=postDoc.data();

adminContent.innerHTML+=`

<div class="userCard">

<div class="userInfo">

<img src="${data.profile||'default-profile.png'}">

<div>

<h3>${data.name}</h3>

<p>${data.text||""}</p>

</div>

</div>

<button
class="deletePostBtn"
data-id="${postDoc.id}">

Delete Post

</button>

</div>

`;

});

document.querySelectorAll(".deletePostBtn")

.forEach(btn=>{

btn.onclick=async()=>{

if(!confirm("Delete this post?")) return;

await deleteDoc(doc(db,"posts",btn.dataset.id));

loadPostsAdmin();

loadDashboard();

};

});

}

document.getElementById("postsBtn")?.onclick=loadPostsAdmin;

// ==========================
// Stories
// ==========================

async function loadStoriesAdmin(){

const adminContent=document.getElementById("adminContent");

adminContent.innerHTML="";

const snap=await getDocs(collection(db,"stories"));

snap.forEach(storyDoc=>{

const data=storyDoc.data();

adminContent.innerHTML+=`

<div class="userCard">

<div class="userInfo">

<img src="${data.image}">

<div>

<h3>${data.name}</h3>

<p>Story</p>

</div>

</div>

<button
class="deleteStoryBtn"
data-id="${storyDoc.id}">

Delete Story

</button>

</div>

`;

});

document.querySelectorAll(".deleteStoryBtn")

.forEach(btn=>{

btn.onclick=async()=>{

await deleteDoc(doc(db,"stories",btn.dataset.id));

loadStoriesAdmin();

loadDashboard();

};

});

}

document.getElementById("storiesBtn")?.onclick=loadStoriesAdmin;

// ==========================
// Reels
// ==========================

async function loadReelsAdmin(){

const adminContent=document.getElementById("adminContent");

adminContent.innerHTML="";

const snap=await getDocs(collection(db,"reels"));

snap.forEach(reelDoc=>{

const data=reelDoc.data();

adminContent.innerHTML+=`

<div class="userCard">

<div class="userInfo">

<div>

<h3>${data.name}</h3>

<p>Reel Video</p>

</div>

</div>

<button
class="deleteReelBtn"
data-id="${reelDoc.id}">

Delete Reel

</button>

</div>

`;

});

document.querySelectorAll(".deleteReelBtn")

.forEach(btn=>{

btn.onclick=async()=>{

await deleteDoc(doc(db,"reels",btn.dataset.id));

loadReelsAdmin();

loadDashboard();

};

});

}

document.getElementById("reelsBtn")?.onclick=loadReelsAdmin;

console.log("Admin Part 3 Loaded");
// ======================================
// Friendsbook Admin
// admin.js Part 4
// Reports + Search + Final
// ======================================

// ==========================
// Reports
// ==========================

async function loadReports(){

const adminContent=document.getElementById("adminContent");

adminContent.innerHTML="<h2>Reports</h2>";

const snap=await getDocs(collection(db,"reports"));

if(snap.empty){

adminContent.innerHTML+=`

<p style="padding:20px">

No Reports Found

</p>

`;

return;

}

snap.forEach(reportDoc=>{

const data=reportDoc.data();

adminContent.innerHTML+=`

<div class="userCard">

<div class="userInfo">

<div>

<h3>${data.type||"Report"}</h3>

<p>${data.message||""}</p>

</div>

</div>

<button

class="deleteReportBtn"

data-id="${reportDoc.id}">

Delete

</button>

</div>

`;

});

document.querySelectorAll(".deleteReportBtn")

.forEach(btn=>{

btn.onclick=async()=>{

if(!confirm("Delete Report?")) return;

await deleteDoc(doc(db,"reports",btn.dataset.id));

loadReports();

};

});

}

document.getElementById("reportsBtn")?.addEventListener("click",loadReports);

// ==========================
// Refresh
// ==========================

document.getElementById("refreshBtn")?.addEventListener("click",()=>{

loadDashboard();

});

// ==========================
// Search User
// ==========================

const search=document.createElement("input");

search.placeholder="Search User...";

search.style.width="100%";

search.style.padding="12px";

search.style.marginBottom="15px";

search.style.borderRadius="8px";

search.style.border="1px solid #ddd";

document.getElementById("adminContent").before(search);

search.addEventListener("keyup",()=>{

const value=search.value.toLowerCase();

document.querySelectorAll(".userCard").forEach(card=>{

card.style.display=

card.innerText.toLowerCase().includes(value)

? "flex"

: "none";

});

});

// ==========================
// Initialize
// ==========================

window.addEventListener("load",()=>{

loadDashboard();

});

console.log("Friendsbook Admin Complete");
