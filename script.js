// =========================
// Friendsbook 2026
// Part 1
// =========================

// Header Buttons

const menuBtn=document.getElementById("menuBtn");

const createBtn=document.getElementById("createBtn");

const searchBtn=document.getElementById("searchBtn");

const messageBtn=document.getElementById("messageBtn");

// =========================
// Menu
// =========================

menuBtn.addEventListener("click",()=>{

console.log("Open Menu");

});

// =========================
// Create
// =========================

createBtn.addEventListener("click",()=>{

console.log("Create");

});

// =========================
// Search
// =========================

searchBtn.addEventListener("click",()=>{

console.log("Search");

});

// =========================
// Messenger
// =========================

messageBtn.addEventListener("click",()=>{

console.log("Messenger");

});

// =========================
// App Ready
// =========================

window.onload=()=>{

console.log("Friendsbook 2026 Loaded");

};
// =========================
// Friendsbook 2026
// Part 2
// Create Post + Stories
// =========================

// Create Post

const postInput=document.querySelector(".postTop input");

const livePostBtn=document.getElementById("livePostBtn");

const photoPostBtn=document.getElementById("photoPostBtn");

const feelingPostBtn=document.getElementById("feelingPostBtn");

// Story

const createStory=document.querySelector(".createStory");

// =========================
// Create Post
// =========================

postInput.addEventListener("click",()=>{

console.log("Open Create Post");

});

livePostBtn.addEventListener("click",()=>{

console.log("Live Video");

});

photoPostBtn.addEventListener("click",()=>{

console.log("Photo Upload");

});

feelingPostBtn.addEventListener("click",()=>{

console.log("Feeling Activity");

});

// =========================
// Story
// =========================

createStory.addEventListener("click",()=>{

console.log("Create Story");

});

// Story Click

document.querySelectorAll(".story").forEach(story=>{

story.addEventListener("click",()=>{

console.log("Open Story");

});

});
// =========================
// Friendsbook 2026
// Feed Reaction System
// =========================

const likeBtn=document.querySelector(".likeBtn");
const likeCount=document.querySelector(".likeCount");

const reactions=document.querySelectorAll(".reaction");

let totalLike=0;

// =========================
// Reactions
// =========================

reactions.forEach(item=>{

item.onclick=()=>{

const emoji=item.innerHTML;

likeBtn.innerHTML=emoji+" Like";

likeBtn.style.color="#1877F2";

totalLike++;

likeCount.innerHTML=emoji+" "+totalLike;

};

});

// =========================
// Comment
// =========================

document.querySelector(".commentBtn").onclick=()=>{

let comment=prompt("Write a comment");

if(comment){

alert("Comment Added:\n\n"+comment);

}

};

// =========================
// Share
// =========================

document.querySelector(".shareBtn").onclick=()=>{

if(navigator.share){

navigator.share({

title:"Friendsbook",

text:"Check this post",

url:location.href

});

}else{

alert("Post Shared");

}

};

// =========================
// 3 Dot Menu
// =========================

document.querySelector(".postMenu").onclick=()=>{

let option=prompt(

"1 = Edit\n2 = Delete\n3 = Save"

);

if(option=="1"){

alert("Edit Post");

}

else if(option=="2"){

document.querySelector(".postCard").remove();

}

else if(option=="3"){

alert("Post Saved");

}

};
// =========================
// Friendsbook 2026
// Profile System
// =========================

const profileName=document.getElementById("profileName");

const profileBio=document.getElementById("profileBio");

const editProfileBtn=document.getElementById("editProfileBtn");

const shareProfileBtn=document.getElementById("shareProfileBtn");

const changeProfileBtn=document.getElementById("changeProfileBtn");

const changeCoverBtn=document.getElementById("changeCoverBtn");

const profilePhoto=document.getElementById("profilePhoto");

const coverPhoto=document.getElementById("coverPhoto");

const profileContent=document.getElementById("profileContent");

// =========================
// Edit Profile
// =========================

editProfileBtn.onclick=()=>{

let name=prompt("Enter Name",profileName.innerText);

if(name){

profileName.innerText=name;

}

let bio=prompt("Enter Bio",profileBio.innerText);

if(bio){

profileBio.innerText=bio;

}

};

// =========================
// Share Profile
// =========================

shareProfileBtn.onclick=()=>{

if(navigator.share){

navigator.share({

title:"Friendsbook Profile",

text:"Visit my Friendsbook profile",

url:location.href

});

}else{

alert("Profile Shared");

}

};

// =========================
// Change Photo
// =========================

changeProfileBtn.onclick=()=>{

alert("Profile Photo Upload Coming Soon");

};

changeCoverBtn.onclick=()=>{

alert("Cover Photo Upload Coming Soon");

};

// =========================
// Tabs
// =========================

const tabBtns=document.querySelectorAll(".tabBtn");

tabBtns.forEach(btn=>{

btn.onclick=()=>{

tabBtns.forEach(item=>{

item.classList.remove("active");

});

btn.classList.add("active");

profileContent.innerHTML=

"<h3 style='color:white'>"+btn.innerText+"</h3>";

};

});

// =========================
// Default
// =========================

profileContent.innerHTML=

"<h3 style='color:white'>Posts</h3>";
// =========================
// Menu Drawer
// Friendsbook 2026
// =========================

const menuBtn=document.getElementById("menuBtn");

const menuDrawer=document.getElementById("menuDrawer");

const menuOverlay=document.getElementById("menuOverlay");

// =========================
// Open Menu
// =========================

menuBtn.onclick=()=>{

menuDrawer.classList.add("active");

menuOverlay.classList.add("active");

};

// =========================
// Close Menu
// =========================

menuOverlay.onclick=()=>{

menuDrawer.classList.remove("active");

menuOverlay.classList.remove("active");

};

// =========================
// Menu Buttons
// =========================

friendsBtn.onclick=()=>{

alert("Friends");

};

savedBtn.onclick=()=>{

alert("Saved");

};

memoryBtn.onclick=()=>{

alert("Memories");

};

reelsMenuBtn.onclick=()=>{

alert("Reels");

};

marketBtn.onclick=()=>{

alert("Marketplace");

};

groupsBtn.onclick=()=>{

alert("Groups");

};

pagesBtn.onclick=()=>{

alert("Pages");

};

settingsBtn.onclick=()=>{

alert("Settings & Privacy");

};

helpBtn.onclick=()=>{

alert("Help & Support");

};

logoutBtn.onclick=()=>{

if(confirm("Logout from Friendsbook?")){

alert("Logged Out");

}

};
