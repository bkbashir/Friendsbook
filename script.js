// ============================
// Friendsbook 2026
// Version 1.0
// ============================

// Loader

window.onload=()=>{

setTimeout(()=>{

document.getElementById("loader").style.display="none";

document.getElementById("app").style.display="block";

},1000);

};

// ============================
// Drawer
// ============================

const menuBtn=document.getElementById("menuBtn");

const drawer=document.getElementById("drawer");

let drawerOpen=false;

menuBtn.onclick=()=>{

if(drawerOpen){

drawer.style.left="-320px";

drawerOpen=false;

}else{

drawer.style.left="0";

drawerOpen=true;

}

};

// ============================
// Bottom Navigation
// ============================

const navBtns=document.querySelectorAll(".bottomNav button");

navBtns.forEach(btn=>{

btn.onclick=()=>{

navBtns.forEach(item=>{

item.classList.remove("active");

});

btn.classList.add("active");

};

});

// Default Active

document.getElementById("homeBtn").classList.add("active");

// ============================
// Coming Features
// ============================

createBtn.onclick=()=>{

console.log("Create");

};

searchBtn.onclick=()=>{

console.log("Search");

};

messageBtn.onclick=()=>{

console.log("Messenger");

};
