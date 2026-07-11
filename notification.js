// ===============================
// Friendsbook V4
// notification.js Part 1
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

const notificationList =
document.getElementById("notificationList");

// ===============================
// Send Notification
// ===============================

export async function sendNotification(

to,
title,
message

){

if(to===auth.currentUser.email) return;

await addDoc(

collection(db,"notifications"),

{

to:to,

from:auth.currentUser.email,

title:title,

message:message,

seen:false,

time:serverTimestamp()

}

);

}

// ===============================
// Load Notifications
// ===============================

const notifyQuery=query(

collection(db,"notifications"),

orderBy("time","desc")

);

onSnapshot(notifyQuery,(snapshot)=>{

notificationList.innerHTML="";

snapshot.forEach((doc)=>{

const n=doc.data();

if(n.to===auth.currentUser.email){

notificationList.innerHTML+=`

<div class="notificationCard">

<div class="notifyTitle">

${n.title}

</div>

<div class="notifyText">

${n.message}

</div>

<div class="notifyFrom">

${n.from}

</div>

</div>

`;

}

});

});// ===============================
// Friendsbook V4
// notification.js Part 2
// Seen + Counter
// ===============================

import {

doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const notificationBtn =
document.getElementById("notificationBtn");

let unseenCount=0;

onSnapshot(notifyQuery,(snapshot)=>{

notificationList.innerHTML="";

unseenCount=0;

snapshot.forEach((item)=>{

const n=item.data();

if(n.to===auth.currentUser.email){

if(!n.seen){

unseenCount++;

}

notificationList.innerHTML+=`

<div class="notificationCard"

onclick="markNotificationSeen('${item.id}')">

<div class="notifyTitle">

${n.title}

</div>

<div class="notifyText">

${n.message}

</div>

<div class="notifyFrom">

${n.from}

</div>

<div class="notifyTime">

${new Date().toLocaleString()}

</div>

</div>

`;

}

});

if(unseenCount>0){

notificationBtn.innerHTML=

`notifications (${unseenCount})`;

}else{

notificationBtn.innerHTML="notifications";

}

});

// ===============================
// Mark as Seen
// ===============================

window.markNotificationSeen=

async(id)=>{

await updateDoc(

doc(db,"notifications",id),

{

seen:true

}

);

};

// ===============================
// End notification.js
// ===============================
