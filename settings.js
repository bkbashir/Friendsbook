// ======================================
// Friendsbook Settings
// settings.js Part 1
// ======================================

import { auth } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ==========================
// Dark Mode
// ==========================

const darkToggle=document.getElementById("darkModeToggle");

if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

if(darkToggle) darkToggle.checked=true;

}

darkToggle?.addEventListener("change",()=>{

if(darkToggle.checked){

document.body.classList.add("dark");

localStorage.setItem("theme","dark");

}else{

document.body.classList.remove("dark");

localStorage.setItem("theme","light");

}

});

// ==========================
// Admin Panel
// ==========================

onAuthStateChanged(auth,(user)=>{

if(!user) return;

if(user.email==="bashirahmed0052@gmail.com"){

document.getElementById("adminPanelSetting").style.display="block";

}else{

document.getElementById("adminPanelSetting").style.display="none";

}

});

// ==========================
// Open Admin
// ==========================

document.getElementById("adminPanelSetting")?.addEventListener("click",()=>{

location.href="admin.html";

});

// ==========================
// Logout
// ==========================

document.getElementById("logoutBtn")?.addEventListener("click",async()=>{

if(!confirm("Logout from Friendsbook?")) return;

await signOut(auth);

location.href="index.html";

});

console.log("Settings Part 1 Loaded");
// ======================================
// Friendsbook Settings
// settings.js Part 2
// Language + Font + Notifications
// ======================================

// ==========================
// Language
// ==========================

const languageSelect=document.getElementById("languageSelect");

if(localStorage.getItem("language")){

languageSelect.value=localStorage.getItem("language");

}

languageSelect?.addEventListener("change",()=>{

localStorage.setItem(

"language",

languageSelect.value

);

alert("Language Saved");

});

// ==========================
// Font Size
// ==========================

const fontSizeSelect=document.getElementById("fontSizeSelect");

if(localStorage.getItem("fontSize")){

fontSizeSelect.value=

localStorage.getItem("fontSize");

document.body.style.fontSize=

localStorage.getItem("fontSize");

}

fontSizeSelect?.addEventListener("change",()=>{

let size="16px";

if(fontSizeSelect.value=="small"){

size="14px";

}

if(fontSizeSelect.value=="large"){

size="18px";

}

document.body.style.fontSize=size;

localStorage.setItem("fontSize",size);

});

// ==========================
// Data Saver
// ==========================

const dataSaver=document.getElementById("dataSaverToggle");

if(localStorage.getItem("dataSaver")=="true"){

dataSaver.checked=true;

}

dataSaver?.addEventListener("change",()=>{

localStorage.setItem(

"dataSaver",

dataSaver.checked

);

});

// ==========================
// Notification
// ==========================

document.querySelectorAll(

"#notificationSettingsPage input[type='checkbox']"

).forEach(item=>{

const key=item.id;

if(localStorage.getItem(key)!=null){

item.checked=

localStorage.getItem(key)=="true";

}

item.addEventListener("change",()=>{

localStorage.setItem(

key,

item.checked

);

});

});

console.log("Settings Part 2 Loaded");
// ======================================
// Friendsbook Settings
// settings.js Part 3
// Account Settings
// ======================================

import {
updatePassword,
updateEmail
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ==========================
// Change Email
// ==========================

document.getElementById("changeEmailBtn")?.addEventListener("click",async()=>{

const newEmail=prompt("Enter New Email");

if(!newEmail) return;

try{

await updateEmail(auth.currentUser,newEmail);

alert("Email Updated Successfully");

}catch(err){

alert(err.message);

}

});

// ==========================
// Change Password
// ==========================

document.getElementById("changePasswordBtn")?.addEventListener("click",async()=>{

const newPassword=prompt("Enter New Password");

if(!newPassword) return;

if(newPassword.length<6){

alert("Password must be at least 6 characters");

return;

}

try{

await updatePassword(auth.currentUser,newPassword);

alert("Password Updated Successfully");

}catch(err){

alert(err.message);

}

});

// ==========================
// Phone Number
// ==========================

document.getElementById("changePhoneBtn")?.addEventListener("click",()=>{

const phone=prompt("Enter Phone Number");

if(phone){

localStorage.setItem("userPhone",phone);

document.getElementById("userPhone").innerText=phone;

}

});

// ==========================
// Personal Information
// ==========================

document.getElementById("personalInfoBtn")?.addEventListener("click",()=>{

alert("Personal Information Page Coming Soon");

});

// ==========================
// Download Data
// ==========================

document.getElementById("downloadDataBtn")?.addEventListener("click",()=>{

alert("Download Data Feature Coming Soon");

});

// ==========================
// Recovery
// ==========================

document.getElementById("recoveryBtn")?.addEventListener("click",()=>{

alert("Recovery Settings Coming Soon");

});

console.log("Settings Part 3 Loaded");
// ======================================
// Friendsbook Settings
// settings.js Part 4 (Final)
// ======================================

import {
deleteUser
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ==========================
// Delete Account
// ==========================

document.getElementById("deleteAccountBtn")?.addEventListener("click",async()=>{

const ok=confirm(
"Delete your Friendsbook account permanently?"
);

if(!ok) return;

try{

await deleteUser(auth.currentUser);

alert("Account Deleted Successfully");

location.href="index.html";

}catch(err){

alert(err.message);

}

});

// ==========================
// Deactivate Account
// ==========================

document.getElementById("deactivateAccountBtn")?.addEventListener("click",()=>{

alert(
"Deactivate Account feature will be available soon."
);

});

// ==========================
// Help Center
// ==========================

document.getElementById("helpCenterBtn")?.addEventListener("click",()=>{

window.open(
"https://support.google.com/",
"_blank"
);

});

// ==========================
// Report Problem
// ==========================

document.getElementById("reportProblemBtn")?.addEventListener("click",()=>{

const report=prompt("Describe your problem");

if(report){

alert("Thank you! Your report has been received.");

}

});

// ==========================
// Terms & Privacy
// ==========================

document.getElementById("termsBtn")?.addEventListener("click",()=>{

alert(
"Friendsbook Terms & Privacy Policy"
);

});

// ==========================
// Refresh Button
// ==========================

document.getElementById("refreshBtn")?.addEventListener("click",()=>{

location.reload();

});

// ==========================
// App Version
// ==========================

console.log("Friendsbook Official V2");
console.log("Settings Module Loaded");
console.log("Version 2.0");

// ==========================
// End
// ==========================

console.log("Settings Part 4 Loaded Successfully");
