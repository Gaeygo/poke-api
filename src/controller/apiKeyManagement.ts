import { FastifyReply, FastifyRequest } from "fastify";
import { createApiKey, deleteApiKey } from "../helper/DBhelper";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto"
import HttpException from "../schema/Error";
import prisma from "../utils/prisma";
import logger from "../utils/logger";
import { Prisma } from "@prisma/client";



export async function fetchKeys(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = await prisma.apiKey.findMany({
        where: {
            userId: request.session.user_id
        }
    })
    if (apiKey) return reply.code(200).send(apiKey)
    return reply.code(404).send({ message: "not available" })
}

export async function createKey(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = uuidv4()
    const apiId = crypto.randomBytes(16).toString('hex')
    const newKey = await createApiKey(request.session.user_id, apiId, apiKey)
    if (!newKey) return reply.code(400).send("Error echoed")
    logger.info("new api key created")
    return reply.code(201).send(newKey)


}


export async function deleteKey(request: FastifyRequest<{
    Body: { keyId: string },
}>, reply: FastifyReply) {

    try {
        const keyDeleted = await deleteApiKey(request.session.user_id, request.body.keyId)
        return reply.code(201).send("Deleted")

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new HttpException(400, "ApikeyID doesn't exist")
        }
        else {
            throw error
        }


    }

}


// try {
//     const deletedAuthor = await prisma.author.delete({
//         where: {
//             id: 1,
//         },
//     });
//     console.log({ deletedAuthor });
// } catch (error) {
//     if (
//         error instanceof Prisma.PrismaClientKnownRequestError &&
//         error.code === "P2025"
//     ) {
//         console.log("Author not found");
//     } else console.error(error);
// }