// ===============================
// Friendsbook V4
// friends.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
doc,
setDoc,
getDocs,
deleteDoc,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const requestList=document.getElementById("requestList");

const friendsList=document.getElementById("friendsList");

// ===============================
// Send Friend Request
// ===============================

export async function sendFriendRequest(email){

if(email===auth.currentUser.email){

alert("নিজেকে Friend করা যাবে না");

return;

}

await setDoc(

doc(

db,

"friendRequests",

auth.currentUser.email+"_"+email

),

{

from:auth.currentUser.email,

to:email,

time:Date.now()

}

);

alert("Friend Request Sent");

}

// ===============================
// Load Friend Requests
// ===============================

const requestRef=collection(db,"friendRequests");

onSnapshot(requestRef,(snapshot)=>{

requestList.innerHTML="";

snapshot.forEach((item)=>{

const data=item.data();

if(data.to===auth.currentUser.email){

requestList.innerHTML+=`

<div class="friendRequest">

<h4>${data.from}</h4>

<button onclick="acceptFriend('${item.id}','${data.from}')">

Accept

</button>

<button onclick="rejectFriend('${item.id}')">

Delete

</button>

</div>

`;

}

});

});// ===============================
// Accept Friend Request
// ===============================

window.acceptFriend = async(requestId, friendEmail)=>{

await setDoc(

doc(

db,

"friends",

auth.currentUser.email+"_"+friendEmail

),

{

user1:auth.currentUser.email,

user2:friendEmail,

createdAt:Date.now()

}

);

await deleteDoc(

doc(db,"friendRequests",requestId)

);

alert("Friend Added");

};

// ===============================
// Reject Friend Request
// ===============================

window.rejectFriend = async(requestId)=>{

await deleteDoc(

doc(db,"friendRequests",requestId)

);

};

// ===============================
// Load Friends
// ===============================

const friendsRef=collection(db,"friends");

onSnapshot(friendsRef,(snapshot)=>{

friendsList.innerHTML="";

snapshot.forEach((item)=>{

const f=item.data();

let friend="";

if(f.user1===auth.currentUser.email){

friend=f.user2;

}else if(f.user2===auth.currentUser.email){

friend=f.user1;

}

if(friend!==""){

friendsList.innerHTML+=`

<div class="friendCard">

<img src="images/default-profile.png">

<div>

<h4>${friend}</h4>

<button onclick="openChat('${friend}')">

Message

</button>

</div>

</div>

`;

}

});

});// ===============================
// Friendsbook V4
// friends.js Part 3
// Unfriend + Search + Follow
// ===============================

import {
updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Unfriend
// ===============================

window.unFriend = async(friendEmail)=>{

const id1 = auth.currentUser.email+"_"+friendEmail;
const id2 = friendEmail+"_"+auth.currentUser.email;

try{

await deleteDoc(doc(db,"friends",id1));

}catch(e){}

try{

await deleteDoc(doc(db,"friends",id2));

}catch(e){}

alert("Friend Removed");

};

// ===============================
// Follow User
// ===============================

window.followUser = async(email)=>{

if(email===auth.currentUser.email) return;

await setDoc(

doc(
db,
"followers",
auth.currentUser.email+"_"+email
),

{

from:auth.currentUser.email,

to:email,

time:Date.now()

}

);

};

// ===============================
// Search Friends
// ===============================

const friendSearch=document.getElementById("searchInput");

friendSearch.addEventListener("keyup",()=>{

const value=friendSearch.value.toLowerCase();

document.querySelectorAll(".friendCard").forEach(card=>{

const txt=card.innerText.toLowerCase();

card.style.display=txt.includes(value)
?"flex"
:"none";

});

});

// ===============================
// Online Status
// ===============================

window.addEventListener("beforeunload",()=>{

localStorage.setItem(

auth.currentUser.email+"_online",

"offline"

);

});

localStorage.setItem(

auth.currentUser.email+"_online",

"online"

);

// ===============================
// End friends.js
// ===============================
