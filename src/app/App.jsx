import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { loadNotes, saveNotes } from "../entities/note/api/noteStorage.js";
import {
  createInitialNotes,
  createNote,
  sortByUpdatedDesc,
} from "../entities/note/model/noteFactory.js";
import NotesList from "../entities/note/ui/NotesList.jsx";
import Editor from "../entities/note/ui/Editor.jsx";

export default function App() {
  const [notes, setNotes] = useState(() => {
    const res = loadNotes();

    if (!res.ok) {
      toast.error(
        "Не удалось прочитать заметки из localStorage. Стартуем с дефолтной заметкой."
      );
      return createInitialNotes();
    }

    if (!res.data || res.data.length === 0) {
      const initial = createInitialNotes();
      const saved = saveNotes(initial);
      if (!saved.ok)
        toast.error(
          "Не удалось сохранить стартовую заметку (localStorage недоступен)."
        );
      return initial;
    }

    return [...res.data].sort(sortByUpdatedDesc);
  });

  const [activeId, setActiveId] = useState(() => notes[0]?.id ?? null);
  const [query, setQuery] = useState("");

  const safeActiveId = useMemo(() => {
    if (activeId && notes.some((n) => n.id === activeId)) return activeId;
    return notes[0]?.id ?? null;
  }, [activeId, notes]);

  useEffect(() => {
    const res = saveNotes(notes);
    if (!res.ok) toast.error("Не удалось сохранить заметки (localStorage недоступен).");
  }, [notes]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === safeActiveId) ?? null,
    [notes, safeActiveId]
  );

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) =>
      `${n.title}\n${n.text}`.toLowerCase().includes(q)
    );
  }, [notes, query]);

  function onCreate() {
    const newNote = createNote();
    setNotes((prev) => [newNote, ...prev].sort(sortByUpdatedDesc));
    setActiveId(newNote.id);
  }

  function onDelete(id) {
    const target = notes.find((n) => n.id === id);
    const label = target?.title ? `«${target.title}»` : "эту заметку";

    if (!window.confirm(`Удалить ${label}?`)) return;

    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Заметка удалена");
  }

  function patchActive(patch) {
    if (!safeActiveId) return;

    setNotes((prev) =>
      prev
        .map((n) =>
          n.id === safeActiveId ? { ...n, ...patch, updatedAt: Date.now() } : n
        )
        .sort(sortByUpdatedDesc)
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#f5ead6]">
      <p className="absolute left-[455px] top-[34px] text-2xl font-bold text-left text-[#0f172b]">
        Мои заметки
      </p>

      <div className="absolute left-[340px] top-[78px]">
        <NotesList
          notes={filteredNotes}
          activeId={safeActiveId}
          query={query}
          onQueryChange={setQuery}
          onSelect={setActiveId}
          onDelete={onDelete}
          onCreate={onCreate}
        />
      </div>

      <div className="absolute left-[760px] top-[78px]">
        <Editor
          note={activeNote}
          onChangeTitle={(title) => patchActive({ title })}
          onChangeText={(text) => patchActive({ text })}
        />
      </div>
    </div>
  );
}