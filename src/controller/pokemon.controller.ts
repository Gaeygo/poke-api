import { FastifyReply, FastifyRequest, errorCodes } from "fastify"
import { FullPokemon, NeededPokemonData, PokemonColor, PokemonList, PokemonSearch, QueryPokeParams } from "../schema/Pokemon"
import instance from "../utils/axios"
import HttpException from "../schema/Error";
import fetchRecursiveData from "../utils/fetch";
import { PokemonForm } from "pokenode-ts";

export async function fetchPokemonHandler(request: FastifyRequest<{
    Body: PokemonSearch
}>, reply: FastifyReply) {

    console.log(request.body);

    try {

        const product = await instance.get<NeededPokemonData>(`/pokemon/${request.body.id}`)
        if (!product.data) {
            throw new HttpException(400, "Pokemon doesn't exist, Input right ID")
        }
        const color = await instance.get<PokemonColor>(`/pokemon-species/${product.data.name}`)
        const pokeColor = color.data
        // return { ...product.data, pokeColor }
        return reply.code(200).send({ ...product.data as NeededPokemonData, pokeColor: pokeColor.color })

    } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        else {
            reply.status(500).send({ status: 500, message: 'Internal Server Error' });

        }
    }


}


export async function fetchPokemonList(request: FastifyRequest<{ Querystring: QueryPokeParams }>, reply: FastifyReply) {
    try {
        const { limit, page } = request.query
        const offset = (+page - 1) * +limit
        const pokeList = await instance.get<PokemonList>(`/pokemon/?offset=${offset}&limit=${limit}`)

        if (pokeList.data) {

            const pokeNames = pokeList.data.results.map(poke => poke.name)
            const pokeDetails = await fetchRecursiveData<PokemonForm>(pokeNames)
            return reply.code(200).send(pokeDetails)

        }
        


        // return reply.code(200).send(pokeList.data)
    } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        return reply.code(500).send(error)
    }

}

// ?offset=20&limit=20
//adding translation based on user location