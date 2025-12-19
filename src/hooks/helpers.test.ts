import type {
  Pokemon,
  NamedAPIResource,
  Type,
  NamedAPIResourceList,
} from 'pokenode-ts';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { pokemonClient } from '../utils/pokemonClient';

import {
  fetchPokemonList,
  fetchPokemonById,
  fetchPokemonByName,
  searchPokemon,
  fetchPokemonsByType,
} from './helpers';

// Mock the pokemonClient
vi.mock('../utils/pokemonClient', () => ({
  pokemonClient: {
    listPokemons: vi.fn(),
    getPokemonById: vi.fn(),
    getPokemonByName: vi.fn(),
    getTypeByName: vi.fn(),
  },
}));

const mockPokemonClient = vi.mocked(pokemonClient);

// Mock data using actual pokenode-ts structures with fake URLs
// For tests, we just need consistent fake URLs that follow the pattern
const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  base_experience: 64,
  height: 7,
  is_default: true,
  order: 1,
  weight: 69,
  abilities: [
    {
      is_hidden: false,
      slot: 1,
      ability: {
        name: 'overgrow',
        url: 'fake://ability/65',
      },
    },
  ],
  forms: [
    {
      name: 'bulbasaur',
      url: 'fake://pokemon-form/1',
    },
  ],
  game_indices: [
    {
      game_index: 1,
      version: {
        name: 'red',
        url: 'fake://version/1',
      },
    },
  ],
  held_items: [],
  location_area_encounters: 'fake://pokemon/1/encounters',
  moves: [],
  species: {
    name: 'bulbasaur',
    url: 'fake://pokemon-species/1',
  },
  sprites: {
    back_default: 'fake://sprites/back/1.png',
    back_female: null,
    back_shiny: 'fake://sprites/back/shiny/1.png',
    back_shiny_female: null,
    front_default: 'fake://sprites/1.png',
    front_female: null,
    front_shiny: 'fake://sprites/shiny/1.png',
    front_shiny_female: null,
    other: {
      dream_world: { front_default: null, front_female: null },
      'official-artwork': { front_default: null, front_shiny: null },
      home: {
        front_default: null,
        front_female: null,
        front_shiny: null,
        front_shiny_female: null,
      },
    },
    versions: {
      'generation-i': {
        'red-blue': {
          back_default: null,
          back_gray: null,
          back_transparent: null,
          front_default: null,
          front_gray: null,
          front_transparent: null,
        },
        yellow: {
          back_default: null,
          back_gray: null,
          back_transparent: null,
          front_default: null,
          front_gray: null,
          front_transparent: null,
        },
      },
      'generation-ii': {
        crystal: {
          back_default: null,
          back_shiny: null,
          back_shiny_transparent: null,
          back_transparent: null,
          front_default: null,
          front_shiny: null,
          front_shiny_transparent: null,
          front_transparent: null,
        },
        gold: {
          back_default: null,
          back_shiny: null,
          front_default: null,
          front_shiny: null,
          front_transparent: null,
        },
        silver: {
          back_default: null,
          back_shiny: null,
          front_default: null,
          front_shiny: null,
          front_transparent: null,
        },
      },
      'generation-iii': {
        emerald: { front_default: null, front_shiny: null },
        'firered-leafgreen': {
          back_default: null,
          back_shiny: null,
          front_default: null,
          front_shiny: null,
        },
        'ruby-sapphire': {
          back_default: null,
          back_shiny: null,
          front_default: null,
          front_shiny: null,
        },
      },
      'generation-iv': {
        'diamond-pearl': {
          back_default: null,
          back_female: null,
          back_shiny: null,
          back_shiny_female: null,
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
        'heartgold-soulsilver': {
          back_default: null,
          back_female: null,
          back_shiny: null,
          back_shiny_female: null,
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
        platinum: {
          back_default: null,
          back_female: null,
          back_shiny: null,
          back_shiny_female: null,
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
      },
      'generation-v': {
        'black-white': {
          animated: {
            back_default: null,
            back_female: null,
            back_shiny: null,
            back_shiny_female: null,
            front_default: null,
            front_female: null,
            front_shiny: null,
            front_shiny_female: null,
          },
          back_default: null,
          back_female: null,
          back_shiny: null,
          back_shiny_female: null,
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
      },
      'generation-vi': {
        'omegaruby-alphasapphire': {
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
        'x-y': {
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
      },
      'generation-vii': {
        icons: { front_default: null, front_female: null },
        'ultra-sun-ultra-moon': {
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
      },
      'generation-viii': { icons: { front_default: null, front_female: null } },
    },
  } as Pokemon['sprites'],
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'fake://stat/1',
      },
    },
  ],
  types: [
    {
      slot: 1,
      type: {
        name: 'grass',
        url: 'fake://type/12',
      },
    },
    {
      slot: 2,
      type: {
        name: 'poison',
        url: 'fake://type/4',
      },
    },
  ],
  past_types: [],
};

const mockNamedAPIResource: NamedAPIResource = {
  name: 'bulbasaur',
  url: 'fake://pokemon/1',
};

const mockPokemonListResponse: NamedAPIResourceList = {
  count: 1302,
  next: 'fake://pokemon?offset=20&limit=20',
  previous: null,
  results: [mockNamedAPIResource],
};

const mockTypeData: Type = {
  id: 12,
  name: 'grass',
  damage_relations: {
    no_damage_to: [],
    half_damage_to: [
      {
        name: 'fire',
        url: 'fake://type/10',
      },
    ],
    double_damage_to: [
      {
        name: 'water',
        url: 'fake://type/11',
      },
    ],
    no_damage_from: [],
    half_damage_from: [
      {
        name: 'water',
        url: 'fake://type/11',
      },
    ],
    double_damage_from: [
      {
        name: 'fire',
        url: 'fake://type/10',
      },
    ],
  },
  past_damage_relations: [],
  game_indices: [
    {
      game_index: 7,
      generation: {
        name: 'generation-i',
        url: 'fake://generation/1',
      },
    },
  ],
  generation: {
    name: 'generation-i',
    url: 'fake://generation/1',
  },
  move_damage_class: {
    name: 'physical',
    url: 'fake://move-damage-class/2',
  },
  names: [
    {
      language: {
        name: 'en',
        url: 'fake://language/9',
      },
      name: 'Grass',
    },
  ],
  pokemon: [
    {
      pokemon: {
        name: 'bulbasaur',
        url: 'fake://pokemon/1',
      },
      slot: 1,
    },
    {
      pokemon: {
        name: 'ivysaur',
        url: 'fake://pokemon/2',
      },
      slot: 1,
    },
  ],
  moves: [
    {
      name: 'razor-leaf',
      url: 'fake://move/75',
    },
  ],
};

describe('Pokemon Helper Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPokemonList', () => {
    it('should fetch a paginated list of Pokemon with default parameters', async () => {
      mockPokemonClient.listPokemons.mockResolvedValue(mockPokemonListResponse);
      mockPokemonClient.getPokemonByName.mockResolvedValue(mockPokemon);

      const result = await fetchPokemonList();

      expect(mockPokemonClient.listPokemons).toHaveBeenCalledWith(0, 20);
      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledWith(
        'bulbasaur',
      );
      expect(result).toEqual({
        count: 1302,
        next: 'fake://pokemon?offset=20&limit=20',
        previous: null,
        results: [mockPokemon],
      });
    });

    it('should fetch a paginated list with custom parameters', async () => {
      mockPokemonClient.listPokemons.mockResolvedValue(mockPokemonListResponse);
      mockPokemonClient.getPokemonByName.mockResolvedValue(mockPokemon);

      await fetchPokemonList(10, 5);

      expect(mockPokemonClient.listPokemons).toHaveBeenCalledWith(5, 10);
    });

    it('should throw error for invalid limit', async () => {
      await expect(fetchPokemonList(0)).rejects.toThrow(
        'Invalid pagination parameters: limit must be > 0 and offset must be >= 0',
      );
    });

    it('should throw error for negative offset', async () => {
      await expect(fetchPokemonList(20, -1)).rejects.toThrow(
        'Invalid pagination parameters: limit must be > 0 and offset must be >= 0',
      );
    });

    it('should handle API errors gracefully', async () => {
      mockPokemonClient.listPokemons.mockRejectedValue(new Error('API Error'));

      await expect(fetchPokemonList()).rejects.toThrow(
        'Failed to fetch Pokemon list: API Error',
      );
    });
  });

  describe('fetchPokemonById', () => {
    it('should fetch Pokemon by valid ID', async () => {
      mockPokemonClient.getPokemonById.mockResolvedValue(mockPokemon);

      const result = await fetchPokemonById(1);

      expect(mockPokemonClient.getPokemonById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPokemon);
    });

    it('should throw error for non-integer ID', async () => {
      await expect(fetchPokemonById(1.5)).rejects.toThrow(
        'Invalid Pokemon ID: must be a positive integer',
      );
    });

    it('should throw error for zero ID', async () => {
      await expect(fetchPokemonById(0)).rejects.toThrow(
        'Invalid Pokemon ID: must be a positive integer',
      );
    });

    it('should throw error for negative ID', async () => {
      await expect(fetchPokemonById(-1)).rejects.toThrow(
        'Invalid Pokemon ID: must be a positive integer',
      );
    });

    it('should handle API errors gracefully', async () => {
      mockPokemonClient.getPokemonById.mockRejectedValue(
        new Error('Pokemon not found'),
      );

      await expect(fetchPokemonById(999999)).rejects.toThrow(
        'Failed to fetch Pokemon with ID 999999: Pokemon not found',
      );
    });
  });

  describe('fetchPokemonByName', () => {
    it('should fetch Pokemon by valid name', async () => {
      mockPokemonClient.getPokemonByName.mockResolvedValue(mockPokemon);

      const result = await fetchPokemonByName('Bulbasaur');

      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledWith(
        'bulbasaur',
      );
      expect(result).toEqual(mockPokemon);
    });

    it('should normalize name to lowercase and trim whitespace', async () => {
      mockPokemonClient.getPokemonByName.mockResolvedValue(mockPokemon);

      await fetchPokemonByName('  BULBASAUR  ');

      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledWith(
        'bulbasaur',
      );
    });

    it('should throw error for empty string', async () => {
      await expect(fetchPokemonByName('')).rejects.toThrow(
        'Invalid Pokemon name: must be a non-empty string',
      );
    });

    it('should throw error for whitespace-only string', async () => {
      await expect(fetchPokemonByName('   ')).rejects.toThrow(
        'Invalid Pokemon name: must be a non-empty string',
      );
    });

    it('should throw error for non-string input', async () => {
      await expect(
        fetchPokemonByName(null as unknown as string),
      ).rejects.toThrow('Invalid Pokemon name: must be a non-empty string');
    });

    it('should handle API errors gracefully', async () => {
      mockPokemonClient.getPokemonByName.mockRejectedValue(
        new Error('Pokemon not found'),
      );

      await expect(fetchPokemonByName('invalidname')).rejects.toThrow(
        "Failed to fetch Pokemon 'invalidname': Pokemon not found",
      );
    });
  });

  describe('searchPokemon', () => {
    beforeEach(() => {
      mockPokemonClient.listPokemons.mockResolvedValue({
        ...mockPokemonListResponse,
        results: [
          { name: 'bulbasaur', url: 'url1' },
          { name: 'ivysaur', url: 'url2' },
          { name: 'venusaur', url: 'url3' },
          { name: 'charmander', url: 'url4' },
        ],
      });
      mockPokemonClient.getPokemonByName.mockResolvedValue(mockPokemon);
    });

    it('should search Pokemon by query with default limit', async () => {
      const result = await searchPokemon('saur');

      expect(mockPokemonClient.listPokemons).toHaveBeenCalledWith(0, 1000);
      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledTimes(3); // bulbasaur, ivysaur, venusaur
      expect(result).toHaveLength(3);
    });

    it('should respect custom limit', async () => {
      const result = await searchPokemon('saur', 2);

      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('should normalize query to lowercase and trim', async () => {
      await searchPokemon('  SAUR  ');

      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledWith(
        'bulbasaur',
      );
    });

    it('should return empty array for no matches', async () => {
      const result = await searchPokemon('xyz');

      expect(result).toEqual([]);
    });

    it('should throw error for empty query', async () => {
      await expect(searchPokemon('')).rejects.toThrow(
        'Invalid search query: must be a non-empty string',
      );
    });

    it('should throw error for whitespace-only query', async () => {
      await expect(searchPokemon('   ')).rejects.toThrow(
        'Invalid search query: must be a non-empty string',
      );
    });

    it('should throw error for invalid limit', async () => {
      await expect(searchPokemon('test', 0)).rejects.toThrow(
        'Invalid limit: must be greater than 0',
      );
    });

    it('should handle API errors gracefully', async () => {
      mockPokemonClient.listPokemons.mockRejectedValue(new Error('API Error'));

      await expect(searchPokemon('test')).rejects.toThrow(
        'Failed to search Pokemon: API Error',
      );
    });
  });

  describe('fetchPokemonsByType', () => {
    beforeEach(() => {
      mockPokemonClient.getTypeByName.mockResolvedValue(mockTypeData);
      mockPokemonClient.getPokemonByName.mockResolvedValue(mockPokemon);
    });

    it('should fetch Pokemon by type with default parameters', async () => {
      const result = await fetchPokemonsByType('grass');

      expect(mockPokemonClient.getTypeByName).toHaveBeenCalledWith('grass');
      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        results: [mockPokemon, mockPokemon],
        hasMore: false,
        total: 2,
      });
    });

    it('should handle pagination correctly', async () => {
      const result = await fetchPokemonsByType('grass', 1, 0);

      expect(mockPokemonClient.getPokemonByName).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        results: [mockPokemon],
        hasMore: true,
        total: 2,
      });
    });

    it('should normalize type name to lowercase and trim', async () => {
      await fetchPokemonsByType('  GRASS  ');

      expect(mockPokemonClient.getTypeByName).toHaveBeenCalledWith('grass');
    });

    it('should throw error for empty type', async () => {
      await expect(fetchPokemonsByType('')).rejects.toThrow(
        'Invalid Pokemon type: must be a non-empty string',
      );
    });

    it('should throw error for invalid pagination parameters', async () => {
      await expect(fetchPokemonsByType('grass', 0)).rejects.toThrow(
        'Invalid pagination parameters: limit must be > 0 and offset must be >= 0',
      );

      await expect(fetchPokemonsByType('grass', 20, -1)).rejects.toThrow(
        'Invalid pagination parameters: limit must be > 0 and offset must be >= 0',
      );
    });

    it('should handle API errors gracefully', async () => {
      mockPokemonClient.getTypeByName.mockRejectedValue(
        new Error('Type not found'),
      );

      await expect(fetchPokemonsByType('invalidtype')).rejects.toThrow(
        "Failed to fetch Pokemon by type 'invalidtype': Type not found",
      );
    });

    it('should handle empty type data', async () => {
      const emptyTypeData = {
        ...mockTypeData,
        pokemon: [],
      };
      mockPokemonClient.getTypeByName.mockResolvedValue(emptyTypeData);

      const result = await fetchPokemonsByType('grass');

      expect(result).toEqual({
        results: [],
        hasMore: false,
        total: 0,
      });
    });
  });
});
