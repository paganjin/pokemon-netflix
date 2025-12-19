import { useQuery } from '@tanstack/react-query';

import { searchPokemon } from './helpers';

export const useSearchPokemon = (query: string, limit = 20) => {
  return useQuery({
    queryKey: ['pokemon', 'search', query, limit],
    queryFn: () => searchPokemon(query, limit),
    enabled: query.length > 0,
  });
};
