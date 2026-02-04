export function safeParse(raw) {
  try {
    return { ok: true, data: JSON.parse(raw) };
  } catch (error) {
    return { ok: false, error };
  }
}

export function safeStringify(value) {
  try {
    return { ok: true, data: JSON.stringify(value) };
  } catch (error) {
    return { ok: false, error };
  }
}
