// ======================================
// Friendsbook 2026
// Script.js
// Part 1/12
// ======================================

import{
auth,
db,

onAuthStateChanged,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendEmailVerification,
sendPasswordResetEmail,
signOut,
updateProfile,

doc,
setDoc,
getDoc,

createUserObject,
isAdmin

}from "./firebase.js";

// ================================
// DOM
// ================================

const $=id=>document.getElementById(id);

// ================================
// APP STATE
// ================================

const App={

user:null,

profile:null,

admin:false,

page:"home",

dark:false,

loading:false

};

// ================================
// HELPERS
// ================================

function show(id){

$(id)?.classList.remove("hidden");

}

function hide(id){

$(id)?.classList.add("hidden");

}

function toast(text){

const box=$("toast");

const label=$("toastText");

if(!box||!label)return;

label.textContent=text;

box.classList.add("show");

clearTimeout(App.toastTimer);

App.toastTimer=setTimeout(()=>{

box.classList.remove("show");

},2500);

}

function showLoading(){

App.loading=true;

show("globalLoading");

}

function hideLoading(){

App.loading=false;

hide("globalLoading");

}
// ======================================
// Authentication
// Part 2/12
// ======================================

async function login(){

const email=$("loginEmail").value.trim();

const password=$("loginPassword").value;

if(!email||!password){

toast("Enter email and password");

return;

}

showLoading();

try{

await signInWithEmailAndPassword(

auth,

email,

password

);

toast("Login successful");

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

async function signup(){

const name=$("signupName").value.trim();

const email=$("signupEmail").value.trim();

const password=$("signupPassword").value;

if(!name||!email||!password){

toast("Fill all fields");

return;

}

showLoading();

try{

const result=

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

await sendEmailVerification(

result.user

);

await setDoc(

doc(db,"users",result.user.uid),

createUserObject(

result.user,

name

)

);

toast("Account created");

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

async function forgotPassword(){

const email=$("forgotEmail").value.trim();

if(!email){

toast("Enter your email");

return;

}

showLoading();

try{

await sendPasswordResetEmail(

auth,

email

);

toast("Password reset email sent");

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

// Register Events (Only Once)

$("loginBtn").addEventListener(

"click",

login

);

$("signupBtn").addEventListener(

"click",

signup

);

$("resetPasswordBtn").addEventListener(

"click",

forgotPassword

);
// ======================================
// Auth State
// Part 3/12
// ======================================

async function loadProfile(uid){

const snap=await getDoc(

doc(db,"users",uid)

);

if(!snap.exists()) return;

App.profile=snap.data();

if($("headerProfile")){

$("headerProfile").src=

App.profile.profilePhoto||

"default-profile.png";

}

if($("menuProfileImage")){

$("menuProfileImage").src=

App.profile.profilePhoto||

"default-profile.png";

}

if($("menuUserName")){

$("menuUserName").textContent=

App.profile.name||

"Friendsbook User";

}

}

onAuthStateChanged(auth,async(user)=>{

if(!user){

App.user=null;

App.profile=null;

App.admin=false;

show("authContainer");

hide("homePage");

return;

}

showLoading();

try{

await user.reload();

App.user=user;

App.admin=isAdmin(user);

await loadProfile(user.uid);

hide("authContainer");

show("homePage");

restorePage();

if(!user.emailVerified){

toast("Verify your email");

}

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

});
// ======================================
// Navigation System
// Part 4/12
// ======================================

const Pages={

home:$("mainContent"),

profile:$("profilePage"),

friends:$("friendsPage"),

create:$("createPage"),

reels:$("reelsPage"),

messenger:$("messengerPage"),

notification:$("notificationPage"),

ai:$("aiPage"),

settings:$("settingsPage"),

marketplace:$("marketplacePage"),

saved:$("savedPage"),

groups:$("groupsPage"),

pages:$("pagesPage"),

admin:$("adminPage")

};

function hideAllPages(){

Object.values(Pages).forEach(page=>{

if(!page) return;

page.classList.add("hidden");

page.classList.remove("active");

});

}

function openPage(name){

if(!Pages[name]){

name="home";

}

hideAllPages();

Pages[name].classList.remove("hidden");

Pages[name].classList.add("active");

App.page=name;

localStorage.setItem(

"fb_page",

name

);

}

// Bottom Navigation

$("navHome").addEventListener(

"click",

()=>openPage("home")

);

$("navFriends").addEventListener(

"click",

()=>openPage("friends")

);

$("navCreate").addEventListener(

"click",

()=>openPage("create")

);

$("navReels").addEventListener(

"click",

()=>openPage("reels")

);

$("navMessenger").addEventListener(

"click",

()=>openPage("messenger")

);

$("navNotification").addEventListener(

"click",

()=>openPage("notification")

);

$("navProfile").addEventListener(

"click",

// ======================================
// Navigation
// Part 4/12
// ======================================

const Pages={

home:$("mainContent"),

profile:$("profilePage"),

friends:$("friendsPage"),

create:$("createPage"),

reels:$("reelsPage"),

messenger:$("messengerPage"),

notification:$("notificationPage"),

ai:$("aiPage"),

settings:$("settingsPage"),

marketplace:$("marketplacePage"),

saved:$("savedPage"),

groups:$("groupsPage"),

pages:$("pagesPage"),

admin:$("adminPage")

};

function hidePages(){

Object.values(Pages).forEach(page=>{

if(page){

page.classList.add("hidden");

page.classList.remove("active");

}

});

}

function openPage(name){

hidePages();

if(Pages[name]){

Pages[name].classList.remove("hidden");

Pages[name].classList.add("active");

App.page=name;

localStorage.setItem("fb_page",name);

}

closeMenu();

}

function restorePage(){

const last=

localStorage.getItem("fb_page")||

"home";

openPage(last);

}

// Bottom Navigation

$("navHome").addEventListener(

"click",

()=>openPage("home")

);

$("navFriends").addEventListener(

"click",

()=>openPage("friends")

);

$("navCreate").addEventListener(

"click",

()=>openPage("create")

);

$("navReels").addEventListener(

"click",

()=>openPage("reels")

);

$("navMessenger").addEventListener(

"click",

()=>openPage("messenger")

);

$("navNotification").addEventListener(

"click",

()=>openPage("notification")

);

$("navProfile").addEventListener(

"click",

()=>openPage("profile")

);

$("navAI").addEventListener(

"click",

()=>openPage("ai")

);

$("headerProfile").addEventListener(

"click",

()=>openPage("profile")

);
// ======================================
// Side Menu
// Part 5/12
// ======================================

function openMenu(){

$("sideMenu").classList.add("active");

show("overlay");

}

function closeMenu(){

$("sideMenu").classList.remove("active");

hide("overlay");

}

// Menu Events (Only Once)

$("navMenu").addEventListener(

"click",

openMenu

);

$("overlay").addEventListener(

"click",

closeMenu

);

// ===============================
// Menu Navigation
// ===============================

$("menuProfileBtn").addEventListener(

"click",

()=>openPage("profile")

);

$("menuSavedBtn").addEventListener(

"click",

()=>openPage("saved")

);

$("menuMarketplaceBtn").addEventListener(

"click",

()=>openPage("marketplace")

);

$("menuPagesBtn").addEventListener(

"click",

()=>openPage("pages")

);

$("menuGroupsBtn").addEventListener(

"click",

()=>openPage("groups")

);

$("menuSettingsBtn").addEventListener(

"click",

()=>openPage("settings")

);

// ===============================
// Dark Mode
// ===============================

function setDarkMode(enable){

App.dark=enable;

document.body.classList.toggle(

"dark",

enable

);

localStorage.setItem(

"fb_dark",

enable

);

}

$("menuDarkBtn").addEventListener(

"click",

()=>{

setDarkMode(!App.dark);

toast(

App.dark?

"Dark Mode Enabled":

"Light Mode Enabled"

);

}

);
// ======================================
// Logout + Initialize
// Part 6/12
// ======================================

async function logout(){

showLoading();

try{

await signOut(auth);

localStorage.removeItem("fb_page");

toast("Logged out");

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

$("logoutBtn").addEventListener(

"click",

logout

);

// ===============================
// Initialize
// ===============================

function initializeApp(){

const dark=

localStorage.getItem("fb_dark")==="true";

setDarkMode(dark);


hideLoading();

console.log(

"Friendsbook Initialized"

);

}

// ===============================
// Single Window Load
// ===============================

window.addEventListener(

"load",

initializeApp

);
// ======================================
// Search + Preview
// Part 7/12
// ======================================

// ===============================
// Search
// ===============================

function search(keyword){

keyword=keyword.trim().toLowerCase();

console.log("Search:",keyword);

// Phase 4

}

$("searchInput").addEventListener(

"input",

e=>{

search(e.target.value);

}

);

$("searchBtn").addEventListener(

"click",

()=>{

$("searchInput").focus();

}

);

// ===============================
// Image Preview
// ===============================

function openImage(src){

$("previewImage").src=src;

show("imageViewer");

}

function closeImage(){

$("previewImage").src="";

hide("imageViewer");

}

$("closeImageViewer").addEventListener(

"click",

closeImage

);

// ===============================
// Video Preview
// ===============================

function openVideo(src){

const video=$("previewVideo");

video.src=src;

show("videoViewer");

video.play();

}

function closeVideo(){

const video=$("previewVideo");

video.pause();

video.removeAttribute("src");

video.load();

hide("videoViewer");

}

$("closeVideoViewer").addEventListener(

"click",

closeVideo

);

// ===============================
// Global Access
// ===============================

window.openImage=openImage;

window.openVideo=openVideo;
// ======================================
// Global Message + Error Handler
// Part 8/12
// ======================================

// ===============================
// Global Message
// ===============================

function showMessage(title,message){

$("messageTitle").textContent=title;

$("messageText").textContent=message;

show("messageModal");

}

function closeMessage(){

hide("messageModal");

}

$("messageOkBtn").addEventListener(

"click",

closeMessage

);

window.showMessage=showMessage;

// ===============================
// Error Handler
// ===============================

window.onerror=function(

message,

source,

line,

column,

error

){

console.error({

message,

source,

line,

column,

error

});

toast("Something went wrong");

return false;

};

window.addEventListener(

"unhandledrejection",

event=>{

console.error(event.reason);

toast("Unexpected error");

}

);

// ===============================
// Network Status
// ===============================

window.addEventListener(

"online",

()=>{

toast("Internet Connected");

}

);

window.addEventListener(

"offline",

()=>{

toast("No Internet Connection");

}

);

// ===============================
// App Information
// ===============================

window.Friendsbook={

name:"Friendsbook",

version:"2026",

foundation:"V1"

};
// ======================================
// Admin + User Utilities
// Part 9/12
// ======================================

// ===============================
// Admin
// ===============================

function openAdmin(){

if(!App.admin){

toast("Access denied");

return;

}

openPage("admin");

}

window.openAdmin=openAdmin;

// ===============================
// User Helpers
// ===============================

function getCurrentUser(){

return App.user;

}

function getProfile(){

return App.profile;

}

function isLoggedIn(){

return App.user!==null;

}

window.getCurrentUser=getCurrentUser;

window.getProfile=getProfile;

window.isLoggedIn=isLoggedIn;

// ===============================
// Profile Refresh
// ===============================

async function refreshProfile(){

if(!App.user) return;

try{

await loadProfile(App.user.uid);

}catch(error){

console.error(error);

}

}

window.refreshProfile=refreshProfile;

// ===============================
// Save Current Page
// ===============================

window.addEventListener(

"beforeunload",

()=>{

localStorage.setItem(

"fb_page",

App.page

);

}

);
// ======================================
// Profile + App Utilities
// Part 10/12
// ======================================

// ===============================
// Update Profile Header
// ===============================

function updateProfileUI(){

if(!App.profile) return;

if($("menuUserName")){

$("menuUserName").textContent=
App.profile.name || "Friendsbook User";

}

if($("headerProfile")){

$("headerProfile").src=
App.profile.profilePhoto || "default-profile.png";

}

if($("menuProfileImage")){

$("menuProfileImage").src=
App.profile.profilePhoto || "default-profile.png";

}

}


// ===============================
// Refresh User Data
// ===============================

async function refreshUser(){

if(!App.user) return;

try{

await loadProfile(App.user.uid);

updateProfileUI();

}catch(error){

console.error(error);

toast("Profile update failed");

}

}


// ===============================
// User Status
// ===============================

function userStatus(){

return {

loggedIn:!!App.user,

admin:App.admin,

page:App.page

};

}

window.refreshUser=refreshUser;

window.userStatus=userStatus;


// ===============================
// App Info
// ===============================

console.log(
"Friendsbook Utility Loaded"
);
// ======================================
// Security + Cleanup
// Part 11/12
// ======================================

// ===============================
// Safe User Check
// ===============================

function requireLogin(){

if(!App.user){

toast("Please login first");

return false;

}

return true;

}

window.requireLogin=requireLogin;


// ===============================
// Admin Check
// ===============================

function requireAdmin(){

if(!App.admin){

toast("Admin access required");

return false;

}

return true;

}

window.requireAdmin=requireAdmin;


// ===============================
// Clean Storage Helper
// ===============================

function clearAppStorage(){

localStorage.removeItem("fb_page");

localStorage.removeItem("fb_dark");

}

window.clearAppStorage=clearAppStorage;


// ===============================
// Debug Status
// ===============================

function debugApp(){

console.log({

user:App.user,

profile:App.profile,

admin:App.admin,

page:App.page,

dark:App.dark

});

}

window.debugApp=debugApp;


// ===============================
// Final Cleanup Log
// ===============================

console.log(
"Friendsbook Security Layer Loaded"
);
// ======================================
// Friendsbook 2026
// Final Initialization
// Part 12/12
// ======================================

// ===============================
// Final App Start
// ===============================

function startApp(){

const darkMode =

localStorage.getItem("fb_dark")==="true";


setDarkMode(darkMode);


hideLoading();


console.log(
"Friendsbook 2026 Started"
);


console.log(
"Version: Foundation V1"
);

}


// ===============================
// Start Once
// ===============================

startApp();


// ===============================
// Final API
// ===============================

window.FriendsbookApp={

version:"2026",

status:"Foundation Ready",

user:()=>App.user,

profile:()=>App.profile,

admin:()=>App.admin

};


// ======================================
// END OF SCRIPT.JS
// ======================================
