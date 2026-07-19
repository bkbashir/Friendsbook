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
