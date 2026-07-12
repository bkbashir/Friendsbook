// ===============================
// Friendsbook V5
// settings.js (Final Fixed)
// ===============================

import { auth } from "./firebase.js";

const darkMode = document.getElementById("darkMode");
const clearCacheBtn = document.getElementById("clearCacheBtn");
const logoutBtn = document.getElementById("logoutBtn");

const editProfileBtn = document.getElementById("editProfileBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const privacyBtn = document.getElementById("privacyBtn");
const notificationSettingBtn = document.getElementById("notificationSettingBtn");
const languageBtn = document.getElementById("languageBtn");
const aboutBtn = document.getElementById("aboutBtn");
const adminPanelBtn = document.getElementById("adminPanelBtn");

// ===============================
// Dark Mode
// ===============================

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

// ===============================
// Clear Cache
// ===============================

clearCacheBtn?.addEventListener("click", () => {

    if (confirm("সব Local Data Delete করবেন?")) {

        localStorage.clear();
        sessionStorage.clear();
        location.reload();

    }

});

// ===============================
// Edit Profile
// ===============================

editProfileBtn?.addEventListener("click", () => {

    document.querySelectorAll(".page").forEach(p => p.style.display = "none");

    document.getElementById("profilePage").style.display = "block";

});

// ===============================
// Change Password
// ===============================

changePasswordBtn?.addEventListener("click", () => {

    alert("Coming Soon");

});

// ===============================
// Privacy
// ===============================

privacyBtn?.addEventListener("click", () => {

    alert("Privacy Settings Coming Soon");

});

// ===============================
// Notification
// ===============================

notificationSettingBtn?.addEventListener("click", () => {

    alert("Notification Settings Coming Soon");

});

// ===============================
// Language
// ===============================

languageBtn?.addEventListener("click", () => {

    alert("Language Settings Coming Soon");

});

// ===============================
// About
// ===============================

aboutBtn?.addEventListener("click", () => {

    alert("Friendsbook V5\nDeveloper: Bashir Ahmed");

});

// ===============================
// Admin Panel
// ===============================

adminPanelBtn?.addEventListener("click", () => {

    location.href = "admin.html";

});

// ===============================
// Logout
// ===============================

logoutBtn?.addEventListener("click", async () => {

    await auth.signOut();

    localStorage.clear();
    sessionStorage.clear();

    location.reload();

});
