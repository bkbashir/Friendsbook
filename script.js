/*==============================
Friendsbook 2026
Part 1
==============================*/

/* Firebase */
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const ADMIN_EMAIL = "bashirahmed0052@gmail.com";

let currentUser = null;

/* ---------- Pages ---------- */

const pages = {
    home: document.getElementById("homePage"),
    friends: document.getElementById("friendsPage"),
    message: document.getElementById("messagePage"),
    notify: document.getElementById("notificationPage"),
    reels: document.getElementById("reelsPage"),
    market: document.getElementById("marketplacePage"),
    search: document.getElementById("searchPage"),
    profile: document.getElementById("profilePage"),
    settings: document.getElementById("settingsPage"),
    admin: document.getElementById("adminPage")
};

function hidePages(){
    Object.values(pages).forEach(p=>{
        if(p) p.style.display="none";
    });
}

function openPage(name){
    hidePages();
    if(pages[name]){
        pages[name].style.display="block";
    }
}

/* ---------- Drawer ---------- */

const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");

if(menuBtn && drawer){
    menuBtn.onclick = ()=>{
        drawer.classList.toggle("active");
    };
}

/* ---------- Bottom Navigation ---------- */

function nav(id,page){
    const btn=document.getElementById(id);
    if(btn){
        btn.onclick=()=>openPage(page);
    }
}

nav("navHome","home");
nav("navFriends","friends");
nav("navReels","reels");
nav("navMarketplace","market");
nav("navProfile","profile");

/* ---------- Auth ---------- */

auth.onAuthStateChanged(async(user)=>{

    if(!user){
        document.getElementById("loginPage").style.display="block";
        document.getElementById("mainPage").style.display="none";
        return;
    }

    await user.reload();

    if(!user.emailVerified){
        alert("Verify your email first.");
        auth.signOut();
        return;
    }

    currentUser=user;

    document.getElementById("loginPage").style.display="none";
    document.getElementById("signupPage").style.display="none";
    document.getElementById("forgotPage").style.display="none";
    document.getElementById("mainPage").style.display="block";

    openPage("home");

});

/* ---------- Login ---------- */

const loginForm=document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("loginEmail").value.trim();

const password=document.getElementById("loginPassword").value;

try{

await auth.signInWithEmailAndPassword(email,password);

}catch(err){

alert(err.message);

}

});

}
