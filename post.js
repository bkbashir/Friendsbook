// ===============================
// Friendsbook V5
// post.js Part 1
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

const postBtn=document.getElementById("createPostBtn");
const postText=document.getElementById("postText");
const imageInput=document.getElementById("postImage");
const videoInput=document.getElementById("postVideo");

postBtn.onclick=async()=>{

let text=postText.value.trim();

if(
text==="" &&
imageInput.files.length===0 &&
videoInput.files.length===0
){

alert("Write something...");
return;

}

let image="";
let video="";

if(imageInput.files.length>0){

const file=imageInput.files[0];

const imageRef=ref(
storage,
"posts/images/"+Date.now()+"_"+file.name
);

await uploadBytes(imageRef,file);

image=await getDownloadURL(imageRef);

}

if(videoInput.files.length>0){

const file=videoInput.files[0];

const videoRef=ref(
storage,
"posts/videos/"+Date.now()+"_"+file.name
);

await uploadBytes(videoRef,file);

video=await getDownloadURL(videoRef);

}await addDoc(

collection(db,"posts"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

name:auth.currentUser.displayName || "Friendsbook User",

text:text,

image:image,

video:video,

reaction:0,

comment:0,

share:0,

createdAt:serverTimestamp()

}

);

postText.value="";

imageInput.value="";

videoInput.value="";

alert("Post Published Successfully");

};

// ===============================
// Load Posts
// ===============================

import {

query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const postContainer=document.getElementById("postContainer");

const postQuery=query(

collection(db,"posts"),

orderBy("createdAt","desc")

);

onSnapshot(postQuery,(snapshot)=>{

postContainer.innerHTML="";

snapshot.forEach((doc)=>{

const post=doc.data();

const postId=doc.id;

postContainer.innerHTML+=`

<div class="postCard">

<div class="postHeader">

<img src="images/default-profile.png">

<div>

<h3>${post.name}</h3>

<p>${post.email}</p>

</div>

</div>

<div class="postText">

${post.text}

</div>

${post.image?

`<img class="postImage" src="${post.image}">`

:""}

${post.video?

`<video class="postVideo" controls src="${post.video}"></video>`

:""}

<div id="reactionCount_${postId}"></div>

`;<div class="postActions">

<button onclick="showReactionBox('${postId}')">

👍 React

</button>

<button onclick="openComment('${postId}')">

💬 Comment

</button>

<button onclick="sharePost('${postId}')">

↗ Share

</button>

${
post.email===auth.currentUser.email

?

`<button onclick="deletePost('${postId}')">

🗑 Delete

</button>`

:""

}

</div>

<div id="commentBox_${postId}"

class="commentBox">

</div>

</div>

`;

loadReactions(postId);

});

});

// ===============================
// Delete Post
// ===============================

import {

deleteDoc,
doc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

window.deletePost=async(postId)=>{

if(confirm("Delete this post?")){

await deleteDoc(

doc(db,"posts",postId)

);

}

};// ===============================
// Friendsbook V5
// Comment + Share
// ===============================

import {

updateDoc,
increment,
getDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Comment
// ===============================

window.openComment=function(postId){

const box=document.getElementById(

"commentBox_"+postId

);

box.innerHTML=`

<input
id="commentInput_${postId}"
placeholder="Write a comment...">

<button
onclick="sendComment('${postId}')">

Send

</button>

<div id="commentList_${postId}"></div>

`;

loadComments(postId);

};

window.sendComment=async(postId)=>{

const input=document.getElementById(

"commentInput_"+postId

);

if(input.value.trim()==="") return;

await addDoc(

collection(db,"comments"),

{

postId:postId,

user:auth.currentUser.email,

text:input.value,

time:serverTimestamp()

}

);

await updateDoc(

doc(db,"posts",postId),

{

comment:increment(1)

}

);

input.value="";

};

// ===============================
// Load Comments
// ===============================

window.loadComments=function(postId){

const q=query(

collection(db,"comments"),

where("postId","==",postId),

orderBy("time","asc")

);

onSnapshot(q,(snapshot)=>{

const list=document.getElementById(

"commentList_"+postId

);

if(!list) return;

list.innerHTML="";

snapshot.forEach((item)=>{

const c=item.data();

list.innerHTML+=`

<div class="commentItem">

<b>${c.user}</b><br>

${c.text}

</div>

`;

});

});

};

// ===============================
// Share
// ===============================

window.sharePost=function(postId){

navigator.clipboard.writeText(

location.href+"?post="+postId

);

alert("Post Link Copied");

};// ===============================
// Friendsbook V5
// Edit + Save + Copy Link
// ===============================

window.editPost = async(postId)=>{

const postRef = doc(db,"posts",postId);

const snap = await getDoc(postRef);

if(!snap.exists()) return;

const data = snap.data();

const newText = prompt("Edit Post",data.text);

if(newText===null) return;

await updateDoc(postRef,{

text:newText

});

};

// ===============================
// Save Post
// ===============================

window.savePost = async(postId)=>{

await setDoc(

doc(

db,

"savedPosts",

auth.currentUser.uid+"_"+postId

),

{

uid:auth.currentUser.uid,

postId:postId,

time:Date.now()

}

);

alert("Post Saved");

};

// ===============================
// Copy Link
// ===============================

window.copyPostLink=(postId)=>{

const url=location.origin+

location.pathname+

"?post="+postId;

navigator.clipboard.writeText(url);

alert("Link Copied");

};

// ===============================
// Facebook Style Reaction Connect
// ===============================

window.openReaction=(postId)=>{

showReactionBox(postId);

};

// ===============================
// Refresh Feed
// ===============================

window.refreshFeed=()=>{

location.reload();

};

// ===============================
// End post.js
// ===============================
