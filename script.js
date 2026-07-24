//=====================================
// Friendsbook 2026 v2
// script.js Part 1
//=====================================

//========== Global ==========

let currentUser = null;
let currentUserData = null;

//========== Elements ==========
const loadingScreen = document.getElementById("loadingScreen");

const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const forgotPage = document.getElementById("forgotPage");
const mainPage = document.getElementById("mainPage");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotForm = document.getElementById("forgotForm");

const goSignup = document.getElementById("goSignup");
const backLogin = document.getElementById("backLogin");

const goForgot = document.getElementById("goForgot");
const forgotBack = document.getElementById("forgotBack");

//========== Loading ==========
window.onload = () => {

setTimeout(() => {

loadingScreen.style.display = "none";

},2500);

};

//========== Pages ==========
function showLogin(){

loginPage.style.display="flex";
signupPage.style.display="none";
forgotPage.style.display="none";
mainPage.style.display="none";

}

function showSignup(){

loginPage.style.display="none";
signupPage.style.display="flex";
forgotPage.style.display="none";
mainPage.style.display="none";

}

function showForgot(){

loginPage.style.display="none";
signupPage.style.display="none";
forgotPage.style.display="flex";
mainPage.style.display="none";

}

function showMain(){

loginPage.style.display="none";
signupPage.style.display="none";
forgotPage.style.display="none";
mainPage.style.display="block";

}

//========== Navigation ==========
goSignup.onclick = showSignup;

backLogin.onclick = showLogin;

goForgot.onclick = showForgot;

forgotBack.onclick = showLogin;

//========== Login ==========
loginForm.onsubmit = async(e)=>{

e.preventDefault();

const email =
document.getElementById("loginEmail").value.trim();

const password =
document.getElementById("loginPassword").value;

await login(email,password);

};

//========== Signup ==========
signupForm.onsubmit = async(e)=>{

e.preventDefault();

const name =
document.getElementById("signupName").value.trim();

const email =
document.getElementById("signupEmail").value.trim();

const password =
document.getElementById("signupPassword").value;

const confirm =
document.getElementById("signupConfirm").value;

if(password!==confirm){

alert("Password Not Match");

return;

}

await signup(name,email,password);

showLogin();

};

//========== Forgot ==========
forgotForm.onsubmit = async(e)=>{

e.preventDefault();

const email =
document.getElementById("forgotEmail").value.trim();

await forgotPassword(email);

showLogin();

};

//========== Auth ==========
auth.onAuthStateChanged(async(user)=>{

if(user){

if(!user.emailVerified){

alert("Verify Your Email");

auth.signOut();

return;

}

currentUser = user;

const doc =
await usersRef.doc(user.uid).get();

currentUserData = doc.data();

showMain();

const lastPage =
localStorage.getItem("lastPage") || "homePage";

showPage(lastPage);

if(user.email===ADMIN_EMAIL){

document.getElementById("adminPage").style.display="block";

}else{

document.getElementById("adminPage").style.display="none";

}

}else{

showLogin();

}

});

//========== Last Page ==========
function saveLastPage(page){

localStorage.setItem("lastPage",page);

}

function getLastPage(){

return localStorage.getItem("lastPage") || "homePage";

}
//=====================================
// Friendsbook 2026 v2
// script.js Part 2
// Drawer + Navigation + Profile
//=====================================

//========== Elements ==========
const drawer=document.getElementById("drawer");

const menuBtn=document.getElementById("menuBtn");

const pages=document.querySelectorAll(".page");

//========== Drawer ==========
menuBtn.onclick=(e)=>{

e.stopPropagation();

drawer.classList.toggle("active");

};

document.addEventListener("click",(e)=>{

if(!drawer.contains(e.target)&&
e.target!==menuBtn){

drawer.classList.remove("active");

}

});

//========== Show Page ==========
function showPage(id){

pages.forEach(page=>{

page.style.display="none";

});

const page=document.getElementById(id);

if(page){

page.style.display="block";

saveLastPage(id);

}

drawer.classList.remove("active");

}

//========== Drawer Menu ==========
document.getElementById("homeMenu").onclick=()=>showPage("homePage");

