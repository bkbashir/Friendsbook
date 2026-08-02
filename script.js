// ======================================
// Friendsbook 2026
// script.js
// Part 1 - Foundation
// ======================================

import {
    auth,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
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
    where,
orderBy,
serverTimestamp,
updateDoc,
increment,
   arrayUnion,
    deleteDoc
} from "./firebase.js";
// ======================================
// CLOUDINARY UPLOAD SYSTEM
// ======================================

const CLOUDINARY_CLOUD_NAME = "d22vigls";
const CLOUDINARY_UPLOAD_PRESET = "friendsbook_upload";

async function uploadToCloudinary(file) {

    if (!file) {
        throw new Error("No file selected");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );

    const resourceType =
        file.type.startsWith("video/")
            ? "video"
            : "image";

    const uploadURL =
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const response =
        await fetch(uploadURL, {
            method: "POST",
            body: formData
        });

    const data =
        await response.json();

    if (!response.ok) {
        console.error("Cloudinary error:", data);
        throw new Error(
            data.error?.message ||
            "Cloudinary upload failed"
        );
    }

    return data.secure_url;
}

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

// Admin button
if ($("menuAdminBtn")) {

    if (App.admin) {
        show("menuAdminBtn");
    } else {
        hide("menuAdminBtn");
    }

}

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
if (!App.profile) {

    App.profile = {

        uid: user.uid,

        name: user.displayName || "User",

        username: user.uid.substring(0, 8),

        bio: "",

        photo: "default-profile.png",

        cover: "default-cover.jpg",

        followers: 0,

        following: 0,

        posts: 0

    };

    }

    loadPosts();
show("homePage");
    
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
// COMPLETE NAVIGATION SYSTEM
// ======================================

const pageViews = [
    "homeContent",
    "profilePage",
    "friendsPage",
    "aiPage",
    "reelsPage",
    "messengerPage",
    "notificationPage",
    "settingsPage",
    "savedPage",
    "marketplacePage",
    "groupsPage",
    "pagesPage",
    "adminPage"
];

function openPage(pageId){

    // সব page hide
    pageViews.forEach(id => {
        hide(id);
    });

    // selected page show
    show(pageId);

    // drawer বন্ধ
    hide("sideMenu");
    hide("overlay");

    // bottom nav active state
    document
        .querySelectorAll(".navItem")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    if(pageId === "homeContent"){
        $("navHome")?.classList.add("active");
    }

    if(pageId === "friendsPage"){
        $("navFriends")?.classList.add("active");
    }

    if(pageId === "aiPage"){
        $("navAI")?.classList.add("active");
    }

    if(pageId === "reelsPage"){
        $("navReels")?.classList.add("active");
    }
}


// ======================================
// HOME
// ======================================

$("navHome")?.addEventListener("click", () => {

    openPage("homeContent");

});


// ======================================
// FRIENDS
// ======================================

$("navFriends")?.addEventListener("click", () => {

    openPage("friendsPage");

});


// ======================================
// AI
// ======================================

$("navAI")?.addEventListener("click", () => {

    openPage("aiPage");

});


// ======================================
// REELS
// ======================================

$("navReels")?.addEventListener("click", () => {

    openPage("reelsPage");

});


// ======================================
// PROFILE
// ======================================

$("headerProfile")?.addEventListener("click", () => {

    openPage("profilePage");

});

$("menuProfileBtn")?.addEventListener("click", () => {

    openPage("profilePage");

});


// ======================================
// MESSENGER
// ======================================

$("messengerBtn")?.addEventListener("click", () => {

    openPage("messengerPage");

});

$("menuMessengerBtn")?.addEventListener("click", () => {

    openPage("messengerPage");

});


// ======================================
// NOTIFICATIONS
// ======================================

$("notificationBtn")?.addEventListener("click", () => {

    openPage("notificationPage");

});

$("menuNotificationBtn")?.addEventListener("click", () => {

    openPage("notificationPage");

});


// ======================================
// SAVED
// ======================================

$("menuSavedBtn")?.addEventListener("click", () => {

    openPage("savedPage");

});


// ======================================
// MARKETPLACE
// ======================================

