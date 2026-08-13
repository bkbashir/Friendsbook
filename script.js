// ======================================
// Friendsbook 2026
// script.js
// Part 1 - Foundation
// ======================================

import {
  auth,
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  createUserObject,
  isAdmin,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
  arrayUnion,
  deleteDoc,
} from "./firebase.js";
// ======================================
// CLOUDINARY UPLOAD SYSTEM
// ======================================

const CLOUDINARY_CLOUD_NAME = "d22vlgls";
const CLOUDINARY_UPLOAD_PRESET = "friendsbook_upload";

async function uploadToCloudinary(file) {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const uploadURL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const response = await fetch(uploadURL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}

// ======================
// DOM Helper
// ======================

const $ = (id) => document.getElementById(id);

const App = {
  user: null,
  profile: null,
  page: "home",
  dark: false,
  admin: false,
};

// ======================
// Show / Hide
// ======================

function show(id) {
  const el = $(id);
  if (el) el.classList.remove("hidden");
}

function hide(id) {
  const el = $(id);
  if (el) el.classList.add("hidden");
}

// ======================
// Auth Pages
// ======================

function openLogin() {
  show("loginPage");
  hide("signupPage");
  hide("forgotPage");
}

function openSignup() {
  hide("loginPage");
  show("signupPage");
  hide("forgotPage");
}

function openForgot() {
  hide("loginPage");
  hide("signupPage");
  show("forgotPage");
}

// ======================
// Event
// ======================

document.addEventListener("DOMContentLoaded", () => {
  $("openSignup")?.addEventListener("click", openSignup);

  $("openLogin")?.addEventListener("click", openLogin);

  $("forgotPasswordBtn")?.addEventListener("click", openForgot);

  $("backLogin")?.addEventListener("click", openLogin);

  hide("homePage");
  show("authContainer");
});
// ======================================
// Part 2
// Authentication
// ======================================

// Login
$("loginBtn")?.addEventListener("click", async () => {
  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert(e.message);
  }
});

// Signup
$("signupBtn")?.addEventListener("click", async () => {
  const name = $("signupName").value.trim();
  const email = $("signupEmail").value.trim();
  const password = $("signupPassword").value;

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, {
      displayName: name,
    });

    await sendEmailVerification(result.user);

    await setDoc(
      doc(db, "users", result.user.uid),
      createUserObject(result.user, name)
    );

    alert("Account Created");

    openLogin();
  } catch (e) {
    alert(e.message);
  }
});

// Forgot Password
$("resetPasswordBtn")?.addEventListener("click", async () => {
  const email = $("forgotEmail").value.trim();

  if (!email) {
    alert("Enter email");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    alert("Reset email sent");

    openLogin();
  } catch (e) {
    alert(e.message);
  }
});
// ======================================
// Part 3
// Auth State + Logout
// ======================================

onAuthStateChanged(auth, async (user) => {
  if (user) {
    App.user = user;

    App.admin = isAdmin(user.email);

    hide("authContainer");

    // Admin button
    if ($("menuAdminBtn")) {
      if (App.admin) {
        show("menuAdminBtn");
      } else {
        hide("menuAdminBtn");
      }
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        App.profile = snap.data();

        // Profile Page
        if ($("profileName"))
          $("profileName").textContent =
            App.profile.name || user.displayName || "User";

        if ($("profileUsername"))
          $("profileUsername").textContent =
            "@" + (App.profile.username || user.uid.substring(0, 8));

        if ($("profileBio"))
          $("profileBio").textContent = App.profile.bio || "";

        if ($("profilePhoto"))
          $("profilePhoto").src = App.profile.photo || "default-profile.png";

        if ($("coverPhoto"))
          $("coverPhoto").src = App.profile.cover || "default-cover.jpg";

        if ($("followersCount"))
          $("followersCount").textContent = App.profile.followers || 0;

        if ($("followingCount"))
          $("followingCount").textContent = App.profile.following || 0;

        if ($("menuUserName"))
          $("menuUserName").textContent =
            App.profile.name || user.displayName || "User";

        if ($("menuProfileImage"))
          $("menuProfileImage").src =
            App.profile.photo || "default-profile.png";

        if ($("headerProfile"))
          $("headerProfile").src = App.profile.photo || "default-profile.png";

        // Header Name
        if ($("headerUserName"))
          $("headerUserName").textContent =
            App.profile.name || user.displayName || "User";
      }
      if (!App.profile) {
        App.profile = {
          uid: user.uid,

          name: user.displayName || "User",

          username: user.uid.substring(0, 8),

          bio: "",

          photo: "default-profile.png",

          cover: "default-cover.jpg",

          followers: 0,

          following: 0,

          posts: 0,
        };
      }

      updateProfileUI();
      loadPosts();
      show("homePage");
    } catch (e) {
      console.error(e);
    }
  } else {
    App.user = null;
    App.profile = null;

    show("authContainer");
    hide("homePage");

    openLogin();
  }
});

// ========================
// Logout
// ========================

$("logoutBtn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (e) {
    alert(e.message);
  }
});

// ======================================
// Part 4
// COMPLETE NAVIGATION SYSTEM
// ======================================

const pageViews = [
  "homeContent",
  "profilePage",
  "commentsPage",
  "friendsPage",
  "aiPage",
  "reelsPage",
  "messengerPage",
  "notificationPage",
  "settingsPage",
  "savedPage",
  "marketplacePage",
  "groupsPage",
  "pagesPage",
  "adminPage",
];

function openPage(pageId) {
  localStorage.setItem("fb_current_page", pageId);

  // App shell must remain visible while switching inner pages
  show("homePage");
  hide("authContainer");

  // সব page hide
  pageViews.forEach((id) => {
    hide(id);
  });

  // selected page show
  show(pageId);

  // drawer বন্ধ
  hide("sideMenu");
  hide("overlay");

  // bottom nav active state
  document.querySelectorAll(".navItem").forEach((btn) => {
    btn.classList.remove("active");
  });

  if (pageId === "homeContent") {
    $("navHome")?.classList.add("active");
  }

  if (pageId === "friendsPage") {
    $("navFriends")?.classList.add("active");
  }

  if (pageId === "aiPage") {
    $("navAI")?.classList.add("active");
  }

  if (pageId === "reelsPage") {
    $("navReels")?.classList.add("active");
  }
}

// ======================================
// HOME
// ======================================

$("navHome")?.addEventListener("click", () => {
  openPage("homeContent");
});

// ======================================
// FRIENDS
// ======================================

$("navFriends")?.addEventListener("click", () => {
  openPage("friendsPage");
});

// ======================================
// AI
// ======================================

$("navAI")?.addEventListener("click", () => {
  openPage("aiPage");
});

// ======================================
// REELS
// ======================================

$("navReels")?.addEventListener("click", () => {
  openPage("reelsPage");
});

// ======================================
// PROFILE
// ======================================

$("headerProfile")?.addEventListener("click", () => {
  openPage("profilePage");
});

$("menuProfileBtn")?.addEventListener("click", () => {
  openPage("profilePage");
});

// ======================================
// MESSENGER
// ======================================

$("messengerBtn")?.addEventListener("click", () => {
  openPage("messengerPage");
});

$("menuMessengerBtn")?.addEventListener("click", () => {
  openPage("messengerPage");
});

// ======================================
// NOTIFICATIONS
// ======================================

$("notificationBtn")?.addEventListener("click", () => {
  openPage("notificationPage");
});

$("menuNotificationBtn")?.addEventListener("click", () => {
  openPage("notificationPage");
});

// ======================================
// SAVED
// ======================================

$("menuSavedBtn")?.addEventListener("click", () => {
  openPage("savedPage");
});

// ======================================
// MARKETPLACE
// ======================================

$("menuMarketplaceBtn")?.addEventListener("click", () => {
  openPage("marketplacePage");
});

// ======================================
// PAGES
// ======================================

