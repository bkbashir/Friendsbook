//=====================================
// Friendsbook 2026
// Part 1
// Firebase
//=====================================

const firebaseConfig = {
 apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
 authDomain: "friendsbook-4a40c.firebaseapp.com",
 projectId: "friendsbook-4a40c",
 storageBucket: "friendsbook-4a40c.firebasestorage.app",
 messagingSenderId: "1000346329473",
 appId: "1:1000346329473:web:9bd69019e2b09f971e8880"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

//=====================================
// Global User
//=====================================

let currentUser = null;

//=====================================
// Elements
//=====================================

const loadingScreen = document.getElementById("loadingScreen");

const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const forgotPage = document.getElementById("forgotPage");
const mainPage = document.getElementById("mainPage");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotForm = document.getElementById("forgotForm");

const profileName = document.getElementById("profileName");
const drawerProfileName = document.getElementById("drawerProfileName");

const profilePhoto = document.getElementById("profilePhoto");
const drawerProfilePhoto = document.getElementById("drawerProfilePhoto");
const homeProfilePhoto = document.getElementById("homeProfilePhoto");

const coverPhoto = document.getElementById("coverPhoto");

const profileBio = document.getElementById("profileBio");

//=====================================
// Loading
//=====================================

window.onload = () => {

setTimeout(() => {

loadingScreen.style.display = "none";

},1800);

};

//=====================================
// Auth State
//=====================================

auth.onAuthStateChanged(async(user)=>{

if(user){

currentUser=user;

loginPage.style.display="none";
signupPage.style.display="none";
forgotPage.style.display="none";

mainPage.style.display="block";

await loadUserProfile(user.uid);

showPage(
localStorage.getItem("lastPage") || "home"
);

}else{

currentUser=null;

loginPage.style.display="flex";

signupPage.style.display="none";

forgotPage.style.display="none";

mainPage.style.display="none";

}

});

//=====================================
// Signup
//=====================================

signupForm.addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("fullName").value.trim();
const email = document.getElementById("signupEmail").value.trim();
const password = document.getElementById("signupPassword").value;

try{

const result = await auth.createUserWithEmailAndPassword(email,password);

await db.collection("users").doc(result.user.uid).set({

uid:result.user.uid,
name:name,
email:email,

bio:"",
profilePhoto:"",
coverPhoto:"",

friends:0,
followers:0,
following:0,

createdAt:firebase.firestore.FieldValue.serverTimestamp()

});

alert("Account Created Successfully");

signupPage.style.display="none";
loginPage.style.display="flex";

}catch(err){

alert(err.message);

}

});

//=====================================
// Login
//=====================================

loginForm.addEventListener("submit", async(e)=>{

e.preventDefault();

const email=document.getElementById("loginEmail").value.trim();

const password=document.getElementById("loginPassword").value;

try{

await auth.signInWithEmailAndPassword(email,password);

}catch(err){

alert(err.message);

}

});

//=====================================
// Forgot Password
//=====================================

forgotForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("forgotEmail").value.trim();

try{

await auth.sendPasswordResetEmail(email);

alert("Password Reset Link Sent");

forgotPage.style.display="none";
loginPage.style.display="flex";

}catch(err){

alert(err.message);

}

});

//=====================================
// Logout
//=====================================

const logoutBtn=document.getElementById("logoutBtn");
const logoutBtn2=document.getElementById("logoutBtn2");

if(logoutBtn){

logoutBtn.onclick=async()=>{

localStorage.removeItem("lastPage");

await auth.signOut();

};

}

if(logoutBtn2){

logoutBtn2.onclick=async()=>{

localStorage.removeItem("lastPage");

await auth.signOut();

};

}

//=====================================
// Load User Profile
//=====================================

async function loadUserProfile(uid){

const doc=await db.collection("users").doc(uid).get();

if(!doc.exists) return;

const data=doc.data();

profileName.textContent=data.name || "Friendsbook User";

drawerProfileName.textContent=data.name || "Friendsbook User";

profileBio.textContent=data.bio || "";

if(data.profilePhoto){

profilePhoto.src=data.profilePhoto;

drawerProfilePhoto.src=data.profilePhoto;

homeProfilePhoto.src=data.profilePhoto;

}

if(data.coverPhoto){

coverPhoto.src=data.coverPhoto;

}

  }