$("menuMarketplaceBtn")?.addEventListener("click", () => {

    openPage("marketplacePage");

});


// ======================================
// PAGES
// ======================================

$("menuPagesBtn")?.addEventListener("click", () => {

    openPage("pagesPage");

});


// ======================================
// GROUPS
// ======================================

$("menuGroupsBtn")?.addEventListener("click", () => {

    openPage("groupsPage");

});


// ======================================
// SETTINGS
// ======================================

$("menuSettingsBtn")?.addEventListener("click", () => {

    openPage("settingsPage");

});


// ======================================
// ADMIN PANEL
// ======================================

$("menuAdminBtn")?.addEventListener("click", () => {

    if(!App.admin){

        alert("Admin access required.");

        return;

    }

    openPage("adminPage");

});


// ======================================
// MENU DRAWER
// ======================================

$("navMenu")?.addEventListener("click", () => {

    show("sideMenu");
    show("overlay");

});


// ======================================
// OVERLAY
// ======================================

$("overlay")?.addEventListener("click", () => {

    hide("sideMenu");
    hide("overlay");

});


// ======================================
// ADMIN BUTTON VISIBILITY
// ======================================

if(App.admin){

    show("menuAdminBtn");

}
else{

    hide("menuAdminBtn");

}

 // ======================================
// PART 8A - PROFILE SYSTEM
// ======================================


// ======================
// PROFILE UI
// ======================

function updateProfileUI(){

    if(!App.profile) return;

    $("profileName").textContent =
        App.profile.name || "User";

    $("profileUsername").textContent =
        "@" + (
            App.profile.username ||
            "username"
        );

    $("profileBio").textContent =
        App.profile.bio ||
        "Add your bio...";

    $("profilePhoto").src =
        App.profile.photo ||
        "default-profile.png";

    $("coverPhoto").src =
        App.profile.cover ||
        "default-cover.jpg";

    $("followersCount").textContent =
        App.profile.followers || 0;

    $("followingCount").textContent =
        App.profile.following || 0;

    $("postsCount").textContent =
        App.profile.posts || 0;

    $("menuUserName").textContent =
        App.profile.name || "User";

    $("menuProfileImage").src =
        App.profile.photo ||
        "default-profile.png";

    $("headerProfile").src =
        App.profile.photo ||
        "default-profile.png";
}


// ======================
// EDIT PROFILE OPEN
// ======================

$("editProfileBtn")?.addEventListener(
    "click",
    () => {

        if(!App.user){

            alert("Please login first.");

            return;

        }

        if(!App.profile){

            alert("Profile not loaded yet.");

            return;

        }

        $("editName").value =
            App.profile.name || "";

        $("editUsername").value =
            App.profile.username || "";

        $("editBio").value =
            App.profile.bio || "";

        show("editProfileModal");

    }
);


// ======================
// CANCEL EDIT
// ======================

$("cancelEdit")?.addEventListener(
    "click",
    () => {

        hide("editProfileModal");

    }
);


// ======================
// SAVE PROFILE
// ======================

$("saveEdit")?.addEventListener(
    "click",
    async () => {

        if(!App.user){

            alert("Please login first.");

            return;

        }

        const name =
            $("editName").value.trim();

        const username =
            $("editUsername").value
                .trim()
                .replace(/^@/, "");

        const bio =
            $("editBio").value.trim();


        if(!name){

            alert("Name cannot be empty.");

            return;

        }


        try{

            const old =
                App.profile || {};


            const newProfile = {

                uid:
                    App.user.uid,

                name:
                    name,

                username:
                    username ||
                    App.user.uid.substring(0,8),

                bio:
                    bio,

                photo:
                    old.photo ||
                    "default-profile.png",

                cover:
                    old.cover ||
                    "default-cover.jpg",

                followers:
                    old.followers || 0,

                following:
                    old.following || 0,

                posts:
                    old.posts || 0,

                email:
                    App.user.email || ""

            };


            // Create OR update document
            await setDoc(
                doc(
                    db,
                    "users",
                    App.user.uid
                ),
                newProfile,
                {
                    merge:true
                }
            );


            // Firebase Auth display name
            await updateProfile(
                App.user,
                {
                    displayName:name
                }
            );


            App.profile = {

                ...old,
                ...newProfile

            };


            updateProfileUI();

            hide("editProfileModal");

            alert(
                "Profile updated successfully!"
            );


        }catch(error){

            console.error(error);

            alert(
                "Profile update failed: " +
                error.message
            );

        }

    }
);


