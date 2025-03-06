import { TMDB_IMAGE_BASE_URL } from "./api";
import { MovieDetails, POSTER_SIZE } from "@/types/movies";

export const buildPosterUrl = (
  posterPath: string | null | undefined,
  size: POSTER_SIZE
) => {
  return posterPath
    ? `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
    : "/placeholder-poster.png";
};

export const getPrimaryLanguage = (movie?: MovieDetails) => {
  return movie?.spoken_languages?.length
    ? movie.spoken_languages[0].english_name
    : "Unknown";
};

export const formatRuntime = (minutes?: number | null) => {
  if (!minutes) return "Unknown";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
