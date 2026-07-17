/*==================================
Friendsbook 2026
Core System
==================================*/


/*==================================
Pages
==================================*/

const pages={

home:document.getElementById("homePage"),

friends:document.getElementById("friendsPage"),

message:document.getElementById("messagePage"),

notify:document.getElementById("notificationPage"),

reels:document.getElementById("reelsPage"),

market:document.getElementById("marketplacePage"),

search:document.getElementById("searchPage"),

profile:document.getElementById("profilePage"),

settings:document.getElementById("settingsPage"),

admin:document.getElementById("adminPage")

};

/*==================================
Hide All
==================================*/

function hidePages(){

Object.values(pages).forEach(page=>{

if(page) page.style.display="none";

});

}

/*==================================
Open Page
==================================*/

function openPage(name){

hidePages();

if(pages[name]){

pages[name].style.display="block";

}

}

/*==================================
Default Page
==================================*/

// openPage("home");

/*==================================
Bottom Navigation
==================================*/

const navHome=document.getElementById("navHome");

const navFriends=document.getElementById("navFriends");

const navReels=document.getElementById("navReels");

const navMarketplace=document.getElementById("navMarketplace");

const navProfile=document.getElementById("navProfile");

function clearNav(){

document.querySelectorAll("#bottomNav button")

.forEach(btn=>btn.classList.remove("active"));

}

navHome.onclick=()=>{

clearNav();

navHome.classList.add("active");

openPage("home");

};

navFriends.onclick=()=>{

clearNav();

navFriends.classList.add("active");

openPage("friends");

};

navReels.onclick=()=>{

clearNav();

navReels.classList.add("active");

openPage("reels");

};

navMarketplace.onclick=()=>{

clearNav();

navMarketplace.classList.add("active");

openPage("market");

};

navProfile.onclick=()=>{

clearNav();

navProfile.classList.add("active");

openPage("profile");

};

navHome.classList.add("active");

/*==================================
Current User
==================================*/

let currentUser=null;
/*==================================
Firebase Initialize
==================================*/

const firebaseConfig = {
apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
authDomain: "friendsbook-4a40c.firebaseapp.com",
projectId: "friendsbook-4a40c",
storageBucket: "friendsbook-4a40c.firebasestorage.app",
messagingSenderId: "1000346329473",
appId: "1:1000346329473:web:9bd69019e2b09f971e8880"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();

const storage = firebase.storage();

/*==================================
Admin Email
==================================*/

const ADMIN_EMAIL = "bashirahmed0052@gmail.com";

/*==================================
Auth State
==================================*/

auth.onAuthStateChanged(async(user)=>{

if(!user){

document.getElementById("loginPage").style.display="block";

document.getElementById("mainPage").style.display="none";

return;

}

await user.reload();

if(!user.emailVerified){

alert("Please verify your email first.");

auth.signOut();

return;

}

currentUser=user;

document.getElementById("loginPage").style.display="none";

document.getElementById("signupPage").style.display="none";

document.getElementById("forgotPage").style.display="none";

document.getElementById("mainPage").style.display="block";

  await loadMyProfile();
  
if(user.email===ADMIN_EMAIL){

document.getElementById("adminPanelButton").style.display="block";

}else{

document.getElementById("adminPanelButton").style.display="none";

}

});
/*==================================
Signup
==================================*/

document.getElementById("signupForm").addEventListener("submit",async(e)=>{

e.preventDefault();

const name=document.getElementById("fullName").value.trim();

const email=document.getElementById("signupEmail").value.trim();

const phone=document.getElementById("signupPhone").value.trim();

const birth=document.getElementById("birthDate").value;

const gender=document.getElementById("gender").value;

const password=document.getElementById("signupPassword").value;

const confirm=document.getElementById("confirmPassword").value;

if(!name||!email||!password){

return alert("Please fill all required fields.");

}

if(password!==confirm){

return alert("Passwords do not match.");

}

try{

const result=await auth.createUserWithEmailAndPassword(email,password);

await result.user.sendEmailVerification();

await db.collection("users").doc(result.user.uid).set({

uid:result.user.uid,

name:name,

email:email,

phone:phone,

birth:birth,

gender:gender,

bio:"",

profilePhoto:"",

coverPhoto:"",

followers:0,

following:0,

posts:0,

createdAt:firebase.firestore.FieldValue.serverTimestamp()

});

alert("Verification link sent to your email. Verify your email before Login.");

await auth.signOut();

document.getElementById("signupForm").reset();

document.getElementById("signupPage").style.display="none";

document.getElementById("loginPage").style.display="block";

}catch(err){

alert(err.message);

}

});
/*==================================
Login
==================================*/

document.getElementById("loginForm").addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("loginEmail").value.trim();

const password=document.getElementById("loginPassword").value;

try{

const result=await auth.signInWithEmailAndPassword(email,password);

await result.user.reload();

if(!result.user.emailVerified){

alert("Please verify your email first.");

await auth.signOut();

return;

}

document.getElementById("loginForm").reset();

}catch(err){

alert(err.message);

}

});

