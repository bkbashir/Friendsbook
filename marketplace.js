// ===============================
// Friendsbook V5
// marketplace.js Part 1
// ===============================

import { db, auth, storage } from "./firebase.js";

import {

collection,
addDoc,
serverTimestamp,
query,
orderBy,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

ref,
uploadBytes,
getDownloadURL

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const itemName=document.getElementById("itemName");
const itemPrice=document.getElementById("itemPrice");
const itemDescription=document.getElementById("itemDescription");
const itemImage=document.getElementById("itemImage");
const sellBtn=document.getElementById("sellBtn");
const marketplaceList=document.getElementById("marketplaceList");

// ===============================
// Sell Product
// ===============================

sellBtn.onclick=async()=>{

if(itemName.value.trim()===""){

alert("Enter Product Name");

return;

}

let imageUrl="";

if(itemImage.files.length>0){

const file=itemImage.files[0];

const imageRef=ref(

storage,

"marketplace/"+Date.now()+"_"+file.name

);

await uploadBytes(imageRef,file);

imageUrl=await getDownloadURL(imageRef);

}

await addDoc(

collection(db,"marketplace"),

{

name:itemName.value,

price:itemPrice.value,

description:itemDescription.value,

image:imageUrl,

seller:auth.currentUser.email,

createdAt:serverTimestamp()

}

);

itemName.value="";
itemPrice.value="";
itemDescription.value="";
itemImage.value="";

alert("Product Listed");

};

// ===============================
// Load Products
// ===============================

const marketQuery=query(

collection(db,"marketplace"),

orderBy("createdAt","desc")

);

onSnapshot(marketQuery,(snapshot)=>{

marketplaceList.innerHTML="";

snapshot.forEach((doc)=>{

const item=doc.data();

const itemId=doc.id;

marketplaceList.innerHTML+=`

<div class="marketItem">

<img src="${item.image}">

<h3>${item.name}</h3>

<p>৳ ${item.price}</p>

<button onclick="buyNow('${itemId}')">

Buy Now

</button>

</div>

`;

});

});// ===============================
// Friendsbook V5
// marketplace.js Part 2
// ===============================

import {

doc,
deleteDoc,
updateDoc,
increment

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Buy Product
// ===============================

window.buyNow=async(itemId)=>{

await updateDoc(

doc(db,"marketplace",itemId),

{

views:increment(1)

}

);

alert("Seller has been notified.");

};

// ===============================
// Delete Product
// ===============================

window.deleteProduct=async(itemId)=>{

if(!confirm("Delete this product?")) return;

await deleteDoc(

doc(db,"marketplace",itemId)

);

alert("Product Deleted");

};

// ===============================
// Edit Product Price
// ===============================

window.editPrice=async(itemId,currentPrice)=>{

const newPrice=prompt(

"Enter New Price",

currentPrice

);

if(newPrice===null) return;

await updateDoc(

doc(db,"marketplace",itemId),

{

price:newPrice

}

);

alert("Price Updated");

};

// ===============================
// Contact Seller
// ===============================

window.contactSeller=(email)=>{

location.href=

"message.html?user="+email;

};// ===============================
// Friendsbook V5
// marketplace.js Part 3 (Final)
// ===============================

import {

collection,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Save Product
// ===============================

window.saveProduct=async(itemId)=>{

await addDoc(

collection(db,"savedProducts"),

{

uid:auth.currentUser.uid,

productId:itemId,

savedAt:serverTimestamp()

}

);

alert("Product Saved");

};

// ===============================
// Share Product
// ===============================

window.shareProduct=(itemId)=>{

const link=

location.origin+

"/marketplace.html?id="+itemId;

navigator.clipboard.writeText(link);

alert("Product Link Copied");

};

// ===============================
// Report Product
// ===============================

window.reportProduct=async(itemId)=>{

await addDoc(

collection(db,"marketplaceReports"),

{

productId:itemId,

reporter:auth.currentUser.email,

time:serverTimestamp()

}

);

alert("Report Submitted");

};

// ===============================
// Product Details
// ===============================

window.openProduct=(itemId)=>{

location.href=

"product.html?id="+itemId;

};

// ===============================
// End marketplace.js
// ===============================
