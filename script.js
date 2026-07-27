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
isAdmin

}from "./firebase.js";
alert("STEP 1");

window.onerror = function(message, source, line, col, error) {
    alert(
        "ERROR:\n" +
        message +
        "\nLine: " + line
    );
};
alert("STEP 2");

document.addEventListener("DOMContentLoaded", () => {
    alert("STEP 3");
});
// ==============================
// DOM Helper
// ==============================

const $=(id)=>document.getElementById(id);

// ==============================
// App State
// ==============================

const App={

user:null,

profile:null,

page:"home",

dark:false,

admin:false

};

// ==============================
// Helpers
// ==============================

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

function toast(message){

const box=$("toast");

const text=$("toastText");

if(!box||!text)return;

text.textContent=message;

box.classList.remove("hidden");

setTimeout(()=>{

box.classList.add("hidden");

},2500);

}

function showLoading(){

show("globalLoading");

}

function hideLoading(){

hide("globalLoading");

}

// ==============================
// Authentication Pages
// ==============================

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

// ==============================
// Page Events
// ==============================

$("openSignup").onclick=openSignup;

$("openLogin").onclick=openLogin;

$("forgotPasswordBtn").onclick=openForgot;

$("backLogin").onclick=openLogin;
// ======================================
// Authentication
// Part 2/10
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

const credential=

await createUserWithEmailAndPassword(
auth,
email,
password
);

await updateProfile(
credential.user,
{
displayName:name
}
);

await sendEmailVerification(
credential.user
);

await setDoc(
doc(db,"users",credential.user.uid),
createUserObject(
credential.user,
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

toast("Reset email sent");

openLogin();

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

// ==============================
// Button Events
// ==============================

$("loginBtn").onclick=login;

$("signupBtn").onclick=signup;

$("resetPasswordBtn").onclick=forgotPassword;
// ======================================
// Auth State
// Part 3/10
// ======================================

async function loadUserProfile(uid){

try{

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

}catch(error){

console.error(error);

}

}

// ======================================
// Firebase Auth Listener
// ======================================

onAuthStateChanged(

auth,

async(user)=>{

if(!user){

App.user=null;

App.profile=null;

App.admin=false;

show("authContainer");

hide("homePage");

hideLoading();

return;

}

showLoading();

try{

App.user=user;

App.admin=isAdmin(user);

await loadUserProfile(user.uid);

hide("authContainer");

show("homePage");

toast("Welcome");

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

);

// ======================================
// Logout
// ======================================

async function logout(){

showLoading();

try{

await signOut(auth);

}catch(error){

toast(error.message);

}finally{

hideLoading();

}

}

$("logoutBtn").onclick=logout;
// ======================================
// Navigation
// Part 4/10
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

function closeAllPages(){

Object.values(Pages).forEach(page=>{

if(page){

page.classList.add("hidden");

}

});

}

function openPage(name){

closeAllPages();

if(Pages[name]){

Pages[name].classList.remove("hidden");

App.page=name;

}

hide("sideMenu");

hide("overlay");

}

// ==============================
// Bottom Navigation
// ==============================

$("navHome").onclick=()=>openPage("home");

$("navFriends").onclick=()=>openPage("friends");

$("navCreate").onclick=()=>openPage("create");

$("navReels").onclick=()=>openPage("reels");

$("navMessenger").onclick=()=>openPage("messenger");

$("navNotification").onclick=()=>openPage("notification");

$("navProfile").onclick=()=>openPage("profile");

$("navAI").onclick=()=>openPage("ai");

// Header Profile

$("headerProfile").onclick=()=>openPage("profile");
// ======================================
// Side Menu
// Part 5/10
// ======================================

function openMenu(){

show("sideMenu");

show("overlay");

}

function closeMenu(){

hide("sideMenu");

hide("overlay");

}

// ==============================
// Menu Events
// ==============================

$("navMenu").onclick=openMenu;

$("overlay").onclick=closeMenu;

// ==============================
// Menu Navigation
// ==============================

$("menuProfileBtn").onclick=()=>{

openPage("profile");

closeMenu();

};

$("menuSavedBtn").onclick=()=>{

openPage("saved");

closeMenu();

};

$("menuMarketplaceBtn").onclick=()=>{

openPage("marketplace");

closeMenu();

};

$("menuPagesBtn").onclick=()=>{

openPage("pages");

closeMenu();

};

$("menuGroupsBtn").onclick=()=>{

openPage("groups");

closeMenu();

};

$("menuSettingsBtn").onclick=()=>{

openPage("settings");

closeMenu();

};

// ==============================
// Dark Mode
// ==============================

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

const savedDark=

localStorage.getItem("fb_dark");

if(savedDark==="true"){

setDarkMode(true);

}

$("menuDarkBtn").onclick=()=>{

setDarkMode(!App.dark);

toast(

App.dark?

"Dark Mode Enabled":

"Light Mode Enabled"

);

};
// ======================================
// Search + Preview
// Part 6/10
// ======================================

// ==============================
// Search
// ==============================

function searchPosts(keyword){

keyword=keyword.trim().toLowerCase();

console.log("Search:",keyword);

// Future Search Logic

}

$("searchInput").oninput=(e)=>{

searchPosts(e.target.value);

};

$("searchBtn").onclick=()=>{

$("searchInput").focus();

};

// ==============================
// Image Preview
// ==============================

function openImage(src){

$("previewImage").src=src;

show("imageViewer");

}

function closeImage(){

$("previewImage").src="";

hide("imageViewer");

}

$("closeImageViewer").onclick=closeImage;

// ==============================
// Video Preview
// ==============================

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

$("closeVideoViewer").onclick=closeVideo;

// Global Access

window.openImage=openImage;

window.openVideo=openVideo;
