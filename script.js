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

    if(!user){

        loginPage.style.display="flex";
        signupPage.style.display="none";
        forgotPage.style.display="none";
        mainPage.style.display="none";
        return;
    }

    await user.reload();

    if(!user.emailVerified){

        alert("Verify your email first.");
        auth.signOut();
        return;
    }

    currentUser=user;

    loginPage.style.display="none";
    signupPage.style.display="none";
    forgotPage.style.display="none";
    mainPage.style.display="block";

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
            profilePhoto:"",
            coverPhoto:"",

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
