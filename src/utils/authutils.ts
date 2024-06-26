import { FastifyRequest, FastifyReply } from "fastify";
import { ApiKey } from "../schema/Pokemon";
import prisma from "./prisma";
import HttpException from "../schema/Error";




// Middleware to check if the user is authenticated
//P represents type for body
//K represents type for QueryString

export const authGenCheck = async <P, K>(request: FastifyRequest<{
    Headers: ApiKey,
    Body: P,
    Querystring: K
}>, reply: FastifyReply) => {
    if (!request.session.user_id) {
        // reply.redirect('/');
        reply.code(401).send({ statusCode: 401, message: "Unauthorised access!, user is not authenticated" })
    }

    // const user = await prisma.user.findUnique({
    //     where: {
    //         id: request.session.user_id
    //     }
    // })

    // request.user = user!

};

// for views
export const authGenCheckView = async <P, K>(request: FastifyRequest<{
    Headers: ApiKey,
    Body: P,
    Querystring: K
}>, reply: FastifyReply) => {
    if (!request.session.user_id) {
        reply.redirect('/');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: request.session.user_id
        }
    })

    request.user = user!

};

//api key validation
export const apiKeyCheck = async<T, K>(request: FastifyRequest<{
    Headers: ApiKey,
    Body: T,
    Querystring: K
}>, reply: FastifyReply) => {
    try {
        const api = request.headers.key
        if (!api) {
            // reply.redirect('/');
            return reply.code(401).send({ statusCode: 401, message: "Unauthorised access!, User is not Authorised" })
        }
        const apiKey = await prisma.apiKey.findUnique({
            where: {
                keyValue: api
            }
        })
        if (!apiKey) throw new HttpException(401, "Api Key is invalid", "apiKeyError")
        if (apiKey.expired) return reply.code(400).send("ApiKey is expired")
        if (Date.now() > apiKey.expiresIn.getTime()) {
            const expiredKey = await prisma.apiKey.update({
                where: {
                    userId: request.session.user_id,
                    id: apiKey.id
                },
                data: {
                    expired: true
                }
            })
            return reply.code(400).send("ApiKey is expired")
        }

    } catch (error) {
        throw error
    }


};
