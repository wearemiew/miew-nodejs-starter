import { config } from 'dotenv';
config();

import Fastify, { FastifyInstance } from 'fastify';
import { bootstrap } from './app';

console.log('Creating Fastify server instance...');
const server: FastifyInstance = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.PRETTY_PRINT === 'true'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              colorize: true,
              levelFirst: true,
            },
          }
        : undefined,
  },
});

// Run the server
const start = async () => {
  try {
    console.log('Starting bootstrap process...');
    // Bootstrap the application
    await bootstrap(server);

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    console.log('Starting server...');

    // Set a timeout to detect if server.listen is hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error('Server startup timed out after 10 seconds. Check your database connection.')
        );
      }, 10000);
    });

    // Race the server listen promise against the timeout
    await Promise.race([server.listen({ port, host: '0.0.0.0' }), timeoutPromise]);

    console.log(`🚀 Server is running at http://localhost:${port}`);
    console.log(`📚 Swagger documentation available at http://localhost:${port}/documentation`);
  } catch (err) {
    console.error('Failed to start server:');
    console.error(err);
    server.log.error(err);
    process.exit(1);
  }
};

console.log('Initializing server...');
start();
