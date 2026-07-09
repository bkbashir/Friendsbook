import { db, auth } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const friendsList = document.getElementById("friendsList");

export async function loadFriends(){

    if(!friendsList) return;

    friendsList.innerHTML = "<h3>Loading Users...</h3>";

    const snap = await getDocs(collection(db,"users"));

    friendsList.innerHTML="";

    snap.forEach(doc=>{

        const user = doc.data();

        if(auth.currentUser &&
           user.email===auth.currentUser.email) return;

        friendsList.innerHTML +=`

<div class="friendCard">

<img
class="friendPhoto"
src="${user.profile || 'https://placehold.co/80'}">

<div class="friendInfo">

<h3>${user.name}</h3>

<p>${user.bio || 'Friendsbook User'}</p>

</div>

<div class="friendActions">

<button class="addFriendBtn"
data-email="${user.email}">
👥 Add Friend
</button>

<button class="followBtn"
data-email="${user.email}">
➕ Follow
</button>

<button class="messageBtn"
data-email="${user.email}">
💬 Message
</button>

</div>

</div>

`;

    });

}
