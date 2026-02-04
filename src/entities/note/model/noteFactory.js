export function createNote({ title = "Новая заметка", text = "" } = {}) {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title,
    text,
    createdAt: now,
    updatedAt: now,
  };
}

export function createInitialNotes() {
  return [
    createNote({
      title: "Первая заметка",
      text:
        "Привет! Это стартовая заметка.\n\n" +
        "• Создавай заметки слева\n" +
        "• Редактируй справа\n" +
        "• Всё сохраняется автоматически\n\n" +
        "Выдели текст и нажми B или I 🙂",
    }),
  ];
}

export function sortByUpdatedDesc(a, b) {
  return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
}
