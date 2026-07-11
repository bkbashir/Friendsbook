// ===============================
// Friendsbook V4
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

const postImage=document.getElementById("postImage");

const postVideo=document.getElementById("postVideo");

postBtn.onclick=async()=>{

if(

postText.value==="" &&
postImage.files.length===0 &&
postVideo.files.length===0

){

alert("Write something");

return;

}

let imageURL="";

let videoURL="";

if(postImage.files.length>0){

const imageRef=ref(

storage,

"posts/"+Date.now()+postImage.files[0].name

);

await uploadBytes(

imageRef,

postImage.files[0]

);

imageURL=await getDownloadURL(imageRef);

}

if(postVideo.files.length>0){

const videoRef=ref(

storage,

"posts/"+Date.now()+postVideo.files[0].name

);

await uploadBytes(

videoRef,

postVideo.files[0]

);

videoURL=await getDownloadURL(videoRef);

}await addDoc(

collection(db,"posts"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:postText.value,

image:imageURL,

video:videoURL,

likes:0,

comments:0,

createdAt:serverTimestamp()

}

);

postText.value="";

postImage.value="";

postVideo.value="";

alert("Post Published");

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

const q=query(

collection(db,"posts"),

orderBy("createdAt","desc")

);

onSnapshot(q,(snapshot)=>{

postContainer.innerHTML="";

snapshot.forEach((doc)=>{

const post=doc.data();

postContainer.innerHTML+=`

<div class="postCard">

<div class="postHeader">

<img src="images/default-profile.png">

<div>

<div class="postUser">

${post.email}

</div>

<div class="postTime">

Just now

</div>

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

<div class="postActions">

<button>👍 Like</button>

<button>💬 Comment</button>

<button>↗ Share</button>

</div>

</div>

`;

});

});
