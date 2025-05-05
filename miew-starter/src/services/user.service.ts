import { PrismaClient, User } from '@prisma/client';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...user }) => user);
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(data: {
    email: string;
    name?: string;
    password: string;
  }): Promise<Omit<User, 'password'>> {
    // In a real app, you would hash the password here
    const user = await this.prisma.user.create({
      data,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(
    id: number,
    data: { email?: string; name?: string; password?: string }
  ): Promise<Omit<User, 'password'>> {
    // Check if user exists first
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: number): Promise<void> {
    // Check if user exists first
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
