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
