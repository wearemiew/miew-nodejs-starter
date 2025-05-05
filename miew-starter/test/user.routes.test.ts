import { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { describe, beforeAll, afterAll, it, expect, jest } from '@jest/globals';
import { bootstrap } from '../src/app';

// Mock the PrismaClient module first, before using any variables
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      user: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            password: 'password',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
        findUnique: jest.fn().mockImplementation((args) => {
          if (args?.where?.id === 1) {
            return Promise.resolve({
              id: 1,
              email: 'test@example.com',
              name: 'Test User',
              password: 'password',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
          return Promise.resolve(null);
        }),
        create: jest.fn().mockImplementation((args) => {
          return Promise.resolve({
            id: 1,
            ...(args?.data || {}),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),
        update: jest.fn().mockImplementation((args) => {
          return Promise.resolve({
            id: args?.where?.id || 1,
            email: 'updated@example.com',
            name: 'Updated User',
            password: 'password',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),
        delete: jest.fn().mockResolvedValue({}),
      },
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('User Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    // Initialize app
    app = Fastify();
    await bootstrap(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/users', () => {
    it('should return all users without passwords', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
      });

      expect(response.statusCode).toBe(200);

      const users = JSON.parse(response.payload);
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual(
        expect.objectContaining({
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
        })
      );
      expect(users[0]).not.toHaveProperty('password');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id without password', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/1',
      });

      expect(response.statusCode).toBe(200);

      const user = JSON.parse(response.payload);
      expect(user).toEqual(
        expect.objectContaining({
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
        })
      );
      expect(user).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/999',
      });

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.payload)).toEqual(
        expect.objectContaining({
          error: 'User not found',
        })
      );
    });

    it('should return 400 for invalid user id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/invalid',
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toEqual(
        expect.objectContaining({
          error: 'Invalid user ID',
        })
      );
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user and return it without password', async () => {
      const newUser = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: newUser,
      });

      expect(response.statusCode).toBe(201);

      const createdUser = JSON.parse(response.payload);
      expect(createdUser).toEqual(
        expect.objectContaining({
          id: 1,
          email: newUser.email,
          name: newUser.name,
        })
      );
      expect(createdUser).not.toHaveProperty('password');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user and return it without password', async () => {
      const updateData = {
        email: 'updated@example.com',
        name: 'Updated User',
      };

      const response = await app.inject({
        method: 'PUT',
        url: '/api/users/1',
        payload: updateData,
      });

      expect(response.statusCode).toBe(200);

      const updatedUser = JSON.parse(response.payload);
      expect(updatedUser).toEqual(
        expect.objectContaining({
          id: 1,
          email: updateData.email,
          name: updateData.name,
        })
      );
      expect(updatedUser).not.toHaveProperty('password');
    });

    it('should return 400 for invalid user id', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/api/users/invalid',
        payload: { name: 'Updated User' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toEqual(
        expect.objectContaining({
          error: 'Invalid user ID',
        })
      );
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user and return 204 status', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/users/1',
      });

      expect(response.statusCode).toBe(204);
      expect(response.payload).toBe('');
    });

    it('should return 400 for invalid user id', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/users/invalid',
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toEqual(
        expect.objectContaining({
          error: 'Invalid user ID',
        })
      );
    });
  });
});
