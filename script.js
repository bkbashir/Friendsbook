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