/*==================================
Forgot Password
==================================*/

document.getElementById("forgotForm").addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("forgotEmail").value.trim();

try{

await auth.sendPasswordResetEmail(email);

alert("Password reset link sent to your email.");

document.getElementById("forgotForm").reset();

}catch(err){

alert(err.message);

}

});

/*==================================
Page Switch
==================================*/

openSignupBtn.onclick=()=>{

loginPage.style.display="none";

signupPage.style.display="block";

};

backLoginBtn.onclick=()=>{

signupPage.style.display="none";

loginPage.style.display="block";

};

forgotPasswordBtn.onclick=()=>{

loginPage.style.display="none";

forgotPage.style.display="block";

};

backLoginBtn2.onclick=()=>{

forgotPage.style.display="none";

loginPage.style.display="block";

};

/*==================================
Logout
==================================*/

logoutBtn.onclick=()=>{

auth.signOut();

};
/*==================================
Load User Profile
==================================*/

async function loadMyProfile(){

if(!currentUser) return;

try{

const doc=await db.collection("users").doc(currentUser.uid).get();

if(!doc.exists) return;

const data=doc.data();

/* Name */

document.getElementById("profileName").textContent=data.name||"";

document.getElementById("drawerProfileName").textContent=data.name||"";

/* Bio */

document.getElementById("profileBio").textContent=data.bio||"No Bio Yet";

/* Stats */

document.getElementById("totalPosts").textContent=data.posts||0;

document.getElementById("totalFollowers").textContent=data.followers||0;

document.getElementById("totalFollowing").textContent=data.following||0;

/* Profile Photo */

if(data.profilePhoto){

document.getElementById("profilePhoto").src=data.profilePhoto;

document.getElementById("drawerProfilePhoto").src=data.profilePhoto;

document.getElementById("myProfilePhoto").src=data.profilePhoto;

document.getElementById("myStoryPhoto").src=data.profilePhoto;

}

/* Cover Photo */

if(data.coverPhoto){

document.getElementById("coverPhoto").src=data.coverPhoto;

}

/* Admin */

if(currentUser.email===ADMIN_EMAIL){

document.getElementById("adminPanelButton").style.display="block";

}else{

document.getElementById("adminPanelButton").style.display="none";

}

}catch(error){

console.log(error);

}

}

/*==================================
Reload After Login
==================================*/

auth.onAuthStateChanged(async(user)=>{

if(user){

currentUser=user;

await loadMyProfile();

}

});
/*==================================
Profile Photo Upload
==================================*/

changeProfileBtn.onclick=()=>{

profileImageInput.click();

};

profileImageInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file||!currentUser)return;

try{

const ref=storage.ref("profile/"+currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("users").doc(currentUser.uid).update({

profilePhoto:url

});

document.getElementById("profilePhoto").src=url;

document.getElementById("drawerProfilePhoto").src=url;

document.getElementById("myProfilePhoto").src=url;

document.getElementById("myStoryPhoto").src=url;

showToast("Profile photo updated.");

}catch(err){

alert(err.message);

}

};

/*==================================
Cover Photo Upload
==================================*/

changeCoverBtn.onclick=()=>{

coverImageInput.click();

};

coverImageInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file||!currentUser)return;

try{

const ref=storage.ref("cover/"+currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("users").doc(currentUser.uid).update({

coverPhoto:url

});

document.getElementById("coverPhoto").src=url;

showToast("Cover photo updated.");

}catch(err){

alert(err.message);

}

};

/*==================================
Toast
==================================*/

function showToast(text){

const toast=document.getElementById("toastMessage");

toast.innerHTML=text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}
/*==================================
Create Post
==================================*/

