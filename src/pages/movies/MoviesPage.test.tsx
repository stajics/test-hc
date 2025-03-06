/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomePage } from "./MoviesPage";
import { usePopularMovies } from "@/lib/hooks/api/tmdb/getPopularMovies";
import { useSearchMovies } from "@/lib/hooks/api/tmdb/searchMovies";
import { BrowserRouter } from "react-router-dom";

// Mock the hooks
vi.mock("@/lib/hooks/api/tmdb/getPopularMovies", () => ({
  usePopularMovies: vi.fn(),
}));

vi.mock("@/lib/hooks/api/tmdb/searchMovies", () => ({
  useSearchMovies: vi.fn(),
}));

// Mock movie data
const mockMovies = {
  results: [
    {
      id: 1,
      title: "Test Movie 1",
      poster_path: "/test1.jpg",
      release_date: "2023-01-01",
      vote_average: 8.5,
      overview: "This is test movie 1",
      adult: false,
      backdrop_path: "/backdrop1.jpg",
      genre_ids: [28, 12],
      original_language: "en",
      original_title: "Test Movie 1",
      popularity: 100.5,
      video: false,
      vote_count: 1000,
    },
    {
      id: 2,
      title: "Test Movie 2",
      poster_path: "/test2.jpg",
      release_date: "2023-02-01",
      vote_average: 7.5,
      overview: "This is test movie 2",
      adult: false,
      backdrop_path: "/backdrop2.jpg",
      genre_ids: [27, 53],
      original_language: "en",
      original_title: "Test Movie 2",
      popularity: 95.2,
      video: false,
      vote_count: 800,
    },
  ],
  page: 1,
  total_pages: 10,
  total_results: 20,
};

// Wrapper component with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock implementations
    (usePopularMovies as any).mockReturnValue({
      data: mockMovies,
      isFetching: false,
      error: null,
    });

    (useSearchMovies as any).mockReturnValue({
      data: null,
      isFetching: false,
    });
  });

  it("renders the homepage title correctly", () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText("Movie Explorer")).toBeInTheDocument();
    expect(
      screen.getByText("Discover popular movies and search for your favorites.")
    ).toBeInTheDocument();
  });

  it("displays popular movies when loaded", () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Test Movie 2")).toBeInTheDocument();
  });

  it("shows loading state when fetching popular movies", () => {
    (usePopularMovies as any).mockReturnValue({
      data: null,
      isFetching: true,
      error: null,
    });

    renderWithRouter(<HomePage />);
    expect(screen.getByText("Loading movies...")).toBeInTheDocument();
  });

  it("shows error state when popular movies fetch fails", () => {
    (usePopularMovies as any).mockReturnValue({
      data: null,
      isFetching: false,
      error: new Error("Failed to fetch"),
    });

    renderWithRouter(<HomePage />);
    expect(
      screen.getByText("Error loading movies. Please try again.")
    ).toBeInTheDocument();
  });

  it("shows empty state when no popular movies are available", () => {
    (usePopularMovies as any).mockReturnValue({
      data: { ...mockMovies, results: [] },
      isFetching: false,
      error: null,
    });

    renderWithRouter(<HomePage />);
    expect(
      screen.getByText("No popular movies available right now.")
    ).toBeInTheDocument();
  });

  it("allows searching for movies", async () => {
    const user = userEvent.setup();

    const mockSearchResults = {
      ...mockMovies,
      results: [
        {
          ...mockMovies.results[0],
          id: 3,
          title: "Search Result Movie",
        },
      ],
    };

    // Initially return empty search results
    (useSearchMovies as any).mockReturnValue({
      data: null,
      isFetching: false,
    });

    renderWithRouter(<HomePage />);

    // Update mock for when search is performed
    (useSearchMovies as any).mockReturnValue({
      data: mockSearchResults,
      isFetching: false,
    });

    // Type in search box
    const searchInput =
      screen.getByPlaceholderText("Search for movies...") ||
      screen.getByRole("textbox");
    await user.type(searchInput, "test search");

    // Submit the search form
    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    // Check if search results are displayed
    await waitFor(() => {
      expect(
        screen.getByText('Search Results for "test search"')
      ).toBeInTheDocument();
      expect(screen.getByText("Search Result Movie")).toBeInTheDocument();
      expect(screen.getByText("Back to Popular")).toBeInTheDocument();
    });
  });

  it("shows loading state when searching", async () => {
    const user = userEvent.setup();

    // Mock search in progress
    (useSearchMovies as any).mockReturnValue({
      data: null,
      isFetching: true,
    });

    renderWithRouter(<HomePage />);

    // Type and submit search
    const searchInput =
      screen.getByPlaceholderText("Search for movies...") ||
      screen.getByRole("textbox");
    await user.type(searchInput, "loading test");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    // Check if loading state is displayed
    await waitFor(() => {
      expect(screen.getByText("Loading movies...")).toBeInTheDocument();
    });
  });

  it("shows empty state when search returns no results", async () => {
    const user = userEvent.setup();

    // Mock empty search results
    (useSearchMovies as any).mockReturnValue({
      data: { ...mockMovies, results: [] },
      isFetching: false,
    });

    renderWithRouter(<HomePage />);

    // Type and submit search
    const searchInput =
      screen.getByPlaceholderText("Search for movies...") ||
      screen.getByRole("textbox");
    await user.type(searchInput, "nonexistent movie");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    // Check if empty state is displayed
    await waitFor(() => {
      expect(
        screen.getByText('No results found for "nonexistent movie"')
      ).toBeInTheDocument();
    });
  });

  it('returns to popular movies when clicking "Back to Popular" button', async () => {
    const user = userEvent.setup();

    // Mock search results
    (useSearchMovies as any).mockReturnValue({
      data: {
        ...mockMovies,
        results: [{ ...mockMovies.results[0], title: "Search Result" }],
      },
      isFetching: false,
    });

    renderWithRouter(<HomePage />);

    // Perform search
    const searchInput =
      screen.getByPlaceholderText("Search for movies...") ||
      screen.getByRole("textbox");
    await user.type(searchInput, "search query");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    // Verify search results are showing
    await waitFor(() => {
      expect(
        screen.getByText('Search Results for "search query"')
      ).toBeInTheDocument();
    });

    // Click back to popular
    const backButton = screen.getByRole("button", { name: "Back to Popular" });
    await user.click(backButton);

    // Verify we're back to popular movies
    await waitFor(() => {
      expect(screen.getByText("Popular Movies")).toBeInTheDocument();
      expect(
        screen.queryByText('Search Results for "search query"')
      ).not.toBeInTheDocument();
    });
  });
});
