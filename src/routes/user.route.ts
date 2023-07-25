import { FastifyInstance } from "fastify"
import { userLogin } from "../controller/user.controllers"
import { bodyUserRouteOptions } from "../schema/UserAuth"

export async function UserRoutes(server:FastifyInstance) {
    server.post("/login", {
        schema : bodyUserRouteOptions
    }, userLogin)
}