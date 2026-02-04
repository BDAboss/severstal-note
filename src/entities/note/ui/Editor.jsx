import React, { useMemo, useRef, useEffect } from "react";
import Toolbar from "./Toolbar.jsx";

function formatUpdatedAt(ts) {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  useEffect(() => {
    const el = textareaRef.current;
    if (!el || !note) return;
    const nextHtml = note.text || "";
    if (el.innerHTML !== nextHtml) el.innerHTML = nextHtml;
  }, [note]);

  if (!note) {
    return (
      <div
        className="flex w-full max-w-[820px] flex-col justify-start items-center h-[924px] overflow-hidden gap-2.5 px-5 pt-[15px] pb-5 rounded-[20px] bg-[#fbf7ef]"
        style={{ boxShadow: "0px 4px 12px 0 rgba(0,0,0,0.25)" }}
      >
        <div className="flex flex-col justify-center items-center self-stretch flex-grow relative overflow-hidden gap-2.5 px-2.5 py-[5px] rounded-lg">
          <h2 className="text-[15px] font-semibold text-black">Нет выбранной заметки</h2>
          <p className="text-sm text-[#90a1b9]">Выбери заметку слева или создай новую.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex w-full max-w-[820px] flex-col justify-start items-center h-[924px] overflow-hidden gap-2.5 px-5 pt-[15px] pb-5 rounded-[20px] bg-[#fbf7ef]"
      style={{ boxShadow: "0px 4px 12px 0 rgba(0,0,0,0.25)" }}
    >
      <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 h-10 relative overflow-hidden gap-2.5 px-2.5 py-[5px] rounded-lg bg-white">
        <input
          value={note.title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="Заголовок…"
          maxLength={80}
          className="self-stretch flex-grow w-full h-[30px] text-[15px] font-semibold text-left text-black bg-transparent outline-none placeholder:text-[#90a1b9] border-none"
        />
      </div>

      <Toolbar textareaRef={textareaRef} onApply={onChangeText} />

      <div className="flex flex-col justify-start items-start self-stretch flex-grow relative overflow-hidden px-2.5 py-4 rounded-2xl bg-[#efebe4]">
        <div className="flex flex-col w-full h-full">
          <div
            data-testid="note-textarea"
            ref={textareaRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => onChangeText(textareaRef.current?.innerHTML ?? "")}
            className="self-stretch flex-grow w-full h-full text-sm text-left text-black bg-transparent outline-none border-none"
            style={{ whiteSpace: "pre-wrap" }}
          />
          <div className="mt-2 text-xs text-[#90a1b9]">{meta}</div>
        </div>
      </div>

      <div className="self-stretch flex-grow-0 flex-shrink-0 text-xs text-[#90a1b9] mt-2">
        Подсказка: выдели текст и нажимай Ж / К / Ч или выбери нужный Шрифт и Размер.
      </div>
    </div>
  );
}
