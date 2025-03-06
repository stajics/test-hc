/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useSearchMovies,
  getSearchMoviesQueryOptions,
  SearchMoviesParams,
} from "../searchMovies";
import { tmbdApi, ENDPOINTS } from "@/lib/utils/api";
import { MoviesResponse } from "@/types/movies";

// Mock the TMDB API
vi.mock("@/lib/utils/api", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    tmbdApi: {
      get: vi.fn(),
    },
  };
});

// Create a wrapper for the query client
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock movie data
const mockMoviesResponse: MoviesResponse = {
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

describe("searchMovies", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock response
    (tmbdApi.get as any).mockResolvedValue({
      data: mockMoviesResponse,
    });
  });

  describe("getSearchMoviesQueryOptions", () => {
    it("should return query options with correct query key", () => {
      const params: SearchMoviesParams = { query: "test" };
      const options = getSearchMoviesQueryOptions(params);

      expect(options.queryKey).toEqual(["SEARCH_MOVIES", "test"]);
      expect(typeof options.queryFn).toBe("function");
      expect(options.enabled).toBe(true);
    });

    it("should disable query when query param is empty", () => {
      const params: SearchMoviesParams = { query: "" };
      const options = getSearchMoviesQueryOptions(params);

      expect(options.enabled).toBe(false);
    });
  });

  describe("useSearchMovies", () => {
    it("should fetch movies with the correct params", async () => {
      const params: SearchMoviesParams = {
        query: "test query",
        page: 2,
        language: "fr-FR",
      };

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchMovies({ params }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockMoviesResponse);
      });

      expect(tmbdApi.get).toHaveBeenCalledWith(ENDPOINTS.SEARCH_MOVIES, {
        params: {
          query: "test query",
          page: 2,
          language: "fr-FR",
        },
      });
    });

    it("should use default values when optional params are not provided", async () => {
      const params: SearchMoviesParams = { query: "test query" };

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchMovies({ params }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockMoviesResponse);
      });

      expect(tmbdApi.get).toHaveBeenCalledWith(ENDPOINTS.SEARCH_MOVIES, {
        params: {
          query: "test query",
          page: 1,
          language: "en-US",
        },
      });
    });

    it("should handle empty query string", async () => {
      const params: SearchMoviesParams = { query: "" };

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchMovies({ params }), {
        wrapper,
      });

      // Query should not run when query string is empty
      expect(tmbdApi.get).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });

    it("should handle API errors", async () => {
      // Mock API error
      const errorMessage = "Failed to fetch movies";
      (tmbdApi.get as any).mockRejectedValueOnce(new Error(errorMessage));

      const params: SearchMoviesParams = { query: "error test" };

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchMovies({ params }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBeDefined();
      });

      expect(tmbdApi.get).toHaveBeenCalledTimes(1);
    });
  });
});
