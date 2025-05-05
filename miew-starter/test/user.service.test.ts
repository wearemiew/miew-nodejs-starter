import { describe, beforeEach, afterEach, it, expect, jest } from '@jest/globals';
import { UserService } from '../src/services/user.service';

// Create a mock PrismaClient
const mockPrisma: any = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
};

// Mock the PrismaClient module
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

describe('UserService', () => {
  let userService: UserService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(mockPrisma);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return all users without password', async () => {
      // Arrange
      mockPrisma.user.findMany.mockResolvedValue([mockUser]);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUserWithoutPassword]);
      expect(result[0]).not.toHaveProperty('password');
    });
  });

  describe('findById', () => {
    it('should return a user by id without password', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await userService.findById(1);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUserWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await userService.findById(999);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user and return it without password', async () => {
      // Arrange
      const userData = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };

      const newUser = {
        ...mockUser,
        id: 2,
        email: userData.email,
        name: userData.name,
        password: userData.password,
      };

      mockPrisma.user.create.mockResolvedValue(newUser);

      // Act
      const result = await userService.create(userData);

      // Assert
      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: userData });
      expect(result).toEqual({
        id: 2,
        email: userData.email,
        name: userData.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('update', () => {
    it('should update a user and return it without password', async () => {
      // Arrange
      const updateData = {
        email: 'updated@example.com',
        name: 'Updated User',
      };

      const updatedUser = {
        ...mockUser,
        ...updateData,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.update(1, updateData);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual({
        id: 1,
        email: updateData.email,
        name: updateData.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user not found during update', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.update(999, { name: 'Updated' })).rejects.toThrow('User not found');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(undefined);

      // Act
      await userService.delete(1);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw error if user not found during deletion', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.delete(999)).rejects.toThrow('User not found');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(mockPrisma.user.delete).not.toHaveBeenCalled();
    });
  });
});
