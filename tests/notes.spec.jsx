import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/app/App.jsx";

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

    await user.click(screen.getByTestId("create-note-btn"));

    const textarea = screen.getByTestId("note-textarea");
    await user.clear(textarea);
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("hello");
  });

  it("persists notes between sessions", async () => {
    const user = userEvent.setup();
    render(<App />);

    const textarea = screen.getByTestId("note-textarea");
    await user.clear(textarea);
    await user.type(textarea, "persist me");
    expect(textarea).toHaveValue("persist me");

    cleanup();
    render(<App />);

    const textarea2 = screen.getByTestId("note-textarea");
    expect(textarea2).toHaveValue("persist me");
  });
});
