// import { openChat } from "./message.js";
// import { loadFriends } from "./friends.js";
import { auth, db, storage } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

"use strict";

//======================
// Friendsbook v3
// Part 3A
//======================

const $ = id => document.getElementById(id);

// Pages
const loginPage = $("loginPage");
const registerPage = $("registerPage");
const homePage = $("homePage");

// Login
const loginEmail = $("loginEmail");
const loginPassword = $("loginPassword");
const loginBtn = $("loginBtn");

// Register
const regName = $("regName");
const regEmail = $("regEmail");
const regPassword = $("regPassword");
const regConfirm = $("regConfirm");
const registerBtn = $("registerBtn");

// Links
const openRegister = $("openRegister");
const backLogin = $("backLogin");

// Profile
const userName = $("userName");
const userBio = $("userBio");

//======================
// Page Switch
//======================

function showLogin(){
    loginPage.style.display="flex";
    registerPage.style.display="none";
    homePage.style.display="none";
}

function showRegister(){
    loginPage.style.display="none";
    registerPage.style.display="flex";
    homePage.style.display="none";
}

    function showHome(){

    loginPage.style.display="none";
    registerPage.style.display="none";
    homePage.style.display="block";

    userName.textContent =
        localStorage.getItem("fb_name") || "Your Name";

    userBio.textContent =
        localStorage.getItem("fb_bio") || "No bio added yet";
userLocation.textContent =
"📍 " + (localStorage.getItem("fb_location") || "No location");

userWork.textContent =
"💼 " + (localStorage.getItem("fb_work") || "No work");

userEducation.textContent =
"🎓 " + (localStorage.getItem("fb_education") || "No education");

userRelationship.textContent =
"❤️ " + (localStorage.getItem("fb_relationship") || "No relationship");
    const profile = localStorage.getItem("fb_profile");
    if(profile){
        profileImage.src = profile;
    }

    const cover = localStorage.getItem("fb_cover");
    if(cover){
        coverImage.src = cover;
    }

}
if (openRegister) {
    openRegister.onclick = showRegister;
}

if (backLogin) {
    backLogin.onclick = showLogin;
}

//======================
// Register
//======================

registerBtn.onclick = async function(){

    if(
        regName.value.trim()===""||
        regEmail.value.trim()===""||
        regPassword.value===""||
        regConfirm.value===""){
        alert("সব তথ্য পূরণ করুন");
        return;
    }

    if(regPassword.value!==regConfirm.value){
        alert("Password মিলছে না");
        return;
    }

    try{

        await createUserWithEmailAndPassword(
            auth,
            regEmail.value.trim(),
            regPassword.value
        );

        await setDoc(doc(db,"users",regEmail.value.trim()),{

    uid: auth.currentUser.uid,

    name: regName.value.trim(),

    email: regEmail.value.trim(),

    profile: "",

    cover: "",

    bio: "",

    location: "",

    work: "",

    education: "",

    relationship: "",

    followers: 0,

    following: 0,

    friends: 0,

    createdAt: new Date().toISOString()

});

        alert("Account Created");

        showLogin();

    }catch(e){

        alert(e.message);

    }

};
//======================
// Login
//======================

loginBtn.onclick = async function(){

    if(
        loginEmail.value.trim()===""||
        loginPassword.value===""){
        alert("Email এবং Password দিন");
        return;
    }

    try{

        await signInWithEmailAndPassword(
            auth,
            loginEmail.value.trim(),
            loginPassword.value
        );

        localStorage.setItem("fb_login","true");

        showHome();

    }catch(e){

        alert("Wrong Email or Password");

    }

};

//======================
// Auto Login
//======================

window.onload=function(){

    if(localStorage.getItem("fb_login")==="true"){

        showHome();

    }else{

        showLogin();

    }

};
//======================
// Friendsbook v3
// Part 3B - Edit Profile
//======================

const editProfileBtn = $("editProfileBtn");
const editProfileModal = $("editProfileModal");
const closeProfileBtn = $("closeProfileBtn");
const saveProfileBtn = $("saveProfileBtn");

const editName = $("editName");
const editBio = $("editBio");
const editLocation = $("editLocation");
const editWork = $("editWork");
const editEducation = $("editEducation");
const editRelationship = $("editRelationship");

