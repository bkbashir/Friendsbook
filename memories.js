// ===============================
// Friendsbook V5
// memories.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
query,
where,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const memoriesFeed=document.getElementById("memoriesFeed");

// ===============================
// Load Memories
// ===============================

const memoriesQuery=query(

collection(db,"posts"),

where("uid","==",auth.currentUser.uid),

orderBy("createdAt","desc")

);

onSnapshot(memoriesQuery,(snapshot)=>{

memoriesFeed.innerHTML="";

snapshot.forEach((doc)=>{

const post=doc.data();

const postId=doc.id;

memoriesFeed.innerHTML+=`

<div class="memoryCard">

<h3>${post.text}</h3>

${

post.image

?

`<img src="${post.image}" class="memoryImage">`

:

""

}

${

post.video

?

`<video controls src="${post.video}" class="memoryVideo"></video>`

:

""

}

<button onclick="shareMemory('${postId}')">

Share Memory

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// memories.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Share Memory
// ===============================

window.shareMemory=async(postId)=>{

const link=

location.origin+

"/post.html?id="+postId;

navigator.clipboard.writeText(link);

alert("Memory Link Copied");

};

// ===============================
// Save Memory
// ===============================

window.saveMemory=async(postId)=>{

await updateDoc(

doc(db,"posts",postId),

{

saved:increment(1)

}

);

alert("Memory Saved");

};

// ===============================
// Delete Memory
// ===============================

window.deleteMemory=async(postId)=>{

if(!confirm("Delete this memory?")) return;

await deleteDoc(

doc(db,"posts",postId)

);

alert("Memory Deleted");

};

// ===============================
// Open Memory
// ===============================

window.openMemory=(postId)=>{

location.href=

"post.html?id="+postId;

};// ===============================
// Friendsbook V5
// memories.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Comment Memory
// ===============================

window.commentMemory=async(postId)=>{

const text=prompt("Write a comment");

if(!text) return;

await addDoc(

collection(db,"memoryComments"),

{

postId:postId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

createdAt:serverTimestamp()

}

);

alert("Comment Added");

};

// ===============================
// Like Memory
// ===============================

window.likeMemory=async(postId)=>{

await addDoc(

collection(db,"memoryLikes"),

{

postId:postId,

uid:auth.currentUser.uid,

likedAt:serverTimestamp()

}

);

alert("Memory Liked");

};

// ===============================
// Report Memory
// ===============================

window.reportMemory=async(postId)=>{

await addDoc(

collection(db,"memoryReports"),

{

postId:postId,

reporter:auth.currentUser.email,

reportedAt:serverTimestamp()

}

);

alert("Memory Report Submitted");

};

// ===============================
// End memories.js
// ===============================
