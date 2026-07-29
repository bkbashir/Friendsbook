// ======================================
// Friendsbook 2026
// script.js v3
// Part 1
// Base + Authentication
// ======================================

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
getDoc,
getDocs,
addDoc,
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

const $ = id => document.getElementById(id);

const App = {

user:null,
profile:null,
admin:false,
dark:false

};

function show(id){

const el=$(id);

if(el) el.classList.remove("hidden");

}

function hide(id){

const el=$(id);

if(el) el.classList.add("hidden");

}

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

document.addEventListener("DOMContentLoaded",()=>{

show("authContainer");
hide("homePage");

$("openSignup")?.addEventListener("click",openSignup);
$("openLogin")?.addEventListener("click",openLogin);
$("forgotPasswordBtn")?.addEventListener("click",openForgot);
$("backLogin")?.addEventListener("click",openLogin);

});

$("loginBtn")?.addEventListener("click",async()=>{

const email=$("loginEmail").value.trim();
const password=$("loginPassword").value;

if(!email||!password){

alert("Enter email & password");
return;

}

try{

await signInWithEmailAndPassword(auth,email,password);

}catch(e){

alert(e.message);

}

});

$("signupBtn")?.addEventListener("click",async()=>{

const name=$("signupName").value.trim();
const email=$("signupEmail").value.trim();
const password=$("signupPassword").value;

if(!name||!email||!password){

alert("Fill all fields");
return;

}

try{

const result=await createUserWithEmailAndPassword(
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

}catch(e){

alert(e.message);

}

});

$("resetPasswordBtn")?.addEventListener("click",async()=>{

const email=$("forgotEmail").value.trim();

if(!email){

alert("Enter email");
return;

}

try{

await sendPasswordResetEmail(auth,email);

alert("Reset Email Sent");

openLogin();

}catch(e){

alert(e.message);

}

});
// ======================================
// Friendsbook 2026
// script.js v3
// Part 2
// Auth State + Navigation + Logout
// ======================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        App.user = null;
        App.profile = null;

        show("authContainer");
        hide("homePage");

        openLogin();

        return;
    }

    App.user = user;
    App.admin = isAdmin(user.email);

    show("homePage");
    hide("authContainer");

    try {

        const snap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (snap.exists()) {

            App.profile = snap.data();

            if ($("menuUserName"))
                $("menuUserName").textContent =
                    App.profile.name || user.displayName;

            if ($("menuProfileImage"))
                $("menuProfileImage").src =
                    App.profile.photo || "default-profile.png";

            if ($("headerProfile"))
                $("headerProfile").src =
                    App.profile.photo || "default-profile.png";

            if ($("createProfileImage"))
                $("createProfileImage").src =
                    App.profile.photo || "default-profile.png";

            if ($("profileName"))
                $("profileName").textContent =
                    App.profile.name || "";

            if ($("profilePhoto"))
                $("profilePhoto").src =
                    App.profile.photo || "default-profile.png";

            if ($("coverPhoto"))
                $("coverPhoto").src =
                    App.profile.cover || "default-cover.jpg";

            if ($("profileBio"))
                $("profileBio").textContent =
                    App.profile.bio || "";

        }

    } catch (e) {

        console.error(e);

    }

});

// Logout

$("logoutBtn")?.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (e) {

        alert(e.message);

    }

});

// Navigation

const pages = [

"profilePage",
"friendsPage",
"createPage",
"reelsPage",
"messengerPage",
"notificationPage",
"settingsPage",
"marketplacePage",
"savedPage",
"groupsPage",
"pagesPage",
"adminPage"

];

function openPage(id){

    pages.forEach(page=>{

        if($(page)) hide(page);

    });

    if(id==="homePage"){

        show("homePage");
        return;

    }

    hide("homePage");
    show(id);

}

$("navHome")?.onclick=()=>openPage("homePage");
$("navFriends")?.onclick=()=>openPage("friendsPage");
$("navReels")?.onclick=()=>openPage("reelsPage");
$("navMessenger")?.onclick=()=>openPage("messengerPage");
$("navNotification")?.onclick=()=>openPage("notificationPage");
$("navProfile")?.onclick=()=>openPage("profilePage");
// ======================================
// Friendsbook 2026
// script.js v3
// Part 3
// Profile System + Storage
// ======================================

// Upload Image

async function uploadImage(file, folder){

    const fileName = Date.now() + "_" + file.name;

    const storageRef = ref(
        storage,
        folder + "/" + fileName
    );

    await uploadBytes(storageRef, file);

    return await getDownloadURL(storageRef);

}

// Reload Profile

async function reloadProfile(){

    if(!App.user) return;

    const snap = await getDoc(
        doc(db,"users",App.user.uid)
    );

    if(!snap.exists()) return;

    App.profile = snap.data();

    $("menuUserName") &&
    ($("menuUserName").textContent =
    App.profile.name);

    $("menuProfileImage") &&
    ($("menuProfileImage").src =
    App.profile.photo);

    $("headerProfile") &&
    ($("headerProfile").src =
    App.profile.photo);

    $("createProfileImage") &&
    ($("createProfileImage").src =
    App.profile.photo);

    $("profilePhoto") &&
    ($("profilePhoto").src =
    App.profile.photo);

    $("coverPhoto") &&
    ($("coverPhoto").src =
    App.profile.cover);

    $("profileName") &&
    ($("profileName").textContent =
    App.profile.name);

    $("profileBio") &&
    ($("profileBio").textContent =
    App.profile.bio || "");

}

