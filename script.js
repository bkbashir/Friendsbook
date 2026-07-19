/*==================================
Friendsbook 2026
Part 1
==================================*/

/* ========= Pages ========= */

const loadingScreen=document.getElementById("loadingScreen");

const loginPage=document.getElementById("loginPage");
const signupPage=document.getElementById("signupPage");
const forgotPage=document.getElementById("forgotPage");
const mainPage=document.getElementById("mainPage");

/* ========= Forms ========= */

const loginForm=document.getElementById("loginForm");
const signupForm=document.getElementById("signupForm");
const forgotForm=document.getElementById("forgotForm");

/* ========= Login ========= */

const loginEmail=document.getElementById("loginEmail");
const loginPassword=document.getElementById("loginPassword");

/* ========= Signup ========= */

const fullName=document.getElementById("fullName");
const signupEmail=document.getElementById("signupEmail");
const signupPhone=document.getElementById("signupPhone");
const birthDate=document.getElementById("birthDate");
const gender=document.getElementById("gender");
const signupPassword=document.getElementById("signupPassword");
const confirmPassword=document.getElementById("confirmPassword");

/* ========= Forgot ========= */

const forgotEmail=document.getElementById("forgotEmail");

/* ========= Buttons ========= */

const openSignupBtn=document.getElementById("openSignupBtn");
const backLoginBtn=document.getElementById("backLoginBtn");
const backLoginBtn2=document.getElementById("backLoginBtn2");
const forgotPasswordBtn=document.getElementById("forgotPasswordBtn");

/* ========= Firebase ========= */

const firebaseConfig={

apiKey:"AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
authDomain:"friendsbook-4a40c.firebaseapp.com",
projectId:"friendsbook-4a40c",
storageBucket:"friendsbook-4a40c.firebasestorage.app",
messagingSenderId:"1000346329473",
appId:"1:1000346329473:web:9bd69019e2b09f971e8880"

};

firebase.initializeApp(firebaseConfig);

const auth=firebase.auth();
const db=firebase.firestore();
const storage=firebase.storage();

let currentUser=null;

/* ========= Main Buttons ========= */

const menuBtn=document.getElementById("menuBtn");
const messageBtn=document.getElementById("messageBtn");

const navHome=document.getElementById("navHome");
const navFriends=document.getElementById("navFriends");
const navReels=document.getElementById("navReels");
const navMarketplace=document.getElementById("navMarketplace");
const navProfile=document.getElementById("navProfile");

/* ========= Pages ========= */

const homePage=document.getElementById("homePage");
const friendsPage=document.getElementById("friendsPage");
const reelsPage=document.getElementById("reelsPage");
const marketplacePage=document.getElementById("marketplacePage");
const profilePage=document.getElementById("profilePage");
const messagePage=document.getElementById("messagePage");

/* ========= Drawer ========= */

const drawer=document.getElementById("drawer");
/*==================================
Part 2
Auth System
==================================*/

auth.onAuthStateChanged(async(user)=>{

    loadingScreen.style.display="none";

    if(user){

        currentUser=user;

        loginPage.style.display="none";
        signupPage.style.display="none";
        forgotPage.style.display="none";
        mainPage.style.display="block";

    }else{

        currentUser=null;

        loginPage.style.display="flex";
        signupPage.style.display="none";
        forgotPage.style.display="none";
        mainPage.style.display="none";

    }

});

/*=========================
Login
=========================*/

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    try{

        await auth.signInWithEmailAndPassword(
            loginEmail.value.trim(),
            loginPassword.value
        );

    }catch(err){

        alert(err.message);

    }

});

/*=========================
Open Signup
=========================*/

openSignupBtn.onclick=()=>{

    loginPage.style.display="none";
    signupPage.style.display="flex";

};

/*=========================
Back Login
=========================*/

backLoginBtn.onclick=()=>{

    signupPage.style.display="none";
    loginPage.style.display="flex";

};

backLoginBtn2.onclick=()=>{

    forgotPage.style.display="none";
    loginPage.style.display="flex";

};

/*=========================
Forgot Password
=========================*/

forgotPasswordBtn.onclick=()=>{

    loginPage.style.display="none";
    forgotPage.style.display="flex";

};

forgotForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    try{

        await auth.sendPasswordResetEmail(
            forgotEmail.value.trim()
        );

        alert("Password reset email sent.");

        forgotPage.style.display="none";
        loginPage.style.display="flex";

    }catch(err){

        alert(err.message);

    }

});
function openPage(page){

homePage.style.display="none";
friendsPage.style.display="none";
reelsPage.style.display="none";
marketplacePage.style.display="none";
profilePage.style.display="none";
messagePage.style.display="none";

page.style.display="block";

            }

/*==================================
Part 3
Signup + Firestore
==================================*/

signupForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    try{

        const result = await auth.createUserWithEmailAndPassword(
            signupEmail.value.trim(),
            signupPassword.value
        );

        await result.user.sendEmailVerification();

        await db.collection("users").doc(result.user.uid).set({

            uid: result.user.uid,
            name: fullName.value.trim(),
            email: signupEmail.value.trim(),
            phone: signupPhone.value.trim(),
            birth: birthDate.value,
            gender: gender.value,

            bio: "Hello Friendsbook 👋",

            profile: "",
            cover: "",

            followers: 0,
            following: 0,
            posts: 0,

            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        alert("Verification email sent.");

        await auth.signOut();

        signupPage.style.display="none";
        loginPage.style.display="flex";

    }catch(err){

        alert(err.message);

    }

});
/*==================================
Part 4
Profile System
==================================*/

/* ========= Profile ========= */

const profileName=document.getElementById("profileName");
const profileBio=document.getElementById("profileBio");
const profilePhoto=document.getElementById("profilePhoto");
const coverPhoto=document.getElementById("coverPhoto");

const drawerProfilePhoto=document.getElementById("drawerProfilePhoto");
const drawerProfileName=document.getElementById("drawerProfileName");

const totalPosts=document.getElementById("totalPosts");
const totalFollowers=document.getElementById("totalFollowers");
const totalFollowing=document.getElementById("totalFollowing");

/*==================================
Load Profile
==================================*/

async function loadMyProfile(){

    if(!currentUser) return;

    try{

        const doc=await db.collection("users").doc(currentUser.uid).get();

        if(!doc.exists) return;

        const data=doc.data();

        profileName.textContent=data.name || "";
        profileBio.textContent=data.bio || "";

        drawerProfileName.textContent=data.name || "";

        totalPosts.textContent=data.posts || 0;
        totalFollowers.textContent=data.followers || 0;
        totalFollowing.textContent=data.following || 0;

        if(data.profile && profilePhoto){
            profilePhoto.src=data.profile;
        }

        if(data.profile && drawerProfilePhoto){
            drawerProfilePhoto.src=data.profile;
        }

        if(data.cover && coverPhoto){
            coverPhoto.src=data.cover;
        }

    }catch(err){

        console.log(err);

    }

}

/*==================================
Open Profile
==================================*/

navProfile.onclick=()=>{

    openPage(profilePage);

    loadMyProfile();

};
