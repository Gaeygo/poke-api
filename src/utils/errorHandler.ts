import { FastifyReply, FastifyRequest } from 'fastify';
import HttpException, { HttpStatus } from "../schema/Error";
import logger from './logger';

export const errorHandler = (error: HttpException, request: FastifyRequest, reply: FastifyReply) => {
    const { statusCode, message, status } = error

    reply.status(statusCode).send({
        status,
        statusCode: statusCode,
        message:
            message,
    });

    logger.error(error, message)


}

