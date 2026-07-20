//=====================================
// Friendsbook 2026
// Firebase Config
//=====================================

const firebaseConfig = {
  apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
  authDomain: "friendsbook-4a40c.firebaseapp.com",
  projectId: "friendsbook-4a40c",
  storageBucket: "friendsbook-4a40c.firebasestorage.app",
  messagingSenderId: "1000346329473",
  appId: "1:1000346329473:web:9bd69019e2b09f971e8880"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

//=====================================
// Elements
//=====================================

const loadingScreen = document.getElementById("loadingScreen");

const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const forgotPage = document.getElementById("forgotPage");
const mainPage = document.getElementById("mainPage");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotForm = document.getElementById("forgotForm");

const logoutBtn = document.getElementById("logoutBtn");
const profileName = document.getElementById("profileName");
const drawerProfileName = document.getElementById("drawerProfileName");

const profileBio = document.getElementById("profileBio");

const profilePhoto = document.getElementById("profilePhoto");
const drawerProfilePhoto = document.getElementById("drawerProfilePhoto");
const homeProfilePhoto = document.getElementById("homeProfilePhoto");

const coverPhoto = document.getElementById("coverPhoto");
//=====================================
// Loading Screen
//=====================================

window.addEventListener("load", () => {

setTimeout(() => {

loadingScreen.style.display = "none";

}, 1800);

});
//=====================================
// Signup
//=====================================

signupForm.addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("fullName").value.trim();
const email = document.getElementById("signupEmail").value.trim();
const password = document.getElementById("signupPassword").value;

try {

const result = await auth.createUserWithEmailAndPassword(email, password);

await db.collection("users").doc(result.user.uid).set({

uid: result.user.uid,
name: name,
email: email,
bio: "",
profilePhoto: "",
coverPhoto: "",
followers: 0,
following: 0,
friends: 0,
createdAt: firebase.firestore.FieldValue.serverTimestamp()

});

alert("Account Created Successfully");

signupPage.style.display = "none";
loginPage.style.display = "flex";

} catch (error) {

alert(error.message);

}

});

//=====================================
// Login
//=====================================

loginForm.addEventListener("submit", async (e) => {

e.preventDefault();

const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value;

try {

await auth.signInWithEmailAndPassword(email, password);

} catch (error) {

alert(error.message);

}

});

//=====================================
// Forgot Password
//=====================================

forgotForm.addEventListener("submit", async (e) => {

e.preventDefault();

const email = document.getElementById("forgotEmail").value.trim();

try {

await auth.sendPasswordResetEmail(email);

alert("Password Reset Link Sent");

forgotPage.style.display = "none";
loginPage.style.display = "flex";

} catch (error) {

alert(error.message);

}

});
//=====================================
// Auto Login + Logout
//=====================================

auth.onAuthStateChanged(async (user) => {

if (user) {

loginPage.style.display = "none";
signupPage.style.display = "none";
forgotPage.style.display = "none";
mainPage.style.display = "block";

loadUserProfile(user.uid);

const lastPage = localStorage.getItem("lastPage") || "home";

showPage(lastPage);

} else {

loginPage.style.display = "flex";
signupPage.style.display = "none";
forgotPage.style.display = "none";
mainPage.style.display = "none";

}

});

//=====================================
// Logout
//=====================================

logoutBtn.addEventListener("click", async () => {

await auth.signOut();

localStorage.removeItem("lastPage");

});

//=====================================
// Page Remember
//=====================================

function showPage(page){

document.querySelectorAll("#mainPage section").forEach(sec=>{

sec.style.display="none";

});

switch(page){

case "profile":
profilePage.style.display="block";
break;

case "friends":
friendsPage.style.display="block";
break;

case "message":
messagePage.style.display="block";
break;

case "reels":
reelsPage.style.display="block";
break;

case "marketplace":
marketplacePage.style.display="block";
break;

case "notification":
notificationPage.style.display="block";
break;

case "settings":
settingsPage.style.display="block";
break;

default:
homePage.style.display="block";

}

localStorage.setItem("lastPage",page);

}

//=====================================
// Load User Profile
//=====================================

async function loadUserProfile(uid){

const doc=await db.collection("users").doc(uid).get();

if(!doc.exists) return;

const data=doc.data();

profileName.textContent=data.name||"";
drawerProfileName.textContent=data.name||"";

profileBio.textContent=data.bio||"";

if(data.profilePhoto){

profilePhoto.src=data.profilePhoto;
drawerProfilePhoto.src=data.profilePhoto;
homeProfilePhoto.src=data.profilePhoto;

}

if(data.coverPhoto){

coverPhoto.src=data.coverPhoto;

}

}
//=====================================
// Profile Photo & Cover Photo Upload
//=====================================

const profilePhotoInput = document.getElementById("profilePhotoInput");
const coverPhotoInput = document.getElementById("coverPhotoInput");
const bioInput = document.getElementById("bioInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");

let currentUser = null;

auth.onAuthStateChanged(user => {
    if(user){
        currentUser = user;
    }
});

//=====================================
// Upload Profile Photo
//=====================================

