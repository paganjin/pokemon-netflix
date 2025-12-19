import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPokemonList } from './helpers';

export const useInfinitePokemonList = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'infinite', limit],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(limit, pageParam),
    getNextPageParam: (lastPage, pages) => {
      const nextOffset = pages.length * limit;
      return nextOffset < lastPage.count ? nextOffset : undefined;
    },
    initialPageParam: 0,
  });
};
