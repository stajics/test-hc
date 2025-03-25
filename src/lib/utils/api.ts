import axios from "axios";

const TMDB_API_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_ACCESS_TOKEN;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const tmbdApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_ACCESS_TOKEN,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export const QUERY_KEYS = {
  POPULAR_MOVIES: "POPULAR_MOVIES",
  SEARCH_MOVIES: "SEARCH_MOVIES",
  MOVIE_DETAILS: "MOVIE_DETAILS",
  TOP_RATED_MOVIES: "TOP_RATED_MOVIES",
};

export const ENDPOINTS = {
  POPULAR_MOVIES: `/movie/popular`,
  SEARCH_MOVIES: `/search/movie`,
  MOVIE_DETAILS: (id: number) => `/movie/${id}`,
  TOP_RATED_MOVIES: `/movie/top_rated`,
};
