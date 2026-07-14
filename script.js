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
