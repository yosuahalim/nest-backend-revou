import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(input: AuthDto) {
    const hash = await bcrypt.hashSync(input.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          email: input.email,
          hashPassword: hash,
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ForbiddenException('Email has been used');
      }
      throw err;
    }
  }

  async validateUser(input: AuthDto): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });
    if (!user) {
      throw new NotFoundException('Incorrect Credential (7701)');
    }

    const isPwMatch: boolean = bcrypt.compareSync(
      input.password,
      user.hashPassword,
    );

    if (!isPwMatch) {
      throw new UnauthorizedException('Incorrect Credential (7702)');
    }
    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  logout() {
    msg: 'test';
  }
}
