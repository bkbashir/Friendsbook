// ===============================
// Friendsbook V5
// dating.js Part 1
// ===============================

import { db, auth, storage } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const datingPhoto=document.getElementById("datingPhoto");
const datingBio=document.getElementById("datingBio");
const datingGender=document.getElementById("datingGender");
const datingAge=document.getElementById("datingAge");
const createDatingBtn=document.getElementById("createDatingBtn");
const datingFeed=document.getElementById("datingFeed");

// ===============================
// Create Dating Profile
// ===============================

createDatingBtn.onclick=async()=>{

if(datingPhoto.files.length===0){

alert("Select Profile Photo");

return;

}

const file=datingPhoto.files[0];

const imageRef=ref(

storage,

"dating/"+Date.now()+"_"+file.name

);

await uploadBytes(imageRef,file);

const imageUrl=await getDownloadURL(imageRef);

await addDoc(

collection(db,"dating"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

photo:imageUrl,

bio:datingBio.value,

gender:datingGender.value,

age:datingAge.value,

likes:0,

createdAt:serverTimestamp()

}

);

datingPhoto.value="";
datingBio.value="";
datingGender.value="";
datingAge.value="";

alert("Dating Profile Created");

};

// ===============================
// Load Dating Profiles
// ===============================

const datingQuery=query(

collection(db,"dating"),

orderBy("createdAt","desc")

);

onSnapshot(datingQuery,(snapshot)=>{

datingFeed.innerHTML="";

snapshot.forEach((doc)=>{

const profile=doc.data();

const profileId=doc.id;

datingFeed.innerHTML+=`

<div class="datingCard">

<img src="${profile.photo}">

<h3>${profile.email}</h3>

<p>${profile.age} Years</p>

<p>${profile.bio}</p>

<button onclick="likeDating('${profileId}')">

❤️ Like

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// dating.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Like Profile
// ===============================

window.likeDating=async(profileId)=>{

await updateDoc(

doc(db,"dating",profileId),

{

likes:increment(1)

}

);

alert("Profile Liked ❤️");

};

// ===============================
// Delete Dating Profile
// ===============================

window.deleteDatingProfile=async(profileId)=>{

if(!confirm("Delete your dating profile?"))

return;

await deleteDoc(

doc(db,"dating",profileId)

);

alert("Dating Profile Deleted");

};

// ===============================
// Share Dating Profile
// ===============================

window.shareDatingProfile=(profileId)=>{

const link=

location.origin+

"/dating.html?id="+profileId;

navigator.clipboard.writeText(link);

alert("Dating Profile Link Copied");

};

// ===============================
// Open Dating Profile
// ===============================

window.openDatingProfile=(profileId)=>{

location.href=

"dating-profile.html?id="+profileId;

};// ===============================
// Friendsbook V5
// dating.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Send Match Request
// ===============================

window.sendMatchRequest=async(profileId)=>{

await addDoc(

collection(db,"datingMatches"),

{

profileId:profileId,

sender:auth.currentUser.email,

createdAt:serverTimestamp()

}

);

alert("Match Request Sent ❤️");

};

// ===============================
// Send Dating Message
// ===============================

window.sendDatingMessage=(profileId)=>{

location.href=

"dating-chat.html?id="+profileId;

};

// ===============================
// Report Dating Profile
// ===============================

window.reportDatingProfile=async(profileId)=>{

await addDoc(

collection(db,"datingReports"),

{

profileId:profileId,

reporter:auth.currentUser.email,

createdAt:serverTimestamp()

}

);

alert("Dating Profile Report Submitted");

};

// ===============================
// Save Dating Profile
// ===============================

window.saveDatingProfile=async(profileId)=>{

await addDoc(

collection(db,"savedDatingProfiles"),

{

uid:auth.currentUser.uid,

profileId:profileId,

createdAt:serverTimestamp()

}

);

alert("Dating Profile Saved");

};

// ===============================
// End dating.js
// ===============================