// ======================
// UPLOAD PROFILE IMAGE
// ======================

async function uploadProfileImage(
    file,
    type
){

    if(!App.user || !file){
        return;
    }

    try{

        showLoading();

        const url =
            await uploadToCloudinary(file);

        const field =
            type === "profile"
                ? "photo"
                : "cover";

        await setDoc(
            doc(
                db,
                "users",
                App.user.uid
            ),
            {
                [field]: url
            },
            {
                merge: true
            }
        );

        App.profile = {

            ...App.profile,

            [field]: url

        };

        updateProfileUI();

        alert(
            type === "profile"
                ? "Profile photo updated!"
                : "Cover photo updated!"
        );

    }catch(error){

        console.error(
            "Cloudinary upload error:",
            error
        );

        alert(
            "Image upload failed: " +
            error.message
        );

    }finally{

        hideLoading();

    }

}
// ======================
// PROFILE PHOTO BUTTON
// ======================

$("profileInput")?.addEventListener(
    "change",
    async (event) => {

        const file =
            event.target.files?.[0];

        if(!file) return;

        await uploadProfileImage(
            file,
            "profile"
        );

        event.target.value = "";

    }
);


// ======================
// COVER PHOTO BUTTON
// ======================

$("coverInput")?.addEventListener(
    "change",
    async (event) => {

        const file =
            event.target.files?.[0];

        if(!file) return;

        await uploadProfileImage(
            file,
            "cover"
        );

        event.target.value = "";

    }
);
// ======================================
// PART 8B
// PROFILE POSTS + PROFILE STATS
// ======================================


// ======================
// LOAD MY PROFILE POSTS
// ======================

async function loadProfilePosts(){

    if(!App.user) return;

    try{

        const q = query(
            collection(db, "posts"),
            where(
                "uid",
                "==",
                App.user.uid
            ),
            orderBy(
                "time",
                "desc"
            )
        );

        const snap =
            await getDocs(q);

        const myPosts = [];

        snap.forEach(item => {

            myPosts.push({

                id: item.id,

                ...item.data()

            });

        });


        // Posts count
        $("postsCount").textContent =
            myPosts.length;


        // Firebase profile count sync
        await setDoc(
            doc(
                db,
                "users",
                App.user.uid
            ),
            {
                posts:
                    myPosts.length
            },
            {
                merge: true
            }
        );


        App.profile = {

            ...App.profile,

            posts:
                myPosts.length

        };


        renderProfilePosts(
            myPosts
        );


    }catch(error){

        console.error(
            "Profile posts error:",
            error
        );

    }

}


// ======================
// RENDER PROFILE POSTS
// ======================

function renderProfilePosts(
    myPosts
){

    const box =
        $("profilePosts");

    if(!box) return;


    if(!myPosts.length){

        box.innerHTML = `

            <div class="card"
                 style="
                 padding:25px;
                 text-align:center;
                 margin-top:15px;
                 ">

                <div style="
                    font-size:40px;
                    margin-bottom:10px;
                ">
                    📝
                </div>

                <strong>
                    No posts yet
                </strong>

                <p>
                    Your posts will appear here.
                </p>

            </div>

        `;

        return;

    }


    box.innerHTML = `

        <h3 style="
            margin:20px 0 10px;
        ">
            My Posts
        </h3>

    `;


    myPosts.forEach(post => {

        box.innerHTML += `

            <div
                class="postCard"
                style="margin-bottom:15px;"
            >

                <div class="post-header">

                    <img
                        class="post-profile"
                        src="${
                            post.photo ||
                            "default-profile.png"
                        }"
                    >

                    <div class="post-user">

                        <h4>
                            ${
                                post.name ||
                                App.profile?.name ||
                                "User"
                            }
                        </h4>

                        <small>
                            Just now
                        </small>

                    </div>

                </div>


                ${
                    post.text
                    ?
                    `
                    <p class="postText">
                        ${escapeHTML(
                            post.text
                        )}
                    </p>
                    `
                    :
                    ""
                }


                ${
                    post.image
                    ?
                    `
                    <img
                        src="${post.image}"
                        class="postImage"
                        onclick="openImage(
                            '${post.image}'
                        )"
                    >
                    `
                    :
                    ""
                }


                <div
                    class="postActions"
                >

                    <button
                        onclick="
                        openPage('homeContent')
                        "
                    >
                        👍 ${
                            post.likes || 0
                        }
                    </button>

                    <button>
                        💬 ${
                            (
                                post.comments ||
                                []
                            ).length
                        }
                    </button>

                </div>

            </div>

        `;

    });

}


