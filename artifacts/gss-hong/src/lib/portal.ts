import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
} from "firebase/auth";
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, getDocs, where, query, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Admission number → safe Firestore doc ID (no slashes or special chars) */
export function admissionDocId(admissionNo: string): string {
  return admissionNo.trim().toUpperCase().replace(/[^A-Z0-9]/g, "-");
}

/** Synthetic Firebase Auth email derived from admission number */
function admissionToEmail(admissionNo: string): string {
  return `${admissionDocId(admissionNo)}@portal.gsshong.local`.toLowerCase();
}

/** Nigerian WAEC grade from total score (0–100) */
export function calcGrade(total: number): string {
  if (total >= 75) return "A1";
  if (total >= 70) return "B2";
  if (total >= 65) return "B3";
  if (total >= 60) return "C4";
  if (total >= 55) return "C5";
  if (total >= 50) return "C6";
  if (total >= 45) return "D7";
  if (total >= 40) return "E8";
  return "F9";
}

export const DEFAULT_PASSWORD = "Password1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentProfile {
  uid?: string;
  name: string;
  admissionNo: string;
  className: string;
  email: string;
  phone: string;
}

export interface SubjectResult {
  subject: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
}

export interface TermResult {
  id: string;
  session: string;
  term: string;
  subjects: SubjectResult[];
  average: number;
  released: boolean;
}

// ─── Student auth ─────────────────────────────────────────────────────────────

/**
 * Register a new student.
 * Creates a Firebase Auth user first (which signs them in),
 * then writes the profile doc while they are authenticated.
 */
export async function registerStudent(data: {
  name: string; admissionNo: string; className: string; email: string; phone: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const docId = admissionDocId(data.admissionNo);
  const syntheticEmail = admissionToEmail(data.admissionNo);
  try {
    // 1. Create Firebase Auth user (auto signs them in on success)
    const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, DEFAULT_PASSWORD);
    // 2. Now authenticated → write Firestore profile
    await setDoc(doc(db, "students", docId), {
      uid: cred.user.uid,
      name: data.name,
      admissionNo: data.admissionNo.trim().toUpperCase(),
      className: data.className,
      email: data.email,
      phone: data.phone,
      createdAt: serverTimestamp(),
    });
    // 3. Sign out immediately — student must explicitly log in via the portal
    await signOut(auth);
    return { ok: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/email-already-in-use") {
      return { ok: false, error: "This admission number is already registered. Please sign in." };
    }
    return { ok: false, error: "Registration failed. Please check your details and try again." };
  }
}

export async function loginStudent(
  admissionNo: string, password: string,
): Promise<{ ok: true; profile: StudentProfile } | { ok: false; error: string }> {
  try {
    await signInWithEmailAndPassword(auth, admissionToEmail(admissionNo), password);
    const snap = await getDoc(doc(db, "students", admissionDocId(admissionNo)));
    if (!snap.exists()) {
      return { ok: false, error: "Account found but profile is missing. Contact the Records office." };
    }
    return { ok: true, profile: snap.data() as StudentProfile };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
      return { ok: false, error: "Invalid admission number or password." };
    }
    return { ok: false, error: "Sign-in failed. Please try again." };
  }
}

/** Fetch only RELEASED results for a student (students see published results only) */
export async function fetchStudentResults(admissionNo: string): Promise<TermResult[]> {
  const docId = admissionDocId(admissionNo);
  const snap = await getDocs(
    query(collection(db, "students", docId, "results"), where("released", "==", true))
  );
  const results = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<TermResult, "id">) }));
  // Sort by session desc, term desc client-side (avoids composite index requirement)
  return results.sort((a, b) => {
    if (b.session !== a.session) return b.session.localeCompare(a.session);
    const order = ["Third Term", "Second Term", "First Term"];
    return order.indexOf(a.term) - order.indexOf(b.term);
  });
}

export async function changeStudentPassword(
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = auth.currentUser;
  if (!user) return { ok: false, error: "Not signed in." };
  try {
    await updatePassword(user, newPassword);
    return { ok: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/requires-recent-login") {
      return { ok: false, error: "Session expired. Please log out and sign in again to change your password." };
    }
    return { ok: false, error: "Could not update password. Try again." };
  }
}

export async function logoutStudent(): Promise<void> {
  await signOut(auth);
}

// ─── Admin auth ───────────────────────────────────────────────────────────────

export async function adminLogin(
  email: string, password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const adminSnap = await getDoc(doc(db, "admins", cred.user.uid));
    if (!adminSnap.exists()) {
      await signOut(auth);
      return { ok: false, error: "This account is not authorised as an admin. Contact the ICT office." };
    }
    return { ok: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
      return { ok: false, error: "Invalid email or password." };
    }
    return { ok: false, error: "Sign-in failed. Please try again." };
  }
}

export async function adminLogout(): Promise<void> {
  await signOut(auth);
}

// ─── Admin data operations ────────────────────────────────────────────────────

export async function fetchAllStudents(): Promise<StudentProfile[]> {
  const snap = await getDocs(collection(db, "students"));
  return snap.docs.map(d => d.data() as StudentProfile);
}

export async function fetchAllResultsForStudent(admissionNo: string): Promise<TermResult[]> {
  const docId = admissionDocId(admissionNo);
  const snap = await getDocs(collection(db, "students", docId, "results"));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as Omit<TermResult, "id">) }))
    .sort((a, b) => {
      if (b.session !== a.session) return b.session.localeCompare(a.session);
      const order = ["Third Term", "Second Term", "First Term"];
      return order.indexOf(a.term) - order.indexOf(b.term);
    });
}

/** Save or overwrite a result. Pass released=false to save draft, true to publish. */
export async function saveResult(
  admissionNo: string,
  result: { session: string; term: string; subjects: SubjectResult[] },
  released: boolean,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const docId = admissionDocId(admissionNo);
    const resultId = `${result.session.replace(/[^A-Z0-9]/gi, "-")}-${result.term.replace(/[^A-Z0-9]/gi, "-")}`.toLowerCase();
    const average = result.subjects.length
      ? Math.round(result.subjects.reduce((s, r) => s + r.total, 0) / result.subjects.length)
      : 0;
    await setDoc(doc(db, "students", docId, "results", resultId), {
      session: result.session,
      term: result.term,
      subjects: result.subjects,
      average,
      released,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    return { ok: true, id: resultId };
  } catch {
    return { ok: false, error: "Failed to save result. Check your connection and try again." };
  }
}

export async function toggleRelease(
  admissionNo: string, resultId: string, released: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await updateDoc(doc(db, "students", admissionDocId(admissionNo), "results", resultId), { released });
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update result. Try again." };
  }
}

export async function deleteResult(
  admissionNo: string, resultId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await deleteDoc(doc(db, "students", admissionDocId(admissionNo), "results", resultId));
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete result." };
  }
}
