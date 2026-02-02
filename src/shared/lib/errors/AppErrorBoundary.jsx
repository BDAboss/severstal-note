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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
            <p className="mt-2 text-sm text-slate-300">{this.state.message}</p>
            <button
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-100 border border-sky-400/30 hover:bg-sky-500/30"
              onClick={() => window.location.reload()}
              type="button"
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
