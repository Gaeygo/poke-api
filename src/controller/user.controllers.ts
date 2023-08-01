import { FastifyReply, FastifyRequest } from "fastify";
import { createApiKey, deleteApiKey } from "../helper/DBhelper";
import { UserInput } from "../schema/UserAuth";
import prisma from "../utils/prisma";
import HttpException from "../schema/Error";
import crypto from "crypto";
import { hashPassword, verifyPassword } from "../helper/Hash";

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

        const passwordRight = await verifyPassword(password, user.password)

        if (passwordRight) {
            request.session.user_id = user.id
            request.session.email = user.email

            reply.code(200).send(user)
        } else {
            throw new HttpException(400, "User Login is details incorrect")

        }

    } catch (error) {
        throw error
    }

    console.log(request.body)

}



// User account Creation route Handler
export async function userCreateAccount(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply) {
    try {
        const { email, password } = request.body
        const hashedPassword = await hashPassword(password)


        const user = await prisma.user.create({
            data: {
                id: crypto.randomBytes(16).toString('hex'),
                email,
                password: hashedPassword

            }
        })
        reply.code(201).send(user)

        // if (!user) throw new HttpException(400, "User doesnt exist, create account")


    } catch (error) {
        throw error
    }

}