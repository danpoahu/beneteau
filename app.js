import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ✅ Paste your Firebase web config here (Project settings -> Your apps -> Web app)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};


const LISTING_ID = "beneteau-373-2005"; // used by both the web + app

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const el = (id) => document.getElementById(id);

function li(text){
  const li = document.createElement("li");
  li.textContent = text;
  return li;
}

function setLinks(data){
  const contacts = Array.isArray(data.contacts) ? data.contacts : [];
  const c1 = contacts[0] || { name: "Dave DelRosario", phone: "808-479-3157" };
  const c2 = contacts[1] || { name: "Dave Ayling", phone: "808-375-8150" };

  const phoneHref1 = `tel:${(c1.phone || "").replace(/[^0-9+]/g,"")}`;
  const phoneHref2 = `tel:${(c2.phone || "").replace(/[^0-9+]/g,"")}`;

  // Primary CTA uses contact #1
  el("callBtn").href = phoneHref1;

  // Contact section
  const name1 = document.getElementById("contactName1");
  const name2 = document.getElementById("contactName2");
  const link1 = document.getElementById("phoneLink1");
  const link2 = document.getElementById("phoneLink2");

  if(name1) name1.textContent = c1.name || "Contact";
  if(link1){
    link1.href = phoneHref1;
    link1.textContent = c1.phone || "";
  }

  if(name2) name2.textContent = c2.name || "";
  if(link2){
    link2.href = phoneHref2;
    link2.textContent = c2.phone || "";
  }
}

function setHero(data){
  if(data.title) el("title").textContent = data.title;
  if(data.subtitle) el("subtitle").textContent = data.subtitle;
  if(typeof data.price === "number") {
    el("priceBadge").textContent = `Asking $${data.price.toLocaleString()}`;
  } else if(data.priceText) {
    el("priceBadge").textContent = data.priceText;
  }

  if(data.locationNote) el("locationNote").textContent = data.locationNote;
  if(data.accessLine) el("accessLine").textContent = data.accessLine;
}

function setLists(data){
  const highlights = el("highlights");
  const included = el("included");
  highlights.innerHTML = "";
  included.innerHTML = "";

  (data.highlights || []).forEach(t => highlights.appendChild(li(t)));
  (data.included || []).forEach(t => included.appendChild(li(t)));
}

function setGallery(data){
  const gallery = el("gallery");
  gallery.innerHTML = "";
  (data.photos || []).forEach(p => {
    const wrap = document.createElement("div");
    wrap.className = "photo";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = p.url;
    img.alt = p.alt || "Boat photo";
    wrap.appendChild(img);
    gallery.appendChild(wrap);
  });
}

async function load(){
  el("year").textContent = new Date().getFullYear();
  const ref = doc(db, "listings", LISTING_ID);
  const snap = await getDoc(ref);

  if(!snap.exists()){
    console.warn("Listing not found. Showing built-in defaults.");
    return;
  }

  const data = snap.data();
  setHero(data);
  setLinks(data);
  setLists(data);
  setGallery(data);
}

load().catch(err => {
  console.error(err);
  alert("Could not load listing data. Check Firebase config and Firestore rules.");
});
