import { Prisma, ApiKey, User } from "@prisma/client"

import prisma from "../utils/prisma"

// export const createUser = async (user: User) => {
//     const newUser = await prisma.user.create({
//         data: user
//     })
// }

// export const updateUser = async (userId: string, params: Prisma.UserUpdateInput) => {
//     const updatedUser = await prisma.user.update({
//         where: {
//             id: userId
//         },
//         data: params

//     })
// }


function createDateTime(weeksToAdd: number) {
    // Calculate the date after the specified number of weeks
    const dateInWeeks = new Date();
    dateInWeeks.setDate(dateInWeeks.getDate() + weeksToAdd * 7);

    return dateInWeeks.toISOString();

}

export const createApiKey = async (userId: string, id: string, apiValue: string) => {
  const newApiKey = await prisma.apiKey.create({
        data: {
            id: id,
            userId: userId,
            expired: false,
            keyValue: apiValue,
            expiresIn: createDateTime(7)
        }
    })
    return newApiKey
}


export const deleteApiKey = async (userId: string, apiId: string) => {
    const deleteKey = await prisma.apiKey.delete({
        where: {
            id: apiId,
            userId: userId
        }
    })
}

