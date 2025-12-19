import { useQuery } from '@tanstack/react-query';

import { fetchPokemonsByType } from './helpers';

export const usePokemonsByType = (type: string, limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['pokemon', 'type', type, limit, offset],
    queryFn: () => fetchPokemonsByType(type, limit, offset),
    enabled: !!type,
  });
};
