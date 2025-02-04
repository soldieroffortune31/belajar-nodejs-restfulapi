import { PrismaClient } from "@prisma/client";
import { logger } from "./logging.js";

export const prismanClient = new PrismaClient({
    log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
});

prismanClient.$on('error', (e) => {
    logger.error(e);
})

prismanClient.$on('warn', (e) => {
    logger.warn(e);
})

prismanClient.$on('info', (e) => {
    logger.info(e);
})

prismanClient.$on('query', (e) => {
    logger.info(e);
})

