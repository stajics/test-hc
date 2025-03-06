import { useParams, useNavigate } from "react-router-dom";
import { useMovieDetails } from "@/lib/hooks/api/tmdb/getMovieDetails";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Globe } from "lucide-react";
import { formatReleaseDate } from "@/lib/utils/date";
import {
  buildPosterUrl,
  formatRuntime,
  getPrimaryLanguage,
} from "@/lib/utils/movie";

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = parseInt(id || "0", 10);

  const {
    data: movie,
    isLoading,
    error,
  } = useMovieDetails({
    params: { id: movieId },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const posterUrl = buildPosterUrl(movie?.poster_path, "w500");
  const primaryLanguage = getPrimaryLanguage(movie);

  return (
    <div className="container py-8 mx-auto px-4">
      <Button size="sm" className="mb-6" onClick={handleBack}>
        <ArrowLeft className="size-4 mr-2" />
        Back
      </Button>

      {isLoading && (
        <div className="text-center py-8">
          <p>Loading movie details...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-destructive">
          <p>Error loading movie details. Please try again.</p>
        </div>
      )}

      {movie && (
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="rounded-lg overflow-hidden">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {movie.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {formatReleaseDate(movie?.release_date)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <Rating value={movie.vote_average} />

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="size-4 mr-2" />
                {formatRuntime(movie.runtime)}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="size-4 mr-2" />
                {primaryLanguage}
              </div>
            </div>

            {movie.tagline && (
              <p className="italic text-muted-foreground">{movie.tagline}</p>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p>{movie.overview || "No overview available."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
