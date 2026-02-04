import React from "react";
import plusIcon from "../../../assets/icon-plus.svg";
import deleteIcon from "../../../assets/icon-delete.svg";

function htmlToText(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
}

function preview(html) {
  const text = htmlToText(html);
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (!oneLine) return "— пусто —";
  return oneLine.length > 80 ? `${oneLine.slice(0, 80)}…` : oneLine;
}

export default function NotesList({
  notes,
  activeId,
  query,
  onQueryChange,
  onSelect,
  onDelete,
  onCreate
}) {
  return (
    <div
      className="flex w-full max-w-[400px] flex-col justify-start items-center h-[924px] relative overflow-hidden gap-2.5 px-[13px] pt-[15px] pb-3.5 rounded-[20px] bg-[#fbf7ef]"
      style={{ boxShadow: "0px 4px 12px 0 rgba(0,0,0,0.25)" }}
    >
      <div className="flex justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-2.5">
        <div className="flex flex-col justify-center items-start flex-grow h-10 relative overflow-hidden gap-2.5 px-2.5 py-[5px] rounded-lg bg-white">
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Поиск..."
            className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#90a1b9] w-full bg-transparent border-none outline-none placeholder:text-[#90a1b9]"
          />
        </div>
        <button
          type="button"
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-10 h-10 relative gap-2.5 p-3 rounded-[26px] cursor-pointer hover:opacity-90 transition-opacity"
          title="Добавить заметку"
          onClick={onCreate}
          style={{ background: "linear-gradient(to right, #fca311 -2.31%, #ef6c1a 102.31%)" }}
        >
          <img 
            src={plusIcon} 
            alt="Добавить заметку" 
            className="w-4 h-4"
          />
        </button>
      </div>
      
      <div className="self-stretch flex-grow-0 flex-shrink-0 h-px relative overflow-hidden">
        <div className="full h-px absolute left-0 top-0 bg-white" />
      </div>

      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-full relative overflow-auto gap-5 p-0 rounded-[0px] bg-transparent">
        {notes.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 w-full text-center">Ничего не найдено</div>
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
                className={`flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-full relative overflow-hidden gap-3 p-5 rounded-[20px] bg-white border ${
                  isActive ? "border-[#ffac4e]" : "border-transparent"
                } cursor-pointer mb-5`}
              >
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[34px] w-60">
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[34px] gap-0">
                      <p className="self-stretch flex-grow-0 flex-shrink-0 w-full text-xs font-bold text-left text-black">
                        {n.title || "Без названия"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(n.id);
                    }}
                    title="Удалить заметку"
                    className="flex-grow-0 flex-shrink-0 w-6 h-6 cursor-pointer flex items-center justify-center rounded-full p-1 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    <img 
                      src={deleteIcon}
                      alt="Удалить заметку" 
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                
                <p className="self-stretch flex-grow-0 flex-shrink-0 w-full text-xs font-light text-left text-black mt-1">
                  {preview(n.text)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}