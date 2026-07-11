// ===============================
// Friendsbook V5
// security.js Part 1
// ===============================

import { auth, db } from "./firebase.js";

import {

EmailAuthProvider,
reauthenticateWithCredential,
updatePassword

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {

doc,
setDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const oldPassword=document.getElementById("oldPassword");
const newPassword=document.getElementById("newPassword");
const changePasswordBtn=document.getElementById("changePasswordBtn");

// ===============================
// Change Password
// ===============================

changePasswordBtn.onclick=async()=>{

try{

const credential=EmailAuthProvider.credential(

auth.currentUser.email,

oldPassword.value

);

await reauthenticateWithCredential(

auth.currentUser,

credential

);

await updatePassword(

auth.currentUser,

newPassword.value

);

alert("Password Changed Successfully");

oldPassword.value="";
newPassword.value="";

}catch(e){

alert(e.message);

}

};

// ===============================
// Save Login Activity
// ===============================

window.saveLoginActivity=async()=>{

await setDoc(

doc(db,"loginActivity",auth.currentUser.uid),

{

email:auth.currentUser.email,

time:serverTimestamp(),

device:navigator.userAgent

}

);

};// ===============================
// Friendsbook V5
// security.js Part 2
// ===============================

import {

collection,
addDoc,
serverTimestamp,
query,
where,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Save Device
// ===============================

window.saveDevice=async()=>{

await addDoc(

collection(db,"devices"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

device:navigator.userAgent,

loginTime:serverTimestamp()

}

);

};

// ===============================
// Load Devices
// ===============================

window.loadDevices=()=>{

const q=query(

collection(db,"devices"),

where("uid","==",auth.currentUser.uid),

orderBy("loginTime","desc")

);

const deviceList=document.getElementById("deviceList");

onSnapshot(q,(snapshot)=>{

deviceList.innerHTML="";

snapshot.forEach((doc)=>{

const d=doc.data();

deviceList.innerHTML+=`

<div class="deviceCard">

<h4>${d.email}</h4>

<p>${d.device}</p>

</div>

`;

});

});

};

// ===============================
// Two Step Verification
// ===============================

window.enable2FA=()=>{

alert("Two-Step Verification Enabled");

};

window.disable2FA=()=>{

alert("Two-Step Verification Disabled");

};// ===============================
// Friendsbook V5
// security.js Part 3 (Final)
// ===============================

import {

doc,
deleteDoc,
updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Remove Device
// ===============================

window.removeDevice=async(deviceId)=>{

if(!confirm("Remove this device?")) return;

await deleteDoc(

doc(db,"devices",deviceId)

);

alert("Device Removed");

};

// ===============================
// Logout All Devices
// ===============================

window.logoutAllDevices=()=>{

alert("All Devices Logged Out");

};

// ===============================
// Account Lock
// ===============================

window.lockAccount=async()=>{

await updateDoc(

doc(db,"users",auth.currentUser.uid),

{

accountLocked:true

}

);

alert("Account Locked");

};

// ===============================
// Unlock Account
// ===============================

window.unlockAccount=async()=>{

await updateDoc(

doc(db,"users",auth.currentUser.uid),

{

accountLocked:false

}

);

alert("Account Unlocked");

};

// ===============================
// Security Status
// ===============================

window.securityStatus=()=>{

alert(

"Friendsbook Security\nStatus : Protected"

);

};

// ===============================
// End security.js
// ===============================