publishPostBtn.onclick = async () => {

if (!currentUser) return;

const text = postText.value.trim();

const image = postImageInput.files[0];

if (text === "" && !image) {

showToast("Write something first.");

return;

}

try {

let imageUrl = "";

if (image) {

const imageRef = storage.ref(
"posts/" + currentUser.uid + "/" + Date.now()
);

await imageRef.put(image);

imageUrl = await imageRef.getDownloadURL();

}

const userDoc = await db.collection("users")
.doc(currentUser.uid)
.get();

const user = userDoc.data();

await db.collection("posts").add({

uid: currentUser.uid,

name: user.name,

profilePhoto: user.profilePhoto || "",

text: text,

image: imageUrl,

time: firebase.firestore.FieldValue.serverTimestamp(),

like: 0,

comment: 0,

share: 0

});

await db.collection("users")
.doc(currentUser.uid)
.update({

posts: firebase.firestore.FieldValue.increment(1)

});

postText.value = "";

postImageInput.value = "";

showToast("Post Published.");

loadPosts();

} catch (err) {

alert(err.message);

}

};

/*==================================
Select Image
==================================*/

photoBtn.onclick = () => {

postImageInput.click();

};
/*==================================
Realtime Feed
==================================*/

function loadPosts(){

db.collection("posts")

.orderBy("time","desc")

.onSnapshot((snapshot)=>{

feedContainer.innerHTML="";

snapshot.forEach((doc)=>{

const post=doc.data();

feedContainer.innerHTML+=`

<div class="postCard">

<div class="postHeader">

<div class="postUser">

<img src="${post.profilePhoto||''}">

<div>

<div class="postName">${post.name}</div>

<div class="postTime">Just now</div>

</div>

</div>

<button class="postMenu">

<i class="fa-solid fa-ellipsis"></i>

</button>

</div>

<div class="postText">

${post.text||""}

</div>

${post.image?`

<img class="postImage"

src="${post.image}">

`:""}

<div class="postCount">

<div>

<span id="likeCount_${doc.id}">

${post.like||0}

</span> Reactions

</div>

<div>

${post.comment||0} Comments

${post.share||0} Shares

</div>

</div>

<div class="postAction">

<button

onclick="openReaction('${doc.id}')">

👍 Like

</button>

<button

onclick="commentPost('${doc.id}')">

💬 Comment

</button>

<button

onclick="sharePost('${doc.id}')">

↗ Share

</button>

</div>

<div

class="reactionBox"

id="reaction_${doc.id}"

style="display:none;">

<span onclick="reactPost('${doc.id}','👍')">👍</span>

<span onclick="reactPost('${doc.id}','❤️')">❤️</span>

<span onclick="reactPost('${doc.id}','😂')">😂</span>

<span onclick="reactPost('${doc.id}','😮')">😮</span>

<span onclick="reactPost('${doc.id}','😢')">😢</span>

<span onclick="reactPost('${doc.id}','😡')">😡</span>

<span onclick="reactPost('${doc.id}','👏')">👏</span>

</div>

</div>

`;

});

});

}

/*==================================
Reaction Box
==================================*/

function openReaction(id){

const box=document.getElementById("reaction_"+id);

box.style.display=

box.style.display==="flex"

?"none"

:"flex";

}

/*==================================
React
==================================*/

async function reactPost(id,reaction){

await db.collection("posts")

.doc(id)

.update({

like:firebase.firestore

.FieldValue.increment(1),

lastReaction:reaction

});

}

/*==================================
Comment
==================================*/

async function commentPost(id){

const text=prompt("Write a comment");

if(!text)return;

await db.collection("posts")

.doc(id)

.collection("comments")

.add({

uid:currentUser.uid,

text:text,

time:firebase.firestore

.FieldValue.serverTimestamp()

});

await db.collection("posts")

.doc(id)

.update({

comment:firebase.firestore

.FieldValue.increment(1)

});

}

/*==================================
Share
==================================*/

async function sharePost(id){

await db.collection("posts")

.doc(id)

.update({

share:firebase.firestore

.FieldValue.increment(1)

});

showToast("Post Shared");

}

/*==================================
Start Feed
==================================*/

loadPosts();
/*==================================
Story Upload
==================================*/

addStoryBtn.onclick=()=>{

storyImageInput.click();

};

