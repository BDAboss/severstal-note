import React, { useMemo, useRef } from "react";
import Toolbar from "./Toolbar.jsx";

function formatUpdatedAt(ts) {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

export default function Editor({ note, onChangeTitle, onChangeText }) {
  const textareaRef = useRef(null);

  const meta = useMemo(() => {
    if (!note) return "";
    return `Обновлено: ${formatUpdatedAt(note.updatedAt)}`;
  }, [note]);

  if (!note) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Нет выбранной заметки</h2>
        <p className="mt-2 text-sm text-slate-300">Выбери заметку слева или создай новую.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="p-3 border-b border-white/10">
        <input
          value={note.title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="Заголовок…"
          maxLength={80}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold outline-none placeholder:text-slate-500 focus:border-sky-400/40"
        />
        <div className="mt-2 text-xs text-slate-300">{meta}</div>
      </div>

      <Toolbar textareaRef={textareaRef} onApply={onChangeText} />

    <textarea
      data-testid="note-textarea"
      ref={textareaRef}
      value={note.text}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder="Текст заметки…"
      className="h-[50vh] md:h-[60vh] w-full resize-none       bg-transparent p-4 text-sm leading-relaxed     outline-none"
    />

      <div className="border-t border-white/10 p-3 text-xs text-slate-300">
        Подсказка: **жирный**, *курсив*, `код` — в формате Markdown.
      </div>
    </section>
  );
}
