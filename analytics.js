// ===============================
// Friendsbook V5
// analytics.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
query,
where,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const totalPosts=document.getElementById("analyticsPosts");
const totalFollowers=document.getElementById("analyticsFollowers");
const totalLikes=document.getElementById("analyticsLikes");
const totalViews=document.getElementById("analyticsViews");

// ===============================
// Posts Analytics
// ===============================

const postQuery=query(

collection(db,"posts"),

where("uid","==",auth.currentUser.uid)

);

onSnapshot(postQuery,(snapshot)=>{

totalPosts.innerHTML=snapshot.size;

});

// ===============================
// Followers Analytics
// ===============================

const followerQuery=query(

collection(db,"followers"),

where("following","==",auth.currentUser.uid)

);

onSnapshot(followerQuery,(snapshot)=>{

totalFollowers.innerHTML=snapshot.size;

});

// ===============================
// Likes Analytics
// ===============================

const likeQuery=query(

collection(db,"likes"),

where("owner","==",auth.currentUser.uid)

);

onSnapshot(likeQuery,(snapshot)=>{

totalLikes.innerHTML=snapshot.size;

});

// ===============================
// Views Analytics
// ===============================

const viewQuery=query(

collection(db,"views"),

where("owner","==",auth.currentUser.uid)

);

onSnapshot(viewQuery,(snapshot)=>{

totalViews.innerHTML=snapshot.size;

});// ===============================
// Friendsbook V5
// analytics.js Part 2
// ===============================

import {

collection,
addDoc,
serverTimestamp,
doc,
updateDoc,
increment

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Track Profile Visit
// ===============================

window.trackProfileVisit=async(ownerUid)=>{

await addDoc(

collection(db,"profileVisits"),

{

owner:ownerUid,

visitor:auth.currentUser.uid,

visitedAt:serverTimestamp()

}

);

};

// ===============================
// Track Post View
// ===============================

window.trackPostView=async(postId)=>{

await updateDoc(

doc(db,"posts",postId),

{

views:increment(1)

}

);

};

// ===============================
// Track Link Click
// ===============================

window.trackLinkClick=async(link)=>{

await addDoc(

collection(db,"linkClicks"),

{

uid:auth.currentUser.uid,

link:link,

clickedAt:serverTimestamp()

}

);

};

// ===============================
// Open Analytics Dashboard
// ===============================

window.openAnalyticsDashboard=()=>{

location.href="analytics-dashboard.html";

};

// ===============================
// Export Analytics
// ===============================

window.exportAnalytics=()=>{

alert("Analytics Export Started");

};// ===============================
// Friendsbook V5
// analytics.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Daily Analytics Log
// ===============================

window.saveDailyAnalytics=async(data)=>{

await addDoc(

collection(db,"analyticsLogs"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

posts:data.posts,

followers:data.followers,

likes:data.likes,

views:data.views,

createdAt:serverTimestamp()

}

);

};

// ===============================
// Refresh Analytics
// ===============================

window.refreshAnalytics=()=>{

location.reload();

};

// ===============================
// Analytics History
// ===============================

window.openAnalyticsHistory=()=>{

location.href="analytics-history.html";

};

// ===============================
// Analytics Report
// ===============================

window.generateAnalyticsReport=()=>{

alert("Analytics Report Generated");

};

// ===============================
// End analytics.js
// ===============================