//=====================================
// Pages
//=====================================

const homePage=document.getElementById("homePage");
const profilePage=document.getElementById("profilePage");
const friendsPage=document.getElementById("friendsPage");
const messagePage=document.getElementById("messagePage");
const reelsPage=document.getElementById("reelsPage");
const marketplacePage=document.getElementById("marketplacePage");
const notificationPage=document.getElementById("notificationPage");
const settingsPage=document.getElementById("settingsPage");
const adminPage=document.getElementById("adminPage");
const searchPage=document.getElementById("searchPage");
const friendRequestPage=document.getElementById("friendRequestPage");
const savedPage=document.getElementById("savedPage");

//=====================================
// Hide All Pages
//=====================================

function hidePages(){

[
homePage,
profilePage,
friendsPage,
messagePage,
reelsPage,
marketplacePage,
notificationPage,
settingsPage,
adminPage,
searchPage,
friendRequestPage,
savedPage

].forEach(page=>{

if(page) page.style.display="none";

});

}

//=====================================
// Show Page
//=====================================

function showPage(page){

hidePages();

switch(page){

case "profile":
profilePage.style.display="block";
break;

case "friends":
friendsPage.style.display="block";
break;

case "message":
messagePage.style.display="block";
break;

case "reels":
reelsPage.style.display="block";
break;

case "marketplace":
marketplacePage.style.display="block";
break;

case "notification":
notificationPage.style.display="block";
break;

case "settings":
settingsPage.style.display="block";
break;

case "search":
searchPage.style.display="block";
break;

case "saved":
savedPage.style.display="block";
break;

case "friendRequest":
friendRequestPage.style.display="block";
break;

case "admin":
adminPage.style.display="block";
break;

default:
homePage.style.display="block";

}

localStorage.setItem("lastPage",page);

}

//=====================================
// Bottom Navigation
//=====================================

document.getElementById("navHome").onclick=()=>showPage("home");
document.getElementById("navFriends").onclick=()=>showPage("friends");
document.getElementById("navReels").onclick=()=>showPage("reels");
document.getElementById("navMarketplace").onclick=()=>showPage("marketplace");
document.getElementById("navProfile").onclick=()=>showPage("profile");

//=====================================
// Drawer
//=====================================

const drawer=document.getElementById("drawer");
const menuBtn=document.getElementById("menuBtn");

menuBtn.onclick=()=>{

drawer.classList.toggle("active");

};

document.onclick=(e)=>{

if(
drawer &&
menuBtn &&
!drawer.contains(e.target) &&
!menuBtn.contains(e.target)
){

drawer.classList.remove("active");

}

};
//=====================================
// Drawer Buttons
//=====================================

document.getElementById("drawerHome").onclick = () => showPage("home");

document.getElementById("drawerProfile").onclick = () => showPage("profile");

document.getElementById("drawerFriends").onclick = () => showPage("friends");

document.getElementById("drawerMessage").onclick = () => showPage("message");

document.getElementById("drawerReels").onclick = () => showPage("reels");

document.getElementById("drawerMarketplace").onclick = () => showPage("marketplace");

document.getElementById("drawerNotification").onclick = () => showPage("notification");

document.getElementById("drawerSettings").onclick = () => showPage("settings");

document.getElementById("drawerSaved").onclick = () => showPage("saved");

document.getElementById("drawerSearch").onclick = () => showPage("search");

document.getElementById("drawerFriendRequest").onclick = () => showPage("friendRequest");

//=====================================
// Admin Panel
//=====================================

const ADMIN_EMAIL = "bashirahmed0052@gmail.com";

const drawerAdmin = document.getElementById("drawerAdmin");

auth.onAuthStateChanged((user)=>{

if(!user) return;

if(user.email === ADMIN_EMAIL){

drawerAdmin.style.display="block";

}else{

drawerAdmin.style.display="none";

}

});

drawerAdmin.onclick = ()=>{

showPage("admin");

};

//=====================================
// Header Buttons
//=====================================

document.getElementById("searchBtn").onclick = ()=>{

showPage("search");

};