$("menuPagesBtn")?.addEventListener("click", () => {
  openPage("pagesPage");
});

// ======================================
// GROUPS
// ======================================

$("menuGroupsBtn")?.addEventListener("click", () => {
  openPage("groupsPage");
});

// ======================================
// SETTINGS
// ======================================

$("menuSettingsBtn")?.addEventListener("click", () => {
  openPage("settingsPage");
});

// ======================================
// ADMIN PANEL
// ======================================

$("menuAdminBtn")?.addEventListener("click", () => {
  if (!App.admin) {
    alert("Admin access required.");

    return;
  }

  openPage("adminPage");
});

// ======================================
// MENU DRAWER
// ======================================

$("navMenu")?.addEventListener("click", () => {
  show("sideMenu");
  show("overlay");
});

// ======================================
// OVERLAY
// ======================================

$("overlay")?.addEventListener("click", () => {
  hide("sideMenu");
  hide("overlay");
});

// ======================================
// ADMIN BUTTON VISIBILITY
// ======================================

if (App.admin) {
  show("menuAdminBtn");
} else {
  hide("menuAdminBtn");
}

// ======================================
// PART 8A - PROFILE SYSTEM
// ======================================

// ======================
// PROFILE UI
// ======================

function updateProfileUI() {
  if (!App.profile) return;

  $("profileName").textContent = App.profile.name || "User";

  $("profileUsername").textContent = "@" + (App.profile.username || "username");

  $("profileBio").textContent = App.profile.bio || "Add your bio...";

  $("profilePhoto").src = App.profile.photo || "default-profile.png";

  $("coverPhoto").src = App.profile.cover || "default-cover.jpg";

  $("followersCount").textContent = App.profile.followers || 0;

  $("followingCount").textContent = App.profile.following || 0;

  $("postsCount").textContent = App.profile.posts || 0;

  $("menuUserName").textContent = App.profile.name || "User";

 $("menuProfileImage").src = App.profile.photo || "default-profile.png";

$("headerProfile").src = App.profile.photo || "default-profile.png";

const composerPhoto = $("createProfileImage");

if (composerPhoto) {
    composerPhoto.src =
        App.profile.photo ||
        "default-profile.png";

    composerPhoto.style.cursor = "pointer";

    composerPhoto.onclick = () => {
        openPage("profilePage");
    };
}
}
// ======================================
// VIEW OTHER USER PROFILE + FOLLOW
// ======================================

let viewedProfileUid = localStorage.getItem("fb_viewed_profile_uid") || null;

async function openUserProfile(uid) {
  if (!uid || !App.user) return;

  try {
    const userSnap = await getDoc(doc(db, "users", uid));

    if (!userSnap.exists()) {
      alert("User profile not found.");
      return;
    }

    const profile = {
      uid: uid,
      ...userSnap.data(),
    };

    viewedProfileUid = uid;
    localStorage.setItem("fb_viewed_profile_uid", uid);

    // Open profile page
    openPage("profilePage");

    // ==========================
    // PROFILE INFORMATION
    // ==========================

    $("profileName").textContent = profile.name || "User";

    $("profileUsername").textContent =
      "@" + (profile.username || uid.substring(0, 8));

    $("profileBio").textContent = profile.bio || "Add your bio...";

    $("profilePhoto").src = profile.photo || "default-profile.png";

    $("coverPhoto").src = profile.cover || "default-cover.jpg";

    // ==========================
    // PROFILE STATS
    // ==========================

    $("followersCount").textContent = profile.followers || 0;

    $("followingCount").textContent = profile.following || 0;

    // ==========================
    // LOAD USER POSTS
    // ==========================

    const q = query(collection(db, "posts"), where("uid", "==", uid));

    const snap = await getDocs(q);

    const userPosts = [];

    snap.forEach((item) => {
      userPosts.push({
        id: item.id,

        ...item.data(),
      });
    });

    userPosts.sort((a, b) => {
      const aTime = a.time?.toMillis?.() || 0;

      const bTime = b.time?.toMillis?.() || 0;

      return bTime - aTime;
    });

    $("postsCount").textContent = userPosts.length;

    renderProfilePosts(userPosts);

    // ==========================
    // OWN PROFILE / OTHER PROFILE
    // ==========================

    const isOwnProfile = uid === App.user.uid;

    const editBtn = $("editProfileBtn");

    const storyBtn = $("createStoryBtn");

    const followBtn = $("followBtn");

    if (isOwnProfile) {
      // নিজের profile

      editBtn?.classList.remove("hidden");

      storyBtn?.classList.remove("hidden");

      followBtn?.classList.add("hidden");

      document.querySelector(".coverCamera")?.classList.remove("hidden");

      document.querySelector(".avatarCamera")?.classList.remove("hidden");
    } else {
      // অন্যের profile

      editBtn?.classList.add("hidden");

      storyBtn?.classList.add("hidden");

      followBtn?.classList.remove("hidden");

      document.querySelector(".coverCamera")?.classList.add("hidden");

      document.querySelector(".avatarCamera")?.classList.add("hidden");

      // ==========================
      // FOLLOWING CHECK
      // ==========================

      const mySnap = await getDoc(doc(db, "users", App.user.uid));

      const myData = mySnap.exists() ? mySnap.data() : {};

      const followingIds = myData.followingIds || [];

      const isFollowing = followingIds.includes(uid);

      followBtn.textContent = isFollowing ? "Following" : "Follow";

      followBtn.classList.toggle("followingBtn", isFollowing);
    }
  } catch (error) {
    console.error("Open user profile error:", error);

    alert("Profile failed: " + error.message);
  }
}
// ======================================
// FOLLOW / UNFOLLOW
// ======================================

$("followBtn")?.addEventListener("click", async () => {
  if (!App.user || !viewedProfileUid || viewedProfileUid === App.user.uid) {
    return;
  }

  const followBtn = $("followBtn");

  try {
    followBtn.disabled = true;

    const myRef = doc(db, "users", App.user.uid);

    const targetRef = doc(db, "users", viewedProfileUid);

    const mySnap = await getDoc(myRef);

    const targetSnap = await getDoc(targetRef);

    if (!mySnap.exists() || !targetSnap.exists()) {
      return;
    }

    const myData = mySnap.data();

    const targetData = targetSnap.data();

    let followingIds = myData.followingIds || [];

    let followerIds = targetData.followerIds || [];

    const alreadyFollowing = followingIds.includes(viewedProfileUid);

    if (alreadyFollowing) {
      // ======================
      // UNFOLLOW
      // ======================

      followingIds = followingIds.filter((id) => id !== viewedProfileUid);

      followerIds = followerIds.filter((id) => id !== App.user.uid);
    } else {
      // ======================
      // FOLLOW
      // ======================

      if (!followingIds.includes(viewedProfileUid)) {
        followingIds.push(viewedProfileUid);
      }

      if (!followerIds.includes(App.user.uid)) {
        followerIds.push(App.user.uid);
      }
    }

    await setDoc(
      myRef,
      {
        followingIds: followingIds,

        following: followingIds.length,
      },
      {
        merge: true,
      }
    );

    await setDoc(
      targetRef,
      {
        followerIds: followerIds,

        followers: followerIds.length,
      },
      {
        merge: true,
      }
    );

    // ======================
    // UPDATE UI
    // ======================

    $("followingCount").textContent = followingIds.length;

    $("followersCount").textContent = followerIds.length;

    const isNowFollowing = followingIds.includes(viewedProfileUid);

    followBtn.textContent = isNowFollowing ? "Following" : "Follow";

    followBtn.classList.toggle("followingBtn", isNowFollowing);
  } catch (error) {
    console.error("Follow error:", error);

    alert("Follow failed: " + error.message);
  } finally {
    followBtn.disabled = false;
  }
});

// ======================
// EDIT PROFILE OPEN
// ======================

