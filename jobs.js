// ===============================
// Friendsbook V5
// jobs.js Part 1
// ===============================

import { db, auth } from "./firebase.js";

import {

collection,
addDoc,
serverTimestamp,
query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const jobTitle=document.getElementById("jobTitle");
const companyName=document.getElementById("companyName");
const jobLocation=document.getElementById("jobLocation");
const jobSalary=document.getElementById("jobSalary");
const jobDescription=document.getElementById("jobDescription");
const publishJobBtn=document.getElementById("publishJobBtn");
const jobsFeed=document.getElementById("jobsFeed");

// ===============================
// Publish Job
// ===============================

publishJobBtn.onclick=async()=>{

if(jobTitle.value.trim()===""){

alert("Enter Job Title");

return;

}

await addDoc(

collection(db,"jobs"),

{

title:jobTitle.value,

company:companyName.value,

location:jobLocation.value,

salary:jobSalary.value,

description:jobDescription.value,

publisher:auth.currentUser.email,

applications:0,

createdAt:serverTimestamp()

}

);

jobTitle.value="";
companyName.value="";
jobLocation.value="";
jobSalary.value="";
jobDescription.value="";

alert("Job Published");

};

// ===============================
// Load Jobs
// ===============================

const jobsQuery=query(

collection(db,"jobs"),

orderBy("createdAt","desc")

);

onSnapshot(jobsQuery,(snapshot)=>{

jobsFeed.innerHTML="";

snapshot.forEach((doc)=>{

const job=doc.data();

const jobId=doc.id;

jobsFeed.innerHTML+=`

<div class="jobCard">

<h3>${job.title}</h3>

<p>${job.company}</p>

<p>${job.location}</p>

<p>Salary : ${job.salary}</p>

<p>${job.description}</p>

<button onclick="applyJob('${jobId}')">

Apply

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// jobs.js Part 2
// ===============================

import {

doc,
updateDoc,
increment,
deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Apply Job
// ===============================

window.applyJob=async(jobId)=>{

await updateDoc(

doc(db,"jobs",jobId),

{

applications:increment(1)

}

);

alert("Application Submitted");

};

// ===============================
// Delete Job
// ===============================

window.deleteJob=async(jobId)=>{

if(!confirm("Delete this job?"))

return;

await deleteDoc(

doc(db,"jobs",jobId)

);

alert("Job Deleted");

};

// ===============================
// Edit Salary
// ===============================

window.editJobSalary=async(jobId,currentSalary)=>{

const newSalary=prompt(

"Enter New Salary",

currentSalary

);

if(newSalary===null) return;

await updateDoc(

doc(db,"jobs",jobId),

{

salary:newSalary

}

);

alert("Salary Updated");

};

// ===============================
// Share Job
// ===============================

window.shareJob=(jobId)=>{

const link=

location.origin+

"/job.html?id="+jobId;

navigator.clipboard.writeText(link);

alert("Job Link Copied");

};

// ===============================
// Open Job
// ===============================

window.openJob=(jobId)=>{

location.href="job.html?id="+jobId;

};// ===============================
// Friendsbook V5
// jobs.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Save Job
// ===============================

window.saveJob=async(jobId)=>{

await addDoc(

collection(db,"savedJobs"),

{

uid:auth.currentUser.uid,

jobId:jobId,

savedAt:serverTimestamp()

}

);

alert("Job Saved");

};

// ===============================
// Report Job
// ===============================

window.reportJob=async(jobId)=>{

await addDoc(

collection(db,"jobReports"),

{

jobId:jobId,

reporter:auth.currentUser.email,

reportedAt:serverTimestamp()

}

);

alert("Job Report Submitted");

};

// ===============================
// Contact Employer
// ===============================

window.contactEmployer=(email)=>{

location.href=

"message.html?user="+email;

};

// ===============================
// Job Bookmark
// ===============================

window.bookmarkJob=async(jobId)=>{

await addDoc(

collection(db,"jobBookmarks"),

{

uid:auth.currentUser.uid,

jobId:jobId,

createdAt:serverTimestamp()

}

);

alert("Job Bookmarked");

};

// ===============================
// End jobs.js
// ===============================