document.getElementById("messageBtn").onclick = ()=>{

showPage("message");

};

document.getElementById("notificationBtn").onclick = ()=>{

showPage("notification");

};

//=====================================
// Dark Mode
//=====================================

const darkModeBtn = document.getElementById("darkModeBtn");

darkModeBtn.onclick = ()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
? "dark"
: "light"
);

};

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}
//=====================================
// Profile Edit
//=====================================

const editProfileBtn=document.getElementById("editProfileBtn");
const editProfileBox=document.getElementById("editProfileBox");

const saveProfileBtn=document.getElementById("saveProfileBtn");

const nameInput=document.getElementById("nameInput");
const bioInput=document.getElementById("bioInput");

const profileInput=document.getElementById("profileInput");
const coverInput=document.getElementById("coverInput");

editProfileBtn.onclick=()=>{

editProfileBox.style.display="block";

nameInput.value=profileName.textContent;

bioInput.value=profileBio.textContent;

};

//=====================================
// Save Name + Bio
//=====================================

saveProfileBtn.onclick=async()=>{

if(!currentUser) return;

await db.collection("users").doc(currentUser.uid).update({

name:nameInput.value,

bio:bioInput.value

});

profileName.textContent=nameInput.value;

drawerProfileName.textContent=nameInput.value;

profileBio.textContent=bioInput.value;

alert("Profile Updated");

};

//=====================================
// Profile Photo Upload
//=====================================

profileInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file) return;

const ref=storage.ref("profilePhotos/"+currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("users").doc(currentUser.uid).update({

profilePhoto:url

});

profilePhoto.src=url;

drawerProfilePhoto.src=url;

homeProfilePhoto.src=url;

};

//=====================================
// Cover Photo Upload
//=====================================

coverInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file) return;

const ref=storage.ref("coverPhotos/"+currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("users").doc(currentUser.uid).update({

coverPhoto:url

});

coverPhoto.src=url;

};
//=====================================
// Create Post
//=====================================

const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const feedContainer = document.getElementById("feedContainer");

postBtn.onclick = async () => {

if(!currentUser) return;

const text = postInput.value.trim();

if(text==""){

alert("Write something first");
return;

}

await db.collection("posts").add({

uid: currentUser.uid,

name: profileName.textContent,

profilePhoto: profilePhoto.src,

text: text,

image: "",

video: "",

likes: 0,

comments: 0,

shares: 0,

time: firebase.firestore.FieldValue.serverTimestamp()

});

postInput.value="";

loadPosts();

};

//=====================================
// Load Posts
//=====================================

async function loadPosts(){

feedContainer.innerHTML="";

const snap = await db.collection("posts")

.orderBy("time","desc")

.get();

snap.forEach(doc=>{

const p = doc.data();

feedContainer.innerHTML += `

<div class="feedCard">

<div class="feedTop">

<img src="${p.profilePhoto}" class="feedProfile">

<div>

<h4>${p.name}</h4>

<small>Just now</small>

</div>

</div>

<p>${p.text}</p>

${p.image ? `<img src="${p.image}" class="feedImage">` : ""}

${p.video ? `<video src="${p.video}" controls class="feedVideo"></video>` : ""}

<div class="feedActions">

<button onclick="likePost('${doc.id}')">👍 ${p.likes}</button>

<button>💬 ${p.comments}</button>

<button>↗ ${p.shares}</button>

</div>

</div>

`;

});

}

//=====================================
// Like Post
//=====================================

async function likePost(id){

const ref = db.collection("posts").doc(id);

const doc = await ref.get();

await ref.update({

likes:(doc.data().likes||0)+1

});

loadPosts();

}

//=====================================
// Auto Load
//=====================================

db.collection("posts")

.orderBy("time","desc")

.onSnapshot(()=>{

loadPosts();

});
//=====================================
// Story Upload
//=====================================

const storyInput=document.getElementById("storyInput");
const storyContainer=document.getElementById("storyContainer");

storyInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file) return;

const ref=storage.ref("stories/"+currentUser.uid+"_"+Date.now());

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("stories").add({

uid:currentUser.uid,

name:profileName.textContent,

profilePhoto:profilePhoto.src,

image:url,

time:firebase.firestore.FieldValue.serverTimestamp()

});

};

