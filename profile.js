// ===============================
// Friendsbook V4
// profile.js Part 1
// ===============================

import { db, auth, storage } from "./firebase.js";

import {
doc,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const profileInput=document.getElementById("profileInput");
const coverInput=document.getElementById("coverInput");
const saveProfileBtn=document.getElementById("saveProfileBtn");
const bioInput=document.getElementById("bioInput");

// ===============================
// Load Profile
// ===============================

async function loadProfile(){

const snap=await getDoc(

doc(db,"users",auth.currentUser.email)

);

if(snap.exists()){

const data=snap.data();

document.getElementById("myName").innerHTML=data.name;

document.getElementById("profileName").innerHTML=data.name;

bioInput.value=data.bio||"";

if(data.profile){

document.getElementById("profileImage").src=data.profile;

document.getElementById("profilePhoto").src=data.profile;

}

if(data.cover){

document.getElementById("coverPhoto").src=data.cover;

}

}

}

loadProfile();// ===============================
// Save Bio
// ===============================

saveProfileBtn.onclick = async()=>{

await updateDoc(

doc(db,"users",auth.currentUser.email),

{

bio:bioInput.value

}

);

alert("Profile Updated");

};

// ===============================
// Upload Profile Photo
// ===============================

profileInput.onchange = async()=>{

const file = profileInput.files[0];

if(!file) return;

const imageRef = ref(

storage,

"profile/"+auth.currentUser.uid

);

await uploadBytes(imageRef,file);

const url = await getDownloadURL(imageRef);

await updateDoc(

doc(db,"users",auth.currentUser.email),

{

profile:url

}

);

document.getElementById("profileImage").src=url;

document.getElementById("profilePhoto").src=url;

};

// ===============================
// Upload Cover Photo
// ===============================

coverInput.onchange = async()=>{

const file = coverInput.files[0];

if(!file) return;

const coverRef = ref(

storage,

"cover/"+auth.currentUser.uid

);

await uploadBytes(coverRef,file);

const url = await getDownloadURL(coverRef);

await updateDoc(

doc(db,"users",auth.currentUser.email),

{

cover:url

}

);

document.getElementById("coverPhoto").src=url;

};

// ===============================
// End profile.js
// ===============================