document.getElementById("profileMenu").onclick=()=>showPage("profilePage");

document.getElementById("friendsMenu").onclick=()=>showPage("friendsPage");

document.getElementById("savedMenu").onclick=()=>showPage("savedPage");

document.getElementById("settingMenu").onclick=()=>showPage("settingsPage");

//========== Bottom Navigation ==========
document.getElementById("navHome").onclick=()=>showPage("homePage");

document.getElementById("navFriends").onclick=()=>showPage("friendsPage");

document.getElementById("navReels").onclick=()=>showPage("reelsPage");

document.getElementById("navMarket").onclick=()=>showPage("marketplacePage");

document.getElementById("navProfile").onclick=()=>showPage("profilePage");

//========== Header ==========
document.getElementById("searchBtn").onclick=()=>{

showPage("searchPage");

};

document.getElementById("messengerBtn").onclick=()=>{

showPage("messagePage");

};

document.getElementById("notificationBtn").onclick=()=>{

showPage("notificationPage");

};

//========== Load Profile ==========
async function loadProfile(){

if(!currentUser)return;

const doc=await usersRef.doc(currentUser.uid).get();

if(!doc.exists)return;

currentUserData=doc.data();

document.getElementById("drawerName").textContent=currentUserData.name||"User";

document.getElementById("profileName").textContent=currentUserData.name||"User";

document.getElementById("profileBio").textContent=currentUserData.bio||"No Bio";

document.getElementById("friendsCount").textContent=currentUserData.friends||0;

document.getElementById("followersCount").textContent=currentUserData.followers||0;

document.getElementById("followingCount").textContent=currentUserData.following||0;

const photo=currentUserData.profilePhoto||"myphoto.png";

document.getElementById("drawerPhoto").src=photo;

document.getElementById("headerProfile").src=photo;

document.getElementById("profilePhoto").src=photo;

document.getElementById("homeProfilePhoto").src=photo;

if(currentUserData.coverPhoto){

document.getElementById("coverPhoto").src=currentUserData.coverPhoto;

}

}

//========== Refresh ==========
auth.onAuthStateChanged((user)=>{

if(user){

loadProfile();

//========== Buttons ==========

document.getElementById("logoutBtn").onclick = () => {
    logout();
};

document.getElementById("editProfileBtn").onclick = () => {
    showPage("editProfilePage");
};

document.getElementById("shareProfileBtn").onclick = async () => {

    const url = location.origin + "/?uid=" + currentUser.uid;

    try{

        await navigator.share({

            title: currentUserData.name,

            text: "Follow me on Friendsbook",

            url: url

        });

    }catch(e){

        navigator.clipboard.writeText(url);

        alert("Profile Link Copied");

    }

};
 
}

});
//=====================================
// Friendsbook 2026 v2
// script.js Part 3
// Profile + Cover + Story + Create Post
//=====================================

//========== Profile Photo ==========
document.getElementById("changeProfileBtn").onclick=()=>{

document.getElementById("profileInput").click();

};

