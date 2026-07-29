// =======================================
// Friendsbook 2026
// script.js v2
// Part 1
// =======================================

import {

auth,
db,
storage,

onAuthStateChanged,

signInWithEmailAndPassword,
createUserWithEmailAndPassword,

sendPasswordResetEmail,
sendEmailVerification,

signOut,

updateProfile,

collection,
doc,
setDoc,
addDoc,
getDoc,
getDocs,
updateDoc,
deleteDoc,

query,
where,
orderBy,
limit,

onSnapshot,

serverTimestamp,

ref,
uploadBytes,
uploadBytesResumable,
getDownloadURL,
deleteObject,

createUserObject,
isAdmin

} from "./firebase.js";

// =======================================
// DOM Helper
// =======================================

const $ = id => document.getElementById(id);

// =======================================
// App State
// =======================================

const App={

user:null,

profile:null,

dark:false,

page:"home",

admin:false

};

// =======================================
// UI Helper
// =======================================

function show(id){

const el=$(id);

if(el)el.classList.remove("hidden");

}

function hide(id){

const el=$(id);

if(el)el.classList.add("hidden");

}

function toggle(id){

const el=$(id);

if(el)el.classList.toggle("hidden");

}

// =======================================
// Authentication Pages
// =======================================

function openLogin(){

show("loginPage");

hide("signupPage");

hide("forgotPage");

}

function openSignup(){

hide("loginPage");

show("signupPage");

hide("forgotPage");

}

function openForgot(){

hide("loginPage");

hide("signupPage");

show("forgotPage");

}

// =======================================
// Startup
// =======================================

document.addEventListener("DOMContentLoaded",()=>{

$("openSignup")?.addEventListener("click",openSignup);

$("openLogin")?.addEventListener("click",openLogin);

$("forgotPasswordBtn")?.addEventListener("click",openForgot);

$("backLogin")?.addEventListener("click",openLogin);

show("authContainer");

hide("homePage");

});
// =======================================
// Friendsbook 2026
// script.js v2
// Part 2
// Authentication
// =======================================

// Login

$("loginBtn")?.addEventListener("click", async () => {

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch (error) {

        alert(error.message);

    }

});

// Signup

$("signupBtn")?.addEventListener("click", async () => {

    const name = $("signupName").value.trim();
    const email = $("signupEmail").value.trim();
    const password = $("signupPassword").value;

    if (!name || !email || !password) {

        alert("Please fill all fields");

        return;

    }

    try {

        const result =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(result.user, {

            displayName: name

        });

        await sendEmailVerification(result.user);

        await setDoc(

            doc(db, "users", result.user.uid),

            createUserObject(
                result.user,
                name
            )

        );

        alert("Account created successfully");

        openLogin();

    } catch (error) {

        alert(error.message);

    }

});

// Forgot Password

$("resetPasswordBtn")?.addEventListener("click", async () => {

    const email = $("forgotEmail").value.trim();

    if (!email) {

        alert("Enter your email");

        return;

    }

    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        alert("Password reset email sent");

        openLogin();

    } catch (error) {

        alert(error.message);

    }

});
// =======================================
// Friendsbook 2026
// script.js v2
// Part 3
// Auth State
// =======================================

