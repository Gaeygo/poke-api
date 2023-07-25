import { FastifyReply, FastifyRequest } from "fastify";
import { updateUser, createApiKey, createUser, deleteApiKey } from "../helper/DBhelper";
import { UserLoginInput } from "../schema/UserAuth";
import prisma from "../utils/prisma";
import HttpException from "../schema/Error";

// export async function fetchPokemonList(request: FastifyRequest<{ Querystring: QueryPokeParams }>, reply: FastifyReply) {


export async function userLogin(request: FastifyRequest<{ Body: UserLoginInput }>, reply: FastifyReply) {
    try {
        const { email, password } = request.body
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })

        if(user && user.password === password){
            reply.code(200).send("User is real")
        }

        if (!user) throw new HttpException(400, "User doesnt exist, create account")
    } catch (error) {

    }

}