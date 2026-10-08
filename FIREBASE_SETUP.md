# Partner Portal — Firebase Setup (≈10 minutes)

The portal (`portal.html`) works right now in **Demo mode** (records save only in
one browser). To make it **real and shared** — every partner/founder logging in from
any phone or computer and seeing the same live farm records — connect Firebase.
It's free for this scale and works on your existing GitHub Pages site.

Do these once:

---

## 1. Create a Firebase project
1. Go to **https://console.firebase.google.com** and sign in with a Google account.
2. Click **Add project** → name it e.g. `prime-agrifuture` → continue.
   (You can turn Google Analytics off — not needed.)

## 2. Register a Web app
1. On the project overview, click the **Web** icon **`</>`**.
2. App nickname: `Prime AgriFuture Portal` → **Register app**.
3. Firebase shows a `firebaseConfig = { ... }` block. **Copy those values.**
4. Open **`firebase-config.js`** in this project and replace each `PASTE_...`
   placeholder with the matching value. Save.

## 3. Turn on Email/Password login
1. Left menu → **Build → Authentication** → **Get started**.
2. **Sign-in method** tab → **Email/Password** → enable the first toggle → **Save**.

## 4. Create the database
1. Left menu → **Build → Firestore Database** → **Create database**.
2. Choose **Production mode** → pick a location (e.g. `eur3` or the closest region) → **Enable**.
3. Open the **Rules** tab, delete what's there, paste the contents of
   **`firestore.rules`** from this project, and click **Publish**.

## 5. Add your team's logins
For each partner/founder:
1. **Authentication → Users → Add user**.
2. Enter their email + a starting password → **Add user**.
3. Share the email/password with them (they can change the password later).

Suggested accounts:
- Parry Hedima (CEO), Sadiq Muhammad Abubakar (COO), Fred Hosea (CFO),
  David Ajoma (Risk & Compliance), Alwan Nasir (Plans & Strategy).

---

## Done ✅
Reload `portal.html`. The banner changes from **Demo** to **Live**, and everyone
who signs in shares the same farm records in real time.

### ⚠️ If you add new portal features later
When new record types are added (the portal now covers **goats, cattle, crops,
transactions, feed, births and activities**), re-publish the rules from
`firestore.rules` (**Firestore Database → Rules → Publish**). The current rules
already allow any signed-in team member to use every collection, so you only
re-publish if you ever replace that file.

### Notes
- The API key in `firebase-config.js` is **safe to be public** — Firebase secures
  your data with the rules in `firestore.rules`, not by hiding the key.
- Free tier (Spark plan) is ample here: 50k reads + 20k writes per day, 1 GiB stored.
- To add or remove a team member later, use **Authentication → Users**.
- Want new record fields (e.g. weight, vaccination dates, health status)? They're
  defined in the `SCHEMAS` object at the top of `portal.js` — easy to extend.
