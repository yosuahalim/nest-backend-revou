import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { AuthEntity } from './entities/auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  //POST /auth/signup
  @Post('/signup')
  @ApiOkResponse({ type: UserEntity })
  async signup(@Body() input: AuthDto) {
    return this.authService.createUser(input);
  }

  @Post('/signin')
  @ApiOkResponse({ type: AuthEntity })
  async signin(@Body() input: AuthDto) {
    return this.authService.validateUser(input);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/user')
  async getAllusers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    return users;
  }
}
