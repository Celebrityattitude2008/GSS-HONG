# Admin Portal User Guide — GSS Hong

This guide is for school staff who manage student results through the GSS Hong admin portal.

---

## Accessing the Admin Portal

Navigate directly to:

```
https://gsshong.edu.ng/admin
```

This URL is **not linked** anywhere on the public site. Only share it with authorised staff.

---

## Signing In

Enter the **admin email address** and **password** created in the Firebase console by the ICT office.

> If you don't have admin credentials, contact the ICT office or the site developer.

---

## The Student List

After signing in, you will see a list of all registered students, sorted alphabetically. Each row shows:

- Student **name**
- **Admission number** (e.g. `GSS/2024/00231`)
- Date registered

Click on any student to open their **result management panel**.

---

## Entering Results

### Opening a student's panel

1. Click on the student's name in the list
2. Their panel opens, showing any existing results

### Filling in the score entry form

1. **Session** — type the academic session, e.g. `2024/2025`
2. **Term** — select First Term, Second Term, or Third Term
3. **Subjects** — the table starts empty. Add subjects one by one:
   - Click **"+ Add Subject"** to add a row
   - Type the **subject name** (e.g. `Mathematics`)
   - Enter **CA score** (Continuous Assessment) — out of **30**
   - Enter **Exam score** — out of **70**
   - The **Total** (out of 100) and **Grade** (A1–F9) calculate automatically
4. To remove a subject row, click the **✕** button on that row

### Saving

| Button | What it does |
|---|---|
| **Save Draft** | Saves the result to Firebase. Only admins can see it. Students cannot view it yet. |
| **Release Result** | Publishes the result. The student can now view and print it from the portal. |

> **Tip:** Always save a draft first and review it before releasing to students.

---

## Managing Existing Results

Each saved result appears in the student's panel with one of two status badges:

- 🟡 **Draft** — not yet visible to the student
- 🟢 **Released** — student can view and print

### Actions per result

| Action | Description |
|---|---|
| **Edit** | Loads the result back into the score entry form for modification |
| **Release** | Publishes a draft result to the student |
| **Unpublish** | Hides a released result from the student (reverts to Draft) |
| **Delete** | Permanently removes the result — use with caution |

---

## Grading Scale (Nigerian WAEC)

| Grade | Mark Range | Meaning |
|---|---|---|
| **A1** | 75 – 100 | Excellent |
| **B2** | 70 – 74 | Very Good |
| **B3** | 65 – 69 | Good |
| **C4** | 60 – 64 | Credit |
| **C5** | 55 – 59 | Credit |
| **C6** | 50 – 54 | Credit |
| **D7** | 45 – 49 | Pass |
| **E8** | 40 – 44 | Pass |
| **F9** | 0 – 39 | Fail |

---

## Student Registration (Staff)

To register a new student, navigate to:

```
https://gsshong.edu.ng/register
```

Enter:
- **Full name** — student's full legal name
- **Admission number** — format: `GSS/YYYY/NNNNN` (e.g. `GSS/2024/00231`)

Click **Register**. The system will:

1. Create a Firebase Auth account for the student
2. Set their default password to **`Password1`**
3. Save their profile to Firestore

The student can then log in at the Student Portal using their admission number and the default password, and change their password immediately after.

> If registration fails with "Admission number already registered", the student already has an account.

---

## Signing Out

Click **Sign Out** in the top-right corner of the admin panel to end your session securely.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Not authorised" after sign-in | Your email's UID is not in the `admins` Firestore collection. Contact the developer. |
| Results not saving | Check your internet connection. Also verify Firestore rules are published. |
| Student says they can't see their result | Make sure you clicked **Release Result**, not just **Save Draft**. |
| Wrong score entered | Click **Edit** on the result, correct the score, and click **Release Result** again. |

---

## Contact the Developer

If you encounter a technical issue with the portal, contact the developer:

- **Paul Adamu (PA_ZTI)** — [LinkedIn](https://www.linkedin.com/in/paul-adamu-67bb46324) · [GitHub](https://github.com/Celebrityattitude2008)
