import { FastifyInstance } from "fastify"
import { userCreateAccount, userLogin } from "../controller/user.controllers"
import { bodyUserRouteOptions } from "../schema/UserAuth"

export async function UserRoutes(server:FastifyInstance) {
    server.post("/login", {
        schema : bodyUserRouteOptions
    }, userLogin)

    server.post("/create", {schema: bodyUserRouteOptions}, userCreateAccount)
}