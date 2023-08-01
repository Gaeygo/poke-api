import { FastifyRequest, FastifyReply } from "fastify";
import { ApiKey } from "../schema/Pokemon";
import prisma from "./prisma";
import HttpException from "../schema/Error";




// Middleware to check if the user is authenticated

export const authGenCheck = async <P>(request: FastifyRequest<{
    Body: P
}>, reply: FastifyReply) => {
    if (!request.session.user_id) {
        // reply.redirect('/');
        reply.code(401).send({ statusCode: 401, message: "Unauthorised access" })
    }
};

//api key validation
export const apiKeyCheck = async<T>(request: FastifyRequest<{
    Headers: ApiKey,
    Body: T
}>, reply: FastifyReply) => {
    try {
        const api = request.headers.key
        if (!api) {
            // reply.redirect('/');
            return reply.code(401).send({ statusCode: 401, message: "Unauthorised access" })
        }
        const apiKey = await prisma.apiKey.findUnique({
            where: {
                keyValue: api
            }
        })
        if (!apiKey) throw new HttpException(401, "Api Key is invalid", "apiKeyError")
        
    } catch (error) {
        throw error
    }


};