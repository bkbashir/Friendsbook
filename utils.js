// ===============================
// Friendsbook V5
// utils.js Part 1
// ===============================

// ===============================
// Format Date
// ===============================

window.formatDate=(timestamp)=>{

if(!timestamp) return "";

const date=new Date(timestamp);

return date.toLocaleDateString()+" "+date.toLocaleTimeString();

};

// ===============================
// Random ID
// ===============================

window.generateId=()=>{

return "FB_"+Date.now()+"_"+

Math.random().toString(36).substring(2,10);

};

// ===============================
// Copy Text
// ===============================

window.copyText=(text)=>{

navigator.clipboard.writeText(text);

alert("Copied Successfully");

};

// ===============================
// Open Link
// ===============================

window.openLink=(url)=>{

window.open(url,"_blank");

};

// ===============================
// Toast Message
// ===============================

window.showToast=(message)=>{

const toast=document.createElement("div");

toast.className="toast";

toast.innerText=message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.remove();

},3000);

};// ===============================
// Friendsbook V5
// utils.js Part 2
// ===============================

// ===============================
// Loading
// ===============================

window.showLoading=()=>{

const loader=document.getElementById("loading");

if(loader){

loader.style.display="flex";

}

};

window.hideLoading=()=>{

const loader=document.getElementById("loading");

if(loader){

loader.style.display="none";

}

};

// ===============================
// Email Validation
// ===============================

window.isValidEmail=(email)=>{

const pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return pattern.test(email);

};

// ===============================
// Password Validation
// ===============================

window.isStrongPassword=(password)=>{

return password.length>=8;

};

// ===============================
// Image Preview
// ===============================

window.previewImage=(input,imgId)=>{

if(input.files.length===0) return;

const reader=new FileReader();

reader.onload=(e)=>{

document.getElementById(imgId).src=e.target.result;

};

reader.readAsDataURL(input.files[0]);

};

// ===============================
// Scroll To Top
// ===============================

window.scrollTopPage=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};// ===============================
// Friendsbook V5
// utils.js Part 3 (Final)
// ===============================

// ===============================
// Logout
// ===============================

window.logout=()=>{

localStorage.clear();

sessionStorage.clear();

location.href="index.html";

};

// ===============================
// Device Check
// ===============================

window.isMobile=()=>{

return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(

navigator.userAgent

);

};

// ===============================
// Network Status
// ===============================

window.checkNetwork=()=>{

if(navigator.onLine){

showToast("Internet Connected");

}else{

showToast("No Internet Connection");

}

};

window.addEventListener("online",checkNetwork);

window.addEventListener("offline",checkNetwork);

// ===============================
// App Version
// ===============================

window.appVersion=()=>{

return "Friendsbook V5.0.0";

};

// ===============================
// Developer
// ===============================

window.developerInfo=()=>{

return{

app:"Friendsbook V5",

developer:"Bashir Ahmed",

version:"5.0.0"

};

};

// ===============================
// End utils.js
// ===============================
