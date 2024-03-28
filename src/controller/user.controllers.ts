import { FastifyReply, FastifyRequest } from "fastify";
import { createApiKey, deleteApiKey } from "../helper/DBhelper";
import { UserInput } from "../schema/UserAuth";
import prisma from "../utils/prisma";
import HttpException from "../schema/Error";
import crypto from "crypto";
import { hashPassword, verifyPassword } from "../helper/Hash";
import logger from "../utils/logger";

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


            // reply.code(200).send(user).view("./view/dashboard.ejs")
            reply.redirect("/dashboard")

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

        //Handling schema validation error
        if (request.validationError) {
            throw new HttpException(400, "Request body should have email and password")
        }
        const { email, password } = request.body
        const hashedPassword = await hashPassword(password)


        const user = await prisma.user.create({
            data: {
                id: crypto.randomBytes(16).toString('hex'),
                email,
                password: hashedPassword

            }
        })
        logger.info(`${user.id} User created`)
        // reply.code(201).send(user)
        reply.redirect("/")

        // if (!user) throw new HttpException(400, "User doesnt exist, create account")


    } catch (error) {
        throw error
    }

}


export async function userLogout(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply) {
    if (!request.session.user_id) {
        reply.redirect('/');
        // reply.code(401).send({ statusCode: 401, message: "Unauthorised access!, user is not authenticated" })
    }

    request.session.destroy((err) => {
        if (err) {
            reply.status(500)
            reply.send('Internal Server Error')
        } else {
            reply.redirect('/')
        }
    })
}
