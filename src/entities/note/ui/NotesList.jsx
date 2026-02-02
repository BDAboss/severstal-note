import React from "react";

function preview(text) {
  const oneLine = (text || "").replace(/\s+/g, " ").trim();
  if (!oneLine) return "— пусто —";
  return oneLine.length > 80 ? `${oneLine.slice(0, 80)}…` : oneLine;
}

export default function NotesList({ notes, activeId, query, onQueryChange, onSelect, onDelete }) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="p-3 border-b border-white/10">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Поиск…"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-sky-400/40"
        />
      </div>

      <div className="max-h-[65vh] overflow-auto p-2">
        {notes.length === 0 ? (
          <div className="p-4 text-sm text-slate-300">Ничего не найдено</div>
        ) : (
          notes.map((n) => {
            const isActive = n.id === activeId;
            return (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(n.id)}
                onKeyDown={(e) => e.key === "Enter" && onSelect(n.id)}
                className={[
                  "mb-2 rounded-2xl border p-3 cursor-pointer",
                  isActive
                    ? "border-sky-400/40 bg-sky-500/10"
                    : "border-transparent bg-white/3 hover:border-white/15"
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {n.title || "Без названия"}
                    </div>
                    <div className="mt-1 text-xs text-slate-300">
                      {preview(n.text)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(n.id);
                    }}
                    title="Удалить"
                    className="shrink-0 rounded-xl border border-rose-400/25 bg-rose-500/10 px-2 py-1 text-xs hover:bg-rose-500/15"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
