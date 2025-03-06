import { useState } from "react";
import { usePopularMovies } from "@/lib/hooks/api/tmdb/getPopularMovies";
import { useSearchMovies } from "@/lib/hooks/api/tmdb/searchMovies";

import { SearchBar } from "@/pages/movies/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/pages/movies/components/MovieCard/MovieCard";

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Determine which movies to display
  const isSearching = searchQuery.trim() !== "";
  const movies = isSearching
    ? searchResults?.results
    : popularMoviesData?.results;

  const isLoading = isSearching ? isFetchingSearch : isFetchingPopular;
  const hasError = popularError || searchError;

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

        {!isSearching && (
          <h2 className="text-xl font-semibold">Popular Movies</h2>
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
