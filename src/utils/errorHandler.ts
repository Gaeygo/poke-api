import { FastifyReply, FastifyRequest } from 'fastify';
import HttpException, {  HttpStatus } from "../schema/Error";
import logger from './logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (error: HttpException | PrismaClientKnownRequestError | unknown, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof HttpException) {
        const { statusCode, message, status } = error

        reply.status(statusCode).send({
            status,
            statusCode: statusCode,
            message: message,
        });

        logger.error(error, message)
    } else if (error instanceof PrismaClientKnownRequestError) {
        handlePrismaError(error)

    }
    new HttpException()
    logger.error(error)
}






function handlePrismaError(error: PrismaClientKnownRequestError) {
    logger.error(error)
    throw new HttpException(400, error.message, error.code);
}



