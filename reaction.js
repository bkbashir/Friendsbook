// ===============================
// Friendsbook V4
// reaction.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

doc,
setDoc,
deleteDoc,
onSnapshot,
collection

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const reactions = [

"👍",
"❤️",
"😂",
"😮",
"😢",
"😡"

];

// ===============================
// Show Reaction Box
// ===============================

window.showReactionBox=function(postId){

let box=document.getElementById("reactionBox");

if(!box){

box=document.createElement("div");

box.id="reactionBox";

box.className="reactionBox";

document.body.appendChild(box);

}

box.innerHTML="";

reactions.forEach(r=>{

box.innerHTML+=`

<span
class="reactionEmoji"
onclick="reactPost('${postId}','${r}')">

${r}

</span>

`;

});

box.style.display="flex";

};

// ===============================
// React
// ===============================

window.reactPost=async(postId,reaction)=>{

await setDoc(

doc(

db,

"reactions",

postId+"_"+auth.currentUser.uid

),

{

postId:postId,

uid:auth.currentUser.uid,

reaction:reaction,

time:Date.now()

}

);

document.getElementById("reactionBox").style.display="none";

};// ===============================
// Friendsbook V4
// reaction.js Part 2
// ===============================

import {

query,
where,
getDocs,
onSnapshot,
collection

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Load Reactions
// ===============================

window.loadReactions=function(postId){

const q=query(

collection(db,"reactions"),

where("postId","==",postId)

);

onSnapshot(q,(snapshot)=>{

let total=0;

let count={

"👍":0,
"❤️":0,
"😂":0,
"😮":0,
"😢":0,
"😡":0

};

snapshot.forEach((doc)=>{

const r=doc.data();

total++;

count[r.reaction]++;

});

const box=document.getElementById(

"reactionCount_"+postId

);

if(box){

box.innerHTML=`

👍 ${count["👍"]}

❤️ ${count["❤️"]}

😂 ${count["😂"]}

😮 ${count["😮"]}

😢 ${count["😢"]}

😡 ${count["😡"]}

&nbsp;&nbsp;(${total})

`;

}

});

};

// ===============================
// Change Reaction
// ===============================

window.changeReaction=

async(postId,reaction)=>{

await reactPost(

postId,

reaction

);

};

// ===============================
// Remove Reaction
// ===============================

window.removeReaction=

async(postId)=>{

await deleteDoc(

doc(

db,

"reactions",

postId+"_"+auth.currentUser.uid

)

);

};

// ===============================
// End reaction.js
// ===============================
