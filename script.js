const profileName = document.getElementById("profileName");
const profileBio = document.getElementById("profileBio");
const profilePhoto = document.getElementById("profilePhoto");
const coverPhoto = document.getElementById("coverPhoto");

const totalPosts = document.getElementById("totalPosts");
const totalFollowers = document.getElementById("totalFollowers");
const totalFollowing = document.getElementById("totalFollowing");
const loadingScreen = document.getElementById("loadingScreen");
const openSignupBtn = document.getElementById("openSignupBtn");
const backLoginBtn = document.getElementById("backLoginBtn");
const backLoginBtn2 = document.getElementById("backLoginBtn2");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

const messengerBtn = document.getElementById("messengerBtn");
const notificationBtn = document.getElementById("notificationBtn");

const editProfileBtn = document.getElementById("editProfileBtn");
const loginPage=document.getElementById("loginPage");
const signupPage=document.getElementById("signupPage");
const forgotPage=document.getElementById("forgotPage");
const mainPage=document.getElementById("mainPage");

const loginForm=document.getElementById("loginForm");
const signupForm=document.getElementById("signupForm");
const forgotForm=document.getElementById("forgotForm");

const loginEmail=document.getElementById("loginEmail");
const loginPassword=document.getElementById("loginPassword");

const signupEmail=document.getElementById("signupEmail");
const signupPassword=document.getElementById("signupPassword");
const confirmPassword=document.getElementById("confirmPassword");

const fullName=document.getElementById("fullName");
const birthDate=document.getElementById("birthDate");
const gender=document.getElementById("gender");
const signupPhone=document.getElementById("signupPhone");

const forgotEmail=document.getElementById("forgotEmail");

const menuBtn=document.getElementById("menuBtn");

const navHome=document.getElementById("navHome");
const navFriends=document.getElementById("navFriends");
const navReels=document.getElementById("navReels");
const navMarketplace=document.getElementById("navMarketplace");
const navProfile=document.getElementById("navProfile");

const homePage=document.getElementById("homePage");
const friendsPage=document.getElementById("friendsPage");
const reelsPage=document.getElementById("reelsPage");
const marketplacePage=document.getElementById("marketplacePage");
const profilePage=document.getElementById("profilePage");
const messagePage=document.getElementById("messagePage");
const notificationPage=document.getElementById("notificationPage");
/*==================================
Friendsbook 2026
Part 1
Firebase + Auth
==================================*/

const firebaseConfig = {
  apiKey: "AIzaSyBRad-Z7zxRRnvy17nRXEh7ZG4hu6fluZ4",
  authDomain: "friendsbook-4a40c.firebaseapp.com",
  projectId: "friendsbook-4a40c",
  storageBucket: "friendsbook-4a40c.firebasestorage.app",
  messagingSenderId: "1000346329473",
  appId: "1:1000346329473:web:9bd69019e2b09f971e8880"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const ADMIN_EMAIL = "bashirahmed0052@gmail.com";

let currentUser = null;

/*==============================
Auth State
==============================*/

auth.onAuthStateChanged(async(user)=>{
auth.onAuthStateChanged(async(user)=>{

    if(user){

        currentUser = user;

        loadingScreen.style.display = "none"; // আগে Hide করো

        loginPage.style.display = "none";
        signupPage.style.display = "none";
        forgotPage.style.display = "none";
        mainPage.style.display = "block";

        await loadMyProfile();

    }else{

        loadingScreen.style.display = "none";

        loginPage.style.display = "flex";
        signupPage.style.display = "none";
        forgotPage.style.display = "none";
        mainPage.style.display = "none";

    }

});
/*==============================
Login
==============================*/

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

/*==============================
Open Signup
==============================*/

openSignupBtn.onclick=()=>{

loginPage.style.display="none";

signupPage.style.display="flex";

};

/*==============================
Back Login
==============================*/

backLoginBtn.onclick=()=>{

signupPage.style.display="none";

loginPage.style.display="flex";

};

backLoginBtn2.onclick=()=>{

forgotPage.style.display="none";

loginPage.style.display="flex";

};

/*==============================
Forgot Password
==============================*/

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
/*==================================
Signup
==================================*/

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = fullName.value.trim();
    const email = signupEmail.value.trim();
    const phone = signupPhone.value.trim();
    const birth = birthDate.value;
    const gender = gender.value;
    const password = signupPassword.value;
    const confirm = confirmPassword.value;

    if(name==="" || email==="" || password===""){
        alert("Please fill all required fields.");
        return;
    }

    if(password!==confirm){
        alert("Password does not match.");
        return;
    }

    try{

        const result = await auth.createUserWithEmailAndPassword(email,password);

        await result.user.sendEmailVerification();

        await db.collection("users").doc(result.user.uid).set({

            uid:result.user.uid,
            name:name,
            email:email,
            phone:phone,
            birth:birth,
            gender:gender,

            bio:"",
            profile:"",
            cover:"",

            followers:0,
            following:0,
            posts:0,

            createdAt:new Date()

        });

        alert("Verification link sent to your email.");

        auth.signOut();

        signupPage.style.display="none";
        loginPage.style.display="flex";

    }catch(err){

        alert(err.message);

    }

});
/*==================================
Drawer + Navigation
==================================*/

const drawer = document.getElementById("drawer");

menuBtn.onclick=()=>{

    drawer.classList.toggle("active");

};

document.addEventListener("click",(e)=>{

    if(!drawer.contains(e.target) && !menuBtn.contains(e.target)){

        drawer.classList.remove("active");

    }

});
/*==================================
Bottom Navigation
==================================*/

function openPage(page){

    document.querySelectorAll("section").forEach(s=>{

        if(s.id.endsWith("Page")){

            s.style.display="none";

        }

    });

    page.style.display="block";

}


navHome.onclick=()=>{

    openPage(homePage);

};

navFriends.onclick=()=>{

    openPage(friendsPage);

};

navReels.onclick=()=>{

    openPage(reelsPage);

};

navMarketplace.onclick=()=>{

    openPage(marketplacePage);

};

navProfile.onclick=()=>{

    openPage(profilePage);

};


/*==================================
Header Buttons
==================================*/

messengerBtn.onclick=()=>{

    openPage(messagePage);

};

notificationBtn.onclick=()=>{

    openPage(notificationPage);

};
/*==================================
Profile System
==================================*/

async function loadMyProfile(){

    if(!currentUser) return;

    try{

        const snap = await db.collection("users").doc(currentUser.uid).get();

        if(!snap.exists){

            alert("User Data Not Found");
            return;

        }

        const data = snap.data();

        profileName.textContent = data.name || "";
        profileBio.textContent = data.bio || "";

        totalPosts.textContent = data.posts || 0;
        totalFollowers.textContent = data.followers || 0;
        totalFollowing.textContent = data.following || 0;

        if(data.profile){
            profilePhoto.src = data.profile;
        }

        if(data.cover){
            coverPhoto.src = data.cover;
        }

    }catch(err){

        alert(err.message);

    }

}
/*==================================
Edit Profile
==================================*/

editProfileBtn.onclick = async () => {

    const newName = prompt(
        "Enter your name",
        document.getElementById("profileName").textContent
    );

    if (newName == null) return;

    const newBio = prompt(
        "Enter your bio",
        document.getElementById("profileBio").textContent
    );

    if (newBio == null) return;

    try {

        await db.collection("users")
        .doc(currentUser.uid)
        .update({

            name: newName,
            bio: newBio

        });

        await loadMyProfile();

        alert("Profile Updated Successfully.");

    } catch (err) {

        alert(err.message);

    }

};
