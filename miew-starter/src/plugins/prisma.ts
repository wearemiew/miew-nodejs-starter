import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient, Prisma } from '@prisma/client';

// Declare the Prisma client in the Fastify instance
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

// Define custom logger that doesn't use events
const prismaLogger: Prisma.LogDefinition[] = [
  { level: 'info', emit: 'stdout' },
  { level: 'warn', emit: 'stdout' },
  { level: 'error', emit: 'stdout' },
];

// Add query logging if enabled
if (process.env.PRISMA_LOG_QUERIES === 'true') {
  prismaLogger.push({ level: 'query', emit: 'stdout' });
}

// Create a Prisma client with configurable logging
const prisma = new PrismaClient({
  log: prismaLogger,
});

const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  try {
    // Test the database connection before decorating the server
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connection established successfully');

    // Add the Prisma client to the Fastify instance
    fastify.decorate('prisma', prisma);

    // Close the Prisma client when the Fastify instance is closed
    fastify.addHook('onClose', async (fastify) => {
      await fastify.prisma.$disconnect();
    });
  } catch (error) {
    console.error('Failed to connect to the database:');
    console.error(error);
    throw error; // Re-throw to stop server startup if database connection fails
  }
});

export { prismaPlugin };
