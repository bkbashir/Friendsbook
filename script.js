// ======================================
// Friendsbook 2026
// script.js
// Part 1 - Foundation
// ======================================

import {
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
    isAdmin,
    collection,
addDoc,
getDocs,
query,
orderBy,
serverTimestamp,
updateDoc,
increment,
   arrayUnion,
    deleteDoc
} from "./firebase.js";

// ======================
// DOM Helper
// ======================

const $ = (id) => document.getElementById(id);

const App = {
    user: null,
    profile: null,
    page: "home",
    dark: false,
    admin: false
};

// ======================
// Show / Hide
// ======================

function show(id) {
    const el = $(id);
    if (el) el.classList.remove("hidden");
}

function hide(id) {
    const el = $(id);
    if (el) el.classList.add("hidden");
}

// ======================
// Auth Pages
// ======================

function openLogin() {

    show("loginPage");
    hide("signupPage");
    hide("forgotPage");

}

function openSignup() {

    hide("loginPage");
    show("signupPage");
    hide("forgotPage");

}

function openForgot() {

    hide("loginPage");
    hide("signupPage");
    show("forgotPage");

}

// ======================
// Event
// ======================

document.addEventListener("DOMContentLoaded", () => {

    $("openSignup")?.addEventListener("click", openSignup);

    $("openLogin")?.addEventListener("click", openLogin);

    $("forgotPasswordBtn")?.addEventListener("click", openForgot);

    $("backLogin")?.addEventListener("click", openLogin);

    hide("homePage");
    show("authContainer");

});
// ======================================
// Part 2
// Authentication
// ======================================

// Login
$("loginBtn")?.addEventListener("click", async () => {

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, email, password);

    } catch (e) {

        alert(e.message);

    }

});

// Signup
$("signupBtn")?.addEventListener("click", async () => {

    const name = $("signupName").value.trim();
    const email = $("signupEmail").value.trim();
    const password = $("signupPassword").value;

    if (!name || !email || !password) {
        alert("Fill all fields");
        return;
    }

    try {

        const result =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(result.user,{
            displayName:name
        });

        await sendEmailVerification(result.user);

        await setDoc(
            doc(db,"users",result.user.uid),
            createUserObject(result.user,name)
        );

        alert("Account Created");

        openLogin();

    } catch(e){

        alert(e.message);

    }

});

// Forgot Password
$("resetPasswordBtn")?.addEventListener("click", async()=>{

    const email=$("forgotEmail").value.trim();

    if(!email){
        alert("Enter email");
        return;
    }

    try{

        await sendPasswordResetEmail(auth,email);

        alert("Reset email sent");

        openLogin();

    }catch(e){

        alert(e.message);

    }

});
// ======================================
// Part 3
// Auth State + Logout
// ======================================

onAuthStateChanged(auth, async (user) => {

    if (user) {

        App.user = user;

        App.admin = isAdmin(user.email);

        hide("authContainer");

        loadPosts();
        show("homePage");

        try {

            const snap = await getDoc(
                doc(db, "users", user.uid)
            );

            if (snap.exists()) {

                App.profile = snap.data();

                // Profile Page
if ($("profileName"))
    $("profileName").textContent =
        App.profile.name || user.displayName || "User";

if ($("profileUsername"))
    $("profileUsername").textContent =
        "@" + (App.profile.username || user.uid.substring(0,8));

if ($("profileBio"))
    $("profileBio").textContent =
        App.profile.bio || "";

if ($("profilePhoto"))
    $("profilePhoto").src =
        App.profile.photo || "default-profile.png";

if ($("coverPhoto"))
    $("coverPhoto").src =
        App.profile.cover || "default-cover.jpg";

if ($("followersCount"))
    $("followersCount").textContent =
        App.profile.followers || 0;

if ($("followingCount"))
    $("followingCount").textContent =
        App.profile.following || 0;
                
                if ($("menuUserName"))
                    $("menuUserName").textContent =
                        App.profile.name || user.displayName || "User";

                if ($("menuProfileImage"))
                    $("menuProfileImage").src =
                        App.profile.photo || "default-profile.png";

                if ($("headerProfile"))
                    $("headerProfile").src =
                        App.profile.photo || "default-profile.png";

                // Header Name
if ($("headerUserName"))
    $("headerUserName").textContent =
        App.profile.name || user.displayName || "User";
            }

        } catch (e) {

            console.error(e);

        }

    } else {

        App.user = null;
        App.profile = null;

        show("authContainer");
        hide("homePage");

        openLogin();

    }

});

