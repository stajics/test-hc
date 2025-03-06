import { Link } from "react-router-dom";
import { Movie } from "@/types/movies";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { formatReleaseDate } from "@/lib/utils/date";
import { buildPosterUrl } from "@/lib/utils/movie";

export interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // Build the poster URL
  const posterUrl = buildPosterUrl(movie.poster_path, "w185");

  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className="flex flex-row overflow-hidden hover:bg-muted/50 cursor-pointer transition-colors">
        <div className="w-24 md:w-32 shrink-0">
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col flex-1">
          <CardHeader className="p-4">
            <CardTitle className="text-lg md:text-xl line-clamp-2">
              {movie.title}
            </CardTitle>
            <CardDescription>
              {formatReleaseDate(movie.release_date)}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 mt-auto">
            <Rating value={movie.vote_average} className="ml-auto" />
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
