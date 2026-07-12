// ===============================
// Friendsbook V5
// live.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
addDoc,
serverTimestamp,
query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const liveTitle=document.getElementById("liveTitle");
const startLiveBtn=document.getElementById("startLiveBtn");
const endLiveBtn=document.getElementById("endLiveBtn");
const liveFeed=document.getElementById("liveFeed");

let localStream=null;

// ===============================
// Start Live
// ===============================

startLiveBtn.onclick=async()=>{

try{

localStream=await navigator.mediaDevices.getUserMedia({

video:true,

audio:true

});

document.getElementById("livePreview").srcObject=

localStream;

await addDoc(

collection(db,"live"),

{

title:liveTitle.value,

owner:auth.currentUser.email,

status:"LIVE",

viewers:0,

createdAt:serverTimestamp()

}

);

alert("Live Started");

}catch(e){

alert(e.message);

}

};

// ===============================
// Load Live Videos
// ===============================

const liveQuery=query(

collection(db,"live"),

orderBy("createdAt","desc")

);

onSnapshot(liveQuery,(snapshot)=>{

liveFeed.innerHTML="";

snapshot.forEach((doc)=>{

const live=doc.data();

const liveId=doc.id;

liveFeed.innerHTML+=`

<div class="liveCard">

<h3>${live.title}</h3>

<p>${live.owner}</p>

<p>${live.status}</p>

<button onclick="watchLive('${liveId}')">

Watch Live

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// live.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Watch Live
// ===============================

window.watchLive=async(liveId)=>{

await updateDoc(

doc(db,"live",liveId),

{

viewers:increment(1)

}

);

location.href="live-player.html?id="+liveId;

};

// ===============================
// End Live
// ===============================

window.endLive=async(liveId)=>{

if(localStream){

localStream.getTracks().forEach(track=>{

track.stop();

});

}

await updateDoc(

doc(db,"live",liveId),

{

status:"ENDED"

}

);

alert("Live Ended");

};

// ===============================
// Delete Live
// ===============================

window.deleteLive=async(liveId)=>{

if(!confirm("Delete this live?"))

return;

await deleteDoc(

doc(db,"live",liveId)

);

alert("Live Deleted");

};

// ===============================
// Share Live
// ===============================

window.shareLive=(liveId)=>{

const link=

location.origin+

"/live.html?id="+liveId;

navigator.clipboard.writeText(link);

alert("Live Link Copied");

};// ===============================
// Friendsbook V5
// live.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Live Comment
// ===============================

window.sendLiveComment=async(liveId)=>{

const text=prompt("Write a comment");

if(!text) return;

await addDoc(

collection(db,"liveComments"),

{

liveId:liveId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

createdAt:serverTimestamp()

}

);

alert("Comment Sent");

};

// ===============================
// Live Reaction
// ===============================

window.sendLiveReaction=async(liveId,reaction)=>{

await addDoc(

collection(db,"liveReactions"),

{

liveId:liveId,

uid:auth.currentUser.uid,

reaction:reaction,

createdAt:serverTimestamp()

}

);

};

// ===============================
// Report Live
// ===============================

window.reportLive=async(liveId)=>{

await addDoc(

collection(db,"liveReports"),

{

liveId:liveId,

reporter:auth.currentUser.email,

createdAt:serverTimestamp()

}

);

alert("Live Report Submitted");

};

// ===============================
// Save Live
// ===============================

window.saveLive=async(liveId)=>{

await addDoc(

collection(db,"savedLive"),

{

uid:auth.currentUser.uid,

liveId:liveId,

createdAt:serverTimestamp()

}

);

alert("Live Saved");

};

// ===============================
// End live.js
// ===============================
