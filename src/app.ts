import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import pokeRoutes from "./routes/pokemon.route";
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";
import { UserRoutes } from "./routes/user.route";
import prisma from "./utils/prisma";
import { User } from "@prisma/client";

import path from "path";
import ejs from "ejs";
import fastifyEnv from "@fastify/env";
import dotenv from "dotenv"
import cors from "@fastify/cors"
import { authGenCheckView } from "./utils/authutils";
import { fetchUserKeys } from "./controller/apiKeyManagement";



declare module "fastify" {

    // interface FastifyInstance {
    //     config: {
    //         PORT: string,
    //         SESSION_SECRET: string
    //     }
    // }
    interface Session {
        user_id: string
        email: string
    }

    interface FastifyRequest {
        user: User
    }

}


// Define the type for the environment variables
declare const process: {
    on(arg0: string, arg1: () => Promise<void>): unknown;
    exit(arg0: number): unknown;
    env: {
        PORT: string;
        SESSION_SECRET: string
    };
};






export const server = Fastify({ logger: logger, requestTimeout: 30000 })
dotenv.config();

server.register(cors, {
    // put your options here
    origin: true
})


const address = +process.env.PORT || 3000


server.setErrorHandler(errorHandler)

server.register(import('@fastify/formbody'))



const sessionSecret = process.env.SESSION_SECRET
//Register cookie plugin Because session depends on it
server.register(fastifyCookie)

// Register session plugin
server.register(fastifySession, {
    secret: sessionSecret,
    cookie: {
        secure: false, // Set to true in production (requires HTTPS)
    },
});


server.register(import('@fastify/view'), {
    engine: {
        ejs,
    },
    templates: path.join(__dirname, 'view'),
});



server.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
})



server.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.view("login")
})

server.get("/signup", (request: FastifyRequest, reply: FastifyReply) => {
    reply.view("signup")
})

server.get("/dashboard", { preValidation: [authGenCheckView<{}, {}>] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const apiKey = await fetchUserKeys(request.user.id)
    // reply.view("dashboard", { user: request.user, apiKeys: apiKey })
    console.log(apiKey)
    return reply.view("dashboard", { user: request.user, apikeys: apiKey })
})



process.on('beforeExit', async () => {
    await prisma.$disconnect();
});



async function main() {
    server.register(UserRoutes, { prefix: "api/auth" })
    server.register(pokeRoutes, { prefix: "api/pokemon" })
    try {
        await server.listen({ port: address as number });
        server.log.info(`Fastify is listening on port: ${address}`);

        console.log(`Server at http://localhost:3000`)

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}


main()
