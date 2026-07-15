// ======================================
// Friendsbook Official V2
// script.js Part 1
// ======================================

// Firebase
import { auth, db, storage } from "./firebase.js";

// Firebase Auth
import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firestore
import {
collection,
doc,
getDoc,
getDocs,
addDoc,
updateDoc,
deleteDoc,
query,
orderBy,
serverTimestamp,
increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Storage
import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// ==========================
// Global Variables
// ==========================

let currentUser=null;

let posts=[];

let stories=[];

let reels=[];

// ==========================
// Elements
// ==========================

const $=(id)=>document.getElementById(id);

const pages=document.querySelectorAll(".page");

// ==========================
// Page System
// ==========================

function hidePages(){

pages.forEach(page=>{

page.style.display="none";

});

}

function showPage(id){

hidePages();

const page=$(id);

if(page){

page.style.display="block";

window.scrollTo({

top:0,

behavior:"smooth"

});

}

}

// ==========================
// Bottom Navigation
// ==========================

$("homeBtn")?.addEventListener("click",()=>showPage("feedPage"));

$("friendsBtn")?.addEventListener("click",()=>showPage("friendsPage"));

$("reelsBtn")?.addEventListener("click",()=>showPage("reelsPage"));

$("profileBtn")?.addEventListener("click",()=>showPage("profilePage"));

$("messageBtn")?.addEventListener("click",()=>showPage("messagePage"));

$("notificationBtn")?.addEventListener("click",()=>showPage("notificationPage"));

$("settingsBtn")?.addEventListener("click",()=>showPage("settingsPage"));

console.log("Friendsbook V2 Part 1 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 2
// Auth State + Loading + Profile
// ======================================

// ==========================
// Loading
// ==========================

window.addEventListener("load",()=>{

setTimeout(()=>{

if($("loadingScreen")){

$("loadingScreen").style.display="none";

}

},800);

});

// ==========================
// Firebase Auth State
// ==========================

onAuthStateChanged(auth,async(user)=>{

if(!user){

if($("mainApp")) $("mainApp").style.display="none";

if($("loginPage")) $("loginPage").style.display="flex";

return;

}

currentUser=user;

if($("loginPage")) $("loginPage").style.display="none";

if($("registerPage")) $("registerPage").style.display="none";

if($("mainApp")) $("mainApp").style.display="block";

try{

const snap=await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data=snap.data();

if($("profileName")){

$("profileName").textContent=data.name||"User";

}

if($("profileBio")){

$("profileBio").textContent=data.bio||"";

}

if($("profileImage")){

$("profileImage").src=data.profile||"default-profile.png";

}

if($("profilePhoto")){

$("profilePhoto").src=data.profile||"default-profile.png";

}

if($("coverPhoto")){

$("coverPhoto").src=data.cover||"default-cover.jpg";

}

}

}catch(err){

console.log(err);

}

showPage("feedPage");

loadPosts();

loadStories();

});

// ==========================
// Logout
// ==========================

$("logoutBtn")?.addEventListener("click",async()=>{

if(confirm("Logout?")){

await signOut(auth);

location.reload();

}

});

console.log("Friendsbook V2 Part 2 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 3
// Create Post + Feed
// ======================================

// ==========================
// Elements
// ==========================

const postBtn=$("postBtn");
const postText=$("postText");
const feedContainer=$("feedContainer");

// ==========================
// Create Post
// ==========================

postBtn?.addEventListener("click",async()=>{

if(!currentUser){

alert("Please Login");

return;

}

const text=postText.value.trim();

if(text==""){

alert("Write something...");

return;

}

await addDoc(collection(db,"posts"),{

uid:currentUser.uid,

name:$("profileName").textContent,

profile:$("profileImage").src,

text:text,

image:"",

likes:0,

comments:0,

shares:0,

reaction:"👍",

createdAt:serverTimestamp()

});

postText.value="";

loadPosts();

});

// ==========================
// Load Posts
// ==========================

async function loadPosts(){

feedContainer.innerHTML="";

posts=[];

const q=query(

collection(db,"posts"),

orderBy("createdAt","desc")

);

const snap=await getDocs(q);

snap.forEach(docSnap=>{

const data=docSnap.data();

posts.push({

id:docSnap.id,

...data

});

feedContainer.innerHTML+=`

<div class="postCard">

<div class="postHeader">

<div class="postUser">

<img src="${data.profile}">

<div>

<h3>${data.name}</h3>

<span>Friendsbook</span>

</div>

</div>

<button

class="deleteBtn"

data-id="${docSnap.id}">

🗑️

</button>

</div>

<div class="postText">

${data.text}

</div>

<div class="reactionBar">

<button

class="likeBtn"

data-id="${docSnap.id}">

${data.reaction} Like (${data.likes})

</button>

<button

class="commentBtn"

data-id="${docSnap.id}">

💬 ${data.comments}

</button>

<button

class="shareBtn"

data-id="${docSnap.id}">

📤 ${data.shares}

</button>

</div>

</div>

`;

});

bindDeleteButtons();

bindReactionButtons();

}

console.log("Friendsbook V2 Part 3 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 4
// Delete + Facebook Reaction
// ======================================

// ==========================
// Delete Post
// ==========================

function bindDeleteButtons(){

document.querySelectorAll(".deleteBtn").forEach(btn=>{

btn.onclick=async()=>{

if(!confirm("Delete this post?")) return;

await deleteDoc(doc(db,"posts",btn.dataset.id));

loadPosts();

};

});

}

// ==========================
// Facebook Reaction Box
// ==========================

const reactionBox=document.createElement("div");

reactionBox.id="reactionBox";

reactionBox.innerHTML=`

<span data-reaction="👍">👍</span>

<span data-reaction="❤️">❤️</span>

<span data-reaction="😂">😂</span>

<span data-reaction="😮">😮</span>

<span data-reaction="😢">😢</span>

<span data-reaction="😡">😡</span>

`;

document.body.appendChild(reactionBox);

reactionBox.style.position="fixed";

reactionBox.style.display="none";

reactionBox.style.background="#fff";

reactionBox.style.padding="8px";

reactionBox.style.borderRadius="40px";

reactionBox.style.boxShadow="0 5px 20px rgba(0,0,0,.25)";

reactionBox.style.zIndex="99999";

reactionBox.style.gap="10px";

// ==========================
// Long Press
// ==========================

let pressTimer=null;

function bindReactionButtons(){

document.querySelectorAll(".likeBtn").forEach(btn=>{

btn.onmousedown=()=>{

pressTimer=setTimeout(()=>{

const rect=btn.getBoundingClientRect();

reactionBox.dataset.post=btn.dataset.id;

reactionBox.style.left=rect.left+"px";

reactionBox.style.top=(rect.top-65)+"px";

reactionBox.style.display="flex";

},500);

};

btn.onmouseup=()=>{

clearTimeout(pressTimer);

};

btn.onmouseleave=()=>{

clearTimeout(pressTimer);

};

btn.onclick=async()=>{

const postRef=doc(db,"posts",btn.dataset.id);

await updateDoc(postRef,{

likes:increment(1),

reaction:"👍"

});

loadPosts();

};

});

}

// ==========================
// Select Reaction
// ==========================

reactionBox.querySelectorAll("span").forEach(icon=>{

icon.onclick=async()=>{

const postId=reactionBox.dataset.post;

const reaction=icon.dataset.reaction;

await updateDoc(doc(db,"posts",postId),{

likes:increment(1),

reaction:reaction

});

reactionBox.style.display="none";

loadPosts();

};

});

// ==========================
// Hide Reaction Box
// ==========================

document.addEventListener("click",(e)=>{

if(!reactionBox.contains(e.target)){

reactionBox.style.display="none";

}

});

console.log("Friendsbook V2 Part 4 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 5
// Comment + Share + Image Upload
// ======================================

// ==========================
// Image Upload
// ==========================

const postImageInput=$("postImageInput");

$("photoPostBtn")?.addEventListener("click",()=>{

postImageInput.click();

});

postImageInput?.addEventListener("change",async(e)=>{

const file=e.target.files[0];

if(!file||!currentUser) return;

const storageRef=ref(

storage,

"posts/"+Date.now()+"_"+file.name

);

await uploadBytes(storageRef,file);

const imageUrl=await getDownloadURL(storageRef);

await addDoc(collection(db,"posts"),{

uid:currentUser.uid,

name:$("profileName").textContent,

profile:$("profileImage").src,

text:postText.value,

image:imageUrl,

likes:0,

comments:0,

shares:0,

reaction:"👍",

createdAt:serverTimestamp()

});

postText.value="";

postImageInput.value="";

loadPosts();

});

// ==========================
// Comment
// ==========================

document.addEventListener("click",async(e)=>{

const btn=e.target.closest(".commentBtn");

if(!btn) return;

const comment=prompt("Write a comment");

if(!comment) return;

await updateDoc(

doc(db,"posts",btn.dataset.id),

{

comments:increment(1)

}

);

alert("Comment Added");

loadPosts();

});

// ==========================
// Share
// ==========================

document.addEventListener("click",async(e)=>{

const btn=e.target.closest(".shareBtn");

if(!btn) return;

await updateDoc(

doc(db,"posts",btn.dataset.id),

{

shares:increment(1)

}

);

if(navigator.share){

navigator.share({

title:"Friendsbook",

text:"Check this post"

});

}else{

alert("Post Shared");

}

loadPosts();

});

console.log("Friendsbook V2 Part 5 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 6
// Story + Reels
// ======================================

// ==========================
// Story Upload
// ==========================

$("storyInput")?.addEventListener("change",async(e)=>{

const file=e.target.files[0];

if(!file||!currentUser) return;

const storageRef=ref(

storage,

"stories/"+Date.now()+"_"+file.name

);

await uploadBytes(storageRef,file);

const image=await getDownloadURL(storageRef);

await addDoc(collection(db,"stories"),{

uid:currentUser.uid,

name:$("profileName").textContent,

profile:$("profileImage").src,

image:image,

createdAt:serverTimestamp()

});

loadStories();

});

// ==========================
// Load Stories
// ==========================

async function loadStories(){

if(!$("storyContainer")) return;

$("storyContainer").innerHTML="";

const snap=await getDocs(

query(

collection(db,"stories"),

orderBy("createdAt","desc")

)

);

snap.forEach(docSnap=>{

const data=docSnap.data();

$("storyContainer").innerHTML+=`

<div class="storyCard">

<img src="${data.image}">

<p>${data.name}</p>

</div>

`;

});

}

// ==========================
// Reels Upload
// ==========================

$("reelVideoInput")?.addEventListener("change",async(e)=>{

const file=e.target.files[0];

if(!file||!currentUser) return;

const storageRef=ref(

storage,

"reels/"+Date.now()+"_"+file.name

);

await uploadBytes(storageRef,file);

const video=await getDownloadURL(storageRef);

await addDoc(collection(db,"reels"),{

uid:currentUser.uid,

name:$("profileName").textContent,

profile:$("profileImage").src,

video:video,

likes:0,

createdAt:serverTimestamp()

});

loadReels();

});

// ==========================
// Load Reels
// ==========================

async function loadReels(){

if(!$("reelsContainer")) return;

$("reelsContainer").innerHTML="";

const snap=await getDocs(

query(

collection(db,"reels"),

orderBy("createdAt","desc")

)

);

snap.forEach(docSnap=>{

const data=docSnap.data();

$("reelsContainer").innerHTML+=`

<div class="reelCard">

<video

src="${data.video}"

controls

autoplay

muted

loop

playsinline

style="width:100%;border-radius:12px;">

</video>

<h3>${data.name}</h3>

</div>

`;

});

}

console.log("Friendsbook V2 Part 6 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 7
// Friends + Notifications + Search
// ======================================

// ==========================
// Load Friends
// ==========================

async function loadFriends(){

if(!$("friendsList")) return;

$("friendsList").innerHTML="";

const snap=await getDocs(collection(db,"users"));

snap.forEach(docSnap=>{

const data=docSnap.data();

if(currentUser&&data.uid!=currentUser.uid){

$("friendsList").innerHTML+=`

<div class="friendCard">

<img src="${data.profile||'default-profile.png'}">

<div>

<h3>${data.name}</h3>

<p>${data.bio||""}</p>

</div>

<button

class="addFriendBtn"

data-id="${data.uid}">

Add Friend

</button>

</div>

`;

}

});

bindFriendButtons();

}

// ==========================
// Friend Request
// ==========================

function bindFriendButtons(){

document.querySelectorAll(".addFriendBtn")

.forEach(btn=>{

btn.onclick=async()=>{

await addDoc(collection(db,"friendRequests"),{

from:currentUser.uid,

to:btn.dataset.id,

createdAt:serverTimestamp()

});

btn.innerText="Requested";

btn.disabled=true;

showToast("Friend Request Sent");

};

});

}

// ==========================
// Notifications
// ==========================

async function loadNotifications(){

if(!$("notificationList")) return;

$("notificationList").innerHTML="";

const snap=await getDocs(

query(

collection(db,"friendRequests"),

orderBy("createdAt","desc")

)

);

let total=0;

snap.forEach(docSnap=>{

const data=docSnap.data();

if(currentUser&&data.to==currentUser.uid){

total++;

$("notificationList").innerHTML+=`

<div class="friendCard">

<p>👤 New Friend Request</p>

</div>

`;

}

});

if($("notificationCount")){

$("notificationCount").innerText=total;

}

}

// ==========================
// Search Users
// ==========================

$("searchInput")?.addEventListener("keyup",()=>{

const value=$("searchInput").value.toLowerCase();

document.querySelectorAll(".friendCard,.postCard")

.forEach(card=>{

card.style.display=

card.innerText.toLowerCase().includes(value)

? "flex"

: "none";

});

});

// ==========================
// Toast
// ==========================

function showToast(text){

if(!$("toastMessage")) return;

$("toastMessage").innerText=text;

$("toastMessage").style.display="block";

setTimeout(()=>{

$("toastMessage").style.display="none";

},2000);

}

// ==========================
// First Load
// ==========================

loadFriends();

loadNotifications();

console.log("Friendsbook V2 Part 7 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 8
// Messenger + Online Status
// ======================================

// ==========================
// Load Chats
// ==========================

async function loadChats(){

if(!$("chatList")) return;

$("chatList").innerHTML="";

const snap=await getDocs(

query(

collection(db,"messages"),

orderBy("createdAt","desc")

)

);

snap.forEach(docSnap=>{

const data=docSnap.data();

if(

data.from==currentUser.uid ||

data.to==currentUser.uid

){

$("chatList").innerHTML+=`

<div class="chatCard">

<img src="${data.profile||'default-profile.png'}">

<div>

<h4>${data.name}</h4>

<p>${data.message}</p>

<small>${data.time||""}</small>

</div>

</div>

`;

}

});

}

// ==========================
// Send Message
// ==========================

async function sendMessage(toUid,name,profile,message){

if(message.trim()=="") return;

await addDoc(collection(db,"messages"),{

from:currentUser.uid,

to:toUid,

name:name,

profile:profile,

message:message,

createdAt:serverTimestamp(),

time:new Date().toLocaleTimeString()

});

loadChats();

}

// ==========================
// Online Status
// ==========================

async function setOnline(){

if(!currentUser) return;

await updateDoc(

doc(db,"users",currentUser.uid),

{

online:true,

lastSeen:serverTimestamp()

}

);

}

async function setOffline(){

if(!currentUser) return;

await updateDoc(

doc(db,"users",currentUser.uid),

{

online:false,

lastSeen:serverTimestamp()

}

);

}

// ==========================
// Auto Online / Offline
// ==========================

window.addEventListener("load",()=>{

setOnline();

});

window.addEventListener("beforeunload",()=>{

setOffline();

});

// ==========================
// Typing Indicator
// ==========================

$("chatInput")?.addEventListener("input",()=>{

if($("typingStatus")){

$("typingStatus").innerText="Typing...";

clearTimeout(window.typingTimer);

window.typingTimer=setTimeout(()=>{

$("typingStatus").innerText="";

},1000);

}

});

// ==========================
// First Load
// ==========================

loadChats();

console.log("Friendsbook V2 Part 8 Loaded");
// ======================================
// Friendsbook Official V2
// script.js Part 9
// Admin + Utility + Initialize
// ======================================

// ==========================
// Admin Panel
// ==========================

const ADMIN_EMAIL="bashirahmed0052@gmail.com";

function checkAdmin(){

if(!currentUser) return;

if(currentUser.email===ADMIN_EMAIL){

if($("adminPanelBtn")){

$("adminPanelBtn").style.display="flex";

}

}

}

$("adminPanelBtn")?.addEventListener("click",()=>{

location.href="admin.html";

});

// ==========================
// Clear Cache
// ==========================

$("clearCacheBtn")?.addEventListener("click",()=>{

if(confirm("Clear Local Cache?")){

localStorage.clear();

showToast("Cache Cleared");

}

});

// ==========================
// About
// ==========================

$("aboutBtn")?.addEventListener("click",()=>{

alert(

"Friendsbook Official V2\n\nDeveloper : Bashir Ahmed"

);

});

// ==========================
// Feedback
// ==========================

$("feedbackBtn")?.addEventListener("click",()=>{

window.open(

"mailto:bashirahmed0052@gmail.com"

);

});

// ==========================
// Help Center
// ==========================

$("helpCenterBtn")?.addEventListener("click",()=>{

alert(

"Friendsbook Help Center"

);

});

// ==========================
// Edit Profile
// ==========================

$("editProfileBtn")?.addEventListener("click",()=>{

const bio=prompt(

"Write your Bio",

$("profileBio").innerText

);

if(bio==null) return;

updateDoc(

doc(db,"users",currentUser.uid),

{

bio:bio

}

).then(()=>{

$("profileBio").innerText=bio;

showToast("Profile Updated");

});

});

// ==========================
// App Initialize
// ==========================

async function initializeApp(){

try{

loadPosts();

loadStories();

loadReels();

loadFriends();

loadNotifications();

loadChats();

checkAdmin();

console.log("Friendsbook Ready");

}catch(err){

console.error(err);

}

}

initializeApp();

// ======================================
// End Of Friendsbook Official V2
// ======================================

console.log("Friendsbook Official V2 Completed");