$("editProfileBtn")?.addEventListener("click", () => {
  if (!App.user) {
    alert("Please login first.");

    return;
  }

  if (!App.profile) {
    alert("Profile not loaded yet.");

    return;
  }

  $("editName").value = App.profile.name || "";

  $("editUsername").value = App.profile.username || "";

  $("editBio").value = App.profile.bio || "";

  show("editProfileModal");
});

// ======================
// CANCEL EDIT
// ======================

$("cancelEdit")?.addEventListener("click", () => {
  hide("editProfileModal");
});

// ======================
// SAVE PROFILE
// ======================

$("saveEdit")?.addEventListener("click", async () => {
  if (!App.user) {
    alert("Please login first.");

    return;
  }

  const name = $("editName").value.trim();

  const username = $("editUsername").value.trim().replace(/^@/, "");

  const bio = $("editBio").value.trim();

  if (!name) {
    alert("Name cannot be empty.");

    return;
  }

  try {
    const old = App.profile || {};

    const newProfile = {
      uid: App.user.uid,

      name: name,

      username: username || App.user.uid.substring(0, 8),

      bio: bio,

      photo: old.photo || "default-profile.png",

      cover: old.cover || "default-cover.jpg",

      followers: old.followers || 0,

      following: old.following || 0,

      posts: old.posts || 0,

      email: App.user.email || "",
    };

    // Create OR update document
    await setDoc(doc(db, "users", App.user.uid), newProfile, {
      merge: true,
    });

    // Firebase Auth display name
    await updateProfile(App.user, {
      displayName: name,
    });

    App.profile = {
      ...old,
      ...newProfile,
    };

    updateProfileUI();

    hide("editProfileModal");

    alert("Profile updated successfully!");
  } catch (error) {
    console.error(error);

    alert("Profile update failed: " + error.message);
  }
});

// ======================
// UPLOAD PROFILE IMAGE
// ======================
async function uploadProfileImage(file, type) {
  if (!App.user || !file) {
    return;
  }

  try {
    showLoading();

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "friendsbook_upload");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/d22vlgls/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        "Cloudinary upload failed: " + response.status
      );
    }

    const data = await response.json();

    const url = data.secure_url;

    const field =
      type === "profile"
        ? "photo"
        : "cover";


    // =====================================
    // UPDATE USER PROFILE
    // =====================================

    await setDoc(
      doc(db, "users", App.user.uid),
      {
        [field]: url,
      },
      {
        merge: true,
      }
    );


    App.profile = {
      ...App.profile,
      [field]: url,
    };


    // =====================================
    // PROFILE PHOTO CHANGE
    // UPDATE OLD POSTS / COMMENTS / REPLIES
    // =====================================

    if (type === "profile") {

      const postsSnapshot =
        await getDocs(
          collection(db, "posts")
        );


      const updatePromises = [];


      postsSnapshot.forEach((postDoc) => {

        const postData = postDoc.data();

        // শুধু নিজের পোস্টগুলো
        if (postData.uid !== App.user.uid) {
          return;
        }


        const updateData = {
          photo: url
        };


        // -------------------------------
        // Comments
        // -------------------------------

        if (
          Array.isArray(postData.comments)
        ) {

          const updatedComments =
            postData.comments.map(
              (comment) => {

                const updatedComment = {
                  ...comment
                };


                // নিজের comment
                if (
                  comment.uid ===
                  App.user.uid
                ) {
                  updatedComment.photo = url;
                }


                // -------------------------
                // Replies
                // -------------------------

                if (
                  Array.isArray(
                    comment.replies
                  )
                ) {

                  updatedComment.replies =
                    comment.replies.map(
                      (reply) => {

                        if (
                          reply.uid ===
                          App.user.uid
                        ) {

                          return {
                            ...reply,
                            photo: url
                          };

                        }

                        return reply;

                      }
                    );

                }


                return updatedComment;

              }
            );


          updateData.comments =
            updatedComments;

        }


        updatePromises.push(
          updateDoc(
            doc(
              db,
              "posts",
              postDoc.id
            ),
            updateData
          )
        );

      });


      await Promise.all(
        updatePromises
      );

    }


    // =====================================
    // UPDATE UI
    // =====================================

    const savedProfileUid =
    localStorage.getItem("fb_viewed_profile_uid");

if (
    savedProfileUid &&
    savedProfileUid !== App.user.uid
) {
    await openUserProfile(savedProfileUid);
} else {
    updateProfileUI();
    await loadPosts();
}


    alert(
      type === "profile"
        ? "Profile photo updated!"
        : "Cover photo updated!"
    );


  } catch (error) {

    console.error(
      "Profile image update error:",
      error
    );

    alert(
      "Image upload failed: " +
      error.message
    );

  } finally {

    hideLoading();

  }
}
// ======================
// PROFILE PHOTO BUTTON
// ======================

$("profileInput")?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  await uploadProfileImage(file, "profile");

  event.target.value = "";
});

// ======================
// COVER PHOTO BUTTON
// ======================

$("coverInput")?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  await uploadProfileImage(file, "cover");

  event.target.value = "";
});
// ======================================
// PART 8B
// PROFILE POSTS + PROFILE STATS
// ======================================

// ======================
// LOAD MY PROFILE POSTS
// ======================

async function loadProfilePosts() {
  if (!App.user) return;

  try {
    const targetUid =
      viewedProfileUid && viewedProfileUid !== App.user.uid
        ? viewedProfileUid
        : App.user.uid;

    const q = query(collection(db, "posts"), where("uid", "==", targetUid));

    const snap = await getDocs(q);

    const myPosts = [];

    snap.forEach((item) => {
      myPosts.push({
        id: item.id,
        ...item.data(),
      });
    });

    // Newest first
    myPosts.sort((a, b) => {
      const aTime = a.time?.toMillis?.() || 0;

      const bTime = b.time?.toMillis?.() || 0;

      return bTime - aTime;
    });

    $("postsCount").textContent = myPosts.length;

    // Only update the logged-in user's profile document when
    // we are actually viewing our own profile.
    if (targetUid === App.user.uid) {
      await setDoc(
        doc(db, "users", App.user.uid),
        {
          posts: myPosts.length,
        },
        {
          merge: true,
        }
      );

      App.profile = {
        ...App.profile,
        posts: myPosts.length,
      };
    }

    renderProfilePosts(myPosts);
  } catch (error) {
    console.error("Profile posts error:", error);

    alert("Profile posts failed: " + error.message);
  }
}

