import type { Pokemon, NamedAPIResource } from 'pokenode-ts';

import type { PokemonListResponse } from '../types';
import { pokemonClient } from '../utils/pokemonClient';

/**
 * Fetches a paginated list of Pokemon with full data including types
 * @param limit - Number of Pokemon to fetch (default: 20)
 * @param offset - Starting position for pagination (default: 0)
 * @returns Promise resolving to PokemonListResponse with full Pokemon data
 */
export const fetchPokemonList = async (
  limit = 20,
  offset = 0,
): Promise<PokemonListResponse> => {
  if (limit <= 0 || offset < 0) {
    throw new Error(
      'Invalid pagination parameters: limit must be > 0 and offset must be >= 0',
    );
  }

  try {
    const data = await pokemonClient.listPokemons(offset, limit);

    // Fetch full Pokemon data for each result to get types
    const pokemonPromises = data.results.map(
      async (pokemon: NamedAPIResource) => {
        return await fetchPokemonByName(pokemon.name);
      },
    );

    const fullPokemonData = await Promise.all(pokemonPromises);

    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: fullPokemonData,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch Pokemon list: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Fetches a single Pokemon by ID
 * @param id - Pokemon ID (must be positive integer)
 * @returns Promise resolving to Pokemon data
 */
export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid Pokemon ID: must be a positive integer');
  }

  try {
    return await pokemonClient.getPokemonById(id);
  } catch (error) {
    throw new Error(
      `Failed to fetch Pokemon with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Fetches a single Pokemon by name
 * @param name - Pokemon name (must be non-empty string)
 * @returns Promise resolving to Pokemon data
 */
export const fetchPokemonByName = async (name: string): Promise<Pokemon> => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Invalid Pokemon name: must be a non-empty string');
  }

  try {
    return await pokemonClient.getPokemonByName(name.toLowerCase().trim());
  } catch (error) {
    throw new Error(
      `Failed to fetch Pokemon '${name}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Searches Pokemon by name containing the query string
 * @param query - Search query (must be non-empty string)
 * @param limit - Maximum number of results to return (default: 20)
 * @returns Promise resolving to array of matching Pokemon
 */
export const searchPokemon = async (
  query: string,
  limit = 20,
): Promise<Pokemon[]> => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Invalid search query: must be a non-empty string');
  }

  if (limit <= 0) {
    throw new Error('Invalid limit: must be greater than 0');
  }

  try {
    const data = await pokemonClient.listPokemons(0, 1000);

    const normalizedQuery = query.toLowerCase().trim();
    const filtered = data.results
      .filter((pokemon: NamedAPIResource) =>
        pokemon.name.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, limit);

    // Fetch full Pokemon data for each result to get types
    const pokemonPromises = filtered.map(async (pokemon: NamedAPIResource) => {
      return await fetchPokemonByName(pokemon.name);
    });

    return await Promise.all(pokemonPromises);
  } catch (error) {
    throw new Error(
      `Failed to search Pokemon: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Fetches Pokemon of a specific type with pagination
 * @param type - Pokemon type name (must be non-empty string)
 * @param limit - Number of Pokemon to fetch (default: 20)
 * @param offset - Starting position for pagination (default: 0)
 * @returns Promise resolving to object with results, hasMore flag, and total count
 */
export const fetchPokemonsByType = async (
  type: string,
  limit = 20,
  offset = 0,
): Promise<{ results: Pokemon[]; hasMore: boolean; total: number }> => {
  if (!type || typeof type !== 'string' || type.trim().length === 0) {
    throw new Error('Invalid Pokemon type: must be a non-empty string');
  }

  if (limit <= 0 || offset < 0) {
    throw new Error(
      'Invalid pagination parameters: limit must be > 0 and offset must be >= 0',
    );
  }

  try {
    const typeData = await pokemonClient.getTypeByName(
      type.toLowerCase().trim(),
    );

    const allPokemon = typeData.pokemon.map(
      (entry: { pokemon: NamedAPIResource }) => ({
        name: entry.pokemon.name,
      }),
    );

    const total = allPokemon.length;
    const paginatedPokemon = allPokemon.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    // Fetch full Pokemon data for each result to get types
    const pokemonPromises = paginatedPokemon.map(
      async (pokemon: { name: string }) => {
        return await fetchPokemonByName(pokemon.name);
      },
    );

    const fullPokemonData = await Promise.all(pokemonPromises);

    return {
      results: fullPokemonData,
      hasMore,
      total,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch Pokemon by type '${type}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
