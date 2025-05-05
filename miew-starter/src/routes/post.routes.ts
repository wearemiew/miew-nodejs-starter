import { FastifyPluginAsync } from 'fastify';
import { PostService } from '../services/post.service';

export const postRoutes: FastifyPluginAsync = async (fastify) => {
  const postService = new PostService(fastify.prisma);

  // Get all posts
  fastify.get('/', async () => {
    return postService.findAll();
  });

  // Get post by id
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return reply.code(400).send({ error: 'Invalid post ID' });
    }

    const post = await postService.findById(postId);

    if (!post) {
      return reply.code(404).send({ error: 'Post not found' });
    }

    return post;
  });

  // Create post
  fastify.post('/', async (request, reply) => {
    const postData = request.body as { title: string; content?: string; published?: boolean };

    try {
      const post = await postService.create(postData);
      return reply.code(201).send(post);
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Update post
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return reply.code(400).send({ error: 'Invalid post ID' });
    }

    const postData = request.body as { title?: string; content?: string; published?: boolean };

    try {
      const post = await postService.update(postId, postData);
      return post;
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Delete post
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return reply.code(400).send({ error: 'Invalid post ID' });
    }

    try {
      await postService.delete(postId);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};
