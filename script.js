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
