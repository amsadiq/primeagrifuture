// ============================================================
//  Firebase configuration for the Prime AgriFuture partner portal
//  ------------------------------------------------------------
//  HOW TO FILL THIS IN  (see FIREBASE_SETUP.md for the full guide)
//
//  1. Go to  https://console.firebase.google.com  and create a project.
//  2. Add a Web app (the </> icon). Firebase shows you a config object.
//  3. Copy each value below, replacing the "PASTE_..." placeholders.
//  4. In the console: enable  Authentication → Email/Password,
//     create  Firestore Database  (production mode), and paste the
//     security rules from  firestore.rules.
//  5. Add a login for each partner/founder under Authentication → Users.
//
//  Until real values are added, the portal runs in DEMO MODE
//  (data saved only in this browser) so you can try it right away.
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyBsEoP0MFctojvSszm0t5mdj1BAihYDb_0",
  authDomain: "prime-agrifuture.firebaseapp.com",
  projectId: "prime-agrifuture",
  storageBucket: "prime-agrifuture.firebasestorage.app",
  messagingSenderId: "361347099238",
  appId: "1:361347099238:web:64db607241632b59855ba7"
};
