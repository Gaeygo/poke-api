import { FastifyInstance } from "fastify"
import { fetchPokemonList, fetchPokemonHandler } from "../controller/pokemon.controller"
import { bodyPokeRouteOptions, queryRouteOptions } from "../schema/Pokemon"


async function pokeRoutes(server: FastifyInstance) {
    server.post("/", {
        schema: bodyPokeRouteOptions
    }, fetchPokemonHandler)

    server.get("/list", {
        schema:
            queryRouteOptions


    }, fetchPokemonList)
}



export default pokeRoutes