const userLocation = $("userLocation");
const userWork = $("userWork");
const userEducation = $("userEducation");
const userRelationship = $("userRelationship");
const profileImage = $("profileImage");
const coverImage = $("coverImage");

const profileInput = $("profileInput");
const coverInput = $("coverInput");

let profileData = localStorage.getItem("fb_profile") || "";
let coverData = localStorage.getItem("fb_cover") || "";

// Load saved images
if(profileData) profileImage.src = profileData;
if(coverData) coverImage.src = coverData;

// Open Edit Profile
editProfileBtn.onclick = function(){

    editProfileModal.style.display = "flex";

    editName.value = localStorage.getItem("fb_name") || "";
    editBio.value = localStorage.getItem("fb_bio") || "";

    editLocation.value = localStorage.getItem("fb_location") || "";
    editWork.value = localStorage.getItem("fb_work") || "";
    editEducation.value = localStorage.getItem("fb_education") || "";
    editRelationship.value = localStorage.getItem("fb_relationship") || "";

};

// Close
closeProfileBtn.onclick = function(){

    editProfileModal.style.display = "none";

};

// Profile Image
profileInput.onchange = function(){

    const file = this.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(){

        profileData = reader.result;
        profileImage.src = profileData;

    };

    reader.readAsDataURL(file);

};

// Cover Image
coverInput.onchange = function(){

    const file = this.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(){

        coverData = reader.result;
        coverImage.src = coverData;

    };

    reader.readAsDataURL(file);

};

// Save Profile
saveProfileBtn.onclick = function(){

    localStorage.setItem("fb_name", editName.value.trim());
    localStorage.setItem("fb_bio", editBio.value.trim());

    localStorage.setItem("fb_location", editLocation.value.trim());
    localStorage.setItem("fb_work", editWork.value.trim());
    localStorage.setItem("fb_education", editEducation.value.trim());
    localStorage.setItem("fb_relationship", editRelationship.value);

    if(profileData){
        localStorage.setItem("fb_profile", profileData);
    }

    if(coverData){
        localStorage.setItem("fb_cover", coverData);
    }

    userName.textContent = editName.value.trim();
    userBio.textContent = editBio.value.trim();

    userLocation.textContent = "📍 " + (editLocation.value.trim() || "No location");
    userWork.textContent = "💼 " + (editWork.value.trim() || "No work");
    userEducation.textContent = "🎓 " + (editEducation.value.trim() || "No education");
    userRelationship.textContent = "❤️ " + (editRelationship.value || "No relationship");

    editProfileModal.style.display = "none";

    alert("Profile Saved");

};
//======================
// Friendsbook v3
// Part 3C - Text Post
//======================

const postBtn = $("postBtn");
const postText = $("postText");
const postImage = $("postImage");
const feed = $("feed");
const videoInput = $("videoInput");
const addVideo = $("addVideo");
addVideo.onclick = function () {
    videoInput.click();
};
let posts = JSON.parse(localStorage.getItem("fb_posts")) || [];

function renderPosts() {

    feed.innerHTML = "";

    posts.slice().reverse().forEach((post, index) => {

        const realIndex = posts.length - 1 - index;

        let commentsHtml = "";

        if (post.comments) {

            post.comments.forEach(c => {

                commentsHtml += `
                <div style="background:#f2f2f2;padding:8px;margin-top:6px;border-radius:8px;">
                    <b>${c.name}</b><br>
                    ${c.text}
                </div>
                `;

            });

        }

        feed.innerHTML += `
        <div class="post">

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">

                <img src="${localStorage.getItem("fb_profile") || "https://placehold.co/60"}"
                style="width:45px;height:45px;border-radius:50%;object-fit:cover;">

                <div>
                    <b>${post.name}</b><br>
                    <small>${post.time}</small>
                </div>

            </div>

            <p>${post.text}</p>
            ${post.image ? `
<img src="${post.image}"
style="width:100%;margin-top:10px;border-radius:10px;">
` : ""}
            <div style="display:flex;gap:10px;margin-top:12px;">
<button onclick="likePost(${realIndex})">

${post.reaction || "👍"}
(
${post.reactions["👍"]},
${post.reactions["❤️"]},
${post.reactions["😂"]},
${post.reactions["😮"]},
${post.reactions["😢"]},
${post.reactions["😡"]}
)
</button>
                <button onclick="addComment(${realIndex})">
                    💬 Comment
                </button>
<button onclick="sharePost(${realIndex})">
🔄 Share
</button>
                <button onclick="deletePost(${realIndex})">
                    🗑 Delete
                </button>

            </div>

            ${commentsHtml}

        </div>
        `;

    });

}

