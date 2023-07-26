import { FastifyReply, FastifyRequest } from "fastify";
import { updateUser, createApiKey, createUser, deleteApiKey } from "../helper/DBhelper";
import { UserInput } from "../schema/UserAuth";
import prisma from "../utils/prisma";
import HttpException from "../schema/Error";
import crypto from "crypto";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

//User Login route handler
export async function userLogin(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply) {
    try {
        const { email, password } = request.body
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        if (!user) throw new HttpException(400, "User doesnt exist, create account")

        if (user && user.password === password) {
            reply.code(200).send(user)
        } else {
            throw new HttpException(400, "User Login is details incorrect")

        }

    } catch (error) {
        throw error
    }

}




export async function userCreateAccount(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply) {
    try {
        const { email, password } = request.body
        const user = await prisma.user.create({
            data: {
                id: crypto.randomBytes(16).toString('hex'),
                email,
                password

            }
        })
        reply.code(201).send(user)

        // if (!user) throw new HttpException(400, "User doesnt exist, create account")


    } catch (error) {
        // if (error instanceof HttpException) {
        //     throw error
        // }
        // if (error instanceof PrismaClientValidationError) {
        //     error.message
        // }
        // else {
        //     // reply.status(500).send({ status: 500, message: 'Internal Server Error' });
        //     throw error
        // }
        throw error
    }

}