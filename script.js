// =======================================
// Friendsbook 2026
// script.js Stable
// Part 1
// Login + Signup + Auth
// =======================================


import {

auth,
db,

signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendPasswordResetEmail,
signOut,
onAuthStateChanged,
updateProfile,

doc,
setDoc,
getDoc,

serverTimestamp

} from "./firebase.js";


// ID Helper

const $ = (id) => document.getElementById(id);


// App Data

let currentUser = null;
let userData = null;


// ==========================
// Login
// ==========================

$("loginBtn")?.addEventListener("click", async()=>{

    const email =
    $("loginEmail")?.value.trim();

    const password =
    $("loginPassword")?.value;


    if(!email || !password){

        alert("Email and Password required");

        return;
    }


    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


    }catch(error){

        alert(error.message);

    }

});



// ==========================
// Signup
// ==========================

$("signupBtn")?.addEventListener("click", async()=>{


    const name =
    $("signupName")?.value.trim();

    const email =
    $("signupEmail")?.value.trim();

    const password =
    $("signupPassword")?.value;



    if(!name || !email || !password){

        alert("Fill all fields");

        return;
    }



    try{


        const result =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );



        await updateProfile(
            result.user,
            {
                displayName:name
            }
        );



        await setDoc(

            doc(
                db,
                "users",
                result.user.uid
            ),

            {

                uid:result.user.uid,

                name:name,

                email:email,

                photo:"default-profile.png",

                cover:"default-cover.jpg",

                bio:"",

                createdAt:serverTimestamp()

            }

        );


        alert("Account Created");


    }catch(error){

        alert(error.message);

    }


});



// ==========================
// Forgot Password
// ==========================

$("resetPasswordBtn")?.addEventListener("click",async()=>{


    const email =
    $("forgotEmail")?.value.trim();



    if(!email){

        alert("Enter email");

        return;

    }



    try{


        await sendPasswordResetEmail(
            auth,
            email
        );


        alert("Reset email sent");


    }catch(error){

        alert(error.message);

    }


});




// ==========================
// Auth State
// ==========================


onAuthStateChanged(auth, async(user)=>{


    if(user){


        currentUser = user;



        const snap =
        await getDoc(

            doc(
                db,
                "users",
                user.uid
            )

        );



        if(snap.exists()){

            userData = snap.data();

        }



        // Login hide

        if($("loginPage"))
        $("loginPage").style.display="none";


        // Main show

        if($("mainPage"))
        $("mainPage").style.display="block";



    }else{


        currentUser=null;

        userData=null;



        if($("loginPage"))
        $("loginPage").style.display="block";



        if($("mainPage"))
        $("mainPage").style.display="none";


    }


});



// ==========================
// Logout
// ==========================

$("logoutBtn")?.addEventListener("click",async()=>{

    await signOut(auth);

});
