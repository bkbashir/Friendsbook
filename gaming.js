// ===============================
// Friendsbook V5
// gaming.js Part 1
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

const gameName=document.getElementById("gameName");
const gameCategory=document.getElementById("gameCategory");
const gameDescription=document.getElementById("gameDescription");
const publishGameBtn=document.getElementById("publishGameBtn");
const gamingFeed=document.getElementById("gamingFeed");

// ===============================
// Publish Game
// ===============================

publishGameBtn.onclick=async()=>{

if(gameName.value.trim()===""){

alert("Enter Game Name");

return;

}

await addDoc(

collection(db,"games"),

{

name:gameName.value,

category:gameCategory.value,

description:gameDescription.value,

publisher:auth.currentUser.email,

followers:0,

plays:0,

createdAt:serverTimestamp()

}

);

gameName.value="";
gameCategory.value="";
gameDescription.value="";

alert("Game Published");

};

// ===============================
// Load Games
// ===============================

const gamesQuery=query(

collection(db,"games"),

orderBy("createdAt","desc")

);

onSnapshot(gamesQuery,(snapshot)=>{

gamingFeed.innerHTML="";

snapshot.forEach((doc)=>{

const game=doc.data();

const gameId=doc.id;

gamingFeed.innerHTML+=`

<div class="gameCard">

<h3>${game.name}</h3>

<p>${game.category}</p>

<p>${game.description}</p>

<p>Publisher : ${game.publisher}</p>

<button onclick="playGame('${gameId}')">

🎮 Play

</button>

<button onclick="followGame('${gameId}')">

⭐ Follow

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// gaming.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Play Game
// ===============================

window.playGame=async(gameId)=>{

await updateDoc(

doc(db,"games",gameId),

{

plays:increment(1)

}

);

location.href="game-player.html?id="+gameId;

};

// ===============================
// Follow Game
// ===============================

window.followGame=async(gameId)=>{

await updateDoc(

doc(db,"games",gameId),

{

followers:increment(1)

}

);

alert("Game Followed");

};

// ===============================
// Delete Game
// ===============================

window.deleteGame=async(gameId)=>{

if(!confirm("Delete this game?")) return;

await deleteDoc(

doc(db,"games",gameId)

);

alert("Game Deleted");

};

// ===============================
// Share Game
// ===============================

window.shareGame=(gameId)=>{

const link=

location.origin+

"/game.html?id="+gameId;

navigator.clipboard.writeText(link);

alert("Game Link Copied");

};// ===============================
// Friendsbook V5
// gaming.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Rate Game
// ===============================

window.rateGame=async(gameId,rating)=>{

await addDoc(

collection(db,"gameRatings"),

{

gameId:gameId,

uid:auth.currentUser.uid,

email:auth.currentUser.email,

rating:rating,

createdAt:serverTimestamp()

}

);

alert("Rating Submitted");

};

// ===============================
// Report Game
// ===============================

window.reportGame=async(gameId)=>{

await addDoc(

collection(db,"gameReports"),

{

gameId:gameId,

reporter:auth.currentUser.email,

createdAt:serverTimestamp()

}

);

alert("Game Report Submitted");

};

// ===============================
// Save Game
// ===============================

window.saveGame=async(gameId)=>{

await addDoc(

collection(db,"savedGames"),

{

uid:auth.currentUser.uid,

gameId:gameId,

createdAt:serverTimestamp()

}

);

alert("Game Saved");

};

// ===============================
// Open Game Details
// ===============================

window.openGame=(gameId)=>{

location.href="game.html?id="+gameId;

};

// ===============================
// End gaming.js
// ===============================
