// ===============================
// Friendsbook V4
// message.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const chatBox=document.getElementById("chatBox");
const chatInput=document.getElementById("chatInput");
const sendBtn=document.getElementById("sendBtn");
const chatFriendName=document.getElementById("chatFriendName");

let currentFriend="";

window.openChat=(friend)=>{

currentFriend=friend;

chatFriendName.innerHTML=friend;

document.getElementById("messagePage").style.display="block";

loadMessages();

};

sendBtn.onclick=async()=>{

if(chatInput.value.trim()==="") return;

await addDoc(

collection(db,"messages"),

{

from:auth.currentUser.email,

to:currentFriend,

text:chatInput.value,

seen:false,

time:serverTimestamp()

}

);

chatInput.value="";

};

chatInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

sendBtn.click();

}

});// ===============================
// Load Messages (Realtime)
// ===============================

function loadMessages(){

const q=query(

collection(db,"messages"),

orderBy("time","asc")

);

onSnapshot(q,(snapshot)=>{

chatBox.innerHTML="";

snapshot.forEach((doc)=>{

const m=doc.data();

if(

(m.from===auth.currentUser.email &&
m.to===currentFriend)

||

(m.from===currentFriend &&
m.to===auth.currentUser.email)

){

chatBox.innerHTML+=`

<div class="${
m.from===auth.currentUser.email
?
"myMessage"
:
"friendMessage"
}">

${m.text}

</div>

`;

}

});

chatBox.scrollTop=chatBox.scrollHeight;

});

}

// ===============================
// Close Messenger
// ===============================

window.closeChat=()=>{

document.getElementById("messagePage").style.display="none";

currentFriend="";

};

// ===============================
// Auto Focus
// ===============================

chatInput.addEventListener("focus",()=>{

chatBox.scrollTop=chatBox.scrollHeight;

});// ===============================
// Friendsbook V4
// message.js Part 3
// Seen + Emoji + Image Message
// ===============================

import {
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
storage
} from "./firebase.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// ===============================
// Seen
// ===============================

async function seenMessage(id){

try{

await updateDoc(

doc(db,"messages",id),

{

seen:true

}

);

}catch(e){}

}

// ===============================
// Emoji
// ===============================

window.addEmoji=function(emoji){

chatInput.value+=emoji;

chatInput.focus();

};

// ===============================
// Send Image
// ===============================

window.sendImage=async(file)=>{

if(!currentFriend) return;

const imageRef=ref(

storage,

"chat/"+Date.now()+file.name

);

await uploadBytes(

imageRef,

file

);

const url=await getDownloadURL(imageRef);

await addDoc(

collection(db,"messages"),

{

from:auth.currentUser.email,

to:currentFriend,

image:url,

text:"",

seen:false,

time:serverTimestamp()

}

);

};

// ===============================
// Voice Message (Coming Next)
// ===============================

// Reserved for Recorder API

// ===============================
// End message.js
// ===============================
