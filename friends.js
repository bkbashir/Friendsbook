// friends.js PART-1

import { db, auth } from "./firebase.js";
import { openChat } from "./message.js";

import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const friendsList = document.getElementById("friendsList");
const requestList = document.getElementById("requestList");

let myFriends = [];

async function loadMyFriends() {

    myFriends = [];

    const snap = await getDocs(
        query(
            collection(db, "friends"),
            where("user1", "==", auth.currentUser.email)
        )
    );

    snap.forEach((d) => {

        myFriends.push(d.data().user2);

    });

}

export async function loadFriends() {

    if (!friendsList) return;

    await loadMyFriends();

    friendsList.innerHTML = "<h3>Loading...</h3>";

    const users = await getDocs(collection(db, "users"));

    friendsList.innerHTML = "";

    users.forEach((docSnap) => {

        const user = docSnap.data();

        if (user.email === auth.currentUser.email) return;

        const isFriend = myFriends.includes(user.email);

        friendsList.innerHTML += `

<div class="friendCard">

<img class="friendPhoto"
src="${user.profile || "https://placehold.co/80"}">

<div class="friendInfo">

<h3>${user.name}</h3>

<p>${user.bio || "Friendsbook User"}</p>

</div>

<div class="friendActions">

${
isFriend
?
`
<button
class="messageBtn"
data-email="${user.email}"
onclick="openChat('${user.email}')">
💬 Message
</button>

<button
class="unfriendBtn"
data-email="${user.email}">
❌ Unfriend
</button>
`
:
`
<button
class="addFriendBtn"
data-email="${user.email}">
👥 Add Friend
</button>

<button
class="followBtn"
data-email="${user.email}">
➕ Follow
</button>
`
}

</div>

</div>

`;

    });

}
// ===============================
// Friend Requests
// ===============================

export async function loadFriendRequests() {

    if (!requestList) return;

    requestList.innerHTML = "";

    const snap = await getDocs(
        query(
            collection(db, "friendRequests"),
            where("to", "==", auth.currentUser.email),
            where("status", "==", "pending")
        )
    );

    snap.forEach((d) => {

        const req = d.data();

        requestList.innerHTML += `

<div class="friendCard">

<h3>${req.from}</h3>

<div class="friendActions">

<button
class="acceptBtn"
data-id="${d.id}">
✅ Accept
</button>

<button
class="rejectBtn"
data-id="${d.id}">
❌ Reject
</button>

</div>

</div>

`;

    });

}

// ===============================
// Add Friend
// ===============================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("addFriendBtn")) return;

    const receiver = e.target.dataset.email;

    await setDoc(

        doc(
            db,
            "friendRequests",
            auth.currentUser.email + "_" + receiver
        ),

        {
            from: auth.currentUser.email,
            to: receiver,
            status: "pending",
            time: Date.now()
        }

    );

    alert("✅ Friend Request Sent");

    loadFriends();

});

// ===============================
// Accept Friend
// ===============================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("acceptBtn")) return;

    const id = e.target.dataset.id;

    const reqRef = doc(db, "friendRequests", id);

    const reqSnap = await getDoc(reqRef);

    const req = reqSnap.data();

    await updateDoc(reqRef, {
        status: "accepted"
    });

    await setDoc(
        doc(
            db,
            "friends",
            auth.currentUser.email + "_" + req.from
        ),
        {
            user1: auth.currentUser.email,
            user2: req.from,
            time: Date.now()
        }
    );

    await setDoc(
        doc(
            db,
            "friends",
            req.from + "_" + auth.currentUser.email
        ),
        {
            user1: req.from,
            user2: auth.currentUser.email,
            time: Date.now()
        }
    );

    await updateDoc(
        doc(db, "users", req.from),
        {
            friends: increment(1)
        }
    );

    await updateDoc(
        doc(db, "users", req.to),
        {
            friends: increment(1)
        }
    );

    alert("✅ Friend Added");

    loadFriends();

    loadFriendRequests();

});
// ===============================
// Reject Friend Request
// ===============================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("rejectBtn")) return;

    await deleteDoc(
        doc(
            db,
            "friendRequests",
            e.target.dataset.id
        )
    );

    alert("❌ Friend Request Rejected");

    loadFriendRequests();

});

// ===============================
// Unfriend
// ===============================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("unfriendBtn")) return;

    const email = e.target.dataset.email;

    if (!confirm("Remove this friend?")) return;

    await deleteDoc(
        doc(
            db,
            "friends",
            auth.currentUser.email + "_" + email
        )
    );

    await deleteDoc(
        doc(
            db,
            "friends",
            email + "_" + auth.currentUser.email
        )
    );

    await updateDoc(
        doc(db, "users", auth.currentUser.email),
        {
            friends: increment(-1)
        }
    );

    await updateDoc(
        doc(db, "users", email),
        {
            friends: increment(-1)
        }
    );

    alert("❌ Friend Removed");

    loadFriends();

});

// ===============================
// Follow / Unfollow
// ===============================

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("followBtn")) return;

    const btn = e.target;

    if (btn.dataset.state === "following") {

        btn.dataset.state = "follow";
        btn.innerHTML = "➕ Follow";

    } else {

        btn.dataset.state = "following";
        btn.innerHTML = "✅ Following";

    }

});

// ===============================
// Auto Load
// ===============================

if (auth.currentUser) {

    loadFriends();

    loadFriendRequests();

}

auth.onAuthStateChanged((user) => {

    if (user) {

        loadFriends();

        loadFriendRequests();

    }

});
