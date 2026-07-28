// ======================================
// Friendsbook 2026
// Script.js
// Part 1/10
// Foundation
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
isAdmin,

getDefaultProfile,
getDefaultCover,
getDefaultBio,

appName,
appVersion

}from "./firebase.js";

// ======================================
// DOM
// ======================================

const $=(id)=>document.getElementById(id);

// ======================================
// APP
// ======================================

const App={

user:null,

profile:null,

page:"home",

admin:false,

dark:false

};

// ======================================
// Helpers
// ======================================

function show(id){

const el=$(id);

if(el){

el.classList.remove("hidden");

}

}

function hide(id){

const el=$(id);

if(el){

el.classList.add("hidden");

}

}

// ======================================
// Toast
// ======================================

function toast(message){

const box=$("toast");

const text=$("toastText");

if(!box||!text)return;

text.textContent=message;

box.classList.remove("hidden");

clearTimeout(box.timer);

box.timer=setTimeout(()=>{

box.classList.add("hidden");

},2500);

}

// ======================================
// Loading
// ======================================

function showLoading(){

show("globalLoading");

}

function hideLoading(){

hide("globalLoading");

}

// ======================================
// Authentication Pages
// ======================================

function openLogin(){

show("loginPage");

hide("signupPage");

hide("forgotPage");

}

function openSignup(){

hide("loginPage");

show("signupPage");

hide("forgotPage");

}

function openForgot(){

hide("loginPage");

hide("signupPage");

show("forgotPage");

}

// ======================================
// Page Switch
// ======================================

const openSignupBtn = $("openSignup");
const openLoginBtn = $("openLogin");
const forgotBtn = $("forgotPasswordBtn");
const backLoginBtn = $("backLogin");

if (openSignupBtn) openSignupBtn.onclick = openSignup;
if (openLoginBtn) openLoginBtn.onclick = openLogin;
if (forgotBtn) forgotBtn.onclick = openForgot;
if (backLoginBtn) backLoginBtn.onclick = openLogin;
console.log(

appName(),
appVersion(),
"Script Loaded"

);
// ======================================
// Authentication
// Part 2/10
// ======================================

// Login
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

// Signup
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

toast("Verification email sent");

openLogin();

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

// Forgot Password
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

toast("Reset link sent");

openLogin();

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

// Button Events

$("loginBtn").onclick=login;

$("signupBtn").onclick=signup;

$("resetPasswordBtn").onclick=forgotPassword;
// ======================================
// Auth State
// Part 3/10
// ======================================

onAuthStateChanged(auth, async(user)=>{
alert("AUTH START");
if(user){

App.user=user;

hide("authContainer");

show("homePage");

try{

const snap=await getDoc(
doc(db,"users",user.uid)
);

if(snap.exists()){

App.profile=snap.data();

}

}catch(error){

console.log(error);

}

$("headerProfile").src=
App.profile?.profilePhoto||
getDefaultProfile();

$("menuProfileImage").src=
App.profile?.profilePhoto||
getDefaultProfile();

$("menuUserName").textContent=
App.profile?.name||
user.displayName||
"Friendsbook User";

App.admin=isAdmin(user);

if(App.admin){

show("adminPage");

}else{

hide("adminPage");

}

toast("Welcome "+(
user.displayName||
"User"
));

}else{

App.user=null;

App.profile=null;

hide("homePage");

show("authContainer");

openLogin();

}
alert("AUTH END");
});

// ======================================
// Logout
// ======================================

async function logout(){

try{

await signOut(auth);

toast("Logged out");

}catch(error){

toast(error.message);

}

}

$("logoutBtn").onclick=logout;
// ======================================
// Navigation
// Part 4/10
// ======================================

const pages={

home:null,

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

Object.values(pages).forEach(page=>{

if(page){

page.classList.add("hidden");

}

});

$("mainContent").classList.remove("hidden");

}

function openPage(page){

hideAllPages();

App.page=page;

if(page==="home"){

$("mainContent").classList.remove("hidden");

return;

}

$("mainContent").classList.add("hidden");

if(pages[page]){

pages[page].classList.remove("hidden");

}

}

// Bottom Navigation

$("navHome").onclick=()=>openPage("home");