postBtn.onclick = function(){

    const text = postText.value.trim();

    if(text === "" && postImage.files.length === 0){
      console.log("Post button clicked");
        alert("Write something or select an image");
        return;
    }

    const savePost = function(imageData){

        posts.push({

            name: localStorage.getItem("fb_name") || "User",

            text: text,

            image: imageData,

            time: new Date().toLocaleString(),

            comments: [],

            reaction: "👍",

reactions: {
    "👍":0,
    "❤️":0,
    "😂":0,
    "😮":0,
    "😢":0,
    "😡":0
},

reacted:false

        });

        try{

    localStorage.setItem("fb_posts", JSON.stringify(posts));

}catch(e){

    alert("Storage Full! Delete some image posts.");

    console.log(e);

}

        postText.value = "";
        postImage.value = "";

        renderPosts();

    };

    if(postImage.files.length > 0){

        const reader = new FileReader();

        reader.onload = function(){

            savePost(reader.result);

        };

        reader.readAsDataURL(postImage.files[0]);

    }else{

        savePost("");

    }

};

renderPosts();

//======================
// Friendsbook v3
// Part 3D - Delete Post
//======================

function deletePost(postIndex){

    const ok = confirm("Delete this post?");

    if(!ok) return;

    posts.splice(postIndex,1);

    localStorage.setItem(
        "fb_posts",
        JSON.stringify(posts)
    );

    renderPosts();

}
let notifications =
JSON.parse(localStorage.getItem("fb_notifications")) || [];

function addNotification(text){

    notifications.unshift({
        text:text,
        time:new Date().toLocaleString()
    });

    localStorage.setItem(
        "fb_notifications",
        JSON.stringify(notifications)
    );

    renderNotifications();

}

function renderNotifications(){

    const box = $("notificationList");

    if(!box) return;

    box.innerHTML="";

    notifications.forEach(n=>{

        box.innerHTML += `
        <div class="post">
            <b>${n.text}</b><br>
            <small>${n.time}</small>
        </div>
        `;

    });

}

renderNotifications();
//======================
// Part 3E - Comments
//======================

function addComment(postIndex){

    const text = prompt("Write a comment");

    if(!text) return;

    posts[postIndex].comments.push({

        name: localStorage.getItem("fb_name"),

        text: text,

        time: new Date().toLocaleString()

    });
  
addNotification("💬 Someone commented on your post");
    localStorage.setItem(
        "fb_posts",
        JSON.stringify(posts)
    );

    renderPosts();

}
//======================
// Part 3F - Share Post
//======================

function sharePost(postIndex){

    const post = posts[postIndex];

  addNotification("🔄 Someone shared your post");
    const text =
`${post.name}

${post.text}

Shared from Friendsbook`;

    if (navigator.share) {

        navigator.share({
            title: "Friendsbook",
            text: text
        });

    } else {

        navigator.clipboard.writeText(text);

        alert("Post copied to clipboard");

    }

}
//======================
// Part 3G - Like
//======================

function reactPost(postIndex,reaction){

    if(posts[postIndex].reacted){

        return;

    }

    posts[postIndex].reaction=reaction;

    posts[postIndex].reactions[reaction]++;

    posts[postIndex].reacted=true;

    localStorage.setItem(
        "fb_posts",
        JSON.stringify(posts)
    );

    addNotification(reaction+" Someone reacted to your post");

    renderPosts();

}
const pages = {
  home: document.getElementById("feed"),
  friends: document.getElementById("friendsPage"),
  message: document.getElementById("messagePage"),
  notification: document.getElementById("notificationPage"),
  menu: document.getElementById("menuPage")
};

