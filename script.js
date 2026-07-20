alert("Script Started");
/*==================================
Friendsbook 2026
Script Part 1
==================================*/

/*==============================
Pages
==============================*/

const loadingScreen=document.getElementById("loadingScreen");

const loginPage=document.getElementById("loginPage");
const signupPage=document.getElementById("signupPage");
const forgotPage=document.getElementById("forgotPage");
const mainPage=document.getElementById("mainPage");

const homePage=document.getElementById("homePage");
const friendsPage=document.getElementById("friendsPage");
const reelsPage=document.getElementById("reelsPage");
const marketplacePage=document.getElementById("marketplacePage");
const profilePage=document.getElementById("profilePage");
const messagePage=document.getElementById("messagePage");
const notificationPage=document.getElementById("notificationPage");
const settingsPage=document.getElementById("settingsPage");
const adminPage=document.getElementById("adminPage");

/*==============================
Buttons
==============================*/

const menuBtn=document.getElementById("menuBtn");

const navHome=document.getElementById("navHome");
const navFriends=document.getElementById("navFriends");
const navReels=document.getElementById("navReels");
const navMarketplace=document.getElementById("navMarketplace");
const navProfile=document.getElementById("navProfile");

const messageBtn=document.getElementById("messageBtn");

const logoutBtn=document.getElementById("logoutBtn");

/*==============================
Forms
==============================*/

const loginForm=document.getElementById("loginForm");
const signupForm=document.getElementById("signupForm");
const forgotForm=document.getElementById("forgotForm");

/*==============================
Firebase
==============================*/

const firebaseConfig={

apiKey:"AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
authDomain:"friendsbook-4a40c.firebaseapp.com",
projectId:"friendsbook-4a40c",
storageBucket:"friendsbook-4a40c.firebasestorage.app",
messagingSenderId:"1000346329473",
appId:"1:1000346329473:web:9bd69019e2b09f971e8880"

};

firebase.initializeApp(firebaseConfig);

const auth=firebase.auth();
const db=firebase.firestore();
const storage=firebase.storage();

let currentUser=null;
alert("Firebase OK");
/*==============================
Loading
==============================*/

window.onload=()=>{

setTimeout(()=>{

loadingScreen.style.display="none";

},1200);

};
/*==================================
Script Part 2
Firebase Auth
==================================*/

auth.onAuthStateChanged(async(user)=>{
alert("Auth State");
currentUser=user;

if(user){

loginPage.style.display="none";
signupPage.style.display="none";
forgotPage.style.display="none";

mainPage.style.display="block";

if(typeof loadMyProfile==="function"){

await loadMyProfile();

}

}else{

loginPage.style.display="flex";
signupPage.style.display="none";
forgotPage.style.display="none";

mainPage.style.display="none";

}

});

/*==============================
Login
==============================*/

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

await auth.signInWithEmailAndPassword(

document.getElementById("loginEmail").value.trim(),

document.getElementById("loginPassword").value

);

}catch(err){

alert(err.message);

}

});

/*==============================
Signup
==============================*/

signupForm.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

const result=await auth.createUserWithEmailAndPassword(

document.getElementById("signupEmail").value.trim(),

document.getElementById("signupPassword").value

);

await db.collection("users").doc(result.user.uid).set({

uid:result.user.uid,

name:document.getElementById("fullName").value,

email:document.getElementById("signupEmail").value,

phone:document.getElementById("signupPhone").value,

birth:document.getElementById("birthDate").value,

gender:document.getElementById("gender").value,

bio:"",

profile:"",

cover:"",

posts:0,

followers:0,

following:0

});

alert("Account Created Successfully");

}catch(err){

alert(err.message);

}

});

/*==============================
Logout
==============================*/

logoutBtn.onclick=async()=>{

await auth.signOut();

location.reload();

};
/*==================================
Script Part 3
Navigation + Drawer
==================================*/

const drawer=document.getElementById("drawer");

/*==============================
Drawer
==============================*/

menuBtn.onclick=()=>{

drawer.classList.toggle("active");

};

document.addEventListener("click",(e)=>{

if(

drawer &&

!drawer.contains(e.target) &&

!menuBtn.contains(e.target)

){

drawer.classList.remove("active");

}

});

/*==============================
Open Page
==============================*/

function hideAllPages(){

homePage.style.display="none";
friendsPage.style.display="none";
reelsPage.style.display="none";
marketplacePage.style.display="none";
profilePage.style.display="none";
messagePage.style.display="none";
notificationPage.style.display="none";
settingsPage.style.display="none";
adminPage.style.display="none";

}

function openPage(page){

hideAllPages();

page.style.display="block";

drawer.classList.remove("active");

}

/*==============================
Bottom Navigation
==============================*/

navHome.onclick=()=>{

openPage(homePage);

};

navFriends.onclick=()=>{

openPage(friendsPage);

};

navReels.onclick=()=>{

openPage(reelsPage);

};

navMarketplace.onclick=()=>{

openPage(marketplacePage);

};

navProfile.onclick=()=>{

openPage(profilePage);

if(typeof loadMyProfile==="function"){

loadMyProfile();

}

};

/*==============================
Header
==============================*/

messageBtn.onclick=()=>{

openPage(messagePage);

};

/*==============================
First Page
==============================*/

hideAllPages();

homePage.style.display="block";
/*==================================
Script Part 4
Profile System
==================================*/

const profileName=document.getElementById("profileName");
const profileBio=document.getElementById("profileBio");

const profilePhoto=document.getElementById("profilePhoto");
const coverPhoto=document.getElementById("coverPhoto");

const drawerProfileName=document.getElementById("drawerProfileName");
const drawerProfilePhoto=document.getElementById("drawerProfilePhoto");

const totalPosts=document.getElementById("totalPosts");
const totalFollowers=document.getElementById("totalFollowers");
const totalFollowing=document.getElementById("totalFollowing");

/*==============================
Load Profile
==============================*/

async function loadMyProfile(){

if(!currentUser) return;

try{

const doc=await db.collection("users").doc(currentUser.uid).get();

if(!doc.exists){

console.log("User document not found");

return;

}

const data=doc.data();

profileName.textContent=data.name || "No Name";

profileBio.textContent=data.bio || "";

drawerProfileName.textContent=data.name || "Friendsbook User";

totalPosts.textContent=data.posts || 0;
totalFollowers.textContent=data.followers || 0;
totalFollowing.textContent=data.following || 0;

if(data.profile!=""){

profilePhoto.src=data.profile;
drawerProfilePhoto.src=data.profile;

}else{

profilePhoto.src="myphoto.png";
drawerProfilePhoto.src="myphoto.png";

}

if(data.cover!=""){

coverPhoto.src=data.cover;

}

console.log("Profile Loaded");

}catch(err){

console.log(err);

}

}

/*==============================
Edit Profile
==============================*/

document.getElementById("editProfileBtn").onclick=async()=>{

const newName=prompt("Enter Name",profileName.textContent);

if(newName==null) return;

const newBio=prompt("Enter Bio",profileBio.textContent);

if(newBio==null) return;

await db.collection("users").doc(currentUser.uid).update({

name:newName,

bio:newBio

});

loadMyProfile();

};

/*==============================
Open Profile
==============================*/

navProfile.onclick=()=>{

openPage(profilePage);

loadMyProfile();

};
