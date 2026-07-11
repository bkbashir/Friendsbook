// ===============================
// Friendsbook V5
// comment.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
addDoc,
serverTimestamp,
query,
where,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Send Comment
// ===============================

window.sendComment = async(postId)=>{

const input=document.getElementById("commentInput_"+postId);

if(!input) return;

const text=input.value.trim();

if(text==="") return;

await addDoc(

collection(db,"comments"),

{

postId:postId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

time:serverTimestamp()

}

);

input.value="";

};

// ===============================
// Load Comments
// ===============================

window.loadComments=(postId)=>{

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

snapshot.forEach((doc)=>{

const c=doc.data();

list.innerHTML+=`

<div class="commentItem">

<b>${c.email}</b><br>

${c.text}

</div>

`;

});

});

};// ===============================
// Friendsbook V5
// comment.js Part 2
// Reply + Delete
// ===============================

import {

doc,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Reply Comment
// ===============================

window.replyComment = async(postId,parentId)=>{

const text=prompt("Write your reply");

if(!text) return;

await addDoc(

collection(db,"comments"),

{

postId:postId,

parentId:parentId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

time:serverTimestamp()

}

);

};

// ===============================
// Delete Comment
// ===============================

window.deleteComment = async(commentId)=>{

if(!confirm("Delete this comment?")) return;

await deleteDoc(

doc(db,"comments",commentId)

);

};

// ===============================
// Load Reply
// ===============================

window.loadReplies=(postId,parentId)=>{

const q=query(

collection(db,"comments"),

where("postId","==",postId),

where("parentId","==",parentId),

orderBy("time","asc")

);

return q;

};

// ===============================
// End Part 2
// ===============================// ===============================
// Friendsbook V5
// comment.js Part 3
// Edit + Pin + Reaction
// ===============================

import {

updateDoc,
doc,
setDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Edit Comment
// ===============================

window.editComment = async(commentId,oldText)=>{

const newText = prompt("Edit Comment",oldText);

if(newText===null || newText.trim()==="") return;

await updateDoc(

doc(db,"comments",commentId),

{

text:newText.trim()

}

);

};

// ===============================
// Pin Comment
// ===============================

window.pinComment = async(commentId)=>{

await updateDoc(

doc(db,"comments",commentId),

{

pin:true

}

);

};

// ===============================
// Comment Reaction
// ===============================

window.reactComment = async(commentId,reaction)=>{

await setDoc(

doc(

db,

"commentReactions",

commentId+"_"+auth.currentUser.uid

),

{

commentId:commentId,

uid:auth.currentUser.uid,

reaction:reaction,

time:Date.now()

}

);

};

// ===============================
// Facebook Style Reaction List
// ===============================

window.commentReactionList=[

"👍",

"❤️",

"😂",

"😮",

"😢",

"😡"

];

// ===============================
// End comment.js
// ===============================
