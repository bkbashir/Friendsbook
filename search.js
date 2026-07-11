// ===============================
// Friendsbook V5
// search.js Part 1
// ===============================

import { db } from "./firebase.js";

import {

collection,
query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const searchInput=document.getElementById("searchInput");
const searchResult=document.getElementById("searchResult");

let users=[];

// ===============================
// Load Users
// ===============================

const userQuery=query(

collection(db,"users"),

orderBy("name")

);

onSnapshot(userQuery,(snapshot)=>{

users=[];

snapshot.forEach((doc)=>{

users.push({

id:doc.id,

...doc.data()

});

});

});

// ===============================
// Live Search
// ===============================

searchInput.addEventListener("keyup",()=>{

const text=searchInput.value.toLowerCase();

searchResult.innerHTML="";

users.forEach(user=>{

if(

user.name.toLowerCase().includes(text)

||

user.email.toLowerCase().includes(text)

){

searchResult.innerHTML+=`

<div class="searchCard">

<img src="${user.profile || 'images/default-profile.png'}">

<div>

<h4>${user.name}</h4>

<p>${user.email}</p>

</div>

</div>

`;

}

});

});// ===============================
// Friendsbook V5
// search.js Part 2
// ===============================

// ===============================
// Open User Profile
// ===============================

window.openProfile=(uid)=>{

location.href="profile.html?id="+uid;

};

// ===============================
// Search Card Click
// ===============================

searchResult.addEventListener("click",(e)=>{

const card=e.target.closest(".searchCard");

if(!card) return;

const uid=card.dataset.uid;

if(uid){

openProfile(uid);

}

});

// ===============================
// Build Search Result
// ===============================

window.renderSearchUser=(user)=>{

return `

<div

class="searchCard"

data-uid="${user.id}">

<img

src="${user.profile || 'images/default-profile.png'}"

class="searchPhoto">

<div class="searchInfo">

<h4>${user.name}</h4>

<p>${user.email}</p>

</div>

</div>

`;

};

// ===============================
// Search Empty
// ===============================

window.showNoResult=()=>{

searchResult.innerHTML=

`<div class="noSearch">

No User Found

</div>`;

};// ===============================
// Friendsbook V5
// search.js Part 3 (Final)
// ===============================

// ===============================
// Clear Search
// ===============================

window.clearSearch=()=>{

searchInput.value="";

searchResult.innerHTML="";

};

// ===============================
// Search on Enter
// ===============================

searchInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

if(searchResult.children.length>0){

searchResult.firstElementChild.click();

}

}

});

// ===============================
// Hide Search Result
// ===============================

document.addEventListener("click",(e)=>{

if(

!searchInput.contains(e.target)

&&

!searchResult.contains(e.target)

){

searchResult.style.display="none";

}

});

searchInput.addEventListener("focus",()=>{

searchResult.style.display="block";

});

// ===============================
// End search.js
// ===============================
