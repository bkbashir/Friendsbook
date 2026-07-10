import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

let currentFriend = "";

export function openChat(email){

currentFriend = email;

loadMessages();

}

sendBtn.onclick = async ()=>{

if(chatInput.value.trim()==="") return;

await addDoc(collection(db,"messages"),{

from:auth.currentUser.email,

to:currentFriend,

text:chatInput.value,

time:Date.now()

});

chatInput.value="";

};
function loadMessages() {

const q = query(
collection(db, "messages"),
orderBy("time")
);

onSnapshot(q, (snap) => {

chatBox.innerHTML = "";

snap.forEach((doc) => {

const m = doc.data();

if (
(m.from === auth.currentUser.email &&
m.to === currentFriend) ||

(m.from === currentFriend &&
m.to === auth.currentUser.email)
) {

chatBox.innerHTML += `
<div class="${
m.from === auth.currentUser.email
? "myMessage"
: "friendMessage"
}">
${m.text}
</div>
`;

}

});

chatBox.scrollTop = chatBox.scrollHeight;

});

}
