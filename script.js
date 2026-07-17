/*==================================
Friendsbook 2026
Core System
==================================*/

const ADMIN_EMAIL="bashirahmed0052@gmail.com";

/*==================================
Pages
==================================*/

const pages={

home:document.getElementById("homePage"),

friends:document.getElementById("friendsPage"),

message:document.getElementById("messagePage"),

notify:document.getElementById("notificationPage"),

reels:document.getElementById("reelsPage"),

market:document.getElementById("marketplacePage"),

search:document.getElementById("searchPage"),

profile:document.getElementById("profilePage"),

settings:document.getElementById("settingsPage"),

admin:document.getElementById("adminPage")

};

/*==================================
Hide All
==================================*/

function hidePages(){

Object.values(pages).forEach(page=>{

if(page) page.style.display="none";

});

}

/*==================================
Open Page
==================================*/

function openPage(name){

hidePages();

if(pages[name]){

pages[name].style.display="block";

}

}

/*==================================
Default Page
==================================*/

openPage("home");

/*==================================
Bottom Navigation
==================================*/

const navHome=document.getElementById("navHome");

const navFriends=document.getElementById("navFriends");

const navReels=document.getElementById("navReels");

const navMarketplace=document.getElementById("navMarketplace");

const navProfile=document.getElementById("navProfile");

function clearNav(){

document.querySelectorAll("#bottomNav button")

.forEach(btn=>btn.classList.remove("active"));

}

navHome.onclick=()=>{

clearNav();

navHome.classList.add("active");

openPage("home");

};

navFriends.onclick=()=>{

clearNav();

navFriends.classList.add("active");

openPage("friends");

};

navReels.onclick=()=>{

clearNav();

navReels.classList.add("active");

openPage("reels");

};

navMarketplace.onclick=()=>{

clearNav();

navMarketplace.classList.add("active");

openPage("market");

};

navProfile.onclick=()=>{

clearNav();

navProfile.classList.add("active");

openPage("profile");

};

navHome.classList.add("active");

/*==================================
Current User
==================================*/

let currentUser=null;