// Profile Photo Upload

$("profilePhotoInput")?.addEventListener(
"change",
async e=>{

const file=e.target.files[0];

if(!file) return;

try{

const url=await uploadImage(
file,
"profiles"
);

await updateDoc(
doc(db,"users",App.user.uid),
{
photo:url
}
);

await reloadProfile();

alert("Profile Photo Updated");

}catch(err){

alert(err.message);

}

});

// Cover Upload

$("coverPhotoInput")?.addEventListener(
"change",
async e=>{

const file=e.target.files[0];

if(!file) return;

try{

const url=await uploadImage(
file,
"covers"
);

await updateDoc(
doc(db,"users",App.user.uid),
{
cover:url
}
);

await reloadProfile();

alert("Cover Photo Updated");

}catch(err){

alert(err.message);

}

});

// Save Bio

$("saveBioBtn")?.addEventListener(
"click",
async()=>{

const bio=$("bioInput")?.value.trim();

await updateDoc(
doc(db,"users",App.user.uid),
{
bio:bio
}
);

await reloadProfile();

alert("Bio Updated");

});
// ======================================
// Friendsbook 2026
// script.js v3
// Part 4A
// Create Post + Feed
// ======================================

let posts=[];

// Create Post

$("postBtn")?.addEventListener("click",async()=>{

if(!App.user) return;

const text=$("postText").value.trim();

const imageFile=$("postImage")?.files[0]||null;
const videoFile=$("postVideo")?.files[0]||null;

if(!text && !imageFile && !videoFile){

alert("Write something or select photo/video");
return;

}

try{

let image="";
let video="";

if(imageFile){

image=await uploadImage(
imageFile,
"posts/images"
);

}

if(videoFile){

video=await uploadImage(
videoFile,
"posts/videos"
);

}

await addDoc(

collection(db,"posts"),

{

uid:App.user.uid,

name:App.profile.name,

photo:App.profile.photo,

text:text,

image:image,

video:video,

likes:0,

comments:0,

shares:0,

createdAt:serverTimestamp()

}

);

$("postText").value="";

if($("postImage"))
$("postImage").value="";

if($("postVideo"))
$("postVideo").value="";

}catch(e){

alert(e.message);

}

});

// Load Feed

const postQuery=query(

collection(db,"posts"),

orderBy("createdAt","desc")

);

onSnapshot(postQuery,snap=>{

posts=[];

snap.forEach(doc=>{

posts.push({

id:doc.id,

...doc.data()

});

});

renderPosts();

});
// ======================================
// Friendsbook 2026
// script.js v3
// Part 4B
// Render Feed
// ======================================

function renderPosts(){

const feed=$("feedContainer");

if(!feed) return;

feed.innerHTML="";

posts.forEach(post=>{

const time=post.createdAt?.seconds
?new Date(post.createdAt.seconds*1000).toLocaleString()
:"Just now";

feed.innerHTML+=`

<div class="post-card">

<div class="post-header">

<img
class="post-avatar"
src="${post.photo||'default-profile.png'}">

<div class="post-user">

<div class="post-name">

${post.name||"User"}

</div>

<div class="post-time">

${time}

</div>

</div>

</div>

${
post.text
?`<div class="post-text">${post.text}</div>`
:""
}

${
post.image
?`<img
class="post-image"
src="${post.image}">`
:""
}

${
post.video
?`<video
class="post-video"
controls
src="${post.video}">
</video>`
:""
}

<div class="post-actions">

<button
class="likeBtn"
onclick="likePost('${post.id}')">

👍 Like

</button>

<button
class="commentBtn"
onclick="commentPost('${post.id}')">

💬 Comment

</button>

<button
class="shareBtn"
onclick="sharePost('${post.id}')">

↗ Share

</button>

</div>

</div>

`;

});

}
window.likePost = likePost;
window.commentPost = commentPost;
window.sharePost = sharePost;
// ======================================
// Friendsbook 2026
// script.js v3
// Part 4C
// Like • Comment • Share
// ======================================

// Like

async function likePost(postId){

try{

const post=posts.find(p=>p.id===postId);

if(!post) return;

await updateDoc(

doc(db,"posts",postId),

{

likes:(post.likes||0)+1

}

);

}catch(e){

alert(e.message);

}

}

// Comment

async function commentPost(postId){

const text=prompt("Write your comment");

if(!text) return;

try{

await addDoc(

collection(db,"posts",postId,"comments"),

{

uid:App.user.uid,

name:App.profile.name,

photo:App.profile.photo,

text:text,

createdAt:serverTimestamp()

}

);

}catch(e){

alert(e.message);

}

}

// Share

