import { FastifyReply, FastifyRequest } from "fastify";
import { createApiKey } from "../helper/DBhelper";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto"
import HttpException from "../schema/Error";
import prisma from "../utils/prisma";
import logger from "../utils/logger";
import { ApiKey } from "@prisma/client";



export async function createKey(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = uuidv4()
    const apiId = crypto.randomBytes(16).toString('hex')
    const newKey = await createApiKey(request.session.user_id, apiId, apiKey)
    if (!newKey) return reply.code(400).send("Error echoed")
    logger.info("new api key created")
    return reply.code(201).send(newKey)


}


export async function deleteKey(request: FastifyRequest, reply: FastifyReply) {

}