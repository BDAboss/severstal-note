import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/app/App.jsx";

beforeEach(() => {
  if (!globalThis.crypto) globalThis.crypto = {};
  if (!globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = vi.fn(() => "test-uuid-" + Math.random());
  }
});

describe("Notes App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows initial note on first launch", () => {
    render(<App />);
    expect(screen.getByText("Первая заметка")).toBeInTheDocument();
  });

  it("can create and edit note", async () => {
    const user = userEvent.setup();
    render(<App />);

    const createBtn = screen.getByRole("button", { name: "Добавить заметку" });
    await user.click(createBtn);

    const editor = screen.getByTestId("note-textarea");

    await user.click(editor);
    await user.keyboard("{Control>}{KeyA}{/Control}{Backspace}");
    await user.keyboard("hello");

    expect(editor).toHaveTextContent("hello");
  });

  it("persists notes between sessions", async () => {
    const user = userEvent.setup();
    render(<App />);

    const editor = screen.getByTestId("note-textarea");

    await user.click(editor);
    await user.keyboard("{Control>}{KeyA}{/Control}{Backspace}");
    await user.keyboard("persist me");

    expect(editor).toHaveTextContent("persist me");

    await waitFor(() => {
      const raw = localStorage.getItem("notes_app_tailwind_v1");
      expect(raw).toBeTruthy();
      expect(raw).toContain("persist me");
    });

    cleanup();
    render(<App />);

    const editor2 = screen.getByTestId("note-textarea");

    await waitFor(() => {
      expect(editor2).toHaveTextContent("persist me");
    });
  });
});
