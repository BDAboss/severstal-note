import React from "react";

function wrapSelection(textarea, left, right) {
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;

  const before = textarea.value.slice(0, start);
  const selected = textarea.value.slice(start, end);
  const after = textarea.value.slice(end);

  const next = before + left + selected + right + after;
  const cursorStart = start + left.length;
  const cursorEnd = end + left.length;

  return { next, cursorStart, cursorEnd };
}

export default function Toolbar({ textareaRef, onApply }) {
  const apply = (type) => {
    const el = textareaRef.current;
    if (!el) return;

    const map = {
      bold: ["**", "**"],
      italic: ["*", "*"],
      mono: ["`", "`"]
    };

    const [l, r] = map[type];
    const { next, cursorStart, cursorEnd } = wrapSelection(el, l, r);

    onApply(next);

    
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const btnClass =
    "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold hover:border-sky-400/40";

  return (
    <div className="flex items-center gap-2 border-b border-white/10 p-3">
      <button type="button" className={btnClass} onClick={() => apply("bold")} title="Жирный (Markdown)">
        B
      </button>
      <button type="button" className={btnClass} onClick={() => apply("italic")} title="Курсив (Markdown)">
        I
      </button>
      <button type="button" className={btnClass} onClick={() => apply("mono")} title="Код (Markdown)">
        {"</>"}
      </button>

      <div className="ml-2 text-xs text-slate-300">Выдели текст → нажми кнопку</div>
    </div>
  );
}
