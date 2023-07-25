import { Prisma, ApiKey, User } from "@prisma/client"

import prisma from "../utils/prisma"

export const createUser = async (user: User) => {
    const newUser = await prisma.user.create({
        data: user
    })
}

export const updateUser = async (userId: string, params: Prisma.UserUpdateInput) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: params

    })
}

export const createApiKey = async (apiDetails: ApiKey) => {
    const newApiKey = await prisma.apiKey.create({
        data: apiDetails
    })
}


export const deleteApiKey = async (userId: string, apiId: string) => {
    const deleteKey = await prisma.apiKey.delete({
        where: {
            id: apiId,
            userId: userId
        }
    })
}

