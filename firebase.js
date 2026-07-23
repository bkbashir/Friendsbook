//==============================
// Firebase Config
//==============================

const firebaseConfig = {
  apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
  authDomain: "friendsbook-4a40c.firebaseapp.com",
  projectId: "friendsbook-4a40c",
  storageBucket: "friendsbook-4a40c.firebasestorage.app",
  messagingSenderId: "1000346329473",
  appId: "1:1000346329473:web:9bd69019e2b09f971e8880"
};

firebase.initializeApp(firebaseConfig);

//==============================
// Firebase Services
//==============================

const auth = firebase.auth();

const db = firebase.firestore();

const storage = firebase.storage();

//==============================
// Collections
//==============================

const usersRef = db.collection("users");

const postsRef = db.collection("posts");

const commentsRef = db.collection("comments");

const reactionsRef = db.collection("reactions");

const storiesRef = db.collection("stories");

const notificationsRef = db.collection("notifications");

const messagesRef = db.collection("messages");

const friendRequestsRef = db.collection("friendRequests");

const savedPostsRef = db.collection("savedPosts");

const reportsRef = db.collection("reports");

//==============================
// Storage
//==============================

const profileFolder = storage.ref("profile");

const coverFolder = storage.ref("cover");

const storyFolder = storage.ref("story");

const postFolder = storage.ref("posts");

const reelsFolder = storage.ref("reels");

//==============================
// Global Variables
//==============================

let currentUser = null;

let currentUserData = null;

const ADMIN_EMAIL = "bashirahmed0052@gmail.com";
//==============================
// Auth Functions
//==============================

// Login

async function login(email,password){

try{

const res=await auth.signInWithEmailAndPassword(email,password);

if(!res.user.emailVerified){

alert("Verify your Email First");

await auth.signOut();

return;

}

}catch(err){

alert(err.message);

}

}

// Signup

async function signup(name,email,password){

try{

const res=await auth.createUserWithEmailAndPassword(email,password);

await res.user.sendEmailVerification();

await usersRef.doc(res.user.uid).set({

uid:res.user.uid,

name:name,

email:email,

profilePhoto:"myphoto.png",

coverPhoto:"",

bio:"",

friends:0,

followers:0,

following:0,

verified:false,

createdAt:firebase.firestore.FieldValue.serverTimestamp()

});

alert("Verification Link Sent");

await auth.signOut();

}catch(err){

alert(err.message);

}

}

// Forgot Password

async function forgotPassword(email){

try{

await auth.sendPasswordResetEmail(email);

alert("Reset Link Sent");

}catch(err){

alert(err.message);

}

}

// Logout

function logout(){

auth.signOut();

}

//==============================
// Auth State
//==============================

auth.onAuthStateChanged(async(user)=>{

if(user){

currentUser=user;

const doc=await usersRef.doc(user.uid).get();

currentUserData=doc.data();

}else{

currentUser=null;

currentUserData=null;

}

});

//==============================
// Time
//==============================

function serverTime(){

return firebase.firestore.FieldValue.serverTimestamp();

}

//==============================
// Helpers
//==============================

function randomId(){

return Date.now()+"_"+Math.random().toString(36).substr(2,9);

}
//==============================
// Firebase Helper Functions
// Part 3
//==============================

//========== Create Post ==========

async function createPost(postData){

const id=randomId();

await postsRef.doc(id).set({

id:id,

uid:currentUser.uid,

name:currentUserData.name,

profilePhoto:currentUserData.profilePhoto,

text:postData.text||"",

images:postData.images||[],

video:postData.video||"",

privacy:postData.privacy||"public",

like:0,

love:0,

haha:0,

wow:0,

sad:0,

angry:0,

comments:0,

shares:0,

createdAt:serverTime()

});

return id;

}

//========== Delete Post ==========

async function deletePost(postId){

await postsRef.doc(postId).delete();

}

//========== Save Post ==========

async function savePost(postId){

await savedPostsRef.doc(

currentUser.uid+"_"+postId

).set({

uid:currentUser.uid,

postId:postId,

createdAt:serverTime()

});

}

//========== Share Post ==========

async function sharePost(postId){

await postsRef.doc(postId).update({

shares:firebase.firestore.FieldValue.increment(1)

});

}

//========== Story ==========

async function createStory(image){

const id=randomId();

await storiesRef.doc(id).set({

id:id,

uid:currentUser.uid,

name:currentUserData.name,

profilePhoto:currentUserData.profilePhoto,

image:image,

createdAt:serverTime()

});

}

//========== Comment ==========

async function createComment(postId,text){

const id=randomId();

await commentsRef.doc(id).set({

id:id,

postId:postId,

uid:currentUser.uid,

name:currentUserData.name,

profilePhoto:currentUserData.profilePhoto,

text:text,

parent:"",

like:0,

love:0,

haha:0,

wow:0,

sad:0,

angry:0,

createdAt:serverTime()

});

await postsRef.doc(postId).update({

comments:firebase.firestore.FieldValue.increment(1)

});

}

//========== Reply ==========

async function createReply(postId,parent,text){

const id=randomId();

await commentsRef.doc(id).set({

id:id,

postId:postId,

uid:currentUser.uid,

name:currentUserData.name,

profilePhoto:currentUserData.profilePhoto,

text:text,

parent:parent,

like:0,

love:0,

haha:0,

wow:0,

sad:0,

angry:0,

createdAt:serverTime()

});

}

//========== Notification ==========

async function createNotification(uid,type,postId=""){

const id=randomId();

await notificationsRef.doc(id).set({

id:id,

uid:uid,

from:currentUser.uid,

type:type,

postId:postId,

seen:false,

createdAt:serverTime()

});

}

//========== Friend Request ==========

async function sendFriendRequest(uid){

await friendRequestsRef.doc(

currentUser.uid+"_"+uid

).set({

from:currentUser.uid,

to:uid,

status:"pending",

createdAt:serverTime()

});

  }
