// ======================================
// Friendsbook Mobile V1
// script.js Part 1
// ======================================

import { auth, db, storage } from "./firebase.js";

import {

doc,
updateDoc,
collection,
addDoc,
getDocs,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

ref,
uploadBytes,
getDownloadURL

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// ======================================
// Pages
// ======================================

const pages=document.querySelectorAll(".page");

function hidePages(){

pages.forEach(page=>{

page.style.display="none";

});

}

function showPage(id){

hidePages();

const page=document.getElementById(id);

if(page){

page.style.display="block";

window.scrollTo({

top:0,

behavior:"smooth"

});

}

}

// ======================================
// Bottom Navigation
// ======================================

document.getElementById("homeBtn").onclick=()=>{

showPage("feedPage");

};

document.getElementById("friendsBtn").onclick=()=>{

showPage("friendsPage");

};

document.getElementById("reelsBtn").onclick=()=>{

showPage("reelsPage");

};

document.getElementById("profileBtn").onclick=()=>{

showPage("profilePage");

};

document.getElementById("messageBtn").onclick=()=>{

showPage("messagePage");

};

document.getElementById("notificationBtn").onclick=()=>{

showPage("notificationPage");

};

// ======================================
// Settings
// ======================================

document.getElementById("settingsBtn")?.onclick=()=>{

showPage("settingsPage");

};

// ======================================
// Logo
// ======================================

document.querySelector(".headerLogo")?.onclick=()=>{

showPage("feedPage");

};

console.log("script.js Part 1 Loaded");
// ======================================
// script.js Part 2
// Search + Dark Mode + Profile Upload
// ======================================

import { auth, db, storage } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// ======================================
// Search
// ======================================

const searchInput=document.getElementById("searchInput");

searchInput?.addEventListener("keyup",()=>{

const value=searchInput.value.toLowerCase();

document.querySelectorAll(".postCard").forEach(post=>{

const text=post.innerText.toLowerCase();

post.style.display=text.includes(value)?"block":"none";

});

});

// ======================================
// Dark Mode
// ======================================

const darkMode=document.getElementById("darkMode");

if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

if(darkMode) darkMode.checked=true;

}

darkMode?.addEventListener("change",()=>{

if(darkMode.checked){

document.body.classList.add("dark");

localStorage.setItem("theme","dark");

}else{

document.body.classList.remove("dark");

localStorage.setItem("theme","light");

}

});

// ======================================
// Profile Photo Upload
// ======================================

const profileInput=document.getElementById("profileInput");

document.getElementById("changeProfileBtn")?.addEventListener("click",()=>{

profileInput.click();

});

profileInput?.addEventListener("change",async(e)=>{

const file=e.target.files[0];

if(!file) return;

const user=auth.currentUser;

if(!user) return;

const storageRef=ref(storage,"profiles/"+user.uid);

await uploadBytes(storageRef,file);

const url=await getDownloadURL(storageRef);

await updateDoc(doc(db,"users",user.uid),{

profile:url

});

document.getElementById("profileImage").src=url;

document.getElementById("profilePhoto").src=url;

});

// ======================================
// Cover Upload
// ======================================

const coverInput=document.getElementById("coverInput");

document.getElementById("changeCoverBtn")?.onclick=()=>{

coverInput.click();

};

coverInput?.addEventListener("change",async(e)=>{

const file=e.target.files[0];

if(!file) return;

const user=auth.currentUser;

if(!user) return;

const storageRef=ref(storage,"covers/"+user.uid);

await uploadBytes(storageRef,file);

const url=await getDownloadURL(storageRef);

await updateDoc(doc(db,"users",user.uid),{

cover:url

});

document.getElementById("coverPhoto").src=url;

});

console.log("script.js Part 2 Loaded");
// ======================================
// Friendsbook Mobile V1
// script.js Part 3
// Post System
// ======================================

import { auth, db } from "./firebase.js";

