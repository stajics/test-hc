import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("renders correctly with empty initial query", () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it("renders correctly with initial query", () => {
    const initialQuery = "Initial search";
    render(<SearchBar onSearch={vi.fn()} initialQuery={initialQuery} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    expect(input).toHaveValue(initialQuery);
  });

  it("updates input value on type", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(
      "Search for movies..."
    ) as HTMLInputElement;
    await user.type(input, "test query");

    expect(input.value).toBe("test query");
  });

  it("calls onSearch when form is submitted", async () => {
    const onSearchMock = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearchMock} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    await user.type(input, "test search");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(onSearchMock).toHaveBeenCalledWith("test search");
  });

  it("calls onSearch when Enter key is pressed", async () => {
    const onSearchMock = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearchMock} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    await user.type(input, "keyboard search{Enter}");

    expect(onSearchMock).toHaveBeenCalledWith("keyboard search");
  });

  it("does not call onSearch when empty query is submitted", async () => {
    const onSearchMock = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearchMock} />);

    // Empty form submission
    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(onSearchMock).not.toHaveBeenCalled();
  });

  it("does not call onSearch when whitespace-only query is submitted", async () => {
    const onSearchMock = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearchMock} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    await user.type(input, "   ");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(onSearchMock).not.toHaveBeenCalled();
  });

  it("trims whitespace from query when submitting", async () => {
    const onSearchMock = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearchMock} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    await user.type(input, "  test with spaces  ");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(onSearchMock).toHaveBeenCalledWith("test with spaces");
  });
});
