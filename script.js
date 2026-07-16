// =========================
// Friendsbook V3
// Feature 1
// Header + Navigation
// =========================

const navItems=document.querySelectorAll(".navItem");

navItems.forEach(btn=>{

btn.addEventListener("click",()=>{

navItems.forEach(item=>{

item.classList.remove("active");

});

btn.classList.add("active");

});

});

// =========================
// Header Buttons
// =========================

menuBtn.onclick=()=>{

alert("Menu Coming Soon");

};

createBtn.onclick=()=>{

alert("Create Coming Soon");

};

searchBtn.onclick=()=>{

alert("Search Coming Soon");

};

messageBtn.onclick=()=>{

alert("Messenger Coming Soon");

};

// =========================
// Navigation
// =========================

homeBtn.onclick=()=>{

console.log("Home");

};

reelsBtn.onclick=()=>{

console.log("Reels");

};

marketBtn.onclick=()=>{

console.log("Marketplace");

};

notifyBtn.onclick=()=>{

console.log("Notifications");

};

profileBtn.onclick=()=>{

console.log("Profile");

};
// =========================
// Feature 2
// Menu Drawer
// =========================

const menuBtn = document.getElementById("menuBtn");
const menuDrawer = document.getElementById("menuDrawer");
const menuOverlay = document.getElementById("menuOverlay");

menuBtn.addEventListener("click", () => {

    menuDrawer.classList.add("active");
    menuOverlay.classList.add("active");

});

menuOverlay.addEventListener("click", () => {

    menuDrawer.classList.remove("active");
    menuOverlay.classList.remove("active");

});

// =========================
// Menu Buttons
// =========================

document.getElementById("profileMenuBtn").onclick = () => {

    alert("Profile");

};

document.getElementById("friendsMenuBtn").onclick = () => {

    alert("Friends");

};

document.getElementById("savedMenuBtn").onclick = () => {

    alert("Saved");

};

document.getElementById("reelsMenuBtn").onclick = () => {

    alert("Reels");

};

document.getElementById("marketMenuBtn").onclick = () => {

    alert("Marketplace");

};

document.getElementById("settingMenuBtn").onclick = () => {

    alert("Settings");

};

document.getElementById("logoutMenuBtn").onclick = () => {

    alert("Logout");

};