function showPage(page){
  Object.values(pages).forEach(p=>p.style.display="none");
  pages[page].style.display="block";

  document.querySelectorAll(".bottomNav button")
    .forEach(btn=>btn.classList.remove("active"));
}

document.getElementById("navHome").onclick=()=>{
  showPage("home");
  document.getElementById("navHome").classList.add("active");
};

document.getElementById("navFriends").onclick = async () => {

    showPage("friends");

    document.getElementById("navFriends")
        .classList.add("active");

    await loadFriends();

};

document.getElementById("navCreate").onclick=()=>{
  window.scrollTo({top:0,behavior:"smooth"});
};

document.getElementById("navNotify").onclick=()=>{
  showPage("notification");
  document.getElementById("navNotify").classList.add("active");
};
document.getElementById("messageBtn").onclick = () => {

    showPage("message");

};
document.getElementById("navMenu").onclick=()=>{
  showPage("menu");
  document.getElementById("navMenu").classList.add("active");
};

showPage("home");
document.getElementById("navHome").classList.add("active");
//======================
// Story System
//======================

const createStory = $("createStory");
const storyInput = $("storyInput");
const storyContainer = $("storyContainer");

let stories =
JSON.parse(localStorage.getItem("fb_stories")) || [];

createStory.onclick=function(){

    storyInput.click();

};

storyInput.onchange = function () {

    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        stories.unshift({
            name: localStorage.getItem("fb_name"),
            image: reader.result,
            time: Date.now()
        });

        localStorage.setItem(
            "fb_stories",
            JSON.stringify(stories)
        );

        renderStories();

        storyInput.value = "";

    };

    reader.readAsDataURL(file);

};

function renderStories(){
console.log(storyContainer);
    storyContainer.innerHTML="";

    stories.forEach((story,index)=>{

        storyContainer.innerHTML+=`
        <div class="story" onclick="openStory(${index})">
            <img src="${story.image}">
            <p>${story.name}</p>
        </div>
        `;

    });

}

renderStories();
function openStory(index){

    const story = stories[index];

    const viewer = document.createElement("div");

    viewer.style.position = "fixed";
    viewer.style.top = "0";
    viewer.style.left = "0";
    viewer.style.width = "100%";
    viewer.style.height = "100%";
    viewer.style.background = "#000";
    viewer.style.zIndex = "99999";
    viewer.style.display = "flex";
    viewer.style.justifyContent = "center";
    viewer.style.alignItems = "center";

    viewer.innerHTML = `
<div class="storyProgress"></div>
<div id="storyMenu"
style="
position:absolute;
top:15px;
right:15px;
font-size:30px;
color:white;
cursor:pointer;
z-index:100000;
">
⋮
</div>
<img src="${story.image}"
style="width:100%;height:100%;object-fit:contain;">`;

    document.body.appendChild(viewer);
  document.getElementById("storyMenu").onclick=function(e){

    e.stopPropagation();

    if(confirm("Delete this story?")){

        stories.splice(index,1);

        localStorage.setItem(
            "fb_stories",
            JSON.stringify(stories)
        );
        renderStories();

        viewer.remove();

    }

};
  viewer.onclick=function(){
    viewer.remove();
};
setTimeout(()=>{

    viewer.remove();

    if(index < stories.length-1){

        openStory(index+1);

    }

},5000);
}
const navMenu = document.getElementById("navMenu");
const menuPanel = document.getElementById("menuPanel");
const closeMenu = document.getElementById("closeMenu");

navMenu.onclick = function () {
    menuPanel.classList.add("show");
};

closeMenu.onclick = function () {
    menuPanel.classList.remove("show");
};

document.addEventListener("click", function (e) {

    if (
        !menuPanel.contains(e.target) &&
        !navMenu.contains(e.target)
    ) {
        menuPanel.classList.remove("show");
    }

});
const menuEditProfileBtn = $("menuEditProfileBtn");

menuEditProfileBtn.onclick = function(){

    editProfileModal.style.display = "flex";

    editName.value = localStorage.getItem("fb_name") || "";
    editBio.value = localStorage.getItem("fb_bio") || "";

    menuPanel.classList.remove("show");

};
document.getElementById("logoutBtn").onclick = function () {

    localStorage.removeItem("fb_login");

    location.reload();

};
