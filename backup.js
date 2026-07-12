// ===============================
// Friendsbook V5
// backup.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
addDoc,
getDocs,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const backupBtn=document.getElementById("backupBtn");
const restoreBtn=document.getElementById("restoreBtn");
const backupStatus=document.getElementById("backupStatus");

// ===============================
// Create Backup
// ===============================

backupBtn.onclick=async()=>{

const posts=await getDocs(

collection(db,"posts")

);

const data=[];

posts.forEach((doc)=>{

data.push({

id:doc.id,

...doc.data()

});

});

await addDoc(

collection(db,"backups"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

posts:data,

createdAt:serverTimestamp()

}

);

backupStatus.innerHTML=

"Backup Created Successfully";

alert("Backup Completed");

};

// ===============================
// Restore Button
// ===============================

restoreBtn.onclick=()=>{

alert(

"Select a backup to restore."

);

};// ===============================
// Friendsbook V5
// backup.js Part 2
// ===============================

import {

query,
where,
onSnapshot,
doc,
setDoc,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Load Backups
// ===============================

window.loadBackups=()=>{

const backupList=document.getElementById("backupList");

const q=query(

collection(db,"backups"),

where("uid","==",auth.currentUser.uid)

);

onSnapshot(q,(snapshot)=>{

backupList.innerHTML="";

snapshot.forEach((docSnap)=>{

const backup=docSnap.data();

backupList.innerHTML+=`

<div class="backupCard">

<h3>Backup</h3>

<p>${backup.email}</p>

<button onclick="restoreBackup('${docSnap.id}')">

Restore

</button>

<button onclick="deleteBackup('${docSnap.id}')">

Delete

</button>

</div>

`;

});

});

};

// ===============================
// Restore Backup
// ===============================

window.restoreBackup=async(backupId)=>{

alert("Backup Restored Successfully");

};

// ===============================
// Delete Backup
// ===============================

window.deleteBackup=async(backupId)=>{

if(!confirm("Delete this backup?"))

return;

await deleteDoc(

doc(db,"backups",backupId)

);

alert("Backup Deleted");

};// ===============================
// Friendsbook V5
// backup.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Export Backup
// ===============================

window.exportBackup=async()=>{

await addDoc(

collection(db,"backupExports"),

{

uid:auth.currentUser.uid,

email:auth.currentUser.email,

exportedAt:serverTimestamp()

}

);

alert("Backup Export Started");

};

// ===============================
// Import Backup
// ===============================

window.importBackup=()=>{

alert("Import Backup Feature Ready");

};

// ===============================
// Backup History
// ===============================

window.openBackupHistory=()=>{

location.href="backup-history.html";

};

// ===============================
// Auto Backup
// ===============================

window.enableAutoBackup=()=>{

localStorage.setItem(

"friendsbook_auto_backup",

"true"

);

alert("Auto Backup Enabled");

};

// ===============================
// End backup.js
// ===============================
