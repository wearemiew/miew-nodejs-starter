import { FastifyPluginAsync } from 'fastify';
import { UserService } from '../services/user.service';

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  const userService = new UserService(fastify.prisma);

  // Get all users
  fastify.get('/', async () => {
    return userService.findAll();
  });

  // Get user by id
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return reply.code(400).send({ error: 'Invalid user ID' });
    }

    const user = await userService.findById(userId);

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return user;
  });

  // Create user
  fastify.post('/', async (request, reply) => {
    const userData = request.body as { email: string; name?: string; password: string };

    try {
      const user = await userService.create(userData);
      return reply.code(201).send(user);
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Update user
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return reply.code(400).send({ error: 'Invalid user ID' });
    }

    const userData = request.body as { email?: string; name?: string; password?: string };

    try {
      const user = await userService.update(userId, userData);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Delete user
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return reply.code(400).send({ error: 'Invalid user ID' });
    }

    try {
      await userService.delete(userId);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};
