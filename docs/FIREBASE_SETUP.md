# Firebase Setup Guide — GSS Hong Portal

This guide walks you through setting up Firebase for the GSS Hong student portal and admin system from scratch.

---

## Prerequisites

- A Google account
- Access to the [Firebase Console](https://console.firebase.google.com/)
- The GSS Hong codebase cloned and dependencies installed

---

## Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it something like `gss-hong-portal`
4. Disable Google Analytics if you don't need it (optional)
5. Click **"Create project"**

---

## Step 2: Register a Web App

1. Inside your project, click the **`</>`** (Web) icon to add a web app
2. Name it `GSS Hong Portal`
3. Check **"Also set up Firebase Hosting"** if you plan to deploy via Firebase
4. Click **"Register app"**
5. Copy the `firebaseConfig` object — you will need these values for environment variables

The config looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "gss-hong-portal.firebaseapp.com",
  projectId: "gss-hong-portal",
  storageBucket: "gss-hong-portal.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
```

---

## Step 3: Set Environment Variables

Create `artifacts/gss-hong/.env` (never commit this file):

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=gss-hong-portal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gss-hong-portal
VITE_FIREBASE_STORAGE_BUCKET=gss-hong-portal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
```

> On Replit: add these as **Secrets** (the padlock icon in the sidebar). On Vercel/Netlify: add them in the project's environment variable settings.

---

## Step 4: Enable Email/Password Authentication

1. In Firebase Console → your project → **Authentication** (left sidebar)
2. Click **"Get started"**
3. Under **"Sign-in providers"**, click **Email/Password**
4. Toggle **"Email/Password"** to **Enabled**
5. Leave **"Email link (passwordless)"** disabled
6. Click **Save**

---

## Step 5: Create Firestore Database

1. In Firebase Console → **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in production mode"** (rules will be set in the next step)
4. Choose a Firestore location close to Nigeria — e.g. **`europe-west1`** or **`us-central1`**
5. Click **"Enable"**

---

## Step 6: Apply Security Rules

1. In Firebase Console → **Firestore Database → Rules** tab
2. Delete the existing rule content
3. Paste the full contents of **`firestore.rules`** from the project root
4. Click **"Publish"**

The rules enforce:
- Students can only read/write their own profile
- Students can only read **released** results
- Only verified admins (checked via the `admins` collection) can write results

---

## Step 7: Create Your Admin Account

### 7a. Create a Firebase Auth user for the admin

1. In Firebase Console → **Authentication → Users** tab
2. Click **"Add user"**
3. Enter your admin email (e.g. `admin@gsshong.edu.ng`) and a strong password
4. Click **"Add user"**
5. Copy the **UID** shown in the users table (looks like `abc123xyz789...`)

### 7b. Add the admin document to Firestore

1. In Firebase Console → **Firestore Database → Data** tab
2. Click **"+ Start collection"**
3. Collection ID: `admins`
4. Document ID: paste the **UID** you copied in 7a
5. Add a field: `isAdmin` → type `boolean` → value `true`
6. Click **Save**

Now when this user signs in at `/admin`, the portal will verify the `admins/{uid}` document and grant access.

---

## Step 8: Test the Setup

### Test student registration

1. Navigate to `https://your-site/register`
2. Enter a test admission number (e.g. `GSS/2024/00001`) and student name
3. Click **Register** — you should see "Registration successful. Default password: Password1"
4. The student should now appear in **Firebase Console → Authentication → Users**

### Test student login

1. Navigate to your site's **Student Portal** (in main nav)
2. Enter the admission number and `Password1`
3. You should see the portal dashboard (no results yet)

### Test admin login

1. Navigate to `https://your-site/admin`
2. Sign in with the admin email and password from Step 7a
3. You should see the list of registered students

---

## Firestore Data Structure

```
students/
  {admissionDocId}/         # e.g. "GSS-2024-00001"
    uid: string             # Firebase Auth UID
    name: string            # Student full name
    admissionNo: string     # Original format: "GSS/2024/00001"
    createdAt: timestamp

    results/
      {session}_{term}/     # e.g. "2024-2025_First-Term"
        session: string
        term: string
        subjects: [
          { subject, ca, exam, total, grade }
        ]
        released: boolean   # true = visible to student
        createdAt: timestamp

admins/
  {uid}/                    # Firebase Auth UID of admin user
    isAdmin: boolean
```

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `permission-denied` on login | Rules not published or wrong | Re-publish `firestore.rules` in Firebase console |
| `auth/email-already-in-use` | Student registered twice | Delete the Firebase Auth user and retry |
| Admin sees no students | `admins/{uid}` doc missing | Create the doc as described in Step 7b |
| `VITE_FIREBASE_*` not defined | Env vars not set | Add them to `.env` or platform secrets |
| Results not showing for student | `released` is `false` | Admin must click "Release Result" in the admin portal |

---

## Security Notes

- The `/register` route is intentionally hidden from public navigation. Share it only with school staff.
- The `/admin` route is also hidden. Admin credentials should be kept confidential.
- Firestore rules prevent any cross-student data access.
- Default password `Password1` should be changed by the student on first login.
- Admin documents in Firestore can only be created manually — there is no client-side admin sign-up.
