import { NotFoundException } from '@nestjs/common';
import { PostsService } from '../src/posts/posts.service';

const mockPrisma = {
  post: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(mockPrisma as never);
  });

  it('findAll returns posts', async () => {
    mockPrisma.post.findMany.mockResolvedValue([
      { id: 1, title: 'A', content: null, published: false },
    ]);

    const posts = await service.findAll();

    expect(posts).toHaveLength(1);
  });

  it('throws not found when post does not exist', async () => {
    mockPrisma.post.findUnique.mockResolvedValue(null);

    await expect(service.findById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
