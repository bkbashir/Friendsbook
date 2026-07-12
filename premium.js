// ===============================
// Friendsbook V5
// premium.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
addDoc,
serverTimestamp,
query,
where,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const premiumPlan=document.getElementById("premiumPlan");
const buyPremiumBtn=document.getElementById("buyPremiumBtn");
const premiumStatus=document.getElementById("premiumStatus");

// ===============================
// Buy Premium
// ===============================

buyPremiumBtn.onclick=async()=>{

await addDoc(

collection(db,"premium"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

plan:premiumPlan.value,

status:"Pending",

createdAt:serverTimestamp()

}

);

alert("Premium Request Submitted");

};

// ===============================
// Load Premium Status
// ===============================

const premiumQuery=query(

collection(db,"premium"),

where("uid","==",auth.currentUser.uid)

);

onSnapshot(premiumQuery,(snapshot)=>{

snapshot.forEach((doc)=>{

const premium=doc.data();

premiumStatus.innerHTML=

`

<h3>${premium.plan}</h3>

<p>Status : ${premium.status}</p>

`;

});

});// ===============================
// Friendsbook V5
// premium.js Part 2
// ===============================

import {

doc,
updateDoc,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Cancel Premium
// ===============================

window.cancelPremium=async(docId)=>{

if(!confirm("Cancel Premium Subscription?"))

return;

await deleteDoc(

doc(db,"premium",docId)

);

alert("Premium Cancelled");

};

// ===============================
// Upgrade Premium
// ===============================

window.upgradePremium=async(docId,newPlan)=>{

await updateDoc(

doc(db,"premium",docId),

{

plan:newPlan,

status:"Pending Upgrade"

}

);

alert("Upgrade Request Sent");

};

// ===============================
// Premium Badge
// ===============================

window.showPremiumBadge=()=>{

const badge=document.getElementById("premiumBadge");

if(badge){

badge.style.display="inline-block";

}

};

// ===============================
// Premium Features
// ===============================

window.openPremiumFeatures=()=>{

location.href="premium-features.html";

};

// ===============================
// Premium Support
// ===============================

window.contactPremiumSupport=()=>{

location.href="premium-support.html";

};// ===============================
// Friendsbook V5
// premium.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Premium Payment History
// ===============================

window.savePaymentHistory=async(amount,plan)=>{

await addDoc(

collection(db,"premiumPayments"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

plan:plan,

amount:amount,

paidAt:serverTimestamp()

}

);

alert("Payment Saved");

};

// ===============================
// Premium Referral
// ===============================

window.generateReferralLink=()=>{

const link=

location.origin+

"/premium?ref="+auth.currentUser.uid;

navigator.clipboard.writeText(link);

alert("Referral Link Copied");

};

// ===============================
// Premium Gift
// ===============================

window.giftPremium=async(receiverEmail,plan)=>{

await addDoc(

collection(db,"premiumGifts"),

{

sender:auth.currentUser.email,

receiver:receiverEmail,

plan:plan,

createdAt:serverTimestamp()

}

);

alert("Premium Gift Sent");

};

// ===============================
// Premium Dashboard
// ===============================

window.openPremiumDashboard=()=>{

location.href="premium-dashboard.html";

};

// ===============================
// End premium.js
// ===============================
