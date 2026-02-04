import React, { useMemo, useRef, useEffect, useCallback } from "react";
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

  const insertImageDataUrl = useCallback(
    (dataUrl) => {
      const el = textareaRef.current;
      if (!el || !dataUrl) return;
      el.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${dataUrl}" alt="image" style="max-width:100%;height:auto;" />`,
      );
      onChangeText(el.innerHTML);
    },
    [onChangeText],
  );

  const insertImageFile = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = () => insertImageDataUrl(reader.result);
      reader.readAsDataURL(file);
    },
    [insertImageDataUrl],
  );

  const onPaste = useCallback(
    (e) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.kind === "file" && item.type?.startsWith("image/"));
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) insertImageFile(file);
    },
    [insertImageFile],
  );

  const onDrop = useCallback(
    (e) => {
      const files = Array.from(e.dataTransfer?.files ?? []);
      const imageFile = files.find((file) => file.type?.startsWith("image/"));
      if (!imageFile) return;
      e.preventDefault();
      insertImageFile(imageFile);
    },
    [insertImageFile],
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key !== "Backspace") return;
      const selection = window.getSelection();
      if (!selection || !selection.isCollapsed) return;
      const anchorNode = selection.anchorNode;
      if (!anchorNode) return;

      const el = textareaRef.current;
      if (!el) return;

      if (anchorNode.nodeType === Node.TEXT_NODE) {
        if (selection.anchorOffset !== 0) return;
        const prev = anchorNode.previousSibling;
        if (prev && prev.nodeName === "IMG") {
          e.preventDefault();
          prev.remove();
          onChangeText(el.innerHTML);
        }
        return;
      }

      if (anchorNode.nodeType === Node.ELEMENT_NODE) {
        const idx = selection.anchorOffset - 1;
        const prev = anchorNode.childNodes?.[idx];
        if (prev && prev.nodeName === "IMG") {
          e.preventDefault();
          prev.remove();
          onChangeText(el.innerHTML);
        }
      }
    },
    [onChangeText],
  );

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

      <Toolbar textareaRef={textareaRef} onApply={onChangeText} onInsertImage={insertImageFile} />

      <div className="flex flex-col justify-start items-start self-stretch flex-1 min-h-0 relative overflow-hidden px-2.5 py-4 rounded-2xl bg-[#efebe4]">
        <div className="flex flex-col w-full h-full min-h-0">
          <div
            data-testid="note-textarea"
            ref={textareaRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => onChangeText(textareaRef.current?.innerHTML ?? "")}
            onPaste={onPaste}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onKeyDown={onKeyDown}
            className="self-stretch flex-1 min-h-0 w-full overflow-y-auto text-sm text-left text-black bg-transparent outline-none border-none"
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