// ======================
// RENDER PROFILE POSTS
// ======================
function renderProfilePosts(myPosts) {
  const box = $("profilePosts");

  if (!box) return;

  if (!myPosts.length) {
    box.innerHTML = ` <div class="card" style=" padding:25px; text-align:center; margin-top:15px; "> <div style=" font-size:40px; margin-bottom:10px; "> 📝 </div> <strong>No posts yet</strong> <p> Your posts will appear here. </p> </div> `;

    return;
  }

  box.innerHTML = ` <h3 style=" margin:20px 0 10px; "> My Posts </h3> `;

  myPosts.forEach((post) => {
    const comments = post.comments || [];

    const reactions = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,

      ...(post.reactions || {}),
    };

    const myReaction = post.userReactions?.[App.user?.uid] || null;

    const reactionInfo = {
      like: {
        emoji: "👍",
        name: "Like",
      },

      love: {
        emoji: "❤️",
        name: "Love",
      },

      haha: {
        emoji: "😂",
        name: "Haha",
      },

      wow: {
        emoji: "😮",
        name: "Wow",
      },

      sad: {
        emoji: "😢",
        name: "Sad",
      },

      angry: {
        emoji: "😡",
        name: "Angry",
      },
    };

    const selected = reactionInfo[myReaction];

    const reactionCount = Object.values(reactions).reduce(
      (total, count) => total + (Number(count) || 0),
      0
    );

    const buttonText = selected
      ? `${selected.emoji} ${selected.name} ${reactionCount}`
      : `👍 Like ${reactionCount}`;

    const likeClass = myReaction === "like" ? "likeBtn activeLike" : "likeBtn";

    box.innerHTML += ` <div class="postCard" id="profile-post-${ post.id }" style="margin-bottom:15px;" > <!-- POST HEADER --> <div class="post-header"> <img class="post-profile" src="${ post.photo || "default-profile.png" }" onclick=" openUserProfile( '${ post.uid }' ) " style="cursor:pointer;" > <div class="post-user" onclick=" openUserProfile( '${ post.uid }' ) " style="cursor:pointer;" > <h4> ${escapeHTML( post.name || App.profile?.name || "User" )} </h4> <small> Just now </small> </div> <button class="postMenuBtn" onclick=" openPostMenu( '${ post.id }' ) " > ⋮ </button> </div> <!-- POST TEXT --> ${ post.text ? ` <p class="postText"> ${escapeHTML(post.text)} </p> ` : "" } <!-- POST IMAGE --> ${ post.image ? ` <img src="${post.image}" class="postImage" onclick=" openImage( '${post.image}' ) " > ` : "" } <!-- POST ACTIONS --> <div class="postActions"> <button class="${likeClass}" onclick=" handleLikeClick( '${ post.id }' ) " onpointerdown=" startReaction( event, '${ post.id }' ) " onpointerup=" endReaction() " onpointerleave=" endReaction() " onpointercancel=" endReaction() " > ${buttonText} </button> <button onclick=" window.openPostComments( '${ post.id }' ) " > 💬 ${comments.length} </button> <button onclick=" sharePost( '${ post.id }' ) " > ↗ Share </button> </div> </div> `;
  });
}

// ======================
// PROFILE PAGE OPEN
// ======================

async function openMyProfile() {
  viewedProfileUid = null;
  localStorage.removeItem("fb_viewed_profile_uid");

  openPage("profilePage");

  updateProfileUI();

  await loadProfilePosts();
}

// ======================
// PROFILE BUTTONS
// ======================

$("menuProfileBtn")?.removeEventListener("click", () => {});

$("menuProfileBtn")?.addEventListener("click", async () => {
  await openMyProfile();
});

$("headerProfile")?.addEventListener("click", async () => {
  await openMyProfile();
});

// ======================
// PROFILE TAB BUTTONS
// ======================

const profileTabs = document.querySelectorAll(".profileTabs button");

profileTabs.forEach((button, index) => {
  button.addEventListener("click", async () => {
    profileTabs.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    if (index === 0) {
      // All
      await loadProfilePosts();
    } else if (index === 1) {
      // Posts
      await loadProfilePosts();
    } else if (index === 2) {
      // Photos
      renderProfilePhotos();
    } else if (index === 3) {
      // Reels
      renderProfileReels();
    } else if (index === 4) {
      // More
      renderProfileMore();
    }
  });
});

// ======================
// PHOTOS TAB
// ======================

function renderProfilePhotos() {
  const box = $("profilePosts");

  if (!box) return;

  const photos = posts.filter(
    (post) => post.uid === App.user.uid && post.image && !post.video
  );

  if (!photos.length) {
    box.innerHTML = ` <div class="card" style=" padding:25px; text-align:center; "> 📷 No photos yet </div> `;

    return;
  }

  box.innerHTML = ` <h3 style=" margin:20px 0 10px; " > Photos </h3> <div style=" display:grid; grid-template-columns: repeat(2,1fr); gap:10px; " > ${photos .map( (post) => ` <img src="${post.image}" style=" width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; " onclick=" openImage( '${post.image}' ) " > ` ) .join("")} </div> `;
}

// ======================
// REELS TAB
// ======================

function renderProfileReels() {
  const box = $("profilePosts");

  if (!box) return;

  box.innerHTML = ` <div class="card" style=" padding:25px; text-align:center; "> 🎬 <h3> My Reels </h3> <p> Reels system will connect here. </p> </div> `;
}

// ======================
// MORE TAB
// ======================

function renderProfileMore() {
  const box = $("profilePosts");

  if (!box) return;

  box.innerHTML = ` <div class="card" style=" padding:25px; margin-top:15px; "> <h3> More </h3> <p> 👥 Friends </p> <p> ❤️ Reactions </p> <p> 🔖 Saved Posts </p> </div> `;
}
// ======================================
// Part 5
// UI System
// ======================================

// ======================
// Dark Mode
// ======================

function applyDarkMode() {
  if (App.dark) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  localStorage.setItem("fb_dark", App.dark);
}

App.dark = localStorage.getItem("fb_dark") === "true";

applyDarkMode();

$("menuDarkBtn")?.addEventListener("click", () => {
  App.dark = !App.dark;

  applyDarkMode();
});

// ======================
// Toast
// ======================

function toast(text) {
  const box = $("toast");

  const txt = $("toastText");

  if (!box || !txt) return;

  txt.textContent = text;

  box.classList.remove("hidden");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 2500);
}

// ======================
// Global Loading
// ======================

function showLoading() {
  show("globalLoading");
}

function hideLoading() {
  hide("globalLoading");
}

// ======================
// Message Modal
// ======================

function message(title, text) {
  $("messageTitle").textContent = title;

  $("messageText").textContent = text;

  show("messageModal");
}
$("profilePhoto")?.addEventListener("click", () => {
  openImage($("profilePhoto").src);
});

$("coverPhoto")?.addEventListener("click", () => {
  openImage($("coverPhoto").src);
});
$("messageOkBtn")?.addEventListener("click", () => {
  hide("messageModal");
});
// ======================================
// Part 6
// Header + Preview System
// ======================================

// ======================
// Image Viewer
// ======================

function openImage(src) {
  if (!src) return;

  $("previewImage").src = src;

  show("imageViewer");
}

function closeImage() {
  $("previewImage").src = "";

  hide("imageViewer");
}

$("closeImageViewer")?.addEventListener("click", closeImage);

$("imageViewer")?.addEventListener("click", (e) => {
  if (e.target.id === "imageViewer") {
    closeImage();
  }
});

// ======================
// Video Viewer
// ======================

function openVideo(src) {
  if (!src) return;

  $("previewVideo").src = src;

  show("videoViewer");
}

function closeVideo() {
  $("previewVideo").pause();

  $("previewVideo").src = "";

  hide("videoViewer");
}

$("closeVideoViewer")?.addEventListener("click", closeVideo);

$("videoViewer")?.addEventListener("click", (e) => {
  if (e.target.id === "videoViewer") {
    closeVideo();
  }
});

// ======================
// Header Buttons
// ======================

$("searchBtn")?.addEventListener("click", () => {
  const text = $("searchInput").value.trim();

  if (!text) {
    toast("Write something to search");

    return;
  }

  toast("Searching: " + text);
});

$("messengerBtn")?.addEventListener("click", () => {
  openPage("messengerPage");
});

$("notificationBtn")?.addEventListener("click", () => {
  openPage("notificationPage");
});

$("headerProfile")?.addEventListener("click", () => {
  openPage("profilePage");
});

// ======================
// Search Enter Key
// ======================

$("searchInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    $("searchBtn").click();
  }
});

// ======================================
// PART 7 - FRIENDSBOOK POST SYSTEM
// ======================================

let posts = [];

let reactionTimer = null;
let reactionOpened = false;

// ======================
// LOAD POSTS
// ======================