async function sharePost(postId){

try{

const post=posts.find(p=>p.id===postId);

if(!post) return;

await updateDoc(

doc(db,"posts",postId),

{

shares:(post.shares||0)+1

}

);

alert("Post Shared");

}catch(e){

alert(e.message);

}

}

// HTML onclick-এর জন্য

window.likePost=likePost;
window.commentPost=commentPost;
window.sharePost=sharePost;
// ======================================
// Friendsbook 2026
// script.js v3
// Part 4D
// Edit + Delete + Preview
// ======================================

// Delete Post

async function deletePost(postId){

if(!confirm("Delete this post?")) return;

try{

await deleteDoc(
doc(db,"posts",postId)
);

}catch(e){

alert(e.message);

}

}

// Edit Post

async function editPost(postId){

const post=posts.find(p=>p.id===postId);

if(!post) return;

const text=prompt(
"Edit Post",
post.text||""
);

if(text===null) return;

try{

await updateDoc(

doc(db,"posts",postId),

{

text:text

}

);

}catch(e){

alert(e.message);

}

}

// Image Preview

function openImage(url){

const viewer=$("imageViewer");

const img=$("previewImage");

if(!viewer||!img) return;

img.src=url;

viewer.classList.remove("hidden");

}

// Video Preview

function openVideo(url){

const viewer=$("videoViewer");

const video=$("previewVideo");

if(!viewer||!video) return;

video.src=url;

viewer.classList.remove("hidden");

video.play();

}

// Close Preview

$("closeImageViewer")?.addEventListener("click",()=>{

$("imageViewer").classList.add("hidden");

});

$("closeVideoViewer")?.addEventListener("click",()=>{

$("previewVideo").pause();

$("videoViewer").classList.add("hidden");

});

// Module Export

window.deletePost=deletePost;
window.editPost=editPost;
window.openImage=openImage;
window.openVideo=openVideo;
// ======================================
// Friendsbook 2026
// script.js v3
// Part 5A
// Search + Dark Mode + Menu
// ======================================

// ---------- Dark Mode ----------

App.dark = localStorage.getItem("fb_dark") === "true";

function applyDarkMode(){

    if(App.dark){

        document.body.classList.add("dark");

    }else{

        document.body.classList.remove("dark");

    }

    localStorage.setItem("fb_dark",App.dark);

}

applyDarkMode();

$("menuDarkBtn")?.addEventListener("click",()=>{

    App.dark=!App.dark;

    applyDarkMode();

});

// ---------- Side Menu ----------

$("navMenu")?.addEventListener("click",()=>{

    $("sideMenu")?.classList.toggle("hidden");

});

document.addEventListener("click",(e)=>{

    const menu=$("sideMenu");

    const btn=$("navMenu");

    if(!menu||!btn) return;

    if(
        !menu.contains(e.target) &&
        !btn.contains(e.target)
    ){

        menu.classList.add("hidden");

    }

});

// ---------- Search ----------

$("searchBtn")?.addEventListener("click",searchUsers);

$("searchInput")?.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        searchUsers();

    }

});

async function searchUsers(){

    const keyword=$("searchInput").value.trim();

    if(!keyword){

        alert("Type a name");

        return;

    }

    try{

        const snap=await getDocs(
            collection(db,"users")
        );

        let found=false;

        snap.forEach(doc=>{

            const user=doc.data();

            if(
                user.name &&
                user.name
                .toLowerCase()
                .includes(keyword.toLowerCase())
            ){

                found=true;

                alert(
                    "Found: "+user.name
                );

            }

        });

        if(!found){

            alert("No user found");

        }

    }catch(e){

        alert(e.message);

    }

}
// ======================================
// Friendsbook 2026
// script.js v3
// Part 5B
// Friend Request System
// ======================================

// Send Friend Request

async function sendFriendRequest(friendUid){

    if(!App.user) return;

    if(friendUid===App.user.uid){

        alert("You can't add yourself");

        return;

    }

    try{

        await setDoc(

            doc(
                db,
                "friendRequests",
                App.user.uid+"_"+friendUid
            ),

            {

                from:App.user.uid,
                to:friendUid,

                fromName:App.profile.name,
                fromPhoto:App.profile.photo,

                status:"pending",

                createdAt:serverTimestamp()

            }

        );

        alert("Friend Request Sent");

    }catch(e){

        alert(e.message);

    }

}

// Accept Friend Request

async function acceptFriendRequest(requestId,data){

    try{

        await setDoc(

            doc(
                db,
                "friends",
                App.user.uid+"_"+data.from
            ),

            {

                user1:App.user.uid,
                user2:data.from,

                createdAt:serverTimestamp()

            }

        );

        await deleteDoc(
            doc(
                db,
                "friendRequests",
                requestId
            )
        );

        alert("Friend Added");

    }catch(e){

        alert(e.message);

    }

}

// Load Friend Requests

function loadFriendRequests(){

    if(!App.user) return;

    const q=query(

        collection(db,"friendRequests"),

        where("to","==",App.user.uid)

    );

    onSnapshot(q,(snap)=>{

        console.log(
            "Friend Requests:",
            snap.size
        );

    });

}

// Start

loadFriendRequests();
