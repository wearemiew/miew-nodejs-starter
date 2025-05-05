import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// Import plugins
import { prismaPlugin } from './plugins/prisma';

// Import routes
import { userRoutes } from './routes/user.routes';
import { postRoutes } from './routes/post.routes';

export async function bootstrap(server: FastifyInstance): Promise<void> {
  try {
    // Register plugins
    await server.register(cors);
    await server.register(helmet);

    console.log('Registering prisma plugin...');
    await server.register(prismaPlugin);
    console.log('Prisma plugin registered successfully');

    // Register Swagger
    await server.register(swagger, {
      openapi: {
        info: {
          title: 'Miew Starter API',
          description: 'API documentation for Miew Starter',
          version: '1.0.0',
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here',
        },
        servers: [
          {
            url: `http://localhost:${process.env.PORT || 3000}`,
          },
        ],
        components: {
          securitySchemes: {},
        },
      },
      hideUntagged: false,
    });

    // Register Swagger UI
    await server.register(swaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    });

    // Register routes
    server.register(userRoutes, { prefix: '/api/users' });
    server.register(postRoutes, { prefix: '/api/posts' });

    // Health check route
    server.get('/health', async () => {
      return { status: 'ok' };
    });

    console.log('Bootstrap completed successfully');
  } catch (error) {
    console.error('Error during bootstrap:');
    console.error(error);
    throw error; // Re-throw to stop server startup if bootstrap fails
  }
}
