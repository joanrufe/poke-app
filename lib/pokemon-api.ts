export interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: string[];
  sprite: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: { name: string };
  }>;
  moves: Array<{
    move: { name: string; url: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  height: number;
  weight: number;
}

export interface TypeDetail {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: Array<{ name: string; url: string }>;
    double_damage_to: Array<{ name: string; url: string }>;
    half_damage_from: Array<{ name: string; url: string }>;
    half_damage_to: Array<{ name: string; url: string }>;
    no_damage_from: Array<{ name: string; url: string }>;
    no_damage_to: Array<{ name: string; url: string }>;
  };
  pokemon: Array<{
    pokemon: { name: string; url: string };
    slot: number;
  }>;
}

export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  priority: number;
  type: {
    name: string;
    url: string;
  };
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
  target: {
    name: string;
    url: string;
  };
}

// API Functions
export const pokemonApi = {
  // Fetch Pokemon list with pagination
  async getPokemonList(
    page: number,
    limit = 20
  ): Promise<{ pokemon: Pokemon[]; totalPages: number }> {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon list");
    }

    const data: PokemonListResponse = await response.json();
    const totalPages = Math.ceil(data.count / limit);

    // Fetch details for each Pokemon in parallel
    const pokemonDetails = await Promise.all(
      data.results.map(async (poke) => {
        const detailResponse = await fetch(poke.url);
        if (!detailResponse.ok) {
          throw new Error(`Failed to fetch details for ${poke.name}`);
        }
        const detail = await detailResponse.json();

        return {
          name: poke.name,
          url: poke.url,
          id: detail.id,
          types: detail.types.map((type: any) => type.type.name),
          sprite:
            detail.sprites.front_default ||
            "/placeholder.svg?height=96&width=96",
        };
      })
    );

    return { pokemon: pokemonDetails, totalPages };
  },

  // Fetch individual Pokemon details
  async getPokemonDetail(id: string): Promise<PokemonDetail> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon with id: ${id}`);
    }

    return response.json();
  },

  // Search Pokemon by name
  async searchPokemon(name: string): Promise<Pokemon> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`Pokemon "${name}" not found`);
    }

    const detail = await response.json();
    return {
      name: detail.name,
      url: `https://pokeapi.co/api/v2/pokemon/${detail.id}`,
      id: detail.id,
      types: detail.types.map((type: any) => type.type.name),
      sprite:
        detail.sprites.front_default || "/placeholder.svg?height=96&width=96",
    };
  },

  // Fetch type details and damage relations
  async getTypeDetail(typeName: string): Promise<TypeDetail> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/type/${typeName.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch type: ${typeName}`);
    }

    return response.json();
  },

  // Fetch Pokemon by type with pagination
  async getPokemonByType(
    typeName: string,
    page: number,
    limit = 20
  ): Promise<{ pokemon: Pokemon[]; totalPages: number; totalCount: number }> {
    // First get the type data to know total count
    const typeData = await this.getTypeDetail(typeName);
    const totalCount = typeData.pokemon.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPokemon = typeData.pokemon.slice(startIndex, endIndex);

    // Fetch details for each Pokemon in the current page
    const pokemonDetails = await Promise.all(
      paginatedPokemon.map(async (pokemonEntry) => {
        const detailResponse = await fetch(pokemonEntry.pokemon.url);
        if (!detailResponse.ok) {
          throw new Error(
            `Failed to fetch details for ${pokemonEntry.pokemon.name}`
          );
        }
        const detail = await detailResponse.json();
        return {
          name: pokemonEntry.pokemon.name,
          url: pokemonEntry.pokemon.url,
          id: detail.id,
          types: detail.types.map((type: any) => type.type.name),
          sprite:
            detail.sprites.front_default ||
            "/placeholder.svg?height=96&width=96",
        };
      })
    );

    return { pokemon: pokemonDetails, totalPages, totalCount };
  },

  // Fetch move details
  async getMoveDetail(moveNameOrId: string | number): Promise<MoveDetail> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/move/${moveNameOrId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch move: ${moveNameOrId}`);
    }

    return response.json();
  },

  // Extract move ID from URL
  extractMoveId(moveUrl: string): string {
    const parts = moveUrl.split("/");
    return parts[parts.length - 2]; // Get the ID from the URL
  },
};
