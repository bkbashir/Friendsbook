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
// script.js Stable
// Part 2
// Profile System
// =======================================


// Load Profile

async function loadProfile(){

if(!currentUser) return;


const snap = await getDoc(

doc(
db,
"users",
currentUser.uid
)

);


if(snap.exists()){

userData = snap.data();


}


// Name

if($("profileName")){

$("profileName").innerText =
userData?.name || "User";

}


// Bio

if($("profileBio")){

$("profileBio").innerText =
userData?.bio || "";

}


// Profile Photo

if($("profileImage")){

$("profileImage").src =
userData?.photo ||
"default-profile.png";

}


// Cover

if($("coverImage")){

$("coverImage").src =
userData?.cover ||
"default-cover.jpg";

}


}



// ==========================
// Save Bio
// ==========================

$("saveBioBtn")?.addEventListener("click",async()=>{


const bio =
$("bioInput").value.trim();



await updateDoc(

doc(
db,
"users",
currentUser.uid
),

{

bio:bio

}

);



loadProfile();


alert("Bio Updated");


});




// ==========================
// Profile Photo Preview
// ==========================

$("profileInput")?.addEventListener("change",(e)=>{


const file=e.target.files[0];


if(!file)return;


const reader=new FileReader();


reader.onload=()=>{


$("profileImage").src =
reader.result;


};


reader.readAsDataURL(file);


});




// ==========================
// Cover Photo Preview
// ==========================

$("coverInput")?.addEventListener("change",(e)=>{


const file=e.target.files[0];


if(!file)return;


const reader=new FileReader();


reader.onload=()=>{


$("coverImage").src =
reader.result;


};


reader.readAsDataURL(file);


});
