import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert an admission number to a safe Firestore document ID (no slashes) */
export function admissionDocId(admissionNo: string): string {
  return admissionNo.trim().toUpperCase().replace(/[^A-Z0-9]/g, "-");
}

/** Derive a synthetic Firebase Auth email from an admission number */
function admissionToEmail(admissionNo: string): string {
  return `${admissionDocId(admissionNo)}@portal.gsshong.local`.toLowerCase();
}

export const DEFAULT_PASSWORD = "Password1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentProfile {
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
}

// ─── Auth operations ──────────────────────────────────────────────────────────

export async function registerStudent(data: {
  name: string;
  admissionNo: string;
  className: string;
  email: string;
  phone: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const docId = admissionDocId(data.admissionNo);
  const syntheticEmail = admissionToEmail(data.admissionNo);

  // Check if admission number already registered
  const existing = await getDoc(doc(db, "students", docId));
  if (existing.exists()) {
    return { ok: false, error: "This admission number is already registered. Please sign in instead." };
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, DEFAULT_PASSWORD);
    await setDoc(doc(db, "students", docId), {
      uid: cred.user.uid,
      name: data.name,
      admissionNo: data.admissionNo.trim().toUpperCase(),
      className: data.className,
      email: data.email,
      phone: data.phone,
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (err: unknown) {
    const msg = (err as { code?: string })?.code;
    if (msg === "auth/email-already-in-use") {
      return { ok: false, error: "This admission number is already registered. Please sign in." };
    }
    return { ok: false, error: "Registration failed. Please check your details and try again." };
  }
}

export async function loginStudent(
  admissionNo: string,
  password: string,
): Promise<{ ok: true; profile: StudentProfile } | { ok: false; error: string }> {
  const syntheticEmail = admissionToEmail(admissionNo);
  try {
    await signInWithEmailAndPassword(auth, syntheticEmail, password);
    const docId = admissionDocId(admissionNo);
    const snap = await getDoc(doc(db, "students", docId));
    if (!snap.exists()) {
      return { ok: false, error: "Account found but profile is missing. Contact the Records office." };
    }
    const d = snap.data() as StudentProfile;
    return { ok: true, profile: d };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
      return { ok: false, error: "Invalid admission number or password." };
    }
    return { ok: false, error: "Sign-in failed. Please try again." };
  }
}

export async function fetchStudentResults(admissionNo: string): Promise<TermResult[]> {
  const docId = admissionDocId(admissionNo);
  const resultsRef = collection(db, "students", docId, "results");
  const snap = await getDocs(query(resultsRef, orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<TermResult, "id">) }));
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
