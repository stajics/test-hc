import { queryOptions, useQuery } from "@tanstack/react-query";
import { ENDPOINTS, QUERY_KEYS, QueryConfig, tmbdApi } from "@/lib/utils/api";
import { MoviesResponse } from "@/types/movies";
import { AxiosResponse } from "axios";

const getTopRatedMovies = async (): Promise<AxiosResponse<MoviesResponse>> => {
  return tmbdApi.get<MoviesResponse>(ENDPOINTS.TOP_RATED_MOVIES);
};

export const getTopRatedMoviesQueryOptions = () => {
  return queryOptions({
    queryKey: [QUERY_KEYS.TOP_RATED_MOVIES],
    queryFn: async () => {
      const response = await getTopRatedMovies();
      return response.data;
    },
  });
};

type UseTopRatedMoviesOptions = {
  queryConfig?: QueryConfig<typeof getTopRatedMoviesQueryOptions>;
};

export const useTopRatedMovies = ({
  queryConfig,
}: UseTopRatedMoviesOptions) => {
  return useQuery({
    ...getTopRatedMoviesQueryOptions(),
    ...queryConfig,
  });
};
