import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import pokeRoutes from "./routes/pokemon.route";
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";
import { UserRoutes } from "./routes/user.route";


export const server = Fastify({ logger: logger, requestTimeout: 30000 })



const address = process.env.PORT || 3000


server.setErrorHandler(errorHandler)

server.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({message: "welcome"})
})



async function main() {
    server.register(UserRoutes, {prefix: "api/auth"})
    server.register(pokeRoutes, {prefix: "api/pokemon"})
    try {
        await server.listen({ port: address as number  });
        server.log.info(`Fastify is listening on port: ${address}`);

        console.log(`Server at http://localhost:3000`)

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}


main()

