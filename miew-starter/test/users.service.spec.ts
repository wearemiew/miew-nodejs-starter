import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';

const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(mockPrisma as never);
  });

  it('returns users without password', async () => {
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id: 1,
        email: 'a@a.com',
        name: 'A',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const users = await service.findAll();

    expect(users).toHaveLength(1);
    expect(users[0]).not.toHaveProperty('password');
  });

  it('throws not found for missing user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