document.getElementById("profileInput").onchange=async(e)=>{

const file=e.target.files[0];

if(!file)return;

const ref=profileFolder.child(currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await usersRef.doc(currentUser.uid).update({

profilePhoto:url

});

currentUserData.profilePhoto=url;

loadProfile();

};

//========== Cover Photo ==========
document.getElementById("changeCoverBtn").onclick=()=>{

document.getElementById("coverInput").click();

};

document.getElementById("coverInput").onchange=async(e)=>{

const file=e.target.files[0];

if(!file)return;

const ref=coverFolder.child(currentUser.uid);

await ref.put(file);

const url=await ref.getDownloadURL();

await usersRef.doc(currentUser.uid).update({

coverPhoto:url

});

document.getElementById("coverPhoto").src=url;

};

//========== Story ==========
document.querySelector(".addStory").onclick=()=>{

document.getElementById("storyInput").click();

};

document.getElementById("storyInput").onchange=async(e)=>{

const file=e.target.files[0];

if(!file)return;

const ref=storyFolder.child(

randomId()

);

await ref.put(file);

const url=await ref.getDownloadURL();

await createStory(url);

loadStories();

};

//========== Load Stories ==========
async function loadStories(){

const box=document.getElementById("stories");

box.innerHTML="";

const snap=await storiesRef

.orderBy("createdAt","desc")

.get();

snap.forEach(doc=>{

const s=doc.data();

box.innerHTML+=`

<div class="story">

<img src="${s.image}">

<p>${s.name}</p>

</div>

`;

});

}

//========== Image Button ==========
document.getElementById("photoBtn").onclick=()=>{

document.getElementById("imageInput").click();

};

//========== Video Button ==========
document.getElementById("videoBtn").onclick=()=>{

document.getElementById("videoInput").click();

};

//========== Create Post ==========
document.getElementById("postBtn").onclick=async()=>{

const text=document.getElementById("postInput").value.trim();

const privacy=document.getElementById("privacySelect").value;

let images=[];

let video="";

// Upload Images

const imgFiles=document.getElementById("imageInput").files;

for(let i=0;i<imgFiles.length;i++){

const ref=postFolder.child(

randomId()

);

await ref.put(imgFiles[i]);

images.push(

await ref.getDownloadURL()

);

}

// Upload Video

const videoFile=document.getElementById("videoInput").files[0];

if(videoFile){

const ref=postFolder.child(

randomId()

);

await ref.put(videoFile);

video=await ref.getDownloadURL();

}

await createPost({

text:text,

images:images,

video:video,

privacy:privacy

});

document.getElementById("postInput").value="";

document.getElementById("imageInput").value="";

document.getElementById("videoInput").value="";

loadFeed();

};

//========== Start ==========
loadStories();
//=====================================
// Friendsbook 2026 v2
// script.js Part 4
// Feed + Like + 6 Reactions + Share + Save
//=====================================

//========== Feed ==========
async function loadFeed(){

const feed=document.getElementById("feedContainer");

feed.innerHTML="";

const snap=await postsRef
.orderBy("createdAt","desc")
.get();

snap.forEach(doc=>{

const p=doc.data();

let imgs="";

if(p.images){

p.images.forEach(img=>{

imgs+=`<img src="${img}" class="postImage">`;

});

}

let video="";

if(p.video){

video=`
<video
class="postVideo"
controls
src="${p.video}">
</video>
`;

}

feed.innerHTML+=`

<div class="postCard">

<div class="postHeader">

<img
class="postProfile"
src="${p.profilePhoto}">

<div class="postInfo">

<div class="postName">

${p.name}

</div>

<div class="postTime">

${timeAgo(p.createdAt)}

</div>

</div>

<div class="postMenu">

<i class="fa-solid fa-ellipsis"></i>

</div>

</div>

<div class="postText">

${p.text}

</div>

${imgs}

${video}

<div class="postActions">

<button
class="likeBtn"
data-id="${doc.id}"

onclick="reactPost('${doc.id}','like')"

oncontextmenu="event.preventDefault();showReactionBox('${doc.id}',event)">

👍 Like

</button>

<button
onclick="openComments('${doc.id}')">

💬 Comment

</button>

<button
onclick="sharePost('${doc.id}')">

↗ Share

</button>

<button
onclick="savePost('${doc.id}')">

💾 Save

</button>

</div>

</div>

`;

});

}

//========== Reaction ==========
async function reactPost(postId,type){

const id=currentUser.uid+"_"+postId;

const ref=reactionsRef.doc(id);

const doc=await ref.get();

if(doc.exists){

const old=doc.data().type;

if(old===type)return;

await postsRef.doc(postId).update({

[old]:
firebase.firestore.FieldValue.increment(-1),

[type]:
firebase.firestore.FieldValue.increment(1)

});

await ref.update({

type:type

});

}else{

await ref.set({

uid:currentUser.uid,

postId:postId,

type:type,

createdAt:serverTime()

});

await postsRef.doc(postId).update({

[type]:
firebase.firestore.FieldValue.increment(1)

});

}

loadFeed();

}

//========== Reaction Box ==========
function showReactionBox(postId,e){

const box=document.getElementById("reactionBox");

box.style.display="flex";

box.style.left=e.pageX+"px";

box.style.top=(e.pageY-60)+"px";

box.innerHTML=`

<span onclick="reactPost('${postId}','like')">👍</span>

<span onclick="reactPost('${postId}','love')">❤️</span>

<span onclick="reactPost('${postId}','haha')">😂</span>

<span onclick="reactPost('${postId}','wow')">😮</span>

<span onclick="reactPost('${postId}','sad')">😢</span>

<span onclick="reactPost('${postId}','angry')">😡</span>

`;

}

document.onclick=()=>{

const box=document.getElementById("reactionBox");

if(box){

box.style.display="none";

}

};

//========== Time ==========
function timeAgo(t){

if(!t)return"Just now";

const sec=Math.floor((Date.now()-t.toDate())/1000);

if(sec<60)return"Just now";

if(sec<3600)return Math.floor(sec/60)+"m ago";

if(sec<86400)return Math.floor(sec/3600)+"h ago";

return Math.floor(sec/86400)+"d ago";

}

//========== Auto Feed ==========
postsRef
.orderBy("createdAt","desc")
.onSnapshot(()=>{

loadFeed();

});

loadFeed();
//=====================================
// Friendsbook 2026 v2
// script.js Part 5
// Comment + Reply + Nested Reply +
// Comment Like + Comment Reaction
//=====================================

//========== Open Comments ==========
async function openComments(postId){

const feed=document.getElementById("feedContainer");

const card=document.querySelector(
`button[onclick="openComments('${postId}')"]`
).closest(".postCard");

let box=card.querySelector(".commentSection");

if(box){

box.remove();

return;

}

box=document.createElement("div");
box.className="commentSection";

box.innerHTML=`

<div class="commentInputBox">

<img
class="commentProfile"
src="${currentUserData.profilePhoto}">

<input
type="text"
class="commentInput"
id="commentInput_${postId}"
placeholder="Write a comment...">

<button
class="commentSend"
onclick="sendComment('${postId}')">

Send

</button>

</div>

<div
id="comments_${postId}">

</div>

`;

card.appendChild(box);

loadComments(postId);

}

//========== Send Comment ==========
async function sendComment(postId){

const input=document.getElementById(

"commentInput_"+postId

);

const text=input.value.trim();

if(text==="") return;

await createComment(postId,text);

input.value="";

loadComments(postId);

}

//========== Load Comments ==========
async function loadComments(postId){

const box=document.getElementById(

"comments_"+postId

);

if(!box)return;

box.innerHTML="";

const snap=await commentsRef

.where("postId","==",postId)

.orderBy("createdAt")

.get();

snap.forEach(doc=>{

const c=doc.data();

if(c.parent===""){

box.innerHTML+=commentHTML(c);

}

});

}

//========== Comment HTML ==========
function commentHTML(c){

return `

<div class="commentCard">

<div class="commentHeader">

<img
class="commentProfile"
src="${c.profilePhoto}">

<div>

<div class="commentName">

${c.name}

</div>

<div class="commentTime">

${timeAgo(c.createdAt)}

</div>

</div>

</div>

<div class="commentText">

${c.text}

</div>

<div class="commentActions">

<span
onclick="likeComment('${c.id}')">

👍 Like

</span>

<span
onclick="showCommentReaction('${c.id}',event)">

❤️ React

</span>

<span
onclick="replyBox('${c.id}')">

↩ Reply

</span>

</div>

<div
class="replyBox"
id="reply_${c.id}">

</div>

</div>

`;

}

//========== Reply ==========
function replyBox(commentId){

const box=document.getElementById(

"reply_"+commentId

);

box.innerHTML=`

<div class="commentInputBox">

<input
class="commentInput"
id="replyInput_${commentId}"
placeholder="Reply...">

<button
class="commentSend"
onclick="sendReply('${commentId}')">

Reply

</button>

</div>

`;

}

//========== Send Reply ==========
async function sendReply(parent){

const input=document.getElementById(

"replyInput_"+parent

);

const text=input.value.trim();

if(text==="")return;

const postId=(await commentsRef.doc(parent).get())

.data().postId;

await createReply(postId,parent,text);

loadComments(postId);

}

//========== Comment Like ==========
async function likeComment(id){

await commentsRef.doc(id).update({

like:firebase.firestore.FieldValue.increment(1)

});

}

//========== Comment Reaction ==========
function showCommentReaction(id,e){

const box=document.getElementById("reactionBox");

box.style.display="flex";

box.style.left=e.pageX+"px";

box.style.top=(e.pageY-60)+"px";

box.innerHTML=`

<span onclick="commentReaction('${id}','love')">❤️</span>

<span onclick="commentReaction('${id}','haha')">😂</span>

<span onclick="commentReaction('${id}','wow')">😮</span>

<span onclick="commentReaction('${id}','sad')">😢</span>

<span onclick="commentReaction('${id}','angry')">😡</span>

`;

}

//========== Save Comment Reaction ==========
async function commentReaction(id,type){

await commentsRef.doc(id).update({

[type]:
firebase.firestore.FieldValue.increment(1)

});

document.getElementById("reactionBox").style.display="none";

}
//=====================================
// Friendsbook 2026 v2
// script.js Part 6
// Friend Request + Follow +
// Search + Notification
//=====================================

//========== Send Friend Request ==========
async function addFriend(uid){

if(uid===currentUser.uid)return;

await friendRequestsRef.doc(

currentUser.uid+"_"+uid

).set({

from:currentUser.uid,

to:uid,

status:"pending",

createdAt:serverTime()

});

await createNotification(

uid,

"friend_request"

);

alert("Friend Request Sent");

}

//========== Accept Friend ==========
async function acceptFriend(id){

const req=await friendRequestsRef.doc(id).get();

const data=req.data();

await friendRequestsRef.doc(id).update({

status:"accepted"

});

await usersRef.doc(data.from).update({

friends:firebase.firestore.FieldValue.increment(1)

});

await usersRef.doc(data.to).update({

friends:firebase.firestore.FieldValue.increment(1)

});

await createNotification(

data.from,

"friend_accept"

);

}

//========== Follow ==========
async function followUser(uid){

if(uid===currentUser.uid)return;

await usersRef.doc(uid).update({

followers:firebase.firestore.FieldValue.increment(1)

});

await usersRef.doc(currentUser.uid).update({

following:firebase.firestore.FieldValue.increment(1)

});

await createNotification(

uid,

"follow"

);

}

//========== Unfollow ==========
async function unfollowUser(uid){

await usersRef.doc(uid).update({

followers:firebase.firestore.FieldValue.increment(-1)

});

await usersRef.doc(currentUser.uid).update({

following:firebase.firestore.FieldValue.increment(-1)

});

}

//========== Search ==========
document.getElementById("searchInput").onkeyup=async(e)=>{

const key=e.target.value.toLowerCase();

const box=document.getElementById("searchResult");

box.innerHTML="";

if(key==="")return;

const snap=await usersRef.get();

snap.forEach(doc=>{

const u=doc.data();

if(

u.name.toLowerCase().includes(key)

){

box.innerHTML+=`

<div class="chatCard">

<img src="${u.profilePhoto}">

<div style="flex:1">

<b>${u.name}</b>

</div>

<button onclick="addFriend('${u.uid}')">

Add

</button>

<button onclick="followUser('${u.uid}')">

Follow

</button>

</div>

`;

}

});

};

//========== Notifications ==========
async function loadNotifications(){

const box=document.getElementById(

"notificationContainer"

);

box.innerHTML="";

const snap=await notificationsRef

.where("uid","==",currentUser.uid)

.orderBy("createdAt","desc")

.get();

snap.forEach(doc=>{

const n=doc.data();

box.innerHTML+=`

<div class="notifyCard">

<img src="${currentUserData.profilePhoto}">

<div>

<b>${n.type}</b>

<br>

<small>

${timeAgo(n.createdAt)}

</small>

</div>

</div>

`;

});

}

//========== Auto Refresh ==========
notificationsRef

.where("uid","==",currentUser.uid)

.onSnapshot(()=>{

loadNotifications();

});

loadNotifications();
console.log("Friendsbook Script Loaded Successfully");
