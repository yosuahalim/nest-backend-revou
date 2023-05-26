import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(username: string, password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }

  async validate(username: string, password: string): Promise<User | null> {
    const user: User = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    const passwordMatch: boolean =
      user && bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    return user;
  }
}
