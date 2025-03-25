import { useMemo, useState } from "react";
import { usePopularMovies } from "@/lib/hooks/api/tmdb/getPopularMovies";
import { useSearchMovies } from "@/lib/hooks/api/tmdb/searchMovies";

import { SearchBar } from "@/pages/movies/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/pages/movies/components/MovieCard/MovieCard";
import { useTopRatedMovies } from "@/lib/hooks/api/tmdb/getTopRatedMovies";

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: popularMoviesData,
    isFetching: isFetchingPopular,
    error: popularError,
  } = usePopularMovies();
  const {
    data: searchResults,
    isFetching: isFetchingSearch,
    error: searchError,
  } = useSearchMovies({
    params: { query: searchQuery },
  });
  const {
    data: topRatedMovies,
    isFetching: isFetchingTopRatedMovies,
    error: topRatedError,
  } = useTopRatedMovies({});

  const [currentTab, setCurrentTab] = useState("popular");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Determine which movies to display
  const isSearching = currentTab === "search";

  const movies = useMemo(() => {
    switch (currentTab) {
      case "popular":
        return popularMoviesData?.results;
      case "search":
        return searchResults?.results;
      case "top_rated":
        return topRatedMovies?.results;
    }
  }, [currentTab, popularMoviesData, searchResults, topRatedMovies]);

  const isLoading = isSearching
    ? isFetchingSearch
    : isFetchingPopular || isFetchingTopRatedMovies;
  const hasError = popularError || searchError || topRatedError;

  return (
    <div className="container py-8 space-y-6 mx-auto px-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Movie Explorer</h1>
        <p className="text-muted-foreground">
          Discover popular movies and search for your favorites.
        </p>
      </div>

      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

        <div className="flex">
          <h2
            className={`text-xl font-semibold mr-2 ${
              currentTab === "popular" && "text-blue-500"
            }`}
            onClick={() => setCurrentTab("popular")}
          >
            Popular Movies
          </h2>
          <h2
            className={`text-xl font-semibold mr-2 ${
              currentTab === "search" && "text-blue-500"
            }`}
            onClick={() => setCurrentTab("search")}
          >
            Search
          </h2>
          <h2
            className={`text-xl font-semibold mr-2 ${
              currentTab === "top_rated" && "text-blue-500"
            }`}
            onClick={() => setCurrentTab("top_rated")}
          >
            Top Rated Movies
          </h2>
        </div>

        {isSearching && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results for "{searchQuery}"
            </h2>
            <Button size="sm" onClick={clearSearch}>
              Back to Popular
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p>Loading movies...</p>
          </div>
        )}

        {hasError && (
          <div className="text-center py-8 text-destructive">
            <p>Error loading movies. Please try again.</p>
          </div>
        )}

        {!isLoading && !hasError && movies && movies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isSearching
                ? `No results found for "${searchQuery}"`
                : "No popular movies available right now."}
            </p>
          </div>
        )}

        {!isLoading && !hasError && movies && movies.length > 0 && (
          <div className="grid gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
