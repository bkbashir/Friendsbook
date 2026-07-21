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