storyImageInput.onchange=async(e)=>{

const file=e.target.files[0];

if(!file||!currentUser)return;

try{

const ref=storage.ref("stories/"+currentUser.uid+"/"+Date.now());

await ref.put(file);

const url=await ref.getDownloadURL();

await db.collection("stories").add({

uid:currentUser.uid,

name:document.getElementById("profileName").innerText,

profilePhoto:document.getElementById("profilePhoto").src,

story:url,

time:firebase.firestore.FieldValue.serverTimestamp()

});

showToast("Story Uploaded");

}catch(err){

alert(err.message);

}

};

/*==================================
Load Stories
==================================*/

function loadStories(){

db.collection("stories")

.orderBy("time","desc")

.onSnapshot((snapshot)=>{

storyContainer.innerHTML="";

snapshot.forEach((doc)=>{

const story=doc.data();

storyContainer.innerHTML+=`

<div class="storyCard"

onclick="viewStory('${story.story}')">

<img src="${story.story}">

<div class="storyUser">

<img src="${story.profilePhoto}">

<span>${story.name}</span>

</div>

</div>

`;

});

});

}

/*==================================
View Story
==================================*/

function viewStory(url){

window.open(url,"_blank");

}

/*==================================
Start Story
==================================*/

loadStories();
/*==================================
Friend Request System
==================================*/

async function sendFriendRequest(targetUID){

if(!currentUser)return;

if(targetUID===currentUser.uid)return;

try{

await db.collection("friendRequests").add({

fromUID:currentUser.uid,

toUID:targetUID,

status:"pending",

time:firebase.firestore.FieldValue.serverTimestamp()

});

showToast("Friend Request Sent");

}catch(err){

alert(err.message);

}

}

/*==================================
Accept Friend Request
==================================*/

async function acceptFriendRequest(requestID,friendUID){

try{

await db.collection("friendRequests")

.doc(requestID)

.update({

status:"accepted"

});

/* My Friend */

await db.collection("users")

.doc(currentUser.uid)

.collection("friends")

.doc(friendUID)

.set({

uid:friendUID

});

/* Friend Side */

await db.collection("users")

.doc(friendUID)

.collection("friends")

.doc(currentUser.uid)

.set({

uid:currentUser.uid

});

/* Followers */

await db.collection("users")

.doc(currentUser.uid)

.update({

followers:firebase.firestore.FieldValue.increment(1)

});

await db.collection("users")

.doc(friendUID)

.update({

following:firebase.firestore.FieldValue.increment(1)

});

showToast("Friend Added");

}catch(err){

alert(err.message);

}

}

/*==================================
Cancel Friend Request
==================================*/

async function cancelFriendRequest(requestID){

await db.collection("friendRequests")

.doc(requestID)

.delete();

showToast("Request Cancelled");

}

/*==================================
Remove Friend
==================================*/

async function removeFriend(friendUID){

await db.collection("users")

.doc(currentUser.uid)

.collection("friends")

.doc(friendUID)

.delete();

await db.collection("users")

.doc(friendUID)

.collection("friends")

.doc(currentUser.uid)

.delete();

showToast("Friend Removed");

}

/*==================================
Load Friends
==================================*/

function loadFriends(){

if(!currentUser)return;

db.collection("users")

.doc(currentUser.uid)

.collection("friends")

.onSnapshot((snapshot)=>{

friendsContainer.innerHTML="";

snapshot.forEach((doc)=>{

friendsContainer.innerHTML+=`

<div class="listCard">

<img src="">

<div>

<h3>${doc.id}</h3>

<p>Friend</p>

</div>

<button

class="secondaryBtn"

onclick="removeFriend('${doc.id}')">

Remove

</button>

</div>

`;

});

});

}

/*==================================
Start Friends
==================================*/

loadFriends();

/*==================================
Messenger
==================================*/

let chatUserUID = null;

/*==================================
Open Chat
==================================*/

async function openChat(friendUID){

chatUserUID = friendUID;

chatBox.innerHTML = "";

db.collection("messages")

.orderBy("time")

.onSnapshot((snapshot)=>{

chatBox.innerHTML = "";

snapshot.forEach((doc)=>{

const msg = doc.data();

const room1 = currentUser.uid+"_"+friendUID;

const room2 = friendUID+"_"+currentUser.uid;

if(msg.room===room1 || msg.room===room2){

chatBox.innerHTML += `

<div class="${
msg.sender===currentUser.uid
?
'myMessage'
:
'friendMessage'
}">

${msg.text}

</div>

`;

}

});

chatBox.scrollTop = chatBox.scrollHeight;

});

}

