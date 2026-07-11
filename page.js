// ===============================
// Friendsbook V5
// page.js Part 1
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

const pageName=document.getElementById("pageName");
const pageCategory=document.getElementById("pageCategory");
const pageAbout=document.getElementById("pageAbout");
const createPageBtn=document.getElementById("createPageBtn");
const pageList=document.getElementById("pageList");

// ===============================
// Create Page
// ===============================

createPageBtn.onclick=async()=>{

if(pageName.value.trim()===""){

alert("Enter Page Name");

return;

}

await addDoc(

collection(db,"pages"),

{

name:pageName.value,

category:pageCategory.value,

about:pageAbout.value,

owner:auth.currentUser.email,

followers:0,

createdAt:serverTimestamp()

}

);

pageName.value="";
pageCategory.value="";
pageAbout.value="";

alert("Page Created");

};

// ===============================
// Load Pages
// ===============================

const pageQuery=query(

collection(db,"pages"),

orderBy("createdAt","desc")

);

onSnapshot(pageQuery,(snapshot)=>{

pageList.innerHTML="";

snapshot.forEach((doc)=>{

const page=doc.data();

const pageId=doc.id;

pageList.innerHTML+=`

<div class="pageCard">

<h3>${page.name}</h3>

<p>${page.category}</p>

<p>${page.about}</p>

<p>Followers : ${page.followers}</p>

<button onclick="followPage('${pageId}')">

Follow

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// page.js Part 2
// ===============================

import {

doc,
setDoc,
deleteDoc,
updateDoc,
increment

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Follow Page
// ===============================

window.followPage=async(pageId)=>{

await setDoc(

doc(

db,

"pageFollowers",

pageId+"_"+auth.currentUser.uid

),

{

pageId:pageId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

followedAt:serverTimestamp()

}

);

await updateDoc(

doc(db,"pages",pageId),

{

followers:increment(1)

}

);

alert("Page Followed");

};

// ===============================
// Unfollow Page
// ===============================

window.unfollowPage=async(pageId)=>{

await deleteDoc(

doc(

db,

"pageFollowers",

pageId+"_"+auth.currentUser.uid

)

);

await updateDoc(

doc(db,"pages",pageId),

{

followers:increment(-1)

}

);

alert("Page Unfollowed");

};

// ===============================
// Open Page
// ===============================

window.openPage=(pageId)=>{

location.href="page.html?id="+pageId;

};// ===============================
// Friendsbook V5
// page.js Part 3 (Final)
// ===============================

import {

collection,
addDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Create Page Post
// ===============================

window.createPagePost=async(pageId)=>{

const text=prompt("Write a Page Post");

if(!text) return;

await addDoc(

collection(db,"pagePosts"),

{

pageId:pageId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

text:text,

createdAt:serverTimestamp()

}

);

alert("Page Post Published");

};

// ===============================
// Delete Page
// ===============================

window.deletePage=async(pageId)=>{

if(!confirm("Delete this page?")) return;

await deleteDoc(

doc(db,"pages",pageId)

);

alert("Page Deleted");

};

// ===============================
// Share Page
// ===============================

window.sharePage=(pageId)=>{

const link=

location.origin+

"/page.html?id="+pageId;

navigator.clipboard.writeText(link);

alert("Page Link Copied");

};

// ===============================
// Invite Friends
// ===============================

window.inviteFriends=(pageId)=>{

alert("Invite Friends feature coming soon");

};

// ===============================
// End page.js
// ===============================