//=====================================
// Load Stories
//=====================================

function loadStories(){

db.collection("stories")

.orderBy("time","desc")

.onSnapshot(snapshot=>{

storyContainer.innerHTML="";

snapshot.forEach(doc=>{

const s=doc.data();

storyContainer.innerHTML+=`

<div class="story">

<img src="${s.image}"

onclick="openStory('${s.image}')">

<p>${s.name}</p>

</div>

`;

});

});

}

//=====================================
// Story Viewer
//=====================================

function openStory(url){

window.open(url,"_blank");

}

//=====================================
// Photo Post Upload
//=====================================

const photoInput=document.getElementById("photoInput");

photoInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file) return;

const ref=storage.ref("posts/"+Date.now());

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("posts").add({

uid:currentUser.uid,

name:profileName.textContent,

profilePhoto:profilePhoto.src,

text:postInput.value,

image:url,

video:"",

likes:0,

comments:0,

shares:0,

time:firebase.firestore.FieldValue.serverTimestamp()

});

postInput.value="";

};

//=====================================
// Video Post Upload
//=====================================

const videoInput=document.getElementById("videoInput");

videoInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file) return;

const ref=storage.ref("videos/"+Date.now());

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("posts").add({

uid:currentUser.uid,

name:profileName.textContent,

profilePhoto:profilePhoto.src,

text:postInput.value,

image:"",

video:url,

likes:0,

comments:0,

shares:0,

time:firebase.firestore.FieldValue.serverTimestamp()

});

postInput.value="";

};

//=====================================
// Start
//=====================================

loadStories();
//=====================================
// Delete Post
//=====================================

async function deletePost(postId){

if(!confirm("Delete this post?")) return;

await db.collection("posts").doc(postId).delete();

}

//=====================================
// Save Post
//=====================================

async function savePost(postId){

await db.collection("users")

.doc(currentUser.uid)

.collection("saved")

.doc(postId)

.set({

savedAt:firebase.firestore.FieldValue.serverTimestamp()

});

alert("Post Saved");

}

//=====================================
// Share Post
//=====================================

async function sharePost(postId){

const ref=db.collection("posts").doc(postId);

const doc=await ref.get();

await ref.update({

shares:(doc.data().shares||0)+1

});

alert("Post Shared");

}

//=====================================
// Comment
//=====================================

async function commentPost(postId){

const text=prompt("Write Comment");

if(!text) return;

await db.collection("posts")

.doc(postId)

.collection("comments")

.add({

uid:currentUser.uid,

name:profileName.textContent,

photo:profilePhoto.src,

text:text,

time:firebase.firestore.FieldValue.serverTimestamp()

});

const ref=db.collection("posts").doc(postId);

const doc=await ref.get();

await ref.update({

comments:(doc.data().comments||0)+1

});

}

//=====================================
// Load Comments
//=====================================

async function loadComments(postId){

const snap=await db.collection("posts")

.doc(postId)

.collection("comments")

.orderBy("time")

.get();

let html="";

snap.forEach(c=>{

const d=c.data();

html+=`

<div class="commentBox">

<img src="${d.photo}" class="commentPhoto">

<b>${d.name}</b>

<p>${d.text}</p>

</div>

`;

});

return html;

 }
//=====================================
// Facebook Style Reactions
//=====================================

async function reactPost(postId,reaction){

const ref=db.collection("posts").doc(postId);

const doc=await ref.get();

const data=doc.data();

let reactions=data.reactions || {

like:0,
love:0,
haha:0,
wow:0,
sad:0,
angry:0

};

reactions[reaction]++;

await ref.update({

reactions:reactions

});

loadPosts();

}

//=====================================
// Reaction Menu
//=====================================

function reactionMenu(postId){

return `

<div class="reactionMenu">

<button onclick="reactPost('${postId}','like')">👍</button>

<button onclick="reactPost('${postId}','love')">❤️</button>

<button onclick="reactPost('${postId}','haha')">😂</button>

<button onclick="reactPost('${postId}','wow')">😮</button>

<button onclick="reactPost('${postId}','sad')">😢</button>

<button onclick="reactPost('${postId}','angry')">😡</button>

</div>

`;

}

