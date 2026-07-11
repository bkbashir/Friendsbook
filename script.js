// ===============================
// Friendsbook V4
// script.js
// ===============================

import { auth } from "./firebase.js";

const pages = document.querySelectorAll(".page");

function hidePages(){

pages.forEach(page=>{

page.style.display="none";

});

}

export function showPage(id){

hidePages();

const page = document.getElementById(id);

if(page){

page.style.display="block";

}

}

// ===============================
// Navigation
// ===============================

document.getElementById("homePageBtn").onclick=()=>{

hidePages();

document.getElementById("feedPage").style.display="block";

};

document.getElementById("profilePageBtn").onclick=()=>{

showPage("profilePage");

};

document.getElementById("friendsPageBtn").onclick=()=>{

showPage("friendsPage");

};

document.getElementById("storyPageBtn").onclick=()=>{

showPage("storyPage");

};

document.getElementById("reelsPageBtn").onclick=()=>{

showPage("reelsPage");

};

document.getElementById("messageBtn").onclick=()=>{

showPage("messagePage");

};

document.getElementById("notificationBtn").onclick=()=>{

showPage("notificationPage");

};

document.getElementById("settingsPageBtn").onclick=()=>{

showPage("settingsPage");

};// ===============================
// Loading Screen
// ===============================

window.addEventListener("load",()=>{

setTimeout(()=>{

document.getElementById("loadingScreen").style.display="none";

},1200);

});

// ===============================
// Search
// ===============================

const searchInput=document.getElementById("searchInput");

searchInput.onkeyup=()=>{

const value=searchInput.value.toLowerCase();

document.querySelectorAll(".postCard").forEach(post=>{

const text=post.innerText.toLowerCase();

post.style.display=text.includes(value)?"block":"none";

});

};

// ===============================
// Dark Mode
// ===============================

const darkMode=document.getElementById("darkMode");

if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

darkMode.checked=true;

}

darkMode.onchange=()=>{

if(darkMode.checked){

document.body.classList.add("dark");

localStorage.setItem("theme","dark");

}else{

document.body.classList.remove("dark");

localStorage.setItem("theme","light");

}

};

// ===============================
// Clear Cache
// ===============================

document.getElementById("clearCacheBtn").onclick=()=>{

if(confirm("সব Local Data Delete করবেন?")){

localStorage.clear();

location.reload();

}

};// ===============================
// Friendsbook V4
// Profile + Mobile Menu
// ===============================

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{

if(user){

hidePages();

document.getElementById("feedPage").style.display="block";

}else{

document.getElementById("loginPage").style.display="flex";

document.getElementById("mainApp").style.display="none";

}

});

// ===============================
// Mobile Menu
// ===============================

const menuBtn=document.getElementById("menuBtn");

const leftSidebar=document.getElementById("leftSidebar");

let menuOpen=false;

menuBtn.onclick=()=>{

if(window.innerWidth<=1100){

menuOpen=!menuOpen;

leftSidebar.style.display=menuOpen?"block":"none";

}

};

// ===============================
// Responsive
// ===============================

window.addEventListener("resize",()=>{

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

document.getElementById("profilePhoto").onclick=()=>{

showPage("profilePage");

};

document.getElementById("profileImage").onclick=()=>{

showPage("profilePage");

};

// ===============================
// Home Shortcut
// ===============================

document.querySelector(".logo").onclick=()=>{

hidePages();

document.getElementById("feedPage").style.display="block";

};

// ===============================
// End Script Part 3
// ===============================
