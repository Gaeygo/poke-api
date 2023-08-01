import { FastifyRequest, FastifyReply } from "fastify";
import {  ApiKey } from "../schema/Pokemon";




// Middleware to check if the user is authenticated

export const authGenCheck = async <P>(request: FastifyRequest<{
    Body: P
}>, reply: FastifyReply) => {
    if (!request.session.user_id) {
        // reply.redirect('/');
        reply.code(401).send({ statusCode: 401, message: "Unauthorised access" })
    }
};


export const apiKeyCheck = async<T >(request: FastifyRequest<{
    Headers: ApiKey,
    Body:  T 
}>, reply: FastifyReply) => {
    const api =  request.headers.key
    if (!api) {
        // reply.redirect('/');
        reply.code(401).send({ statusCode: 401, message: "Unauthorised access" })
    } else {
    }
};