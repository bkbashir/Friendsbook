// ======================================
// Friendsbook V6
// script.js Part 1
// Developer: Bashir Ahmed
// ======================================

import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ==========================
// Elements
// ==========================

const loadingScreen = document.getElementById("loadingScreen");
const loginPage = document.getElementById("loginPage");
const mainApp = document.getElementById("mainApp");

const pages = document.querySelectorAll(".page");

// ==========================
// Loading
// ==========================

window.addEventListener("load", () => {
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 800);
    }
});

// ==========================
// Hide All Pages
// ==========================

function hidePages() {
    pages.forEach(page => {
        page.style.display = "none";
    });
}

// ==========================
// Show Page
// ==========================

function showPage(pageId) {

    hidePages();

    const page = document.getElementById(pageId);

    if (page) {
        page.style.display = "block";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ==========================
// Open Home
// ==========================

function openHome() {
    showPage("feedPage");
}

// ==========================
// Firebase Login Check
// ==========================

onAuthStateChanged(auth, user => {

    if (user) {

        if (loginPage)
            loginPage.style.display = "none";

        if (mainApp)
            mainApp.style.display = "block";

        openHome();

    } else {

        if (mainApp)
            mainApp.style.display = "none";

        if (loginPage)
            loginPage.style.display = "flex";

    }

});

// ==========================
// Navigation
// ==========================

document.getElementById("homePageBtn")?.addEventListener("click", () => openHome());

document.getElementById("profilePageBtn")?.addEventListener("click", () => showPage("profilePage"));

document.getElementById("friendsPageBtn")?.addEventListener("click", () => showPage("friendsPage"));

document.getElementById("storyPageBtn")?.addEventListener("click", () => showPage("storyPage"));

document.getElementById("reelsPageBtn")?.addEventListener("click", () => showPage("reelsPage"));

document.getElementById("messageBtn")?.addEventListener("click", () => showPage("messagePage"));

document.getElementById("notificationBtn")?.addEventListener("click", () => showPage("notificationPage"));

document.getElementById("settingsPageBtn")?.addEventListener("click", () => showPage("settingsPage"));

// ==========================
// Logout
// ==========================

document.getElementById("logoutBtn")?.addEventListener("click", async () => {

    await signOut(auth);

});

// ==========================
// End Part 1
// ==========================
// ======================================
// Friendsbook V6
// script.js Part 2
// ======================================

// ---------- Search ----------

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".postCard").forEach(post => {

            const txt = post.innerText.toLowerCase();

            post.style.display = txt.includes(value)
                ? "block"
                : "none";

        });

    });

}

// ---------- Dark Mode ----------

const darkMode = document.getElementById("darkMode");

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    if (darkMode) darkMode.checked = true;

}

darkMode?.addEventListener("change", () => {

    if (darkMode.checked) {

        document.body.classList.add("dark");

        localStorage.setItem("theme", "dark");

    } else {

        document.body.classList.remove("dark");

        localStorage.setItem("theme", "light");

    }

});

// ---------- Mobile Menu ----------

const menuBtn = document.getElementById("menuBtn");

const leftSidebar = document.getElementById("leftSidebar");

let menuOpen = false;

menuBtn?.addEventListener("click", () => {

    if (window.innerWidth <= 1100) {

        menuOpen = !menuOpen;

        leftSidebar.style.display = menuOpen
            ? "block"
            : "none";

    }

});

window.addEventListener("resize", () => {

    if (!leftSidebar) return;

    if (window.innerWidth > 1100) {

        leftSidebar.style.display = "block";

    } else {

        leftSidebar.style.display = "none";

        menuOpen = false;

    }

});

// ---------- Profile Shortcut ----------

document.getElementById("profileImage")
?.addEventListener("click", () => {

    showPage("profilePage");

});

document.getElementById("profilePhoto")
?.addEventListener("click", () => {

    showPage("profilePage");

});

// ---------- Logo ----------

document.querySelector(".logo")
?.addEventListener("click", () => {

    openHome();

});

// ======================================
// End Part 2
// ======================================
// ======================================
// Friendsbook V6
// script.js Part 3
// ======================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==========================
// User Profile Load
// ==========================

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

        const snap = await getDoc(
            doc(db, "users", user.email)
        );

        if (!snap.exists()) return;

        const data = snap.data();

        document.getElementById("myName") &&
        (document.getElementById("myName").innerHTML = data.name);

        document.getElementById("profileName") &&
        (document.getElementById("profileName").innerHTML = data.name);

        document.getElementById("profileBio") &&
        (document.getElementById("profileBio").innerHTML = data.bio || "");

        if (data.profile) {

            document.getElementById("profileImage") &&
            (document.getElementById("profileImage").src = data.profile);

            document.getElementById("profilePhoto") &&
            (document.getElementById("profilePhoto").src = data.profile);

        }

        if (data.cover) {

            document.getElementById("coverPhoto") &&
            (document.getElementById("coverPhoto").src = data.cover);

        }

    } catch (e) {

        console.log(e);

    }

});

// ==========================
// Admin Panel
// ==========================

const ADMIN_EMAIL = "bashirahmed0052@gmail.com";

const adminBtn = document.getElementById("adminPanelBtn");

onAuthStateChanged(auth, (user) => {

    if (!adminBtn) return;

    if (user && user.email === ADMIN_EMAIL) {

        adminBtn.style.display = "flex";

    } else {

        adminBtn.style.display = "none";

    }

});

adminBtn?.addEventListener("click", () => {

    location.href = "admin.html";

});

// ==========================
// App Info
// ==========================

window.FRIENDSBOOK = {

    version: "6.0",

    developer: "Bashir Ahmed"

};

console.log("Friendsbook V6 Loaded");

// ======================================
// End Part 3
// ======================================