// ========================
// Logout
// ========================

$("logoutBtn")?.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (e) {

        alert(e.message);

    }

});
// ======================================
// Part 4
// Navigation System
// ======================================

const pages = [

"homePage",
"profilePage",
"friendsPage",
"createPage",
"reelsPage",
"messengerPage",
"notificationPage",
"aiPage",
"settingsPage",
"marketplacePage",
"savedPage",
"groupsPage",
"pagesPage",
"adminPage"

];

function openPage(page){

pages.forEach(id=>{

hide(id);

});

show(page);

hide("sideMenu");
hide("overlay");

}

// Bottom Navigation

$("navHome")?.addEventListener("click",()=>{

openPage("homePage");

});

$("navFriends")?.addEventListener("click",()=>{

openPage("friendsPage");

});

$("navCreate")?.addEventListener("click",()=>{

openPage("createPage");

});

$("navReels")?.addEventListener("click",()=>{

openPage("reelsPage");

});

$("navMessenger")?.addEventListener("click",()=>{

openPage("messengerPage");

});

$("navNotification")?.addEventListener("click",()=>{

openPage("notificationPage");

});

$("navProfile")?.addEventListener("click",()=>{

openPage("profilePage");

});

$("navAI")?.addEventListener("click",()=>{

openPage("aiPage");

});

// ======================
// Side Menu
// ======================

$("navMenu")?.addEventListener("click",()=>{

show("sideMenu");
show("overlay");

});

$("overlay")?.addEventListener("click",()=>{

hide("sideMenu");
hide("overlay");

});

// ======================
// Menu Buttons
// ======================

$("menuProfileBtn")?.addEventListener("click",()=>{

openPage("profilePage");

});

$("menuSavedBtn")?.addEventListener("click",()=>{

openPage("savedPage");

});

$("menuMarketplaceBtn")?.addEventListener("click",()=>{

openPage("marketplacePage");

});

$("menuPagesBtn")?.addEventListener("click",()=>{

openPage("pagesPage");

});

$("menuGroupsBtn")?.addEventListener("click",()=>{

openPage("groupsPage");

});

$("menuSettingsBtn")?.addEventListener("click",()=>{

openPage("settingsPage");

});

// Admin

if(App.admin){

show("adminPage");

}
// ======================================
// Part 5
// UI System
// ======================================

// ======================
// Dark Mode
// ======================

function applyDarkMode(){

if(App.dark){

document.body.classList.add("dark");

}else{

document.body.classList.remove("dark");

}

localStorage.setItem(
"fb_dark",
App.dark
);

}

App.dark=
localStorage.getItem("fb_dark")==="true";

applyDarkMode();

$("menuDarkBtn")?.addEventListener("click",()=>{

App.dark=!App.dark;

applyDarkMode();

});

// ======================
// Toast
// ======================

function toast(text){

const box=$("toast");

const txt=$("toastText");

if(!box||!txt)return;

txt.textContent=text;

box.classList.remove("hidden");

setTimeout(()=>{

box.classList.add("hidden");

},2500);

}

// ======================
// Global Loading
// ======================

function showLoading(){

show("globalLoading");

}

function hideLoading(){

hide("globalLoading");

}

// ======================
// Message Modal
// ======================

function message(title,text){

$("messageTitle").textContent=title;

$("messageText").textContent=text;

show("messageModal");

}

$("messageOkBtn")?.addEventListener("click",()=>{

hide("messageModal");

});
// ======================================
// Part 6
// Header + Preview System
// ======================================

// ======================
// Image Viewer
// ======================

function openImage(src){

if(!src)return;

$("previewImage").src=src;

show("imageViewer");

}

function closeImage(){

$("previewImage").src="";

hide("imageViewer");

}

$("closeImageViewer")?.addEventListener("click",closeImage);

$("imageViewer")?.addEventListener("click",(e)=>{

if(e.target.id==="imageViewer"){

closeImage();

}

});

// ======================
// Video Viewer
// ======================

function openVideo(src){

if(!src)return;

$("previewVideo").src=src;

show("videoViewer");

}

function closeVideo(){

$("previewVideo").pause();

$("previewVideo").src="";

hide("videoViewer");

}

$("closeVideoViewer")?.addEventListener("click",closeVideo);

$("videoViewer")?.addEventListener("click",(e)=>{

if(e.target.id==="videoViewer"){

closeVideo();

}

});

// ======================
// Header Buttons
// ======================

$("searchBtn")?.addEventListener("click",()=>{

const text=$("searchInput").value.trim();

if(!text){

toast("Write something to search");

return;

}

toast("Searching: "+text);

});