/*==================================
Send Message
==================================*/

async function sendMessage(){

if(!chatUserUID)return;

const text = messageInput.value.trim();

if(text==="")return;

await db.collection("messages").add({

room:currentUser.uid+"_"+chatUserUID,

sender:currentUser.uid,

receiver:chatUserUID,

text:text,

time:firebase.firestore.FieldValue.serverTimestamp()

});

messageInput.value="";

}

/*==================================
Message Button
==================================*/

sendMessageBtn.onclick=()=>{

sendMessage();

};

/*==================================
Load Friend List
==================================*/

function loadMessenger(){

db.collection("users")

.doc(currentUser.uid)

.collection("friends")

.onSnapshot(async(snapshot)=>{

chatList.innerHTML="";

for(const doc of snapshot.docs){

const user = await db.collection("users")

.doc(doc.id)

.get();

const data = user.data();

chatList.innerHTML += `

<div class="listCard"

onclick="openChat('${doc.id}')">

<img src="${data.profilePhoto||''}">

<div>

<h3>${data.name}</h3>

<p>Tap to chat</p>

</div>

</div>

`;

}

});

}

loadMessenger();
/*==================================
Search Users
==================================*/

globalSearchInput.onkeyup = async function () {

const keyword = this.value.trim().toLowerCase();

searchResultContainer.innerHTML = "";

if(keyword==="") return;

const snapshot = await db.collection("users").get();

snapshot.forEach((doc)=>{

const user = doc.data();

if(user.uid===currentUser.uid) return;

if(user.name.toLowerCase().includes(keyword)){

searchResultContainer.innerHTML += `

<div class="listCard">

<img src="${user.profilePhoto || ''}">

<div style="flex:1;">

<h3>${user.name}</h3>

<p>${user.bio || "No Bio Yet"}</p>

</div>

<button

class="primaryBtn"

onclick="sendFriendRequest('${user.uid}')">

Add Friend

</button>

<button

class="secondaryBtn"

onclick="viewUserProfile('${user.uid}')">

View

</button>

</div>

`;

}

});

};

/*==================================
View User Profile
==================================*/

async function viewUserProfile(uid){

const doc = await db.collection("users")

.doc(uid)

.get();

if(!doc.exists) return;

const user = doc.data();

openPage("profile");

profileName.innerHTML = user.name;

profileBio.innerHTML = user.bio || "No Bio Yet";

totalPosts.innerHTML = user.posts || 0;

totalFollowers.innerHTML = user.followers || 0;

totalFollowing.innerHTML = user.following || 0;

if(user.profilePhoto){

profilePhoto.src = user.profilePhoto;

}

if(user.coverPhoto){

coverPhoto.src = user.coverPhoto;

}

}
/*==================================
Notifications
==================================*/

async function addNotification(uid,type,text){

if(uid===currentUser.uid) return;

await db.collection("notifications").add({

uid:uid,

type:type,

text:text,

seen:false,

time:firebase.firestore.FieldValue.serverTimestamp()

});

}

/*==================================
Load Notifications
==================================*/

function loadNotifications(){

if(!currentUser) return;

db.collection("notifications")

.where("uid","==",currentUser.uid)

.orderBy("time","desc")

.onSnapshot((snapshot)=>{

notificationContainer.innerHTML="";

snapshot.forEach((doc)=>{

const notify=doc.data();

notificationContainer.innerHTML+=`

<div class="listCard">

<div style="flex:1">

<h3>${notify.type}</h3>

<p>${notify.text}</p>

</div>

<button

class="secondaryBtn"

onclick="markNotificationSeen('${doc.id}')">

OK

</button>

</div>

`;

});

});

}

/*==================================
Seen Notification
==================================*/

async function markNotificationSeen(id){

await db.collection("notifications")

.doc(id)

.update({

seen:true

});

}

/*==================================
Notification Examples
==================================*/

async function notifyLike(postOwner){

await addNotification(

postOwner,

"👍 Like",

currentUser.email+" liked your post."

);

}

async function notifyComment(postOwner){

await addNotification(

postOwner,

"💬 Comment",

currentUser.email+" commented on your post."

);

}

async function notifyShare(postOwner){

await addNotification(

postOwner,

"📤 Share",

currentUser.email+" shared your post."

);

}

async function notifyFriend(friendUID){

await addNotification(

friendUID,

"👥 Friend Request",

currentUser.email+" sent you a friend request."

);

}