async function loadPosts() {
  try {
    const q = query(collection(db, "posts"), orderBy("time", "desc"));

    const snap = await getDocs(q);

    posts = [];

    snap.forEach((item) => {
      posts.push({
        id: item.id,
        ...item.data(),
      });
    });

    renderFeed();

    if ($("profilePage") && !$("profilePage").classList.contains("hidden")) {
      await loadProfilePosts();
    }
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

// ======================
// CREATE POST
// ======================

async function createPost(text, image = "") {
  try {
    await addDoc(collection(db, "posts"), {
      uid: App.user.uid,

      name: App.profile?.name || App.user.displayName || "User",

      photo: App.profile?.photo || "default-profile.png",

      text: text,

      image: image,

      likes: 0,

      reactions: {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      },
      userReactions: {},
      comments: [],

      time: serverTimestamp(),
    });

    await loadPosts();
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

// ======================
// POST BUTTON + CLOUDINARY IMAGE UPLOAD
// ======================

$("postBtn")?.addEventListener("click", async () => {
  const input = $("postText");
  const imageInput = $("postImage");

  const text = input.value.trim();

  const file = imageInput?.files?.[0] || null;

  // Text অথবা Image যেকোনো একটি থাকলেই Post হবে
  if (!text && !file) {
    alert("Write something or select a photo.");

    return;
  }

  try {
    showLoading();

    let imageURL = "";

    // ==========================
    // CLOUDINARY IMAGE UPLOAD
    // ==========================

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image.");

        return;
      }

      imageURL = await uploadToCloudinary(file);
    }

    // ==========================
    // SAVE POST TO FIRESTORE
    // ==========================

    await createPost(text, imageURL);

    // Clear composer
    input.value = "";

    if (imageInput) {
      imageInput.value = "";
    }
  } catch (error) {
    console.error("Post upload error:", error);

    alert("Post failed: " + error.message);
  } finally {
    hideLoading();
  }
});

// ======================
// RENDER FEED
// ======================

function renderFeed() {
  const feed = $("feedContainer");

  if (!feed) return;

  feed.innerHTML = "";

  posts.forEach((post) => {
    const comments = post.comments || [];

    const reactions = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,
      ...(post.reactions || {}),
    };

    const myReaction = post.userReactions?.[App.user?.uid] || null;

    const reactionInfo = {
      like: {
        emoji: "👍",
        name: "Like",
      },

      love: {
        emoji: "❤️",
        name: "Love",
      },

      haha: {
        emoji: "😂",
        name: "Haha",
      },

      wow: {
        emoji: "😮",
        name: "Wow",
      },

      sad: {
        emoji: "😢",
        name: "Sad",
      },

      angry: {
        emoji: "😡",
        name: "Angry",
      },
    };

    const selected = reactionInfo[myReaction];

    const reactionCount = Object.values(reactions).reduce(
      (total, count) => total + (Number(count) || 0),
      0
    );

    const buttonText = selected
      ? `${selected.emoji} ${selected.name} ${reactionCount}`
      : `👍 Like ${reactionCount}`;

    const likeClass = myReaction === "like" ? "likeBtn activeLike" : "likeBtn";

    const isOwnPost = post.uid === App.user?.uid;

    const isFollowing = (App.profile?.followingIds || []).includes(post.uid);

    const showFollowButton = !isOwnPost && !isFollowing;

    feed.innerHTML += ` <div class="postCard" id="post-${ post.id }" > <!-- POST HEADER --> <div class="post-header"> <img
    class="post-profile"
    src="${
        post.uid === App.user?.uid
            ? (App.profile?.photo || "default-profile.png")
            : (post.photo || "default-profile.png")
    }" onclick=" openUserProfile( '${ post.uid }' ) " style="cursor:pointer;" > <div class="post-user" onclick=" openUserProfile( '${ post.uid }' ) " style=" cursor:pointer; flex:1; " > <h4> ${escapeHTML( post.name || "User" )} </h4> <small> Just now </small> </div> ${ showFollowButton ? ` <button type="button" class="feedFollowBtn" onclick=" event.stopPropagation(); toggleFollowFromList( '${post.uid}', this ) " style=" border:none; background:#6c63ff; color:white; border-radius:8px; padding:6px 10px; font-weight:600; cursor:pointer; margin-right:8px; " > Follow </button> ` : "" } <button class="postMenuBtn" onclick=" openPostMenu( '${ post.id }' ) " > ⋮ </button> </div> <!-- POST TEXT --> ${ post.text ? ` <p class="postText"> ${escapeHTML(post.text)} </p> ` : "" } <!-- POST IMAGE --> ${ post.image ? ` <img src="${post.image}" class="postImage" onclick=" openImage( '${post.image}' ) " > ` : "" } <!-- POST ACTIONS --> <div class="postActions"> <button class="${likeClass}" onclick=" handleLikeClick( '${ post.id }' ) " onpointerdown=" startReaction( event, '${ post.id }' ) " onpointerup=" endReaction() " onpointerleave=" endReaction() " onpointercancel=" endReaction() " > ${buttonText} </button> <button onclick=" openPostComments( '${ post.id }' ) " > 💬 ${comments.length} </button> <button onclick=" sharePost( '${ post.id }' ) " > ↗ Share </button> </div> </div> `;
  });
}

// ======================================
// FOLLOW FROM HOME / COMMENTS
// ======================================

async function toggleFollowFromList(targetUid, button) {
  if (!App.user || !targetUid) return;

  // নিজের profile-কে follow করা যাবে না
  if (targetUid === App.user.uid) return;

  try {
    if (button) {
      button.disabled = true;
    }

    const myRef = doc(db, "users", App.user.uid);

    const targetRef = doc(db, "users", targetUid);

    const mySnap = await getDoc(myRef);

    const targetSnap = await getDoc(targetRef);

    if (!mySnap.exists() || !targetSnap.exists()) {
      return;
    }

    const myData = mySnap.data();

    const targetData = targetSnap.data();

    let followingIds = [...(myData.followingIds || [])];

    let followerIds = [...(targetData.followerIds || [])];

    const alreadyFollowing = followingIds.includes(targetUid);

    if (alreadyFollowing) {
      // ==========================
      // UNFOLLOW
      // ==========================

      followingIds = followingIds.filter((id) => id !== targetUid);

      followerIds = followerIds.filter((id) => id !== App.user.uid);
    } else {
      // ==========================
      // FOLLOW
      // ==========================

      if (!followingIds.includes(targetUid)) {
        followingIds.push(targetUid);
      }

      if (!followerIds.includes(App.user.uid)) {
        followerIds.push(App.user.uid);
      }
    }

    // ==========================
    // SAVE MY FOLLOWING
    // ==========================

    await setDoc(
      myRef,
      {
        followingIds: followingIds,

        following: followingIds.length,
      },
      {
        merge: true,
      }
    );

    // ==========================
    // SAVE TARGET FOLLOWERS
    // ==========================

    await setDoc(
      targetRef,
      {
        followerIds: followerIds,

        followers: followerIds.length,
      },
      {
        merge: true,
      }
    );

    // ==========================
    // UPDATE CURRENT APP PROFILE
    // ==========================

    App.profile = {
      ...App.profile,

      followingIds: followingIds,

      following: followingIds.length,
    };

    // ==========================
    // REFRESH HOME FEED
    // ==========================

    await loadPosts();

    // Refresh the Comments page immediately if it is open
    if (currentCommentsPostId) {
      const updatedCommentPost = posts.find(
        (p) => p.id === currentCommentsPostId
      );

      if (updatedCommentPost) {
        renderCommentsPage(updatedCommentPost);
      }
    }
  } catch (error) {
    console.error("Follow error:", error);

    alert("Follow failed: " + error.message);
  } finally {
    if (button) {
      button.disabled = false;
    }
  }
}
// ======================
// COMMENT HTML
// ======================

function renderComment(postId, comment, commentIndex) {
  const reactions = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0,

    ...(comment.reactions || {}),
  };

  const replies = comment.replies || [];

  const myReaction = comment.userReactions?.[App.user?.uid] || null;

  const reactionInfo = {
    like: {
      emoji: "👍",
      name: "Like",
    },

    love: {
      emoji: "❤️",
      name: "Love",
    },

    haha: {
      emoji: "😂",
      name: "Haha",
    },

    wow: {
      emoji: "😮",
      name: "Wow",
    },

    sad: {
      emoji: "😢",
      name: "Sad",
    },

    angry: {
      emoji: "😡",
      name: "Angry",
    },
  };

  const selected = reactionInfo[myReaction];

  const buttonText = selected
    ? `${selected.emoji} ${selected.name}`
    : `👍 Like`;

  const likeClass = myReaction === "like" ? "likeBtn activeLike" : "likeBtn";

  const isOwnComment = comment.uid === App.user?.uid;

  const isFollowingCommentUser = (App.profile?.followingIds || []).includes(
    comment.uid
  );

  const showCommentFollow =
    comment.uid && !isOwnComment && !isFollowingCommentUser;

  return ` <div class="commentBox"> <img
    src="${
        comment.uid === App.user?.uid
            ? (App.profile?.photo || "default-profile.png")
            : (comment.photo || "default-profile.png")
    }"
    class="commentPhoto"
> <div class="commentContent"> <div style=" display:flex; align-items:center; gap:8px; flex-wrap:wrap; " > <b onclick=" openUserProfile( '${ comment.uid }' ) " style=" cursor:pointer; " > ${escapeHTML( comment.name || "User" )} </b> ${ showCommentFollow ? ` <button type="button" onclick=" event.stopPropagation(); toggleFollowFromList( '${comment.uid}', this ) " style=" border:none; background:#6c63ff; color:white; border-radius:7px; padding:4px 9px; font-size:12px; font-weight:600; cursor:pointer; " > Follow </button> ` : "" } </div> <small> ${ comment.time || "Just now" } </small> <div class="commentActions"> <button class="${likeClass}" onclick=" handleCommentLikeClick( '${postId}', ${commentIndex} ) " onpointerdown=" startCommentReaction( event, '${postId}', ${commentIndex} ) " onpointerup=" endCommentReaction() " onpointerleave=" endCommentReaction() " onpointercancel=" endCommentReaction() " > ${buttonText} </button> <button onclick=" replyComment( '${postId}', ${commentIndex} ) " > ↩ Reply </button> </div> ${ replies.length ? replies .map((reply, replyIndex) => renderReply(postId, commentIndex, reply, replyIndex) ) .join("") : "" } </div> </div> `;
}

