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
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};
