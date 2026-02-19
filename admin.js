import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// ✅ Paste your Firebase web config here (Project settings -> Your apps -> Web app)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};


const LISTING_ID = "beneteau-373-2005";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const el = (id) => document.getElementById(id);

function setStatus(text, ok=false){
  el("status").textContent = text;
  el("status").style.background = ok ? "#0E8A8A" : "#111827";
}

function linesToArray(text){
  return (text || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

function photosToArray(text){
  return linesToArray(text).map(line => {
    const parts = line.split(" | ");
    return { url: parts[0].trim(), alt: (parts[1] || "").trim() };
  });
}

function arrayToLines(arr, formatter = (x)=>x){
  return (arr || []).map(formatter).join("\n");
}

async function loadCurrent(){
  const ref = doc(db, "listings", LISTING_ID);
  const snap = await getDoc(ref);
  if(!snap.exists()) {
    setStatus("No listing found yet — you can create it by saving.", false);
    return;
  }
  const d = snap.data();

  el("title").value = d.title || "";
  el("subtitle").value = d.subtitle || "";
  el("price").value = (typeof d.price === "number") ? d.price : "";
  el("locationNote").value = d.locationNote || "";
  el("accessLine").value = d.accessLine || "";

  el("contactName1").value = (d.contacts?.[0]?.name) || "Dave DelRosario";
  el("contactPhone1").value = (d.contacts?.[0]?.phone) || "808-479-3157";
  el("contactName2").value = (d.contacts?.[1]?.name) || "Dave Ayling";
  el("contactPhone2").value = (d.contacts?.[1]?.phone) || "808-375-8150";
  
  

  el("highlights").value = arrayToLines(d.highlights);
  el("included").value = arrayToLines(d.included);
  el("photos").value = arrayToLines(d.photos, p => (p.alt ? `${p.url} | ${p.alt}` : p.url));

  setStatus("Loaded current listing.", true);
}

async function save(){
  const user = auth.currentUser;
  if(!user) {
    alert("Sign in first.");
    return;
  }

  const payload = {
    title: el("title").value.trim(),
    subtitle: el("subtitle").value.trim(),
    price: Number(el("price").value || 0),
    locationNote: el("locationNote").value.trim(),
    accessLine: el("accessLine").value.trim(),
    contacts: [
      { name: el("contactName1").value.trim(), phone: el("contactPhone1").value.trim() },
      { name: el("contactName2").value.trim(), phone: el("contactPhone2").value.trim() },
    ],
    highlights: linesToArray(el("highlights").value),
    included: linesToArray(el("included").value),
    photos: photosToArray(el("photos").value),
    updatedAt: new Date().toISOString(),
    listingId: LISTING_ID,
  };

  const ref = doc(db, "listings", LISTING_ID);
  await setDoc(ref, payload, { merge: true });
  setStatus("Saved ✔︎ (web + app will reflect updates).", true);
}

async function doSignIn(){
  const email = el("loginEmail").value.trim();
  const pass = el("loginPassword").value;
  await signInWithEmailAndPassword(auth, email, pass);
}

el("signInBtn").addEventListener("click", () => doSignIn().catch(e => alert(e.message)));
el("signOutBtn").addEventListener("click", () => signOut(auth).catch(e => alert(e.message)));
el("loadBtn").addEventListener("click", () => loadCurrent().catch(e => alert(e.message)));
el("saveBtn").addEventListener("click", () => save().catch(e => alert(e.message)));

onAuthStateChanged(auth, (user) => {
  if(user) {
    setStatus(`Signed in as ${user.email}`, true);
  } else {
    setStatus("Not signed in", false);
  }
});
