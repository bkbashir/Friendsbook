// ===============================
// Friendsbook V5
// watch.js Part 1
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

const watchVideo=document.getElementById("watchVideo");
const watchTitle=document.getElementById("watchTitle");
const uploadWatchBtn=document.getElementById("uploadWatchBtn");
const watchFeed=document.getElementById("watchFeed");

// ===============================
// Upload Video
// ===============================

uploadWatchBtn.onclick=async()=>{

if(watchVideo.files.length===0){

alert("Select Video");

return;

}

const file=watchVideo.files[0];

const videoRef=ref(

storage,

"watch/"+Date.now()+"_"+file.name

);

await uploadBytes(videoRef,file);

const videoURL=await getDownloadURL(videoRef);

await addDoc(

collection(db,"watch"),

{

title:watchTitle.value,

video:videoURL,

owner:auth.currentUser.email,

likes:0,

views:0,

createdAt:serverTimestamp()

}

);

watchTitle.value="";
watchVideo.value="";

alert("Video Uploaded");

};

// ===============================
// Load Videos
// ===============================

const watchQuery=query(

collection(db,"watch"),

orderBy("createdAt","desc")

);

onSnapshot(watchQuery,(snapshot)=>{

watchFeed.innerHTML="";

snapshot.forEach((doc)=>{

const video=doc.data();

const videoId=doc.id;

watchFeed.innerHTML+=`

<div class="watchCard">

<h3>${video.title}</h3>

<video

controls

src="${video.video}">

</video>

<p>${video.owner}</p>

<button onclick="watchLike('${videoId}')">

👍 ${video.likes}

</button>

<button onclick="watchShare('${videoId}')">

Share

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// watch.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Like Video
// ===============================

window.watchLike=async(videoId)=>{

await updateDoc(

doc(db,"watch",videoId),

{

likes:increment(1)

}

);

};

// ===============================
// View Count
// ===============================

window.watchView=async(videoId)=>{

await updateDoc(

doc(db,"watch",videoId),

{

views:increment(1)

}

);

};

// ===============================
// Delete Video
// ===============================

window.deleteWatchVideo=async(videoId)=>{

if(!confirm("Delete this video?"))

return;

await deleteDoc(

doc(db,"watch",videoId)

);

alert("Video Deleted");

};

// ===============================
// Share Video
// ===============================

window.watchShare=(videoId)=>{

const link=

location.origin+

"/watch.html?id="+videoId;

navigator.clipboard.writeText(link);

alert("Video Link Copied");

};

// ===============================
// Full Screen Video
// ===============================

window.fullScreenWatch=(video)=>{

if(video.requestFullscreen){

video.requestFullscreen();

}

};
// ===============================
// Friendsbook V5
// watch.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Comment Video
// ===============================

window.watchComment=async(videoId)=>{

const text=prompt("Write a comment");

if(!text) return;

await addDoc(

collection(db,"watchComments"),

{

videoId:videoId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

createdAt:serverTimestamp()

}

);

alert("Comment Added");

};

// ===============================
// Save Video
// ===============================

window.saveWatchVideo=async(videoId)=>{

await addDoc(

collection(db,"savedWatch"),

{

uid:auth.currentUser.uid,

videoId:videoId,

savedAt:serverTimestamp()

}

);

alert("Video Saved");

};

// ===============================
// Report Video
// ===============================

window.reportWatchVideo=async(videoId)=>{

await addDoc(

collection(db,"watchReports"),

{

videoId:videoId,

reporter:auth.currentUser.email,

reportedAt:serverTimestamp()

}

);

alert("Video Report Submitted");

};

// ===============================
// Open Video
// ===============================

window.openWatchVideo=(videoId)=>{

location.href="watch-player.html?id="+videoId;

};

// ===============================
// End watch.js
// ===============================
