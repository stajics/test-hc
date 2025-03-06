import { queryOptions, useQuery } from "@tanstack/react-query";
import { ENDPOINTS, QUERY_KEYS, QueryConfig, tmbdApi } from "@/lib/utils/api";
import { MovieDetails } from "@/types/movies";
import { AxiosResponse } from "axios";

export type MovieDetailsParams = {
  id: number;
  language?: string;
  append_to_response?: string;
};

const getMovieDetails = async ({
  id,
  language = "en-US",
  append_to_response,
}: MovieDetailsParams): Promise<AxiosResponse<MovieDetails>> => {
  const queryParams: Record<string, string> = {
    language,
  };

  if (append_to_response) {
    queryParams.append_to_response = append_to_response;
  }

  return tmbdApi.get<MovieDetails>(ENDPOINTS.MOVIE_DETAILS(id), {
    params: queryParams,
  });
};

export const getMovieDetailsQueryOptions = (params: MovieDetailsParams) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.MOVIE_DETAILS, params.id],
    queryFn: async () => {
      const response = await getMovieDetails(params);
      return response.data;
    },
  });
};

type UseGetMovieDetailsOptions = {
  params: MovieDetailsParams;
  queryConfig?: QueryConfig<typeof getMovieDetailsQueryOptions>;
};

export const useMovieDetails = ({
  params,
  queryConfig,
}: UseGetMovieDetailsOptions) => {
  return useQuery({
    ...getMovieDetailsQueryOptions(params),
    ...queryConfig,
  });
};
