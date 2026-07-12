// ===============================
// Friendsbook V5
// ads.js Part 1
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

const adTitle=document.getElementById("adTitle");
const adDescription=document.getElementById("adDescription");
const adLink=document.getElementById("adLink");
const adImage=document.getElementById("adImage");
const publishAdBtn=document.getElementById("publishAdBtn");
const adsFeed=document.getElementById("adsFeed");

// ===============================
// Publish Advertisement
// ===============================

publishAdBtn.onclick=async()=>{

if(adTitle.value.trim()===""){

alert("Enter Advertisement Title");

return;

}

let imageURL="";

if(adImage.files.length>0){

const file=adImage.files[0];

const imageRef=ref(

storage,

"ads/"+Date.now()+"_"+file.name

);

await uploadBytes(imageRef,file);

imageURL=await getDownloadURL(imageRef);

}

await addDoc(

collection(db,"ads"),

{

title:adTitle.value,

description:adDescription.value,

link:adLink.value,

image:imageURL,

owner:auth.currentUser.email,

clicks:0,

createdAt:serverTimestamp()

}

);

adTitle.value="";
adDescription.value="";
adLink.value="";
adImage.value="";

alert("Advertisement Published");

};

// ===============================
// Load Advertisements
// ===============================

const adsQuery=query(

collection(db,"ads"),

orderBy("createdAt","desc")

);

onSnapshot(adsQuery,(snapshot)=>{

adsFeed.innerHTML="";

snapshot.forEach((doc)=>{

const ad=doc.data();

const adId=doc.id;

adsFeed.innerHTML+=`

<div class="adCard">

<img src="${ad.image}">

<h3>${ad.title}</h3>

<p>${ad.description}</p>

<button onclick="openAd('${adId}','${ad.link}')">

Visit

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// ads.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Open Advertisement
// ===============================

window.openAd=async(adId,link)=>{

await updateDoc(

doc(db,"ads",adId),

{

clicks:increment(1)

}

);

window.open(

link,

"_blank"

);

};

// ===============================
// Delete Advertisement
// ===============================

window.deleteAd=async(adId)=>{

if(!confirm("Delete this advertisement?"))

return;

await deleteDoc(

doc(db,"ads",adId)

);

alert("Advertisement Deleted");

};

// ===============================
// Edit Advertisement
// ===============================

window.editAd=async(adId)=>{

const title=prompt("New Advertisement Title");

if(!title) return;

await updateDoc(

doc(db,"ads",adId),

{

title:title

}

);

alert("Advertisement Updated");

};

// ===============================
// Copy Advertisement Link
// ===============================

window.copyAdLink=(link)=>{

navigator.clipboard.writeText(link);

alert("Advertisement Link Copied");

};// ===============================
// Friendsbook V5
// ads.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Report Advertisement
// ===============================

window.reportAd=async(adId)=>{

await addDoc(

collection(db,"adReports"),

{

adId:adId,

reporter:auth.currentUser.email,

reportedAt:serverTimestamp()

}

);

alert("Advertisement Report Submitted");

};

// ===============================
// Save Advertisement
// ===============================

window.saveAd=async(adId)=>{

await addDoc(

collection(db,"savedAds"),

{

uid:auth.currentUser.uid,

adId:adId,

savedAt:serverTimestamp()

}

);

alert("Advertisement Saved");

};

// ===============================
// Advertisement Analytics
// ===============================

window.viewAdAnalytics=(adId)=>{

location.href=

"ad-analytics.html?id="+adId;

};

// ===============================
// Advertisement Preview
// ===============================

window.previewAd=(adId)=>{

location.href=

"ad-preview.html?id="+adId;

};

// ===============================
// End ads.js
// ===============================
