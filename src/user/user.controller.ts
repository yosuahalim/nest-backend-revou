import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
// import { CurrentUser } from 'src/decorators/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserInput } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async getUser(@CurrentUser() currentUser: User) {
    return await this.prisma.user.findFirst({
      where: {
        id: currentUser.id,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    if (id !== currentUser.id) {
      throw new UnauthorizedException('Not allowed to delete user');
    }

    try {
      const deletedUser = await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return {
        success: true,
        message: `Successfuly deleted user with id: ${id}`,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause);
      }
      throw error;
    }
  }
}
