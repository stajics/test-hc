import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { ENDPOINTS, QUERY_KEYS, QueryConfig, tmbdApi } from "@/lib/utils/api";
import { MoviesResponse } from "@/types/movies";
import { AxiosResponse } from "axios";

export type PopularMoviesParams = {
  page?: number;
  language?: string;
  region?: string;
};

const getPopularMovies = async ({
  page = 1,
  language = "en-US",
  region,
}: PopularMoviesParams = {}): Promise<AxiosResponse<MoviesResponse>> => {
  const queryParams: Record<string, number | string> = {
    page,
    language,
  };

  if (region) {
    queryParams.region = region;
  }

  return tmbdApi.get<MoviesResponse>(ENDPOINTS.POPULAR_MOVIES, {
    params: queryParams,
  });
};

export const getPopularMoviesQueryOptions = (
  params: PopularMoviesParams = {}
) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.POPULAR_MOVIES, params],
    queryFn: async () => {
      const response = await getPopularMovies(params);
      return response.data;
    },
  });
};

type UseGetPopularMoviesOptions = {
  params?: PopularMoviesParams;
  queryConfig?: QueryConfig<typeof getPopularMoviesQueryOptions>;
};

export const usePopularMovies = ({
  params = {},
  queryConfig,
}: UseGetPopularMoviesOptions = {}) => {
  return useQuery({
    placeholderData: keepPreviousData,
    ...getPopularMoviesQueryOptions(params),
    ...queryConfig,
  });
};
