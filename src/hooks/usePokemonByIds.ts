import { useQueries } from '@tanstack/react-query';

import { fetchPokemonById } from './helpers';

export const usePokemonByIds = (ids: number[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: () => fetchPokemonById(id),
      enabled: !!id,
    })),
  });
};
