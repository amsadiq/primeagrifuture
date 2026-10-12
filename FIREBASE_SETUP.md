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

## 5. Getting team members in
Two ways:
- **They self sign up** (easiest): on the portal login screen they click
  **Create an account**, enter name/email/password, and land on an
  "Awaiting approval" screen with no access. You then approve them (step 6).
- **Or you create them**: **Authentication → Users → Add user** (email + a
  starting password), then approve.

Either way, **no one can see farm data until an admin approves them.**

## 6. Roles — who can do what
Three access levels:
- **admin** — full access to everything (the co-founders).
- **finance** — can edit **Transactions**; views everything else (the CFO).
- **viewer** — view-only everywhere (everyone else).
- *pending* — a new sign-up with no access yet, waiting for approval.

**Bootstrap the first admin** (one-time, in the console — do this before anyone
else can be approved):
1. **Firestore Database → Start collection** → Collection ID: `roles`.
2. **Document ID** = your login email in lowercase (e.g. `sadiq@...`).
3. Add a field: **`role`** (string) = `admin` → **Save**.

Then sign in as that admin and open **Team & Roles** in the sidebar to approve
and assign everyone — no more console needed:
- Pending sign-ups appear with a **PENDING** badge → **Edit** to set their role
  (approve), or **Delete** to reject.
- Set Parry & Sadiq → **admin**, Fred → **finance**, David & Alwan → **viewer**.

> Each person's role takes effect the next time they sign in. Emails must match
> their login exactly (lowercase).

---

## Done ✅
Reload `portal.html`. The banner changes from **Demo** to **Live**, and everyone
who signs in shares the same farm records in real time, with access set by role.

### ⚠️ If you ever replace the rules file
The current `firestore.rules` already enforces the roles above and covers every
collection. You only re-publish (**Firestore Database → Rules → Publish**) if you
change that file.

### Notes
- The API key in `firebase-config.js` is **safe to be public** — Firebase secures
  your data with the rules in `firestore.rules`, not by hiding the key.
- Free tier (Spark plan) is ample here: 50k reads + 20k writes per day, 1 GiB stored.
- To add or remove a team member later, use **Authentication → Users**.
- Want new record fields (e.g. weight, vaccination dates, health status)? They're
  defined in the `SCHEMAS` object at the top of `portal.js` — easy to extend.