import {

collection,
addDoc,
getDocs,
query,
orderBy,
deleteDoc,
doc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ======================================
// Elements
// ======================================

const postBtn=document.getElementById("postBtn");

const postText=document.getElementById("postText");

const feedContainer=document.getElementById("feedContainer");

// ======================================
// Create Post
// ======================================

postBtn?.addEventListener("click",async()=>{

const user=auth.currentUser;

if(!user){

alert("Login Required");

return;

}

const text=postText.value.trim();

if(text===""){

alert("Write Something");

return;

}

await addDoc(collection(db,"posts"),{

uid:user.uid,

name:user.displayName,

text:text,

profile:user.photoURL ||

"default-profile.png",

likes:0,

comments:0,

createdAt:serverTimestamp()

});

postText.value="";

loadPosts();

});

// ======================================
// Load Posts
// ======================================

async function loadPosts(){

feedContainer.innerHTML="";

const q=query(

collection(db,"posts"),

orderBy("createdAt","desc")

);

const snap=await getDocs(q);

snap.forEach(post=>{

const data=post.data();

feedContainer.innerHTML+=`

<div class="postCard">

<div class="postHeader">

<div class="postUser">

<img src="${data.profile}">

<div>

<h3>${data.name}</h3>

<span>Just Now</span>

</div>

</div>

<button

class="deletePost"

data-id="${post.id}">

🗑️

</button>

</div>

<div class="postText">

${data.text}

</div>

<div class="reactionBar">

<button class="likeBtn" data-id="${post.id}">

👍 Like (${data.likes})

</button>

<button>

💬 Comment

</button>

<button>

📤 Share

</button>

</div>

</div>

`;

});

deletePosts();

}

// ======================================
// Delete Post
// ======================================

function deletePosts(){

document.querySelectorAll(".deletePost")

.forEach(btn=>{

btn.onclick=async()=>{

if(confirm("Delete this post?")){

await deleteDoc(

doc(db,"posts",btn.dataset.id)

);

loadPosts();

}

};

});

}

// ======================================
// First Load
// ======================================

loadPosts();

console.log("script.js Part 3 Loaded");
// ======================================
// Friendsbook Mobile V1
// script.js Part 4
// Facebook Reaction UI
// ======================================

// Long Press Time

let pressTimer = null;

// Create Reaction Box

const reactionBox = document.createElement("div");

reactionBox.id = "reactionBox";

reactionBox.innerHTML = `

<span data-reaction="👍">👍</span>

<span data-reaction="❤️">❤️</span>

<span data-reaction="😂">😂</span>

<span data-reaction="😮">😮</span>

<span data-reaction="😢">😢</span>

<span data-reaction="😡">😡</span>

`;

document.body.appendChild(reactionBox);

// Style

reactionBox.style.position = "fixed";

reactionBox.style.display = "none";

reactionBox.style.background = "#fff";

reactionBox.style.padding = "8px";

reactionBox.style.borderRadius = "35px";

reactionBox.style.boxShadow = "0 5px 20px rgba(0,0,0,.25)";

reactionBox.style.zIndex = "99999";

// Long Press

document.addEventListener("mousedown",(e)=>{

const btn=e.target.closest(".likeBtn");

if(!btn)return;

pressTimer=setTimeout(()=>{

const rect=btn.getBoundingClientRect();

reactionBox.style.left=rect.left+"px";

reactionBox.style.top=(rect.top-60)+"px";

reactionBox.style.display="flex";

reactionBox.dataset.target=btn.dataset.id;

},500);

});

document.addEventListener("mouseup",()=>{

clearTimeout(pressTimer);

});

// Hide

document.addEventListener("click",(e)=>{

if(!reactionBox.contains(e.target)){

reactionBox.style.display="none";

}

});

// Select Reaction

reactionBox.querySelectorAll("span").forEach(icon=>{

icon.onclick=()=>{

const reaction=icon.dataset.reaction;

const targetId=reactionBox.dataset.target;

const btn=document.querySelector(

`.likeBtn[data-id="${targetId}"]`

);

if(btn){

btn.innerHTML=reaction+" Like";

}

reactionBox.style.display="none";

};

});

console.log("Reaction UI Loaded");
// ======================================
// Friendsbook Mobile V1
// script.js Part 5
// Reaction System
// ======================================

import {

doc,
updateDoc,
increment,
getDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ======================================
// Save Reaction
// ======================================

async function saveReaction(postId,reaction){

const postRef=doc(db,"posts",postId);

await updateDoc(postRef,{

likes:increment(1),

lastReaction:reaction

});

}

// ======================================
// Reaction Click
// ======================================

reactionBox.querySelectorAll("span")

.forEach(icon=>{

icon.onclick=async()=>{

const reaction=icon.dataset.reaction;

const postId=reactionBox.dataset.target;

await saveReaction(postId,reaction);

const btn=document.querySelector(

`.likeBtn[data-id="${postId}"]`

);

if(btn){

btn.innerHTML=`${reaction} Liked`;

}

reactionBox.style.display="none";

};

});

// ======================================
// Normal Like
// ======================================

document.addEventListener("click",async(e)=>{

const btn=e.target.closest(".likeBtn");

if(!btn)return;

const postId=btn.dataset.id;

if(!postId)return;

const postRef=doc(db,"posts",postId);

const snap=await getDoc(postRef);

if(!snap.exists()) return;

const data=snap.data();

await updateDoc(postRef,{

likes:increment(1),

lastReaction:"👍"

});

btn.innerHTML=`👍 Liked (${(data.likes||0)+1})`;

});

console.log("Reaction Save Ready");
