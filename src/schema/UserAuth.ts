import { FastifySchema } from "fastify";

export interface UserInput { email: string, password: string }




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