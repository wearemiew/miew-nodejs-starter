import { PrismaClient, Post } from '@prisma/client';

export class PostService {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async create(data: { title: string; content?: string; published?: boolean }): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async update(
    id: number,
    data: { title?: string; content?: string; published?: boolean }
  ): Promise<Post> {
    // Check if post exists first
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    // Check if post exists first
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    await this.prisma.post.delete({
      where: { id },
    });
  }
}
