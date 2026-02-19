# Beneteau 373 Listing (Web + App Shared Data)

This folder is a **static website** that reads a single Firestore document.
When you edit the listing in `admin.html`, it updates **both**:
- the website (this landing page)
- any mobile app you build that reads the same Firestore document

## 1) Put the images in /assets
Copy these into `assets/`:
- main.jpg
- haul.jpg
- interior.jpg

(Already included in this package.)

## 2) Create Firebase project
- Firebase Console -> create project
- Add a Web App -> copy the **firebaseConfig** object
- Enable **Firestore Database**
- Enable **Email/Password Auth (for admin sign-in)** (Authentication -> Sign-in method)

## 3) Paste firebaseConfig in TWO files
Edit:
- `app.js`
- `admin.js`
Replace the placeholder config with your real config.

## 4) Create an admin user
Firebase Console -> Authentication -> Users -> Add user
Use your email + password (or Dave's).

## 5) Firestore security (simple + safe starter)
Firestore Rules (Database -> Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Later, you can lock writes down further (only specific admins).

## 6) Deploy (easy options)
- GitHub Pages (static hosting)
- Firebase Hosting (recommended if you're already using Firebase)

## 7) Add your real listing data
Open `/admin.html`, sign in, click **Load current**, then edit & **Save changes**.

---

If you want this to feel like a "real product" quickly:
- We can add a custom domain (e.g., `davesbeneteau.com`)
- Add a QR code on the flyer pointing to the landing page
- Add a lightweight app (same data feed) for iOS/Android


## Listing data model
This listing uses a single Firestore document with `contacts` as an array (two call/text numbers).
