// =======================================
// Friendsbook 2026
// script.js Stable
// Part 1
// Authentication + Profile Load
// =======================================

import {

auth,
db,

signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendPasswordResetEmail,
signOut,
onAuthStateChanged,
updateProfile,

doc,
setDoc,
getDoc,

serverTimestamp

} from "./firebase.js";


// Helper

const $ = id => document.getElementById(id);


// App Data

let currentUser = null;
let userData = null;


// ==========================
// Login
// ==========================

$("loginBtn")?.addEventListener("click", async()=>{

const email = $("loginEmail").value.trim();

const password = $("loginPassword").value;


try{

await signInWithEmailAndPassword(
auth,
email,
password
);


}catch(error){

alert(error.message);

}

});


// ==========================
// Signup
// ==========================

$("signupBtn")?.addEventListener("click", async()=>{


const name = $("signupName").value.trim();

const email = $("signupEmail").value.trim();

const password = $("signupPassword").value;



try{


const result =
await createUserWithEmailAndPassword(
auth,
email,
password
);



await updateProfile(
result.user,
{
displayName:name
}
);



await setDoc(

doc(
db,
"users",
result.user.uid
),

{

uid:result.user.uid,

name:name,

email:email,

photo:"default-profile.png",

cover:"default-cover.jpg",

bio:"",

createdAt:serverTimestamp()

}

);



alert("Account Created");


}catch(error){

alert(error.message);

}


});


// ==========================
// Forgot Password
// ==========================

$("resetPasswordBtn")?.addEventListener("click",async()=>{


const email=$("forgotEmail").value.trim();


try{


await sendPasswordResetEmail(
auth,
email
);


alert("Reset email sent");


}catch(error){

alert(error.message);

}


});


// ==========================
// Auth State
// ==========================


onAuthStateChanged(auth,async(user)=>{


if(user){


currentUser=user;


const snap =
await getDoc(
doc(
db,
"users",
user.uid
)
);



if(snap.exists()){

userData=snap.data();

}


// Show Home

$("loginPage").style.display="none";

$("mainPage").style.display="block";



// Update Name

if($("userName")){

$("userName").innerText =
userData?.name || user.displayName;

}


// Update Photo

if($("profileImage")){

$("profileImage").src =
userData?.photo ||
"default-profile.png";

}


}else{


currentUser=null;

userData=null;


$("loginPage").style.display="block";

$("mainPage").style.display="none";


}


});


// ==========================
// Logout
// ==========================


$("logoutBtn")?.addEventListener("click",async()=>{


await signOut(auth);


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
