// ===============================
// Friendsbook V4
// story.js Part 1
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

const storyInput=document.getElementById("storyInput");

const uploadStoryBtn=document.getElementById("uploadStoryBtn");

uploadStoryBtn.onclick=async()=>{

if(storyInput.files.length===0){

alert("Select Story");

return;

}

const file=storyInput.files[0];

const storyRef=ref(

storage,

"stories/"+Date.now()+file.name

);

await uploadBytes(

storyRef,

file

);

const url=await getDownloadURL(storyRef);

await addDoc(

collection(db,"stories"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

story:url,

type:file.type,

createdAt:serverTimestamp()

}

);

storyInput.value="";

alert("Story Uploaded");

};// ===============================
// Load Stories
// ===============================

import {

query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const storyBar=document.getElementById("storyBar");

const storyContainer=document.getElementById("storyContainer");

const storyQuery=query(

collection(db,"stories"),

orderBy("createdAt","desc")

);

onSnapshot(storyQuery,(snapshot)=>{

storyBar.innerHTML="";

storyContainer.innerHTML="";

snapshot.forEach((doc)=>{

const story=doc.data();

const isVideo=story.type.startsWith("video");

storyBar.innerHTML+=`

<div class="storyCard"

onclick="window.open('${story.story}','_blank')">

${

isVideo

?

`<video src="${story.story}" muted></video>`

:

`<img src="${story.story}">`

}

<p>${story.email}</p>

</div>

`;

storyContainer.innerHTML+=`

<div class="storyViewer">

${

isVideo

?

`<video controls src="${story.story}"></video>`

:

`<img src="${story.story}">`

}

<h4>${story.email}</h4>

</div>

`;

});

});// ===============================
// Story Auto Delete (24 Hours)
// ===============================

import {
deleteDoc,
doc,
Timestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onSnapshot(storyQuery, async(snapshot)=>{

const now=Date.now();

snapshot.forEach(async(item)=>{

const data=item.data();

if(data.createdAt){

const created=data.createdAt.toMillis();

const hours=(now-created)/(1000*60*60);

if(hours>=24){

await deleteDoc(

doc(db,"stories",item.id)

);

}

}

});

});

// ===============================
// Story Viewer
// ===============================

window.openStory=function(url,type){

const viewer=document.createElement("div");

viewer.className="storyFullScreen";

viewer.innerHTML=`

<div class="storyClose"

onclick="this.parentElement.remove()">

✕

</div>

${
type.startsWith("video")

?

`<video src="${url}" autoplay controls></video>`

:

`<img src="${url}">`

}

`;

document.body.appendChild(viewer);

};

// ===============================
// Story End
// ===============================
