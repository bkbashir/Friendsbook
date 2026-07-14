// ===============================
// Friendsbook V5
// script.js Part 1
// ===============================

// Imports
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ===============================
// Elements
// ===============================

const pages=document.querySelectorAll(".page");

const loadingScreen=document.getElementById("loadingScreen");

const loginPage=document.getElementById("loginPage");

const mainApp=document.getElementById("mainApp");

// ===============================
// Hide All Pages
// ===============================

export function hidePages(){

pages.forEach(page=>{

page.style.display="none";

});

}

// ===============================
// Show Page
// ===============================

export function showPage(id){

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

// ===============================
// Open Feed
// ===============================

export function openFeed(){

showPage("feedPage");

}

// ===============================
// Authentication
// ===============================

onAuthStateChanged(auth,(user)=>{

if(user){

if(loginPage){

loginPage.style.display="none";

}

if(mainApp){

mainApp.style.display="block";

}

openFeed();

}else{

if(loginPage){

loginPage.style.display="flex";

}

if(mainApp){

mainApp.style.display="none";

}

}

});

// ===============================
// Loading Screen
// ===============================

window.addEventListener("load",()=>{

setTimeout(()=>{

if(loadingScreen){

loadingScreen.style.display="none";

}

},1000);

});

// ===============================
// Navigation Buttons
// ===============================

document.getElementById("homePageBtn")?.addEventListener("click",()=>{

openFeed();

});

document.getElementById("profilePageBtn")?.addEventListener("click",()=>{

showPage("profilePage");

});

document.getElementById("friendsPageBtn")?.addEventListener("click",()=>{

showPage("friendsPage");

});

document.getElementById("storyPageBtn")?.addEventListener("click",()=>{

showPage("storyPage");

});

document.getElementById("reelsPageBtn")?.addEventListener("click",()=>{

showPage("reelsPage");

});

document.getElementById("messageBtn")?.addEventListener("click",()=>{

showPage("messagePage");

});

document.getElementById("notificationBtn")?.addEventListener("click",()=>{

showPage("notificationPage");

});

document.getElementById("settingsPageBtn")?.addEventListener("click",()=>{

showPage("settingsPage");

});

// ===============================
// End Part 1
// ===============================// ===============================
// Friendsbook V5
// script.js Part 2
// ===============================

// ===============================
// Search
// ===============================

const searchInput=document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const value=searchInput.value.toLowerCase();

document.querySelectorAll(".postCard").forEach(post=>{

const text=post.innerText.toLowerCase();

post.style.display=text.includes(value)?"block":"none";

});

});

}

// ===============================
// Dark Mode
// ===============================

const darkMode=document.getElementById("darkMode");

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

if(darkMode){

darkMode.checked=true;

}

}

if(darkMode){

darkMode.addEventListener("change",()=>{

if(darkMode.checked){

document.body.classList.add("dark");

localStorage.setItem("theme","dark");

}else{

document.body.classList.remove("dark");

localStorage.setItem("theme","light");

}

});

}

// ===============================
// Mobile Menu
// ===============================

const menuBtn=document.getElementById("menuBtn");

const leftSidebar=document.getElementById("leftSidebar");

let menuOpen=false;

if(menuBtn){

menuBtn.addEventListener("click",()=>{

if(window.innerWidth<=1100){

menuOpen=!menuOpen;

if(leftSidebar){

leftSidebar.style.display=

menuOpen?"block":"none";

}

}

});

}

// ===============================
// Responsive
// ===============================

window.addEventListener("resize",()=>{

if(!leftSidebar) return;

if(window.innerWidth>1100){

leftSidebar.style.display="block";

}else{

leftSidebar.style.display="none";

menuOpen=false;

}

});

// ===============================
// Profile Shortcut
// ===============================

document.getElementById("profilePhoto")?.addEventListener("click",()=>{

showPage("profilePage");

});

document.getElementById("profileImage")?.addEventListener("click",()=>{

showPage("profilePage");

});

// ===============================
// Logo Shortcut
// ===============================

document.querySelector(".logo")?.addEventListener("click",()=>{

openFeed();

});

// ===============================
// End Part 2
// ===============================// ===============================
// Friendsbook V5
// script.js Part 3 (Final)
// ===============================

// ===============================
// Clear Local Cache
// ===============================

document.getElementById("clearCacheBtn")?.addEventListener("click",()=>{

if(confirm("সব Local Data Delete করবেন?")){

localStorage.clear();

sessionStorage.clear();

location.reload();

}

});

// ===============================
// Online / Offline Status
// ===============================

window.addEventListener("online",()=>{

console.log("Internet Connected");

});

window.addEventListener("offline",()=>{

console.log("Internet Disconnected");

});

// ===============================
// Keyboard Shortcut
// ===============================

window.addEventListener("keydown",(e)=>{

// Home

if(e.altKey && e.key==="1"){

openFeed();

}

// Profile

if(e.altKey && e.key==="2"){

showPage("profilePage");

}

// Friends

if(e.altKey && e.key==="3"){

showPage("friendsPage");

}

// Messages

if(e.altKey && e.key==="4"){

showPage("messagePage");

}

});

// ===============================
// Global Logout
// ===============================

window.logout=async()=>{

await auth.signOut();

localStorage.clear();

sessionStorage.clear();

location.reload();

};

// ===============================
// App Version
// ===============================

window.FRIENDSBOOK={

name:"Friendsbook",

version:"5.0.0",

developer:"Bashir Ahmed"

};

// ===============================
// Initialize App
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

console.log(

`${FRIENDSBOOK.name} ${FRIENDSBOOK.version} Loaded`

);

});
const ADMIN_EMAIL = "bashirahmed0052@gmail.com";

const adminBtn = document.getElementById("adminPanelBtn");

onAuthStateChanged(auth, (user) => {

    if (!adminBtn) return;

    if (user && user.email === ADMIN_EMAIL) {

        adminBtn.style.display = "flex";

    } else {

        adminBtn.style.display = "none";

    }

});

if (adminBtn) {
    adminBtn.addEventListener("click", () => {
        location.href = "admin.html";
    });
}
// ===============================
// End script.js
// ===============================
window.onerror = function(message, source, line, col) {
    alert("ERROR:\n" + message + "\nLine: " + line);
};
