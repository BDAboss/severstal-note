import React, { useMemo, useState, useCallback, useRef } from "react";

function exec(cmd, value = null) {
  document.execCommand(cmd, false, value);
}

function keepSelectionAndFocus(el, fn) {
  if (!el) return;
  el.focus();
  fn();
  el.focus();
}

export default function Toolbar({ textareaRef, onApply, onInsertImage }) {
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const imageInputRef = useRef(null);

  // что показываем в кнопках
  const [selectedFontLabel, setSelectedFontLabel] = useState("Шрифт");
  const [selectedSizeLabel, setSelectedSizeLabel] = useState("Размер");

  const fonts = useMemo(
    () => [
      { label: "Inter", value: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
      { label: "Arial", value: "Arial, Helvetica, sans-serif" },
      { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
      { label: "Georgia", value: "Georgia, serif" },
      { label: "Courier New", value: '"Courier New", Courier, monospace' },
      { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
    ],
    [],
  );

  const sizes = useMemo(
    () => [
      { label: "10", value: 1 },
      { label: "12", value: 2 },
      { label: "14", value: 3 },
      { label: "16", value: 4 },
      { label: "18", value: 5 },
      { label: "24", value: 6 },
      { label: "32", value: 7 },
    ],
    [],
  );

  const syncHtml = useCallback(() => {
    const el = textareaRef?.current;
    if (!el) return;
    onApply?.(el.innerHTML);
  }, [onApply, textareaRef]);

  const applyInline = useCallback(
    (type) => {
      const el = textareaRef.current;
      if (!el) return;

      const map = { bold: "bold", italic: "italic", underline: "underline" };
      keepSelectionAndFocus(el, () => exec(map[type]));
      syncHtml();
    },
    [textareaRef, syncHtml],
  );

  const applyFont = useCallback(
    (font) => {
      const el = textareaRef.current;
      if (!el) return;

      keepSelectionAndFocus(el, () => exec("fontName", font.value));
      setSelectedFontLabel(font.label); // показываем выбранный шрифт
      setFontOpen(false);
      syncHtml();
    },
    [textareaRef, syncHtml],
  );

  const applySize = useCallback(
    (size) => {
      const el = textareaRef.current;
      if (!el) return;

      keepSelectionAndFocus(el, () => exec("fontSize", size.value));
      setSelectedSizeLabel(size.label); // показываем выбранный размер
      setSizeOpen(false);
      syncHtml();
    },
    [textareaRef, syncHtml],
  );

  const onPickImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const onImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file || !file.type?.startsWith("image/")) {
        e.target.value = "";
        return;
      }
      onInsertImage?.(file);
      e.target.value = "";
    },
    [onInsertImage],
  );

  return (
    <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 overflow-visible gap-2.5 px-2.5 py-2 rounded-xl bg-white border border-[#787878]">
      {/* Шрифт */}
      <div className="relative">
        <button
          type="button"
          className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[198px] h-6 relative overflow-hidden px-2.5 rounded-lg bg-white border border-[#b5b5b5] cursor-pointer"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setFontOpen((v) => !v);
            setSizeOpen(false);
          }}
          title="Шрифт"
        >
          {/* тут теперь выбранное название */}
          <p className="flex-grow-0 flex-shrink-0 text-[10px] text-left text-black truncate">
            {selectedFontLabel}
          </p>
          <div className="flex items-center justify-center h-full">
            <div className="w-2 h-2 border-t border-r border-[#2D2D2D] transform rotate-135"></div>
          </div>
        </button>

        {fontOpen && (
          <div className="absolute left-0 top-7 z-[9999] w-[198px] rounded-lg border border-[#b5b5b5] bg-white shadow-sm overflow-hidden">
            {fonts.map((f) => (
              <button
                key={f.label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFont(f)}
                className="w-full px-2.5 py-1 text-left text-[10px] hover:bg-gray-50"
                style={{ fontFamily: f.value }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Размер */}
      <div className="relative">
        <button
          type="button"
          className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[75px] h-6 relative overflow-hidden px-2.5 rounded-lg bg-white border border-[#b5b5b5] cursor-pointer"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setSizeOpen((v) => !v);
            setFontOpen(false);
          }}
          title="Размер"
        >
          {/* тут теперь выбранный размер */}
          <p className="flex-grow-0 flex-shrink-0 text-[10px] text-left text-black truncate">
            {selectedSizeLabel}
          </p>
          <div className="flex items-center justify-center h-full">
            <div className="w-2 h-2 border-t border-r border-[#2D2D2D] transform rotate-135"></div>
          </div>
        </button>

        {sizeOpen && (
          <div className="absolute left-0 top-7 z-[9999] w-[75px] rounded-lg border border-[#b5b5b5] bg-white shadow-sm overflow-hidden">
            {sizes.map((s) => (
              <button
                key={s.label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applySize(s)}
                className="w-full px-2.5 py-1 text-left text-[10px] hover:bg-gray-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Жирный */}
      <button
        type="button"
        className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded bg-white border border-[#b5b5b5] cursor-pointer hover:bg-gray-50 transition-colors"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyInline("bold")}
        title="Жирный"
      >
        <p className="text-[10px] font-bold text-center text-black">Ж</p>
      </button>

      {/* Курсив */}
      <button
        type="button"
        className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded bg-white border border-[#b5b5b5] cursor-pointer hover:bg-gray-50 transition-colors"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyInline("italic")}
        title="Курсив"
      >
        <p className="text-[10px] italic text-center text-black">К</p>
      </button>

      {/* Подчёркнутый */}
      <button
        type="button"
        className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded bg-white border border-[#b5b5b5] cursor-pointer hover:bg-gray-50 transition-colors"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyInline("underline")}
        title="Подчёркнутый"
      >
        <p className="text-[10px] font-medium text-center text-black underline">Ч</p>
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
      />
      <button
        type="button"
        className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative overflow-hidden rounded bg-white border border-[#b5b5b5] cursor-pointer hover:bg-gray-50 transition-colors"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onPickImage}
        title="Insert image"
      >
        <span className="text-[10px] font-medium text-center text-black">IMG</span>
      </button>
    </div>
  );
}
