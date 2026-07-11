// ===============================
// Friendsbook V5
// events.js Part 1
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

const eventName=document.getElementById("eventName");
const eventPlace=document.getElementById("eventPlace");
const eventDate=document.getElementById("eventDate");
const eventDescription=document.getElementById("eventDescription");
const createEventBtn=document.getElementById("createEventBtn");
const eventList=document.getElementById("eventList");

// ===============================
// Create Event
// ===============================

createEventBtn.onclick=async()=>{

if(eventName.value.trim()===""){

alert("Enter Event Name");

return;

}

await addDoc(

collection(db,"events"),

{

name:eventName.value,

place:eventPlace.value,

date:eventDate.value,

description:eventDescription.value,

host:auth.currentUser.email,

going:0,

interested:0,

createdAt:serverTimestamp()

}

);

eventName.value="";
eventPlace.value="";
eventDate.value="";
eventDescription.value="";

alert("Event Created");

};

// ===============================
// Load Events
// ===============================

const eventQuery=query(

collection(db,"events"),

orderBy("createdAt","desc")

);

onSnapshot(eventQuery,(snapshot)=>{

eventList.innerHTML="";

snapshot.forEach((doc)=>{

const event=doc.data();

const eventId=doc.id;

eventList.innerHTML+=`

<div class="eventCard">

<h3>${event.name}</h3>

<p>${event.place}</p>

<p>${event.date}</p>

<p>${event.description}</p>

<p>Going : ${event.going}</p>

<button onclick="goingEvent('${eventId}')">

Going

</button>

<button onclick="interestedEvent('${eventId}')">

Interested

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// events.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Going
// ===============================

window.goingEvent=async(eventId)=>{

await updateDoc(

doc(db,"events",eventId),

{

going:increment(1)

}

);

alert("You are Going");

};

// ===============================
// Interested
// ===============================

window.interestedEvent=async(eventId)=>{

await updateDoc(

doc(db,"events",eventId),

{

interested:increment(1)

}

);

alert("Marked as Interested");

};

// ===============================
// Delete Event
// ===============================

window.deleteEvent=async(eventId)=>{

if(!confirm("Delete this event?")) return;

await deleteDoc(

doc(db,"events",eventId)

);

alert("Event Deleted");

};

// ===============================
// Share Event
// ===============================

window.shareEvent=(eventId)=>{

const link=

location.origin+

"/event.html?id="+eventId;

navigator.clipboard.writeText(link);

alert("Event Link Copied");

};// ===============================
// Friendsbook V5
// events.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Invite Friend
// ===============================

window.inviteFriend=async(eventId,friendEmail)=>{

await addDoc(

collection(db,"eventInvites"),

{

eventId:eventId,

friend:friendEmail,

sender:auth.currentUser.email,

time:serverTimestamp()

}

);

alert("Invitation Sent");

};

// ===============================
// Save Event
// ===============================

window.saveEvent=async(eventId)=>{

await addDoc(

collection(db,"savedEvents"),

{

uid:auth.currentUser.uid,

eventId:eventId,

savedAt:serverTimestamp()

}

);

alert("Event Saved");

};

// ===============================
// Open Event
// ===============================

window.openEvent=(eventId)=>{

location.href="event.html?id="+eventId;

};

// ===============================
// Report Event
// ===============================

window.reportEvent=async(eventId)=>{

await addDoc(

collection(db,"eventReports"),

{

eventId:eventId,

reporter:auth.currentUser.email,

reportedAt:serverTimestamp()

}

);

alert("Event Report Submitted");

};

// ===============================
// End events.js
// ===============================