// ======================
// REPLY HTML
// ======================

function renderReply(postId, commentIndex, reply, replyIndex) {
  const reactions = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0,

    ...(reply.reactions || {}),
  };

  const myReaction = reply.userReactions?.[App.user?.uid] || null;

  const reactionInfo = {
    like: {
      emoji: "👍",
      name: "Like",
    },

    love: {
      emoji: "❤️",
      name: "Love",
    },

    haha: {
      emoji: "😂",
      name: "Haha",
    },

    wow: {
      emoji: "😮",
      name: "Wow",
    },

    sad: {
      emoji: "😢",
      name: "Sad",
    },

    angry: {
      emoji: "😡",
      name: "Angry",
    },
  };

  const selected = reactionInfo[myReaction];

  const buttonText = selected
    ? `${selected.emoji} ${selected.name}`
    : `👍 Like`;

  const likeClass = myReaction === "like" ? "likeBtn activeLike" : "likeBtn";

  return ` <div class="replyBox"> <img src="${ reply.photo || "default-profile.png" }" class="commentPhoto" > <div> <b> ${escapeHTML( reply.name || "User" )} </b> <div> ${escapeHTML(reply.text || "")} </div> <small> ${ reply.time || "Just now" } </small> <div class="commentActions"> <button class="${likeClass}" onclick=" handleReplyLikeClick( '${postId}', ${commentIndex}, ${replyIndex} ) " onpointerdown=" startReplyReaction( event, '${postId}', ${commentIndex}, ${replyIndex} ) " onpointerup=" endReplyReaction() " onpointerleave=" endReplyReaction() " onpointercancel=" endReplyReaction() " > ${buttonText} </button> </div> </div> </div> `;
}

// ======================
// LIKE
// ======================

async function likePost(postId) {
  if (!App.user) return;

  try {
    const postRef = doc(db, "posts", postId);

    const snap = await getDoc(postRef);

    if (!snap.exists()) return;

    const post = snap.data();

    const reactions = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,
      ...(post.reactions || {}),
    };

    const userReactions = {
      ...(post.userReactions || {}),
    };

    const uid = App.user.uid;

    const oldReaction = userReactions[uid] || null;

    // Already Like করলে কিছু হবে না
    if (oldReaction === "like") {
      return;
    }

    // পুরোনো reaction থাকলে সেটা কমাও
    if (oldReaction) {
      reactions[oldReaction] = Math.max(0, (reactions[oldReaction] || 0) - 1);
    }

    // নতুন Like
    reactions.like = (reactions.like || 0) + 1;

    userReactions[uid] = "like";

    await updateDoc(postRef, {
      reactions: reactions,

      userReactions: userReactions,

      likes: reactions.like,
    });

    await loadPosts();
  } catch (e) {
    console.error(e);

    alert(e.message);
  }
}
// ======================
// LONG PRESS REACTION
// ======================

function startReaction(event, postId) {
  reactionOpened = false;

  const button = event.currentTarget;

  const rect = button.getBoundingClientRect();

  reactionTimer = setTimeout(() => {
    reactionOpened = true;

    showReactionMenu(rect, postId);
  }, 550);
}

function endReaction() {
  if (reactionTimer) {
    clearTimeout(reactionTimer);

    reactionTimer = null;
  }
}

function handleLikeClick(postId) {
  if (reactionOpened) {
    reactionOpened = false;

    return;
  }

  likePost(postId);
}

// ======================
// REACTION MENU
// ======================

function showReactionMenu(rect, postId) {
  closeReactionMenu();

  const menu = document.createElement("div");

  menu.id = "reactionMenu";

  menu.innerHTML = ` <button onclick="sendReaction( '${postId}', 'like' )" > 👍 </button> <button onclick="sendReaction( '${postId}', 'love' )" > ❤️ </button> <button onclick="sendReaction( '${postId}', 'haha' )" > 😂 </button> <button onclick="sendReaction( '${postId}', 'wow' )" > 😮 </button> <button onclick="sendReaction( '${postId}', 'sad' )" > 😢 </button> <button onclick="sendReaction( '${postId}', 'angry' )" > 😡 </button> `;

  document.body.appendChild(menu);

  menu.style.left = Math.max(10, rect.left - 20) + "px";

  menu.style.top = Math.max(10, rect.top - 65) + "px";
}

function closeReactionMenu() {
  const old = $("reactionMenu");

  if (old) {
    old.remove();
  }
}

// ======================
// SEND POST REACTION
// ======================

async function sendReaction(postId, type) {
  closeReactionMenu();

  if (!App.user) return;

  try {
    const postRef = doc(db, "posts", postId);

    const snap = await getDoc(postRef);

    if (!snap.exists()) return;

    const post = snap.data();

    const reactions = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,
      ...(post.reactions || {}),
    };

    const userReactions = {
      ...(post.userReactions || {}),
    };

    const uid = App.user.uid;

    const oldReaction = userReactions[uid] || null;

    // একই reaction আবার দিলে কিছু করবে না
    if (oldReaction === type) {
      return;
    }

    // আগের reaction কমাও
    if (oldReaction) {
      reactions[oldReaction] = Math.max(0, (reactions[oldReaction] || 0) - 1);
    }

    // নতুন reaction বাড়াও
    reactions[type] = (reactions[type] || 0) + 1;

    userReactions[uid] = type;

    await updateDoc(postRef, {
      reactions: reactions,

      userReactions: userReactions,

      likes: reactions.like,
    });

    await loadPosts();
  } catch (e) {
    console.error(e);

    alert(e.message);
  }
}

// ======================
// COMMENT
// ======================

