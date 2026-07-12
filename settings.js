// ===============================
// Friendsbook V5
// settings.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

doc,
getDoc,
updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const darkMode=document.getElementById("darkMode");
const language=document.getElementById("language");
const privacy=document.getElementById("privacy");
const saveSettingsBtn=document.getElementById("saveSettingsBtn");

// ===============================
// Load Settings
// ===============================

async function loadSettings(){

const snap=await getDoc(

doc(db,"settings",auth.currentUser.uid)

);

if(snap.exists()){

const data=snap.data();

darkMode.checked=data.darkMode||false;

language.value=data.language||"English";

privacy.value=data.privacy||"Public";

if(data.darkMode){

document.body.classList.add("dark");

}

}

}

loadSettings();

// ===============================
// Save Settings
// ===============================

saveSettingsBtn.onclick=async()=>{

await updateDoc(

doc(db,"settings",auth.currentUser.uid),

{

darkMode:darkMode.checked,

language:language.value,

privacy:privacy.value

}

);

alert("Settings Saved");

};// ===============================
// Friendsbook V5
// settings.js Part 2
// ===============================

// ===============================
// Dark Mode Toggle
// ===============================

darkMode.addEventListener("change",()=>{

if(darkMode.checked){

document.body.classList.add("dark");

}else{

document.body.classList.remove("dark");

}

});

// ===============================
// Language Change
// ===============================

language.addEventListener("change",()=>{

localStorage.setItem(

"friendsbook_language",

language.value

);

});

// ===============================
// Privacy Change
// ===============================

privacy.addEventListener("change",()=>{

localStorage.setItem(

"friendsbook_privacy",

privacy.value

);

});

// ===============================
// Clear Cache
// ===============================

window.clearCache=()=>{

localStorage.clear();

sessionStorage.clear();

alert("Cache Cleared");

};

// ===============================
// Reset Settings
// ===============================

window.resetSettings=()=>{

darkMode.checked=false;

language.value="English";

privacy.value="Public";

document.body.classList.remove("dark");

alert("Settings Reset");

};// ===============================
// Friendsbook V5
// settings.js Part 3 (Final)
// ===============================

// ===============================
// Account Logout
// ===============================

window.logoutAccount=async()=>{

await auth.signOut();

location.href="index.html";

};

// ===============================
// Delete Account
// ===============================

window.deleteAccount=()=>{

const ok=confirm(

"Are you sure you want to delete your account?"

);

if(!ok) return;

alert(

"Account Delete Feature Enabled"

);

// Firebase Auth delete() এখানে পরে যোগ হবে

};

// ===============================
// App Version
// ===============================

window.showAppVersion=()=>{

alert(

"Friendsbook V5\nVersion : 5.0.0"

);

};

// ===============================
// About App
// ===============================

window.aboutFriendsbook=()=>{

alert(

"Friendsbook V5\nCreated by Bashir Ahmed"

);

};

// ===============================
// End settings.js
// ===============================
// ===============================
// Friendsbook V5 Extra Settings
// ===============================

const editProfileBtn=document.getElementById("editProfileBtn");
const changePasswordBtn=document.getElementById("changePasswordBtn");
const notificationSettingBtn=document.getElementById("notificationSettingBtn");
const aboutBtn=document.getElementById("aboutBtn");
const adminPanelBtn=document.getElementById("adminPanelBtn");

// Edit Profile
editProfileBtn?.addEventListener("click",()=>{

if(document.getElementById("feedPage"))
document.getElementById("feedPage").style.display="none";

if(document.getElementById("profilePage"))
document.getElementById("profilePage").style.display="block";

});

// Change Password
changePasswordBtn?.addEventListener("click",()=>{

alert("Change Password feature coming soon.");

});

// Notification Settings
notificationSettingBtn?.addEventListener("click",()=>{

alert("Notification Settings coming soon.");

});

// About
aboutBtn?.addEventListener("click",()=>{

showAppVersion();

});

// Admin Panel
adminPanelBtn?.addEventListener("click",()=>{

location.href="admin.html";

});