/*==================================
Start Notification
==================================*/

loadNotifications();
/*==================================
Settings System
==================================*/

/* Edit Bio */

editProfileBtn.onclick = async ()=>{

if(!currentUser) return;

const bio = prompt("Write your bio",profileBio.innerText);

if(bio===null) return;

await db.collection("users")

.doc(currentUser.uid)

.update({

bio:bio

});

profileBio.innerText=bio;

showToast("Bio Updated");

};

/*==================================
Change Password
==================================*/

changePasswordBtn.onclick=async()=>{

const email=currentUser.email;

await auth.sendPasswordResetEmail(email);

showToast("Password reset link sent to your email.");

};

/*==================================
Logout
==================================*/

logoutBtn.onclick=()=>{

auth.signOut();

showToast("Logged Out");

};

/*==================================
Delete Account
==================================*/

deleteAccountBtn.onclick=async()=>{

const ok=confirm(

"Delete your Friendsbook account permanently?"

);

if(!ok)return;

try{

await db.collection("users")

.doc(currentUser.uid)

.delete();

await currentUser.delete();

showToast("Account Deleted");

}catch(err){

alert(

"Please login again before deleting account."

);

}

};

/*==================================
Open Settings
==================================*/

settingsMenuBtn.onclick=()=>{

openPage("settings");

};

/*==================================
Open Profile
==================================*/

drawerProfile.onclick=()=>{

openPage("profile");

};

/*==================================
Open Admin
==================================*/

adminMenuBtn.onclick=()=>{

if(currentUser.email===ADMIN_EMAIL){

openPage("admin");

}

};
/*==================================
Reels Upload
==================================*/

async function uploadReel(){

if(!currentUser) return;

const file = reelVideoInput.files[0];

if(!file){

showToast("Select a video first.");

return;

}

try{

const ref = storage.ref(

"reels/"+currentUser.uid+"/"+Date.now()

);

await ref.put(file);

const url = await ref.getDownloadURL();

const userDoc = await db.collection("users")

.doc(currentUser.uid)

.get();

const user = userDoc.data();

await db.collection("reels").add({

uid:currentUser.uid,

name:user.name,

profilePhoto:user.profilePhoto||"",

video:url,

likes:0,

comments:0,

shares:0,

time:firebase.firestore.FieldValue.serverTimestamp()

});

showToast("Reel Uploaded");

reelVideoInput.value="";

}catch(err){

alert(err.message);

}

}

/*==================================
Upload Button
==================================*/

document.getElementById("reelsMenuBtn").ondblclick=()=>{

reelVideoInput.click();

};

reelVideoInput.onchange=()=>{

uploadReel();

};

/*==================================
Load Reels
==================================*/

function loadReels(){

db.collection("reels")

.orderBy("time","desc")

.onSnapshot((snapshot)=>{

reelsContainer.innerHTML="";

snapshot.forEach((doc)=>{

const reel = doc.data();

reelsContainer.innerHTML += `

<div class="reelCard">

<div class="postHeader">

<div class="postUser">

<img src="${reel.profilePhoto||''}">

<div>

<div class="postName">

${reel.name}

</div>

</div>

</div>

</div>

<video

class="reelVideo"

src="${reel.video}"

controls

playsinline

autoplay

loop

muted

></video>

<div class="postAction">

<button onclick="likeReel('${doc.id}')">

👍 ${reel.likes||0}

</button>

<button onclick="commentReel('${doc.id}')">

💬 ${reel.comments||0}

</button>

<button onclick="shareReel('${doc.id}')">

↗ ${reel.shares||0}

</button>

</div>

</div>

`;

});

});

}

/*==================================
Like Reel
==================================*/

async function likeReel(id){

await db.collection("reels")

.doc(id)

.update({

likes:firebase.firestore.FieldValue.increment(1)

});

}

/*==================================
Comment Reel
==================================*/

async function commentReel(id){

const text = prompt("Write comment");

if(!text) return;

await db.collection("reels")

.doc(id)

.update({

comments:firebase.firestore.FieldValue.increment(1)

});

}

/*==================================
Share Reel
==================================*/

async function shareReel(id){

await db.collection("reels")

.doc(id)

.update({

shares:firebase.firestore.FieldValue.increment(1)

});

showToast("Reel Shared");

}

/*==================================
Start Reels
==================================*/

loadReels();
/*==================================
Marketplace
==================================*/