async function commentPost(postId) {
  const text = prompt("Write a comment");

  if (!text) return;

  try {
    await updateDoc(doc(db, "posts", postId), {
      comments: arrayUnion({
        uid: App.user.uid,

        name: App.profile?.name || App.user.displayName || "User",

        photo: App.profile?.photo || "default-profile.png",

        text: text,

        time: new Date().toLocaleString(),

        reactions: {
          like: 0,
          love: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0,
        },

        replies: [],
      }),
    });

    await loadPosts();
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

// ======================
// COMMENT REACTION
// ======================

async function reactComment(postId, commentIndex, type) {
  if (!App.user) return;

  try {
    const post = posts.find((p) => p.id === postId);

    if (!post) return;

    const comments = [...(post.comments || [])];

    const comment = {
      ...comments[commentIndex],
    };

    const reactions = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,

      ...(comment.reactions || {}),
    };

    const userReactions = {
      ...(comment.userReactions || {}),
    };

    const uid = App.user.uid;

    const oldReaction = userReactions[uid] || null;

    // একই reaction আবার দিলে কিছু হবে না
    if (oldReaction === type) {
      return;
    }

    // আগের reaction থাকলে count কমবে
    if (oldReaction) {
      reactions[oldReaction] = Math.max(0, (reactions[oldReaction] || 0) - 1);
    }

    // নতুন reaction
    reactions[type] = (reactions[type] || 0) + 1;

    userReactions[uid] = type;

    comment.reactions = reactions;

    comment.userReactions = userReactions;

    comments[commentIndex] = comment;

    await updateDoc(doc(db, "posts", postId), {
      comments: comments,
    });

    await loadPosts();
    const updatedPost = posts.find((p) => p.id === postId);

    if (updatedPost && currentCommentsPostId === postId) {
      renderCommentsPage(updatedPost);
    }
  } catch (e) {
    console.error(e);

    alert(e.message);
  }
}
let commentReactionTimer = null;

let commentReactionOpened = false;

function startCommentReaction(event, postId, commentIndex) {
  commentReactionOpened = false;

  const button = event.currentTarget;

  const rect = button.getBoundingClientRect();

  commentReactionTimer = setTimeout(() => {
    commentReactionOpened = true;

    showCommentReactionMenu(rect, postId, commentIndex);
  }, 550);
}

function endCommentReaction() {
  if (commentReactionTimer) {
    clearTimeout(commentReactionTimer);

    commentReactionTimer = null;
  }
}

function handleCommentLikeClick(postId, commentIndex) {
  if (commentReactionOpened) {
    commentReactionOpened = false;

    return;
  }

  reactComment(postId, commentIndex, "like");
}
function showCommentReactionMenu(rect, postId, commentIndex) {
  closeCommentReactionMenu();

  const menu = document.createElement("div");

  menu.id = "commentReactionMenu";

  menu.innerHTML = ` <button onclick=" reactComment( '${postId}', ${commentIndex}, 'like' ); closeCommentReactionMenu(); " > 👍 </button> <button onclick=" reactComment( '${postId}', ${commentIndex}, 'love' ); closeCommentReactionMenu(); " > ❤️ </button> <button onclick=" reactComment( '${postId}', ${commentIndex}, 'haha' ); closeCommentReactionMenu(); " > 😂 </button> <button onclick=" reactComment( '${postId}', ${commentIndex}, 'wow' ); closeCommentReactionMenu(); " > 😮 </button> <button onclick=" reactComment( '${postId}', ${commentIndex}, 'sad' ); closeCommentReactionMenu(); " > 😢 </button> <button onclick=" reactComment( '${postId}', ${commentIndex}, 'angry' ); closeCommentReactionMenu(); " > 😡 </button> `;

  document.body.appendChild(menu);

  menu.style.position = "fixed";

  menu.style.left = Math.max(10, rect.left - 20) + "px";

  menu.style.top = Math.max(10, rect.top - 65) + "px";
}

function closeCommentReactionMenu() {
  const menu = document.getElementById("commentReactionMenu");

  if (menu) {
    menu.remove();
  }
}
// ======================
// REPLY COMMENT
// ======================

async function replyComment(postId, commentIndex) {
  const text = prompt("Write a reply");

  if (!text) return;

  try {
    const post = posts.find((p) => p.id === postId);

    if (!post) return;

    const comments = [...(post.comments || [])];

    const comment = {
      ...comments[commentIndex],
    };

    const replies = [...(comment.replies || [])];

    replies.push({
      uid: App.user.uid,

      name: App.profile?.name || App.user.displayName || "User",

      photo: App.profile?.photo || "default-profile.png",

      text: text,

      time: new Date().toLocaleString(),

      reactions: {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      },
    });

    comment.replies = replies;

    comments[commentIndex] = comment;

    await updateDoc(doc(db, "posts", postId), {
      comments: comments,
    });

    await loadPosts();
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

// ======================
// REPLY REACTION
// ======================

async function reactReply(postId, commentIndex, replyIndex, type) {
  if (!App.user) return;

  try {
    const post = posts.find((p) => p.id === postId);

    if (!post) return;

    const comments = [...(post.comments || [])];

    const comment = {
      ...comments[commentIndex],
    };

    const replies = [...(comment.replies || [])];

    if (!replies[replyIndex]) return;

    const reply = {
      ...replies[replyIndex],
    };

    const reactions = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,

      ...(reply.reactions || {}),
    };

    const userReactions = {
      ...(reply.userReactions || {}),
    };

    const uid = App.user.uid;

    const oldReaction = userReactions[uid] || null;

    if (oldReaction === type) {
      return;
    }

    if (oldReaction) {
      reactions[oldReaction] = Math.max(0, (reactions[oldReaction] || 0) - 1);
    }

    reactions[type] = (reactions[type] || 0) + 1;

    userReactions[uid] = type;

    reply.reactions = reactions;

    reply.userReactions = userReactions;

    replies[replyIndex] = reply;

    comment.replies = replies;

    comments[commentIndex] = comment;

    await updateDoc(doc(db, "posts", postId), {
      comments: comments,
    });

    await loadPosts();
  } catch (e) {
    console.error(e);

    alert(e.message);
  }
}
let replyReactionTimer = null;

let replyReactionOpened = false;

function startReplyReaction(event, postId, commentIndex, replyIndex) {
  replyReactionOpened = false;

  const button = event.currentTarget;

  const rect = button.getBoundingClientRect();

  replyReactionTimer = setTimeout(() => {
    replyReactionOpened = true;

    showReplyReactionMenu(rect, postId, commentIndex, replyIndex);
  }, 550);
}

function endReplyReaction() {
  if (replyReactionTimer) {
    clearTimeout(replyReactionTimer);

    replyReactionTimer = null;
  }
}

function handleReplyLikeClick(postId, commentIndex, replyIndex) {
  if (replyReactionOpened) {
    replyReactionOpened = false;

    return;
  }

  reactReply(postId, commentIndex, replyIndex, "like");
}
function showReplyReactionMenu(rect, postId, commentIndex, replyIndex) {
  closeReactionMenu();

  const menu = document.createElement("div");

  menu.id = "replyReactionMenu";

  menu.innerHTML = ` <button onclick=" reactReply( '${postId}', ${commentIndex}, ${replyIndex}, 'like' ); closeReplyReactionMenu(); " > 👍 </button> <button onclick=" reactReply( '${postId}', ${commentIndex}, ${replyIndex}, 'love' ); closeReplyReactionMenu(); " > ❤️ </button> <button onclick=" reactReply( '${postId}', ${commentIndex}, ${replyIndex}, 'haha' ); closeReplyReactionMenu(); " > 😂 </button> <button onclick=" reactReply( '${postId}', ${commentIndex}, ${replyIndex}, 'wow' ); closeReplyReactionMenu(); " > 😮 </button> <button onclick=" reactReply( '${postId}', ${commentIndex}, ${replyIndex}, 'sad' ); closeReplyReactionMenu(); " > 😢 </button> <button onclick=" reactReply( '${postId}', ${commentIndex}, ${replyIndex}, 'angry' ); closeReplyReactionMenu(); " > 😡 </button> `;

  document.body.appendChild(menu);

  menu.style.position = "fixed";

  menu.style.left = Math.max(10, rect.left - 20) + "px";

  menu.style.top = Math.max(10, rect.top - 65) + "px";
}

function closeReplyReactionMenu() {
  const menu = $("replyReactionMenu");

  if (menu) {
    menu.remove();
  }
}
// ======================
// EDIT POST
// ======================

async function editPost(postId) {
  const post = posts.find((p) => p.id === postId);

  if (!post) return;

  if (post.uid !== App.user.uid) {
    alert("Not your post");

    return;
  }

  const text = prompt("Edit Post", post.text || "");

  if (text === null) return;

  try {
    await updateDoc(doc(db, "posts", postId), {
      text: text,
    });

    await loadPosts();
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

// ======================
// DELETE POST
// ======================

async function deletePost(postId) {
  const post = posts.find((p) => p.id === postId);

  if (!post) return;

  if (post.uid !== App.user.uid) {
    alert("Not your post");

    return;
  }

  if (!confirm("Delete this post?")) return;

  try {
    await deleteDoc(doc(db, "posts", postId));

    await loadPosts();
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

// ======================
// THREE DOT MENU
// ======================

function openPostMenu(postId) {
  const post = posts.find((p) => p.id === postId);

  if (!post) return;

  if (post.uid === App.user.uid) {
    const action = prompt("1 = Edit\n" + "2 = Delete\n" + "3 = Copy Link");

    if (action === "1") {
      editPost(postId);
    } else if (action === "2") {
      deletePost(postId);
    } else if (action === "3") {
      navigator.clipboard?.writeText(location.href);

      alert("Link Copied");
    }
  } else {
    const action = prompt("1 = Report\n" + "2 = Copy Link");

    if (action === "1") {
      alert("Reported");
    } else if (action === "2") {
      navigator.clipboard?.writeText(location.href);

      alert("Link Copied");
    }
  }
}

// ======================
// HELPERS
// ======================

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ======================
// GLOBAL FUNCTIONS
// ======================

window.loadPosts = loadPosts;

window.createPost = createPost;

window.renderFeed = renderFeed;

window.likePost = likePost;

window.startReaction = startReaction;

window.endReaction = endReaction;

window.handleLikeClick = handleLikeClick;

window.sendReaction = sendReaction;

window.commentPost = commentPost;

window.reactComment = reactComment;

window.replyComment = replyComment;

window.reactReply = reactReply;

window.startReplyReaction = startReplyReaction;

window.endReplyReaction = endReplyReaction;

window.handleReplyLikeClick = handleReplyLikeClick;

window.editPost = editPost;

window.openUserProfile = openUserProfile;

window.toggleFollowFromList = toggleFollowFromList;

window.deletePost = deletePost;

window.openPostMenu = openPostMenu;

window.startCommentReaction = startCommentReaction;

window.endCommentReaction = endCommentReaction;

window.handleCommentLikeClick = handleCommentLikeClick;

window.closeCommentReactionMenu = closeCommentReactionMenu;

window.startReplyReaction = startReplyReaction;

window.endReplyReaction = endReplyReaction;

window.handleReplyLikeClick = handleReplyLikeClick;

window.closeReplyReactionMenu = closeReplyReactionMenu;

// ======================================
// COMMENTS PAGE
// ======================================

let currentCommentsPostId = null;

function openCommentsPage(postId) {
  const post = posts.find((p) => p.id === postId);

  if (!post) return;

  currentCommentsPostId = postId;

  localStorage.setItem(
    "fb_comments_post_id",
    postId
  );

  openPage("commentsPage");

  renderCommentsPage(post);
}

function renderCommentsPage(post) {
  const preview = $("commentsPostPreview");

  const list = $("commentsPageList");

  if (!preview || !list) return;

  const comments = post.comments || [];

  preview.innerHTML = ` <div class="commentsPostPreview"> <div class="post-header"> <img class="post-profile" src="${ post.photo || "default-profile.png" }" > <div class="post-user"> <h4> ${escapeHTML( post.name || "User" )} </h4> <small> Just now </small> </div> </div> ${ post.text ? ` <p class="postText"> ${escapeHTML(post.text)} </p> ` : "" } ${ post.image ? ` <img src="${post.image}" class="postImage" onclick=" openImage( '${post.image}' ) " > ` : "" } </div> `;

  list.innerHTML = ` <h3> ${comments.length} ${ comments.length === 1 ? "Comment" : "Comments" } </h3> ${ comments.length ? comments .map((comment, index) => renderComment(post.id, comment, index)) .join("") : ` <div class="noComments"> No comments yet. </div> ` } `;
}

// ======================
// OPEN COMMENTS BUTTON
// ======================

function openPostComments(postId) {
  openCommentsPage(postId);
}

// ======================
// SEND NEW COMMENT
// ======================

$("commentsSendBtn")?.addEventListener("click", async () => {
  const input = $("commentsInput");

  const text = input?.value.trim();

  if (!text) return;

  if (!currentCommentsPostId) return;

  try {
    await updateDoc(
      doc(db, "posts", currentCommentsPostId),

      {
        comments: arrayUnion({
          uid: App.user.uid,

          name: App.profile?.name || App.user.displayName || "User",

          photo: App.profile?.photo || "default-profile.png",

          text: text,

          time: new Date().toLocaleString(),

          reactions: {
            like: 0,
            love: 0,
            haha: 0,
            wow: 0,
            sad: 0,
            angry: 0,
          },

          replies: [],
        }),
      }
    );

    input.value = "";

    await loadPosts();

    const updatedPost = posts.find((p) => p.id === currentCommentsPostId);

    if (updatedPost) {
      renderCommentsPage(updatedPost);
    }
  } catch (e) {
    console.error(e);

    alert("Comment failed: " + e.message);
  }
});

// ======================
// ENTER = SEND COMMENT
// ======================

$("commentsInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    $("commentsSendBtn")?.click();
  }
});

// ======================
// BACK
// ======================

$("backFromComments")?.addEventListener("click", () => {
  currentCommentsPostId = null;

  localStorage.removeItem(
    "fb_comments_post_id"
  );

  openPage("homeContent");
});
// ======================================
// GLOBAL COMMENT BUTTON
// ======================================

window.openPostComments = openPostComments;
// ======================================
// RESTORE LAST PAGE AFTER REFRESH
// ======================================

async function restoreLastPage() {
  if (!App.user) return;

  const lastPage = localStorage.getItem("fb_current_page");
  const savedProfileUid = localStorage.getItem("fb_viewed_profile_uid");
const savedCommentsPostId =
  localStorage.getItem("fb_comments_post_id");
  // Restore the exact other profile after refresh.
  if (
    lastPage === "profilePage" &&
    savedProfileUid &&
    savedProfileUid !== App.user.uid
  ) {
    viewedProfileUid = savedProfileUid;
    await openUserProfile(savedProfileUid);
    return;
  }

  // If profilePage was saved without a valid other-user UID,
  // show the logged-in user's profile.
 if (
  lastPage === "commentsPage" &&
  savedCommentsPostId
) {
  currentCommentsPostId =
    savedCommentsPostId;

  await loadPosts();

  const commentPost =
    posts.find(
      (p) =>
        p.id ===
        savedCommentsPostId
    );

  if (commentPost) {
    openPage("commentsPage");
    renderCommentsPage(commentPost);
    return;
  }

  localStorage.removeItem(
    "fb_comments_post_id"
  );
 }
  if (lastPage === "profilePage") {
    viewedProfileUid = null;
    localStorage.removeItem("fb_viewed_profile_uid");
    await openMyProfile();
    return;
  }

  if (lastPage && pageViews.includes(lastPage)) {
    openPage(lastPage);
  } else {
    openPage("homeContent");
  }
}

setTimeout(() => {
  restoreLastPage();
}, 700);
