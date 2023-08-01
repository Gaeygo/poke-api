import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import pokeRoutes from "./routes/pokemon.route";
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";
import { UserRoutes } from "./routes/user.route";
import prisma from "./utils/prisma";
import path from "path";
import handlebars from "handlebars";
import fastifyEnv from "@fastify/env";
import dotenv from "dotenv"

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
        handlebars,
    },
    templates: path.join(__dirname, 'view'),
});

server.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.view("login")
})



process.on('beforeExit', async () => {
    await prisma.$disconnect();
});



async function main() {
    server.register(UserRoutes, { prefix: "api/auth" })
    server.register(pokeRoutes,  { prefix: "api/pokemon" })
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
