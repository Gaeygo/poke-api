import { FastifyReply, FastifyRequest } from "fastify";
import { createApiKey } from "../helper/DBhelper";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto"



export async function createKey(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = uuidv4()
    const apiId = crypto.randomBytes(16).toString('hex')
    const newKey = await createApiKey(request.session.user_id, apiId, apiKey)
} 


export async function deleteKey(request: FastifyRequest, reply: FastifyReply){
    
}