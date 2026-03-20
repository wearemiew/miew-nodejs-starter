import { Injectable, NotFoundException } from '@nestjs/common';
import type { Post as PostEntity } from '@prisma/client';
import { PrismaService } from '../prisma';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PostEntity[]> {
    return this.prisma.post.findMany();
  }

  async findById(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async create(data: {
    title: string;
    content?: string;
    published?: boolean;
  }): Promise<PostEntity> {
    return this.prisma.post.create({ data });
  }

  async update(
    id: number,
    data: { title?: string; content?: string; published?: boolean },
  ): Promise<PostEntity> {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.post.delete({ where: { id } });
  }
}
