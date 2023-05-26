import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  serializeUser(user: User, done: (error: Error, user: any) => void): any {
    done(null, user.id);
  }

  async deserializeUser(
    userId: number,
    done: (error: Error, payload: any) => void,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
      },
    });

    done(null, user);
  }
}
