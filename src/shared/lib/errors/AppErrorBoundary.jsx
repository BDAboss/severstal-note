import React from "react";
import toast from "react-hot-toast";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? "Unknown error" };
  }

  componentDidCatch(error) {
    toast.error(`Критическая ошибка: ${error?.message ?? "unknown"}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-[#f5ead6]">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 pb-10 pt-8">
            <p className="text-2xl font-bold text-left text-[#0f172b]">
              Мои заметки
            </p>

            <div className="flex w-full items-center justify-center">
              <div
                className="flex w-full max-w-[820px] flex-col justify-start items-start overflow-hidden gap-3 px-5 pt-[15px] pb-5 rounded-[20px] bg-[#fbf7ef]"
                style={{ boxShadow: "0px 4px 12px 0 rgba(0,0,0,0.25)" }}
              >
                <div className="flex flex-col justify-center items-start self-stretch gap-1 px-2.5 py-[10px] rounded-lg bg-white">
                  <h1 className="text-[15px] font-semibold text-black">
                    Что-то пошло не так
                  </h1>
                  <p className="text-sm text-[#90a1b9]">
                    Приложение столкнулось с критической ошибкой. Можно
                    перезагрузить страницу и продолжить работу.
                  </p>
                </div>

                <div className="self-stretch rounded-2xl bg-[#efebe4] px-4 py-3">
                  <p className="text-xs font-medium text-black mb-1">
                    Текст ошибки
                  </p>
                  <pre className="text-xs text-black whitespace-pre-wrap break-words">
                    {this.state.message}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="flex justify-center items-center gap-2.5 px-4 py-2 rounded-[26px] cursor-pointer hover:opacity-90 transition-opacity text-sm font-semibold text-white"
                    style={{
                      background:
                        "linear-gradient(to right, #fca311 -2.31%, #ef6c1a 102.31%)",
                    }}
                  >
                    Перезагрузить
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="px-4 py-2 rounded-[26px] bg-white border border-[#b5b5b5] hover:bg-gray-50 transition-colors text-sm font-semibold text-black"
                    title="Удалит сохранённые заметки и перезагрузит страницу"
                  >
                    Сбросить данные
                  </button>
                </div>

                <p className="text-xs text-[#90a1b9] mt-1">
                  Если ошибка повторяется, попробуй “Сбросить данные”.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
