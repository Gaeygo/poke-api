import { FastifyReply, FastifyRequest } from "fastify";
import { createApiKey } from "../helper/DBhelper";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto"
import HttpException from "../schema/Error";
import prisma from "../utils/prisma";



export async function createKey(request: FastifyRequest, reply: FastifyReply) {
    if (request.session.user_id) {
        const apiKey = uuidv4()
        const apiId = crypto.randomBytes(16).toString('hex')
        const newKey = await createApiKey(request.session.user_id, apiId, apiKey)
        return newKey

    }
    throw new HttpException(401, "User is not authenticated, kindly login")

}


export async function deleteKey(request: FastifyRequest, reply: FastifyReply) {

}