//=====================================
// Total Reaction
//=====================================

function totalReaction(r){

if(!r) return 0;

return (r.like||0)+
(r.love||0)+
(r.haha||0)+
(r.wow||0)+
(r.sad||0)+
(r.angry||0);

}
//=====================================
// Messenger
//=====================================

const chatList=document.getElementById("chatList");
const chatMessages=document.getElementById("chatMessages");

const messageInput=document.getElementById("messageInput");
const sendMessageBtn=document.getElementById("sendMessageBtn");

let currentChatUser=null;

//=====================================
// Open Chat
//=====================================

async function openChat(uid,name,photo){

currentChatUser=uid;

document.getElementById("chatName").textContent=name;

document.getElementById("chatProfile").src=photo;

loadMessages();

}

//=====================================
// Send Message
//=====================================

sendMessageBtn.onclick=async()=>{

if(!currentChatUser) return;

const text=messageInput.value.trim();

if(text=="") return;

await db.collection("messages").add({

from:currentUser.uid,

to:currentChatUser,

text:text,

time:firebase.firestore.FieldValue.serverTimestamp(),

seen:false

});

messageInput.value="";

};

//=====================================
// Load Messages
//=====================================

function loadMessages(){

db.collection("messages")

.orderBy("time")

.onSnapshot(snapshot=>{

chatMessages.innerHTML="";

snapshot.forEach(doc=>{

const m=doc.data();

if(

(m.from==currentUser.uid && m.to==currentChatUser) ||

(m.from==currentChatUser && m.to==currentUser.uid)

){

chatMessages.innerHTML+=`

<div class="${
m.from==currentUser.uid
?"myMessage"
:"friendMessage"
}">

${m.text}

</div>

`;

}

});

chatMessages.scrollTop=chatMessages.scrollHeight;

});

}

//=====================================
// Online Status
//=====================================

async function setOnline(status){

await db.collection("users")

.doc(currentUser.uid)

.update({

online:status,

lastSeen:new Date()

});

}

window.addEventListener("beforeunload",()=>{

if(currentUser){

setOnline(false);

}

});

auth.onAuthStateChanged(user=>{

if(user){

setOnline(true);

}

});
//=====================================
// Messenger Advanced
//=====================================

const imageMessageInput = document.getElementById("imageMessageInput");
const voiceMessageInput = document.getElementById("voiceMessageInput");

//=====================================
// Send Image
//=====================================

imageMessageInput.onchange = async (e)=>{

const file = e.target.files[0];

if(!file || !currentChatUser) return;

const ref = storage.ref("chatImages/"+Date.now());

await ref.put(file);

const url = await ref.getDownloadURL();

await db.collection("messages").add({

from:currentUser.uid,
to:currentChatUser,

text:"",
image:url,

voice:"",

seen:false,

time:firebase.firestore.FieldValue.serverTimestamp()

});

};

//=====================================
// Send Voice
//=====================================

voiceMessageInput.onchange = async(e)=>{

const file = e.target.files[0];

if(!file || !currentChatUser) return;

const ref = storage.ref("voice/"+Date.now());

await ref.put(file);

const url = await ref.getDownloadURL();

await db.collection("messages").add({

from:currentUser.uid,
to:currentChatUser,

text:"",
image:"",
voice:url,

seen:false,

time:firebase.firestore.FieldValue.serverTimestamp()

});

};

//=====================================
// Seen
//=====================================

async function seenMessage(){

const snap = await db.collection("messages")

.where("from","==",currentChatUser)

.where("to","==",currentUser.uid)

.get();

snap.forEach(async(doc)=>{

await doc.ref.update({

seen:true

});

});

}

//=====================================
// Emoji
//=====================================

function addEmoji(e){

messageInput.value += e;

}

//=====================================
// New Message Notification
//=====================================

db.collection("messages")

.where("to","==",currentUser.uid)

.onSnapshot((snapshot)=>{

snapshot.docChanges().forEach((change)=>{

if(change.type==="added"){

console.log("New Message");

}

});

});
