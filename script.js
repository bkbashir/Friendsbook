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