$("navFriends").onclick=()=>openPage("friends");

$("navCreate").onclick=()=>openPage("create");

$("navReels").onclick=()=>openPage("reels");

$("navMessenger").onclick=()=>openPage("messenger");

$("navNotification").onclick=()=>openPage("notification");

$("navProfile").onclick=()=>openPage("profile");

$("navAI").onclick=()=>openPage("ai");
// ======================================
// Side Menu + Search + Dark Mode
// Part 5/10
// ======================================

// =============================
// Side Menu
// =============================

function openMenu(){

show("sideMenu");
show("overlay");

}

function closeMenu(){

hide("sideMenu");
hide("overlay");

}

$("navMenu").onclick=openMenu;

$("overlay").onclick=closeMenu;

// =============================
// Search
// =============================

function searchPosts(){

const keyword=$("searchInput")
.value
.trim()
.toLowerCase();

console.log("Search:",keyword);

// Search System
// Coming Next Phase

}

$("searchBtn").onclick=searchPosts;

$("searchInput").addEventListener(

"keyup",

function(e){

if(e.key==="Enter"){

searchPosts();

}

}

);

// =============================
// Dark Mode
// =============================

$("menuDarkBtn").onclick=function(){

document.body.classList.toggle("dark");

App.dark=!App.dark;

toast(

App.dark?

"Dark Mode Enabled":

"Dark Mode Disabled"

);

};

// =============================
// Menu Buttons
// =============================

$("menuProfileBtn").onclick=()=>{

closeMenu();

openPage("profile");

};

$("menuSavedBtn").onclick=()=>{

closeMenu();

openPage("saved");

};

$("menuMarketplaceBtn").onclick=()=>{

closeMenu();

openPage("marketplace");

};

$("menuPagesBtn").onclick=()=>{

closeMenu();

openPage("pages");

};

$("menuGroupsBtn").onclick=()=>{

closeMenu();

openPage("groups");

};

$("menuSettingsBtn").onclick=()=>{

closeMenu();

openPage("settings");

};
// ======================================
// Preview + Message Modal
// Part 6/10
// ======================================

// =============================
// Message Modal
// =============================

function showMessage(title,message){

$("messageTitle").textContent=title;

$("messageText").textContent=message;

show("messageModal");

}

function closeMessage(){

hide("messageModal");

}

$("messageOkBtn").onclick=closeMessage;

// =============================
// Image Preview
// =============================

function openImage(src){

$("previewImage").src=src;

show("imageViewer");

show("overlay");

}

function closeImage(){

$("previewImage").src="";

hide("imageViewer");

hide("overlay");

}

$("closeImageViewer").onclick=closeImage;

// =============================
// Video Preview
// =============================

function openVideo(src){

const video=$("previewVideo");

video.src=src;

show("videoViewer");

show("overlay");

video.play();

}

function closeVideo(){

const video=$("previewVideo");

video.pause();

video.removeAttribute("src");

video.load();

hide("videoViewer");

hide("overlay");

}

$("closeVideoViewer").onclick=closeVideo;

// =============================
// Global Access
// =============================

window.openImage=openImage;

window.openVideo=openVideo;

window.showMessage=showMessage;
// ======================================
// Header + Feed Foundation
// Part 7/10
// ======================================

// =============================
// Header Buttons
// =============================

$("headerLogo").onclick=()=>{

openPage("home");

};

$("headerProfile").onclick=()=>{

openPage("profile");

};

$("messengerBtn").onclick=()=>{

openPage("messenger");

};

$("notificationBtn").onclick=()=>{

openPage("notification");

};

// =============================
// Feed
// =============================

function clearFeed(){

$("feedContainer").innerHTML="";

}

function emptyFeed(){

$("feedContainer").innerHTML=`

<div class="emptyFeed">

<h3>No Posts Yet</h3>

<p>Create your first post.</p>

</div>

`;

}

function loadFeed(){

clearFeed();

emptyFeed();

}

// =============================
// App Start
// =============================

document.addEventListener(

"DOMContentLoaded",

()=>{

openLogin();

loadFeed();

hide("sideMenu");

hide("overlay");

hide("globalLoading");

}

);

// =============================
// Console
// =============================

console.log(

"Friendsbook 2026 Ready"

);
