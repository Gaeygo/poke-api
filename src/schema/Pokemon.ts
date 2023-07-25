import { FastifySchema } from "fastify";
import { Pokemon, PokemonClient, PokemonSpecies } from "pokenode-ts";


type OmitAllExcept<T, K extends keyof T> = Pick<T, K>;


export type PokemonSearch = {
  id: string | number
};



export type NeededPokemonData = Omit<Pokemon,
  "game_indices" |
  "held_items" |
  "location_area_encounters" |
  "moves" |
  "species" |
  "types" |
  "past_types"
>

export type PokemonList = {
  count: number,
  next: string,
  previous: null,
  results: [{ name: string, url: string }]
}

export type QueryPokeParams = {
  page: string,
  limit: string
}

export const queryRouteOptions: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string' },
      limit: { type: 'string' },
    },
    required: ['page', 'limit'],
  },
}

export const bodyPokeRouteOptions: FastifySchema = {
  body: {
    type: "object",
    properties: {
      id: { type: "string" }
    },
    required: ["id"]
  }
}


export type PokemonColor = OmitAllExcept<PokemonSpecies, "color">


export type FullPokemon = NeededPokemonData & PokemonColor