onAuthStateChanged(auth, async (user) => {

    if (user) {

        App.user = user;

        App.admin = isAdmin(user.email);

        hide("authContainer");
        show("homePage");

        try {

            const snap = await getDoc(
                doc(db, "users", user.uid)
            );

            if (snap.exists()) {

                App.profile = snap.data();

                if ($("menuUserName")) {
                    $("menuUserName").textContent =
                        App.profile.name || user.displayName;
                }

                if ($("menuProfileImage")) {
                    $("menuProfileImage").src =
                        App.profile.photo || "default-profile.png";
                }

                if ($("headerProfile")) {
                    $("headerProfile").src =
                        App.profile.photo || "default-profile.png";
                }
// Profile Page

if ($("profileName")) {
    $("profileName").textContent =
        App.profile.name || user.displayName;
}

if ($("profilePhoto")) {
    $("profilePhoto").src =
        App.profile.photo || "default-profile.png";
}

if ($("coverPhoto")) {
    $("coverPhoto").src =
        App.profile.cover || "default-cover.jpg";
}

if ($("profileBio")) {
    $("profileBio").textContent =
        App.profile.bio || "";
        }
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

// =======================================
// Logout
// =======================================

$("logoutBtn")?.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (e) {

        alert(e.message);

    }

});
// =======================================
// Friendsbook 2026
// script.js v2
// Part 4
// Navigation + Dark Mode
// =======================================

// All Pages
const pages = [

"homePage",
"profilePage",
"friendsPage",
"reelsPage",
"messengerPage",
"notificationPage",
"marketplacePage",
"settingsPage",
"savedPage",
"groupsPage"

];

// Open Page
function openPage(page){

pages.forEach(id=>{

const el=$(id);

if(el) hide(id);

});

show(page);

App.page=page;

}

// Bottom Navigation

$("navHome")?.addEventListener("click",()=>{

openPage("homePage");

});

$("navFriends")?.addEventListener("click",()=>{

openPage("friendsPage");

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

// =======================
// Dark Mode
// =======================

App.dark =
localStorage.getItem("fb_dark") === "true";

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

applyDarkMode();

$("darkModeBtn")?.addEventListener("click",()=>{

App.dark=!App.dark;

applyDarkMode();

});

// =======================
// Search
// =======================

$("searchBtn")?.addEventListener("click",()=>{

const text=$("searchInput")?.value.trim();

if(!text){

alert("Type something");

return;

}

console.log("Search:",text);

});

// =======================
// Menu
// =======================

$("menuBtn")?.addEventListener("click",()=>{

toggle("sideMenu");

});
// =======================================
// Friendsbook 2026
// script.js v2
// Part 5
// Profile System
// =======================================

// Load Profile

async function loadProfile() {

    if (!App.user) return;

    const snap = await getDoc(
        doc(db, "users", App.user.uid)
    );

    if (!snap.exists()) return;

    App.profile = snap.data();

    if ($("profileName"))
        $("profileName").textContent =
            App.profile.name || "";

    if ($("profileBio"))
        $("profileBio").textContent =
            App.profile.bio || "";

    if ($("profilePhoto"))
        $("profilePhoto").src =
            App.profile.photo || "default-profile.png";

    if ($("coverPhoto"))
        $("coverPhoto").src =
            App.profile.cover || "default-cover.jpg";

}

// =======================
// Save Bio
// =======================

$("saveBioBtn")?.addEventListener("click", async () => {

    const bio = $("bioInput").value.trim();

    await updateDoc(

        doc(db, "users", App.user.uid),

        {

            bio: bio

        }

    );

    loadProfile();

    alert("Bio updated");

});

// =======================
// Profile Photo
// =======================

$("profilePhotoInput")?.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    console.log(file);

    // Upload Part আসবে Part 6-এ

});

// =======================
// Cover Photo
// =======================

$("coverPhotoInput")?.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    console.log(file);

    // Upload Part আসবে Part 6-এ

});
// =======================================
// Friendsbook 2026
// script.js v2
// Part 6
// Firebase Storage Upload
// =======================================

// Upload Image
async function uploadImage(file, folder) {

    const fileName = Date.now() + "_" + file.name;

    const storageRef = ref(
        storage,
        folder + "/" + fileName
    );

    await uploadBytes(storageRef, file);

    return await getDownloadURL(storageRef);

}

// =======================
// Profile Photo Upload
// =======================

$("profilePhotoInput")?.addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

        const url = await uploadImage(file, "profiles");

        await updateDoc(
            doc(db, "users", App.user.uid),
            {
                photo: url
            }
        );

        loadProfile();

        alert("Profile photo updated");

    } catch (err) {

        alert(err.message);

    }

});

// =======================
// Cover Photo Upload
// =======================

$("coverPhotoInput")?.addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

        const url = await uploadImage(file, "covers");

        await updateDoc(
            doc(db, "users", App.user.uid),
            {
                cover: url
            }
        );

        loadProfile();

        alert("Cover photo updated");

    } catch (err) {

        alert(err.message);

    }

});
// =======================================
// Friendsbook 2026
// script.js v2
// Part 7
// Post System
// =======================================

// Posts Array
let posts = [];

// =======================
// Create Post
// =======================

$("postBtn")?.addEventListener("click", async () => {

    const text = $("postText").value.trim();

    if (!text) {

        alert("Write something first");

        return;

    }

    try {

        await addDoc(

            collection(db, "posts"),

            {

                uid: App.user.uid,

                name: App.profile?.name || App.user.displayName || "User",

photo: App.profile?.photo || "default-profile.png",
              
                text: text,

                image: "",

                video: "",

                likes: 0,

                comments: 0,

                shares: 0,

                createdAt: serverTimestamp()

            }

        );

        $("postText").value = "";

    } catch (e) {

        alert(e.message);

    }

});

// =======================
// Load Posts
// =======================

const postQuery = query(

    collection(db, "posts"),

    orderBy("createdAt", "desc")

);

onSnapshot(postQuery, (snapshot) => {

    posts = [];

    snapshot.forEach((doc) => {

        posts.push({

            id: doc.id,

            ...doc.data()

        });

    });

    renderPosts();

});

// =======================
// Render Posts
// =======================

function renderPosts() {

    const feed = $("feedContainer");

    if (!feed) return;

    feed.innerHTML = "";

    posts.forEach(post => {

        feed.innerHTML += `

<div class="post-card">

<div class="post-header">

<img src="${post.photo}" class="post-avatar">

<div>

<b>${post.name}</b>

<br>

<small>Just now</small>

</div>

</div>

<p>${post.text}</p>

<div class="post-actions">

<button onclick="likePost('${post.id}')">

👍 Like

</button>

<button onclick="commentPost('${post.id}')">

💬 Comment

</button>

<button onclick="sharePost('${post.id}')">

↗ Share

</button>

</div>

</div>

`;

    });

                  }
// =======================================
// Friendsbook 2026
// script.js v2
// Part 8
// Facebook Reactions
// =======================================

// Save Reaction

async function reactPost(postId, reaction){

    try{

        await updateDoc(

            doc(db,"posts",postId),

            {

                reaction:reaction

            }

        );

    }catch(e){

        alert(e.message);

    }

}

// Like

function likePost(id){

    reactPost(id,"👍");

}

// Love

function lovePost(id){

    reactPost(id,"❤️");

}

// Haha

function hahaPost(id){

    reactPost(id,"😂");

}

// Wow

function wowPost(id){

    reactPost(id,"😮");

}

// Sad

function sadPost(id){

    reactPost(id,"😢");

}

// Angry

function angryPost(id){

    reactPost(id,"😡");

}

// Share

function sharePost(id){

    alert("Share feature coming in next part");

}

// Comment

function commentPost(id){

    alert("Comment feature coming in next part");

}