$("messengerBtn")?.addEventListener("click",()=>{

openPage("messengerPage");

});

$("notificationBtn")?.addEventListener("click",()=>{

openPage("notificationPage");

});

$("headerProfile")?.addEventListener("click",()=>{

openPage("profilePage");

});

// ======================
// Search Enter Key
// ======================

$("searchInput")?.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

$("searchBtn").click();

}

});
// ======================================
// Part 7A
// Firebase Posts
// ======================================

let posts = [];

async function loadPosts(){

    const q = query(
        collection(db,"posts"),
        orderBy("time","desc")
    );

    const snap = await getDocs(q);

    posts = [];

    snap.forEach(doc=>{

        posts.push({
            id:doc.id,
            ...doc.data()
        });

    });

    renderFeed();

}
async function createPost(text,image=""){

    await addDoc(collection(db,"posts"),{

        uid:App.user.uid,

        name: App.profile?.name || App.user.displayName || "User",

photo: App.profile?.photo || "default-profile.png",

        text,

        image,

        likes:0,

        comments:[],

        time:serverTimestamp()

    });

    loadPosts();

}
$("postBtn")?.addEventListener("click", async () => {

    const text = $("postText").value.trim();

    if(!text){
        alert("Write something");
        return;
    }

    await createPost(text);

    $("postText").value="";

});

function renderFeed(){

    const feed = $("feedContainer");

    if(!feed) return;

    feed.innerHTML = "";

    posts.forEach(post=>{

        feed.innerHTML += `

        <div class="postCard">

            <div class="post-header">

    <img class="post-profile"
         src="${post.photo || "default-profile.png"}">

    <div class="post-user">

        <h4>${post.name}</h4>

        <small>Just now</small>

    </div>

    <button class="postMenuBtn"
            onclick="openPostMenu('${post.id}')">
        ⋮
    </button>

</div>

            ${post.text ? `
            <p class="postText">${post.text}</p>
            ` : ""}

            ${post.image ? `
            <img
            src="${post.image}"
            class="postImage"
            onclick="openImage('${post.image}')">
            ` : ""}

<div class="postActions">

${post.uid===App.user.uid ? `
<button onclick="editPost('${post.id}')">✏️ Edit</button>
<button onclick="deletePost('${post.id}')">🗑 Delete</button>
` : ""}

<button onclick="likePost('${post.id}')">
👍 ${post.likes || 0}
</button>

<button onclick="commentPost('${post.id}')">
💬 ${(post.comments || []).length}
</button>

<button onclick="sharePost('${post.id}')">
↗ Share
</button>

</div>

</div>

`;

    });

}
async function deletePost(postId){
if(!confirm("Delete this post?")) return;

    await deleteDoc(
        doc(db,"posts",postId)
    );

    loadPosts();

}

window.deletePost=deletePost;
async function editPost(postId){

    const post=posts.find(p=>p.id===postId);

    if(!post) return;

    const text=prompt("Edit Post",post.text);

    if(text===null) return;

    await updateDoc(
        doc(db,"posts",postId),
        {
            text:text
        }
    );

    loadPosts();

}

window.editPost=editPost;
// ======================
// Like Post
// ======================

async function likePost(postId){

    await updateDoc(
        doc(db,"posts",postId),
        {
            likes: increment(1)
        }
    );

    loadPosts();

}

window.likePost = likePost;

async function commentPost(postId){

    const text = prompt("Write a comment");

    if(!text) return;

    await updateDoc(
        doc(db,"posts",postId),
        {
            comments: arrayUnion({
                uid: App.user.uid,
                name: App.profile.name,
                photo: App.profile.photo || "default-profile.png",
                text: text,
                time: new Date().toLocaleString()
            })
        }
    );

    loadPosts();

}

window.commentPost = commentPost;
function openPostMenu(postId){

const post=posts.find(p=>p.id===postId);

if(!post)return;

if(post.uid===App.user.uid){

const action=prompt(

"1 = Edit\n2 = Delete\n3 = Copy Link"

);

if(action=="1"){

editPost(postId);

}

else if(action=="2"){

deletePost(postId);

}

else if(action=="3"){

navigator.clipboard.writeText(location.href);

alert("Link Copied");

}

}else{

const action=prompt(

"1 = Report\n2 = Copy Link"

);

if(action=="1"){

alert("Reported");

}

else if(action=="2"){

navigator.clipboard.writeText(location.href);

alert("Link Copied");

}

}

}

window.openPostMenu=openPostMenu;
