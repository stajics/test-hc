import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { ENDPOINTS, QUERY_KEYS, QueryConfig, tmbdApi } from "@/lib/utils/api";
import { MoviesResponse } from "@/types/movies";
import { AxiosResponse } from "axios";

export type SearchMoviesParams = {
  query: string;
  page?: number;
  language?: string;
};

const searchMovies = async ({
  query,
  page = 1,
  language = "en-US",
}: SearchMoviesParams): Promise<AxiosResponse<MoviesResponse>> => {
  const queryParams: Record<string, string | number> = {
    query,
    page,
    language,
  };

  return tmbdApi.get<MoviesResponse>(ENDPOINTS.SEARCH_MOVIES, {
    params: queryParams,
  });
};

export const getSearchMoviesQueryOptions = (params: SearchMoviesParams) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.SEARCH_MOVIES, params.query],
    queryFn: async () => {
      const response = await searchMovies(params);
      return response.data;
    },
    enabled: !!params.query,
  });
};

type UseSearchMoviesOptions = {
  params: SearchMoviesParams;
  queryConfig?: QueryConfig<typeof getSearchMoviesQueryOptions>;
};

export const useSearchMovies = ({
  params,
  queryConfig,
}: UseSearchMoviesOptions) => {
  return useQuery({
    placeholderData: keepPreviousData,
    ...getSearchMoviesQueryOptions(params),
    ...queryConfig,
  });
};