// ======================
// PROFILE PAGE OPEN
// ======================

async function openMyProfile(){

    openPage(
        "profilePage"
    );


    updateProfileUI();


    await loadProfilePosts();

}


// ======================
// PROFILE BUTTONS
// ======================

$("menuProfileBtn")?.removeEventListener(
    "click",
    () => {}
);

$("menuProfileBtn")?.addEventListener(
    "click",
    async () => {

        await openMyProfile();

    }
);


$("headerProfile")?.addEventListener(
    "click",
    async () => {

        await openMyProfile();

    }
);


// ======================
// PROFILE TAB BUTTONS
// ======================

const profileTabs =
    document.querySelectorAll(
        ".profileTabs button"
    );


profileTabs.forEach(
    (button, index) => {

        button.addEventListener(
            "click",
            async () => {

                profileTabs.forEach(
                    btn =>
                    btn.classList.remove(
                        "active"
                    )
                );

                button.classList.add(
                    "active"
                );


                if(index === 0){

                    // All
                    await loadProfilePosts();

                }

                else if(index === 1){

                    // Posts
                    await loadProfilePosts();

                }

                else if(index === 2){

                    // Photos
                    renderProfilePhotos();

                }

                else if(index === 3){

                    // Reels
                    renderProfileReels();

                }

                else if(index === 4){

                    // More
                    renderProfileMore();

                }

            }
        );

    }
);


// ======================
// PHOTOS TAB
// ======================

function renderProfilePhotos(){

    const box =
        $("profilePosts");

    if(!box) return;


    const photos =
        posts.filter(
            post =>
                post.uid ===
                App.user.uid &&
                post.image &&
                !post.video
        );


    if(!photos.length){

        box.innerHTML = `

            <div class="card"
                 style="
                 padding:25px;
                 text-align:center;
                 ">

                📷 No photos yet

            </div>

        `;

        return;

    }


    box.innerHTML = `

        <h3
            style="
            margin:20px 0 10px;
            "
        >
            Photos
        </h3>

        <div
            style="
            display:grid;
            grid-template-columns:
            repeat(2,1fr);
            gap:10px;
            "
        >

            ${
                photos.map(
                    post => `

                    <img
                        src="${post.image}"
                        style="
                        width:100%;
                        aspect-ratio:1;
                        object-fit:cover;
                        border-radius:12px;
                        "
                        onclick="
                        openImage(
                            '${post.image}'
                        )
                        "
                    >

                    `
                ).join("")
            }

        </div>

    `;

}


// ======================
// REELS TAB
// ======================

function renderProfileReels(){

    const box =
        $("profilePosts");

    if(!box) return;


    box.innerHTML = `

        <div class="card"
             style="
             padding:25px;
             text-align:center;
             ">

            🎬

            <h3>
                My Reels
            </h3>

            <p>
                Reels system will connect here.
            </p>

        </div>

    `;

}


// ======================
// MORE TAB
// ======================