profilePhotoInput.addEventListener("change", async(e)=>{

const file=e.target.files[0];

if(!file || !currentUser) return;

const ref=storage.ref("profilePhotos/"+currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("users").doc(currentUser.uid).update({

profilePhoto:url

});

profilePhoto.src=url;
drawerProfilePhoto.src=url;
homeProfilePhoto.src=url;

});

//=====================================
// Upload Cover Photo
//=====================================

coverPhotoInput.addEventListener("change",async(e)=>{

const file=e.target.files[0];

if(!file || !currentUser) return;

const ref=storage.ref("coverPhotos/"+currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("users").doc(currentUser.uid).update({

coverPhoto:url

});

coverPhoto.src=url;

});

//=====================================
// Save Bio
//=====================================

saveProfileBtn.addEventListener("click",async()=>{

if(!currentUser) return;

await db.collection("users").doc(currentUser.uid).update({

bio:bioInput.value.trim()

});

profileBio.textContent=bioInput.value.trim();

alert("Profile Updated Successfully");

});
// Navigation Buttons

const navHome = document.getElementById("navHome");
const navFriends = document.getElementById("navFriends");
const navReels = document.getElementById("navReels");
const navMarketplace = document.getElementById("navMarketplace");
const navProfile = document.getElementById("navProfile");

const homePage = document.getElementById("homePage");
const friendsPage = document.getElementById("friendsPage");
const reelsPage = document.getElementById("reelsPage");
const marketplacePage = document.getElementById("marketplacePage");
const profilePage = document.getElementById("profilePage");

function hidePages(){

homePage.style.display="none";
friendsPage.style.display="none";
reelsPage.style.display="none";
marketplacePage.style.display="none";
profilePage.style.display="none";

}

navHome.onclick=()=>{

hidePages();
homePage.style.display="block";
localStorage.setItem("lastPage","home");

};

navFriends.onclick=()=>{

hidePages();
friendsPage.style.display="block";
localStorage.setItem("lastPage","friends");

};

navReels.onclick=()=>{

hidePages();
reelsPage.style.display="block";
localStorage.setItem("lastPage","reels");

};

navMarketplace.onclick=()=>{

hidePages();
marketplacePage.style.display="block";
localStorage.setItem("lastPage","marketplace");

};

navProfile.onclick=()=>{

hidePages();
profilePage.style.display="block";
localStorage.setItem("lastPage","profile");

};
//==============================
// Create Post (Firestore)
//==============================

const postBtn = document.getElementById("postBtn");
const imageBtn = document.getElementById("imageBtn");
const videoBtn = document.getElementById("videoBtn");

const imageInput = document.getElementById("imageInput");
const videoInput = document.getElementById("videoInput");

let selectedImage = null;
let selectedVideo = null;

imageBtn.onclick = () => imageInput.click();
videoBtn.onclick = () => videoInput.click();

imageInput.onchange = (e)=>{
    selectedImage = e.target.files[0];
}

videoInput.onchange = (e)=>{
    selectedVideo = e.target.files[0];
}

postBtn.onclick = async ()=>{

const user = auth.currentUser;

if(!user){
alert("Login Required");
return;
}

const text = postInput.value.trim();

if(text==="" && !selectedImage && !selectedVideo){
alert("Write something");
return;
}

let imageUrl="";
let videoUrl="";

// Image Upload
if(selectedImage){

const ref = storage.ref("posts/images/"+Date.now());

await ref.put(selectedImage);

imageUrl = await ref.getDownloadURL();

}

// Video Upload
if(selectedVideo){

const ref = storage.ref("posts/videos/"+Date.now());

await ref.put(selectedVideo);

videoUrl = await ref.getDownloadURL();

}

const userDoc = await db.collection("users").doc(user.uid).get();

await db.collection("posts").add({

uid:user.uid,

name:userDoc.data().name,

profile:userDoc.data().profilePhoto,

text:text,

image:imageUrl,

video:videoUrl,

time:firebase.firestore.FieldValue.serverTimestamp(),

like:0,

comment:0,

share:0

});

postInput.value="";
selectedImage=null;
selectedVideo=null;

alert("Post Successful");

loadPosts();

  }
//=====================================
// Load Posts
//=====================================

async function loadPosts(){

feedContainer.innerHTML="";

const snapshot = await db.collection("posts")
.orderBy("time","desc")
.get();

snapshot.forEach((doc)=>{

const post = doc.data();

feedContainer.innerHTML += `

<div class="postCard">

<div class="postTop">

<img src="${post.profile || 'myphoto.png'}" class="postProfile">

<div>

<h4>${post.name}</h4>

<small>${post.time?.toDate().toLocaleString() || ""}</small>

</div>

</div>

<p>${post.text || ""}</p>

${post.image ? `<img src="${post.image}" class="postImage">` : ""}

${post.video ? `
<video class="postVideo" controls>
<source src="${post.video}">
</video>` : ""}

<div class="postActions">

<button>👍 ${post.like}</button>

<button>💬 ${post.comment}</button>

<button>↗️ ${post.share}</button>

</div>

</div>

`;

});

}

//=====================================
// Auto Load Feed
//=====================================

auth.onAuthStateChanged((user)=>{

if(user){

loadPosts();

}

});
