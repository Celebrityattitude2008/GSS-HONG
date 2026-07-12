import {
  collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp,
  query, orderBy, addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;       // human-readable display date, e.g. "June 15, 2025"
  image: string;      // base64 data URL (or "" if no image)
  createdAt?: unknown; // Firestore server timestamp, used for ordering
}

const NEWS_COLLECTION = "news";

// ─── Image helpers ────────────────────────────────────────────────────────────

/**
 * Convert an uploaded image file into a compressed base64 data URL.
 * Resizes to a max dimension and re-encodes as JPEG to keep the resulting
 * Firestore document well under the 1MB document size limit.
 */
export function fileToBase64Image(file: File, maxDimension = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas not supported.")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ─── News CRUD ────────────────────────────────────────────────────────────────

/** Fetch all news articles, newest first. Public — no auth required. */
export async function fetchAllNews(): Promise<NewsArticle[]> {
  const snap = await getDocs(query(collection(db, NEWS_COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<NewsArticle, "id">) }));
}

/** Create a news article. Admin-only (enforced by Firestore rules). */
export async function createNews(data: {
  title: string; excerpt: string; category: string; date: string; image: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const ref = await addDoc(collection(db, NEWS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { ok: true, id: ref.id };
  } catch {
    return { ok: false, error: "Failed to publish news article." };
  }
}

/** Update an existing news article. Admin-only. */
export async function updateNews(
  id: string,
  data: { title: string; excerpt: string; category: string; date: string; image: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await setDoc(doc(db, NEWS_COLLECTION, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update news article." };
  }
}

/** Delete a news article. Admin-only. */
export async function deleteNews(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await deleteDoc(doc(db, NEWS_COLLECTION, id));
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete news article." };
  }
}
