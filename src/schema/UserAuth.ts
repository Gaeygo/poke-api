import { FastifySchema } from "fastify";

export interface UserLoginInput { email: string, password: string }



export const bodyUserRouteOptions: FastifySchema = {
    body: {
        type: "object",
        properties: {
            email: { type: "string" },
            password: { type: "string" }
        },
        required: ["email", "password"]
    }
}