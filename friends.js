import { db, auth } from "./firebase.js";
import { openChat } from "./message.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
  increment
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
<button
class="${
myFriends.includes(user.email)
? "messageBtn"
: "addFriendBtn"
}"
data-email="${user.email}">

${
myFriends.includes(user.email)
? "❌ Unfriend"
: "👥 Add Friend"
}

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
document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("addFriendBtn")) {

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

        e.target.textContent = "⏳ Request Sent";

        alert("Friend Request Sent");

    }

});
const requestList = document.getElementById("requestList");

export async function loadFriendRequests() {

    if (!requestList) return;

    requestList.innerHTML = "";

    const q = query(
        collection(db, "friendRequests"),
        where("to", "==", auth.currentUser.email),
        where("status", "==", "pending")
    );

    const snap = await getDocs(q);

    snap.forEach((docSnap) => {

        const data = docSnap.data();

        requestList.innerHTML += `
            <div class="friendCard">

                <h3>${data.from}</h3>

                <button class="acceptBtn"
                    data-id="${docSnap.id}">
                    ✅ Accept
                </button>

                <button class="rejectBtn"
                    data-id="${docSnap.id}">
                    ❌ Reject
                </button>

            </div>
        `;

    });

const friendSnap = await getDocs(
    query(
        collection(db, "friends"),
        or(
            where("user1", "==", auth.currentUser.email),
            where("user2", "==", auth.currentUser.email)
        )
    )
);

const myFriends = [];

friendSnap.forEach(f => {

    const d = f.data();

    if (d.user1 === auth.currentUser.email) {

        myFriends.push(d.user2);

    } else {

        myFriends.push(d.user1);

    }

});                      
document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("acceptBtn")) {

        const id = e.target.dataset.id;

const reqRef = doc(db, "friendRequests", id);

const reqSnap = await getDoc(reqRef);

const req = reqSnap.data();

await updateDoc(reqRef, {
    status: "accepted"
});
await setDoc(
    doc(db, "friends", auth.currentUser.email + "_" + req.from),
    {
        user1: auth.currentUser.email,
        user2: req.from,
        time: Date.now()
    }
);

await setDoc(
    doc(db, "friends", req.from + "_" + auth.currentUser.email),
    {
        user1: req.from,
        user2: auth.currentUser.email,
        time: Date.now()
    }
);
// Sender Friends Count
await updateDoc(
    doc(db, "users", req.from),
    {
        friends: increment(1)
    }
);

// Receiver Friends Count
await updateDoc(
    doc(db, "users", req.to),
    {
        friends: increment(1)
    }
);

alert("✅ Friend Added");

loadFriendRequests();
loadFriends();
document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("rejectBtn")) {

        const id = e.target.dataset.id;

        await deleteDoc(doc(db, "friendRequests", id));

        alert("❌ Friend Request Rejected");

        loadFriendRequests();

    }

});
      document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("messageBtn")) return;

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
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("followBtn")) return;

    const btn = e.target;

    if (btn.dataset.state === "following") {

        btn.dataset.state = "follow";
        btn.textContent = "➕ Follow";

    } else {

        btn.dataset.state = "following";
        btn.textContent = "✅ Following";

    }

});
