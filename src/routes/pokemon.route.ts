import { FastifyInstance } from "fastify"
import { fetchPokemonList, fetchPokemonHandler } from "../controller/pokemon.controller"
import { PokemonSearch, QueryPokeParams, bodyPokeRouteOptions, queryRouteOptions } from "../schema/Pokemon"
import { apiKeyCheck, authGenCheck } from "../utils/authutils"



async function pokeRoutes(server: FastifyInstance) {
    server.post("/", {
        preValidation: [apiKeyCheck<PokemonSearch, {}>],
        schema: bodyPokeRouteOptions
    }, fetchPokemonHandler)

    server.get("/list", {
        preValidation:[apiKeyCheck<{}, QueryPokeParams>],
        schema:
            queryRouteOptions


    }, fetchPokemonList)
}



export default pokeRoutes