function renderProfileMore(){

    const box =
        $("profilePosts");

    if(!box) return;


    box.innerHTML = `

        <div class="card"
             style="
             padding:25px;
             margin-top:15px;
             ">

            <h3>
                More
            </h3>

            <p>
                👥 Friends
            </p>

            <p>
                ❤️ Reactions
            </p>

            <p>
                🔖 Saved Posts
            </p>

        </div>

    `;

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
// PART 7 - FRIENDSBOOK POST SYSTEM
// ======================================

let posts = [];

let reactionTimer = null;
let reactionOpened = false;


// ======================
// LOAD POSTS
// ======================

async function loadPosts(){

    try{

        const q = query(
            collection(db,"posts"),
            orderBy("time","desc")
        );

        const snap = await getDocs(q);

        posts = [];

        snap.forEach(item => {

            posts.push({
                id: item.id,
                ...item.data()
            });

        });

        renderFeed();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// CREATE POST
// ======================

async function createPost(text,image=""){

    try{

        await addDoc(
            collection(db,"posts"),
            {

                uid: App.user.uid,

                name:
                    App.profile?.name ||
                    App.user.displayName ||
                    "User",

                photo:
                    App.profile?.photo ||
                    "default-profile.png",

                text: text,

                image: image,

                likes: 0,

                reactions: {
                    like: 0,
                    love: 0,
                    haha: 0,
                    wow: 0,
                    sad: 0,
                    angry: 0
                },

                comments: [],

                time: serverTimestamp()

            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// POST BUTTON
// ======================

$("postBtn")?.addEventListener(
    "click",
    async () => {

        const input = $("postText");

        const text =
            input.value.trim();

        if(!text){

            alert("Write something");

            return;

        }

        await createPost(text);

        input.value = "";

    }
);


// ======================
// RENDER FEED
// ======================

function renderFeed(){

    const feed =
        $("feedContainer");

    if(!feed) return;

    feed.innerHTML = "";

    posts.forEach(post => {

        const comments =
            post.comments || [];

        const reactions =
            post.reactions || {};

        feed.innerHTML += `

        <div class="postCard"
             id="post-${post.id}">

            <!-- POST HEADER -->

            <div class="post-header">

                <img
                    class="post-profile"
                    src="${post.photo || "default-profile.png"}"
                >

                <div class="post-user">

                    <h4>
                        ${post.name || "User"}
                    </h4>

                    <small>
                        Just now
                    </small>

                </div>

                <button
                    class="postMenuBtn"
                    onclick="openPostMenu('${post.id}')"
                >
                    ⋮
                </button>

            </div>


            <!-- POST TEXT -->

            ${
                post.text
                ?
                `<p class="postText">
                    ${escapeHTML(post.text)}
                </p>`
                :
                ""
            }


            <!-- POST IMAGE -->

            ${
                post.image
                ?
                `
                <img
                    src="${post.image}"
                    class="postImage"
                    onclick="openImage('${post.image}')"
                >
                `
                :
                ""
            }


            <!-- POST ACTIONS -->

            <div class="postActions">

                <button
                    class="likeBtn"
                    onclick="handleLikeClick('${post.id}')"
                    onpointerdown="startReaction(event,'${post.id}')"
                    onpointerup="endReaction()"
                    onpointerleave="endReaction()"
                    onpointercancel="endReaction()"
                >
                    👍 ${post.likes || 0}
                </button>


                <button
                    onclick="commentPost('${post.id}')"
                >
                    💬 ${comments.length}
                </button>


                <button
                    onclick="sharePost('${post.id}')"
                >
                    ↗ Share
                </button>

            </div>


            <!-- REACTION COUNTS -->

            <div class="reactionCounts">

                ${
                    reactions.like
                    ?
                    `👍 ${reactions.like}`
                    :
                    ""
                }

                ${
                    reactions.love
                    ?
                    ` ❤️ ${reactions.love}`
                    :
                    ""
                }

                ${
                    reactions.haha
                    ?
                    ` 😂 ${reactions.haha}`
                    :
                    ""
                }

                ${
                    reactions.wow
                    ?
                    ` 😮 ${reactions.wow}`
                    :
                    ""
                }

                ${
                    reactions.sad
                    ?
                    ` 😢 ${reactions.sad}`
                    :
                    ""
                }

                ${
                    reactions.angry
                    ?
                    ` 😡 ${reactions.angry}`
                    :
                    ""
                }

            </div>


            <!-- COMMENTS -->

            <div class="commentList">

                ${
                    comments.map(
                        (comment,index) =>

                        renderComment(
                            post.id,
                            comment,
                            index
                        )

                    ).join("")
                }

            </div>

        </div>

        `;

    });

}


// ======================
// COMMENT HTML
// ======================

function renderComment(
    postId,
    comment,
    commentIndex
){

    const reactions =
        comment.reactions || {};

    const replies =
        comment.replies || [];

    return `

    <div class="commentBox">

        <img
            src="${comment.photo || "default-profile.png"}"
            class="commentPhoto"
        >

        <div class="commentContent">

            <b>
                ${escapeHTML(comment.name || "User")}
            </b>

            <div>
                ${escapeHTML(comment.text || "")}
            </div>

            <small>
                ${comment.time || "Just now"}
            </small>


            <!-- COMMENT REACTIONS -->

            <div class="commentActions">

                <button
                    onclick="reactComment(
                        '${postId}',
                        ${commentIndex},
                        'like'
                    )"
                >
                    👍 ${reactions.like || 0}
                </button>


                <button
                    onclick="reactComment(
                        '${postId}',
                        ${commentIndex},
                        'love'
                    )"
                >
                    ❤️ ${reactions.love || 0}
                </button>


                <button
                    onclick="reactComment(
                        '${postId}',
                        ${commentIndex},
                        'haha'
                    )"
                >
                    😂 ${reactions.haha || 0}
                </button>


                <button
                    onclick="reactComment(
                        '${postId}',
                        ${commentIndex},
                        'wow'
                    )"
                >
                    😮 ${reactions.wow || 0}
                </button>


                <button
                    onclick="reactComment(
                        '${postId}',
                        ${commentIndex},
                        'sad'
                    )"
                >
                    😢 ${reactions.sad || 0}
                </button>


                <button
                    onclick="reactComment(
                        '${postId}',
                        ${commentIndex},
                        'angry'
                    )"
                >
                    😡 ${reactions.angry || 0}
                </button>


                <button
                    onclick="replyComment(
                        '${postId}',
                        ${commentIndex}
                    )"
                >
                    ↩ Reply
                </button>

            </div>


            <!-- REPLIES -->

            ${
                replies.length
                ?

                replies.map(
                    (reply,replyIndex) =>

                    renderReply(
                        postId,
                        commentIndex,
                        reply,
                        replyIndex
                    )

                ).join("")

                :

                ""
            }

        </div>

    </div>

    `;

}


// ======================
// REPLY HTML
// ======================

function renderReply(
    postId,
    commentIndex,
    reply,
    replyIndex
){

    const reactions =
        reply.reactions || {};

    return `

    <div class="replyBox">

        <img
            src="${reply.photo || "default-profile.png"}"
            class="commentPhoto"
        >

        <div>

            <b>
                ${escapeHTML(reply.name || "User")}
            </b>

            <div>
                ${escapeHTML(reply.text || "")}
            </div>

            <small>
                ${reply.time || "Just now"}
            </small>


            <div class="commentActions">

                <button
                    onclick="reactReply(
                        '${postId}',
                        ${commentIndex},
                        ${replyIndex},
                        'like'
                    )"
                >
                    👍 ${reactions.like || 0}
                </button>


                <button
                    onclick="reactReply(
                        '${postId}',
                        ${commentIndex},
                        ${replyIndex},
                        'love'
                    )"
                >
                    ❤️ ${reactions.love || 0}
                </button>


                <button
                    onclick="reactReply(
                        '${postId}',
                        ${commentIndex},
                        ${replyIndex},
                        'haha'
                    )"
                >
                    😂 ${reactions.haha || 0}
                </button>


                <button
                    onclick="reactReply(
                        '${postId}',
                        ${commentIndex},
                        ${replyIndex},
                        'wow'
                    )"
                >
                    😮 ${reactions.wow || 0}
                </button>


                <button
                    onclick="reactReply(
                        '${postId}',
                        ${commentIndex},
                        ${replyIndex},
                        'sad'
                    )"
                >
                    😢 ${reactions.sad || 0}
                </button>


                <button
                    onclick="reactReply(
                        '${postId}',
                        ${commentIndex},
                        ${replyIndex},
                        'angry'
                    )"
                >
                    😡 ${reactions.angry || 0}
                </button>

            </div>

        </div>

    </div>

    `;

}


// ======================
// LIKE
// ======================

async function likePost(postId){

    try{

        await updateDoc(
            doc(db,"posts",postId),
            {
                likes: increment(1),

                "reactions.like":
                    increment(1)
            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// LONG PRESS REACTION
// ======================

function startReaction(event, postId){

    reactionOpened = false;

    const button = event.currentTarget;

    const rect = button.getBoundingClientRect();

    reactionTimer = setTimeout(() => {

        reactionOpened = true;

        showReactionMenu(
            rect,
            postId
        );

    }, 550);

}


function endReaction(){

    if(reactionTimer){

        clearTimeout(reactionTimer);

        reactionTimer = null;

    }

}


function handleLikeClick(postId){

    if(reactionOpened){

        reactionOpened = false;

        return;

    }

    likePost(postId);

}


// ======================
// REACTION MENU
// ======================

function showReactionMenu(
    rect,
    postId
){

    closeReactionMenu();

    const menu =
        document.createElement("div");

    menu.id =
        "reactionMenu";

    menu.innerHTML = `

        <button
            onclick="sendReaction(
                '${postId}',
                'like'
            )"
        >
            👍
        </button>

        <button
            onclick="sendReaction(
                '${postId}',
                'love'
            )"
        >
            ❤️
        </button>

        <button
            onclick="sendReaction(
                '${postId}',
                'haha'
            )"
        >
            😂
        </button>

        <button
            onclick="sendReaction(
                '${postId}',
                'wow'
            )"
        >
            😮
        </button>

        <button
            onclick="sendReaction(
                '${postId}',
                'sad'
            )"
        >
            😢
        </button>

        <button
            onclick="sendReaction(
                '${postId}',
                'angry'
            )"
        >
            😡
        </button>

    `;

    document.body.appendChild(menu);

    menu.style.left =
        Math.max(
            10,
            rect.left - 20
        ) + "px";

    menu.style.top =
        Math.max(
            10,
            rect.top - 65
        ) + "px";

}


function closeReactionMenu(){

    const old =
        $("reactionMenu");

    if(old){

        old.remove();

    }

}


// ======================
// SEND POST REACTION
// ======================

async function sendReaction(
    postId,
    type
){

    closeReactionMenu();

    try{

        await updateDoc(
            doc(db,"posts",postId),
            {
                [`reactions.${type}`]:
                    increment(1)
            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// COMMENT
// ======================

async function commentPost(
    postId
){

    const text =
        prompt("Write a comment");

    if(!text) return;

    try{

        await updateDoc(
            doc(db,"posts",postId),
            {

                comments:

                    arrayUnion({

                        uid:
                            App.user.uid,

                        name:
                            App.profile?.name ||
                            App.user.displayName ||
                            "User",

                        photo:
                            App.profile?.photo ||
                            "default-profile.png",

                        text:
                            text,

                        time:
                            new Date()
                            .toLocaleString(),

                        reactions: {

                            like: 0,
                            love: 0,
                            haha: 0,
                            wow: 0,
                            sad: 0,
                            angry: 0

                        },

                        replies: []

                    })

            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// COMMENT REACTION
// ======================

async function reactComment(
    postId,
    commentIndex,
    type
){

    try{

        const post =
            posts.find(
                p => p.id === postId
            );

        if(!post) return;

        const comments =
            [...(post.comments || [])];

        const comment =
            {
                ...comments[commentIndex]
            };

        const reactions =
            {
                ...(comment.reactions || {})
            };

        reactions[type] =
            (reactions[type] || 0) + 1;

        comment.reactions =
            reactions;

        comments[commentIndex] =
            comment;

        await updateDoc(
            doc(db,"posts",postId),
            {
                comments: comments
            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// REPLY COMMENT
// ======================

async function replyComment(
    postId,
    commentIndex
){

    const text =
        prompt("Write a reply");

    if(!text) return;

    try{

        const post =
            posts.find(
                p => p.id === postId
            );

        if(!post) return;

        const comments =
            [...(post.comments || [])];

        const comment =
            {
                ...comments[commentIndex]
            };

        const replies =
            [
                ...(comment.replies || [])
            ];

        replies.push({

            uid:
                App.user.uid,

            name:
                App.profile?.name ||
                App.user.displayName ||
                "User",

            photo:
                App.profile?.photo ||
                "default-profile.png",

            text:
                text,

            time:
                new Date()
                .toLocaleString(),

            reactions: {

                like: 0,
                love: 0,
                haha: 0,
                wow: 0,
                sad: 0,
                angry: 0

            }

        });

        comment.replies =
            replies;

        comments[commentIndex] =
            comment;

        await updateDoc(
            doc(db,"posts",postId),
            {
                comments: comments
            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// REPLY REACTION
// ======================

async function reactReply(
    postId,
    commentIndex,
    replyIndex,
    type
){

    try{

        const post =
            posts.find(
                p => p.id === postId
            );

        if(!post) return;

        const comments =
            [...(post.comments || [])];

        const comment =
            {
                ...comments[commentIndex]
            };

        const replies =
            [
                ...(comment.replies || [])
            ];

        const reply =
            {
                ...replies[replyIndex]
            };

        const reactions =
            {
                ...(reply.reactions || {})
            };

        reactions[type] =
            (reactions[type] || 0) + 1;

        reply.reactions =
            reactions;

        replies[replyIndex] =
            reply;

        comment.replies =
            replies;

        comments[commentIndex] =
            comment;

        await updateDoc(
            doc(db,"posts",postId),
            {
                comments: comments
            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// EDIT POST
// ======================

async function editPost(postId){

    const post =
        posts.find(
            p => p.id === postId
        );

    if(!post) return;

    if(
        post.uid !==
        App.user.uid
    ){

        alert("Not your post");

        return;

    }

    const text =
        prompt(
            "Edit Post",
            post.text || ""
        );

    if(text === null) return;

    try{

        await updateDoc(
            doc(db,"posts",postId),
            {
                text: text
            }
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// DELETE POST
// ======================

async function deletePost(postId){

    const post =
        posts.find(
            p => p.id === postId
        );

    if(!post) return;

    if(
        post.uid !==
        App.user.uid
    ){

        alert("Not your post");

        return;

    }

    if(
        !confirm(
            "Delete this post?"
        )
    ) return;

    try{

        await deleteDoc(
            doc(db,"posts",postId)
        );

        await loadPosts();

    }catch(e){

        console.error(e);
        alert(e.message);

    }

}


// ======================
// THREE DOT MENU
// ======================

function openPostMenu(postId){

    const post =
        posts.find(
            p => p.id === postId
        );

    if(!post) return;

    if(
        post.uid ===
        App.user.uid
    ){

        const action =
            prompt(
                "1 = Edit\n" +
                "2 = Delete\n" +
                "3 = Copy Link"
            );

        if(action === "1"){

            editPost(postId);

        }

        else if(action === "2"){

            deletePost(postId);

        }

        else if(action === "3"){

            navigator.clipboard
                ?.writeText(
                    location.href
                );

            alert("Link Copied");

        }

    }else{

        const action =
            prompt(
                "1 = Report\n" +
                "2 = Copy Link"
            );

        if(action === "1"){

            alert("Reported");

        }

        else if(action === "2"){

            navigator.clipboard
                ?.writeText(
                    location.href
                );

            alert("Link Copied");

        }

    }

}


// ======================
// HELPERS
// ======================

function escapeHTML(value){

    return String(value || "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


// ======================
// GLOBAL FUNCTIONS
// ======================

window.loadPosts =
    loadPosts;

window.createPost =
    createPost;

window.renderFeed =
    renderFeed;

window.likePost =
    likePost;

window.startReaction =
    startReaction;

window.endReaction =
    endReaction;

window.handleLikeClick =
    handleLikeClick;

window.sendReaction =
    sendReaction;

window.commentPost =
    commentPost;

window.reactComment =
    reactComment;

window.replyComment =
    replyComment;

window.reactReply =
    reactReply;

window.editPost =
    editPost;

window.deletePost =
    deletePost;

window.openPostMenu =
    openPostMenu;
