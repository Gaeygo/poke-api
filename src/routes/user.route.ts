import { FastifyInstance } from "fastify"
import { userCreateAccount, userLogin } from "../controller/user.controllers"
import { bodyUserRouteOptions } from "../schema/UserAuth"
import { createKey, deleteKey, fetchKeys } from "../controller/apiKeyManagement"
import { authGenCheck } from "../utils/authutils"

export async function UserRoutes(server: FastifyInstance) {
    server.post("/login", {
        schema: bodyUserRouteOptions
    }, userLogin)

    server.get("/getkeys", { preValidation: [authGenCheck<{}, {}>] }, fetchKeys)

    server.post("/create", { schema: bodyUserRouteOptions, attachValidation: true }, userCreateAccount)

    server.get("/createapikey", { preValidation: [authGenCheck<{}, {}>] }, createKey)

    server.post("/deleteapikey", { preValidation: [authGenCheck<{ keyId: string }, {}>] }, deleteKey)
}