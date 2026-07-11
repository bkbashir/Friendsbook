// ===============================
// Friendsbook V5
// group.js Part 1
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

const groupName=document.getElementById("groupName");
const groupAbout=document.getElementById("groupAbout");
const createGroupBtn=document.getElementById("createGroupBtn");
const groupList=document.getElementById("groupList");

// ===============================
// Create Group
// ===============================

createGroupBtn.onclick=async()=>{

if(groupName.value.trim()===""){

alert("Enter Group Name");

return;

}

await addDoc(

collection(db,"groups"),

{

name:groupName.value,

about:groupAbout.value,

owner:auth.currentUser.email,

members:1,

createdAt:serverTimestamp()

}

);

groupName.value="";
groupAbout.value="";

alert("Group Created");

};

// ===============================
// Load Groups
// ===============================

const groupQuery=query(

collection(db,"groups"),

orderBy("createdAt","desc")

);

onSnapshot(groupQuery,(snapshot)=>{

groupList.innerHTML="";

snapshot.forEach((doc)=>{

const group=doc.data();

const groupId=doc.id;

groupList.innerHTML+=`

<div class="groupCard">

<h3>${group.name}</h3>

<p>${group.about}</p>

<p>Members : ${group.members}</p>

<button onclick="joinGroup('${groupId}')">

Join Group

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// group.js Part 2
// Join + Leave Group
// ===============================

import {

doc,
setDoc,
deleteDoc,
updateDoc,
increment

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Join Group
// ===============================

window.joinGroup=async(groupId)=>{

await setDoc(

doc(

db,

"groupMembers",

groupId+"_"+auth.currentUser.uid

),

{

groupId:groupId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

joinedAt:serverTimestamp()

}

);

await updateDoc(

doc(db,"groups",groupId),

{

members:increment(1)

}

);

alert("Joined Successfully");

};

// ===============================
// Leave Group
// ===============================

window.leaveGroup=async(groupId)=>{

await deleteDoc(

doc(

db,

"groupMembers",

groupId+"_"+auth.currentUser.uid

)

);

await updateDoc(

doc(db,"groups",groupId),

{

members:increment(-1)

}

);

alert("Left Group");

};// ===============================
// Friendsbook V5
// group.js Part 3 (Final)
// ===============================

import {

collection,
addDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Group Post
// ===============================

window.createGroupPost=async(groupId)=>{

const text=prompt("Write a group post");

if(!text) return;

await addDoc(

collection(db,"groupPosts"),

{

groupId:groupId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

createdAt:serverTimestamp()

}

);

alert("Group Post Published");

};

// ===============================
// Delete Group
// ===============================

window.deleteGroup=async(groupId)=>{

if(!confirm("Delete this group?")) return;

await deleteDoc(

doc(db,"groups",groupId)

);

alert("Group Deleted");

};

// ===============================
// Group Chat
// ===============================

window.openGroupChat=(groupId)=>{

location.href="group-chat.html?id="+groupId;

};

// ===============================
// Group Share
// ===============================

window.shareGroup=(groupId)=>{

const link=

location.origin+

"/group.html?id="+groupId;

navigator.clipboard.writeText(link);

alert("Group Link Copied");

};

// ===============================
// End group.js
// ===============================
