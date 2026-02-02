import { safeParse, safeStringify } from "../../../shared/lib/storage/safeJson.js";

const STORAGE_KEY = "notes_app_tailwind_v1";

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, data: null };

    const parsed = safeParse(raw);
    if (!parsed.ok) return { ok: false, error: parsed.error };

    if (!Array.isArray(parsed.data)) {
      return { ok: false, error: new Error("Invalid notes format in storage") };
    }

    return { ok: true, data: parsed.data };
  } catch (error) {
    return { ok: false, error };
  }
}

export function saveNotes(notes) {
  try {
    const str = safeStringify(notes);
    if (!str.ok) return { ok: false, error: str.error };

    localStorage.setItem(STORAGE_KEY, str.data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