/* Sell Product */

sellItemBtn.onclick = async ()=>{

if(!currentUser) return;

const name = prompt("Product Name");

if(!name) return;

const price = prompt("Price");

if(!price) return;

const image = prompt("Product Image URL");

await db.collection("marketplace").add({

uid:currentUser.uid,

seller:currentUser.email,

product:name,

price:price,

image:image||"",

createdAt:firebase.firestore.FieldValue.serverTimestamp()

});

showToast("Product Listed");

};

/*==================================
Load Marketplace
==================================*/

function loadMarketplace(){

db.collection("marketplace")

.orderBy("createdAt","desc")

.onSnapshot((snapshot)=>{

marketplaceContainer.innerHTML="";

snapshot.forEach((doc)=>{

const item=doc.data();

marketplaceContainer.innerHTML+=`

<div class="listCard">

<img src="${item.image||''}">

<div style="flex:1">

<h3>${item.product}</h3>

<p>৳ ${item.price}</p>

</div>

<button

class="primaryBtn"

onclick="buyProduct('${doc.id}')">

Buy

</button>

</div>

`;

});

});

}

/*==================================
Buy Product
==================================*/

async function buyProduct(id){

showToast("Purchase request sent.");

}

/*==================================
Start Marketplace
==================================*/

loadMarketplace();
/*==================================
Admin Panel
==================================*/

/* Only Admin */

function isAdmin(){

return currentUser &&
currentUser.email===ADMIN_EMAIL;

}

/*==================================
Load All Users
==================================*/

async function loadAdminUsers(){

if(!isAdmin()) return;

const snapshot=await db.collection("users").get();

const adminUsers=document.getElementById("adminUsers");

if(!adminUsers) return;

adminUsers.innerHTML="";

snapshot.forEach((doc)=>{

const user=doc.data();

adminUsers.innerHTML+=`

<div class="listCard">

<div style="flex:1">

<h3>${user.name}</h3>

<p>${user.email}</p>

</div>

<button class="secondaryBtn"

onclick="banUser('${doc.id}')">

Ban

</button>

<button class="primaryBtn"

onclick="deleteUser('${doc.id}')">

Delete

</button>

</div>

`;

});

}

/*==================================
Delete User
==================================*/

async function deleteUser(uid){

if(!confirm("Delete this user?")) return;

await db.collection("users")

.doc(uid)

.delete();

showToast("User Deleted");

loadAdminUsers();

}

/*==================================
Ban User
==================================*/

async function banUser(uid){

await db.collection("users")

.doc(uid)

.update({

banned:true

});

showToast("User Banned");

}

/*==================================
Delete Post
==================================*/

async function adminDeletePost(postID){

if(!confirm("Delete this post?")) return;

await db.collection("posts")

.doc(postID)

.delete();

showToast("Post Deleted");

}

/*==================================
Announcement
==================================*/

async function publishAnnouncement(){

const text=prompt("Write Announcement");

if(!text) return;

await db.collection("announcement")

.add({

text:text,

time:firebase.firestore.FieldValue.serverTimestamp(),

admin:currentUser.email

});

showToast("Announcement Published");

}

/*==================================
Open Admin
==================================*/

if(document.getElementById("announcementBtn")){

announcementBtn.onclick=()=>{

publishAnnouncement();

};

}

/*==================================
Start Admin
==================================*/

loadAdminUsers();
/*==================================
Final Initialization
==================================*/

window.onload = function(){

hidePages();

openPage("home");

loadPosts();

loadStories();

loadFriends();

loadMessenger();

loadNotifications();

loadReels();

loadMarketplace();

if(currentUser){

loadMyProfile();

}

};

/*==================================
Security Check
==================================*/

auth.onAuthStateChanged(async(user)=>{

if(!user){

location.reload();

return;

}

await user.reload();

if(!user.emailVerified){

alert("Please verify your email.");

await auth.signOut();

return;

}

});

/*==================================
Online Status
==================================*/

window.addEventListener("online",()=>{

showToast("Internet Connected");

});

window.addEventListener("offline",()=>{

showToast("No Internet");

});

/*==================================
Prevent Double Click
==================================*/

document.querySelectorAll("button").forEach(btn=>{

btn.addEventListener("dblclick",(e)=>{

e.preventDefault();

});

});

/*==================================
End Friendsbook 2026
==================================*/

console.log("Friendsbook 2026 Ready");
