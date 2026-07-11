// ===============================
// Friendsbook V5
// reels.js Part 1
// ===============================

import { db, auth, storage } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const reelsInput=document.getElementById("reelsInput");
const uploadReelBtn=document.getElementById("uploadReelBtn");

uploadReelBtn.onclick=async()=>{

if(reelsInput.files.length===0){

alert("Select a Reel Video");

return;

}

const file=reelsInput.files[0];

const reelRef=ref(

storage,

"reels/"+Date.now()+"_"+file.name

);

await uploadBytes(reelRef,file);

const reelURL=await getDownloadURL(reelRef);

await addDoc(

collection(db,"reels"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

video:reelURL,

likes:0,

comments:0,

shares:0,

createdAt:serverTimestamp()

}

);

reelsInput.value="";

alert("Reel Uploaded Successfully");

};// ===============================
// Friendsbook V5
// reels.js Part 2
// ===============================

import {

query,
collection,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const reelsContainer=document.getElementById("reelsContainer");

const reelsQuery=query(

collection(db,"reels"),

orderBy("createdAt","desc")

);

onSnapshot(reelsQuery,(snapshot)=>{

reelsContainer.innerHTML="";

snapshot.forEach((doc)=>{

const reel=doc.data();

const reelId=doc.id;

reelsContainer.innerHTML+=`

<div class="reelCard">

<video

class="reelVideo"

src="${reel.video}"

autoplay

muted

loop

playsinline

controls>

</video>

<div class="reelInfo">

<h3>${reel.email}</h3>

</div>

<div class="reelActions">

<button onclick="likeReel('${reelId}')">

❤️ ${reel.likes}

</button>

<button onclick="commentReel('${reelId}')">

💬 ${reel.comments}

</button>

<button onclick="shareReel('${reelId}')">

↗ ${reel.shares}

</button>

</div>

</div>

`;

});

});

// ===============================
// Auto Play Visible Reel
// ===============================

const observer=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

const video=entry.target;

if(entry.isIntersecting){

video.play();

}else{

video.pause();

}

});

},

{

threshold:0.7

}

);

setTimeout(()=>{

document.querySelectorAll(".reelVideo")

.forEach(video=>{

observer.observe(video);

});

},1000);// ===============================
// Friendsbook V5
// reels.js Part 3
// ===============================

import {

doc,
updateDoc,
deleteDoc,
increment

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Like Reel
// ===============================

window.likeReel=async(reelId)=>{

await updateDoc(

doc(db,"reels",reelId),

{

likes:increment(1)

}

);

};

// ===============================
// Comment Reel
// ===============================

window.commentReel=async(reelId)=>{

const text=prompt("Write a comment");

if(!text) return;

await addDoc(

collection(db,"reelComments"),

{

reelId:reelId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

time:serverTimestamp()

}

);

await updateDoc(

doc(db,"reels",reelId),

{

comments:increment(1)

}

);

};

// ===============================
// Share Reel
// ===============================

window.shareReel=async(reelId)=>{

navigator.clipboard.writeText(

location.origin+

location.pathname+

"?reel="+reelId

);

await updateDoc(

doc(db,"reels",reelId),

{

shares:increment(1)

}

);

alert("Reel Link Copied");

};

// ===============================
// Delete Own Reel
// ===============================

window.deleteReel=async(reelId)=>{

if(!confirm("Delete this reel?"))

return;

await deleteDoc(

doc(db,"reels",reelId)

);

};

// ===============================
// End reels.js
// ===============================
