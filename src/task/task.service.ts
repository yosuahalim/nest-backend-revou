import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PatchTaskInput, PutTaskInput, TaskInput } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  findAll(query: string, userId: number) {
    return this.prisma.task.findMany({
      where: {
        userId: userId,
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number, userId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (task && task.userId !== userId) {
      throw new UnauthorizedException(
        `Not authorized to get task of id: ${id}`,
      );
    }

    if (task === null) {
      throw new NotFoundException(`Task with id: ${id} doesn't exist`);
    }

    return task;
  }

  async create(input: TaskInput, userId: number) {
    try {
      if (input.folderId) {
        const folder = await this.prisma.folder.findFirst({
          where: {
            id: input.folderId,
          },
        });

        if (!folder) {
          throw new NotFoundException(
            'Couldnt find folder with that id. Try again.',
          );
        }

        if (folder.userId !== userId) {
          throw new UnauthorizedException(`You're not the owner of the folder`);
        }
      }

      return await this.prisma.task.create({
        data: {
          ...input,
          userId,
          folderId: input.folderId ? input.folderId : undefined,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `userId or folderId is not valid. Try again.`,
        );
      }
      throw error;
    }
  }

  async remove(id: number, userId: number) {
    try {
      const user = await this.prisma.task.deleteMany({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!user.count) {
        throw new NotFoundException(`Could not find the task with id: ${id}`);
      }

      return {
        success: true,
        message: `Task with id: ${id} deleted succesfully.`,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause);
      }
      throw error;
    }
  }

  async update(id: number, input: PutTaskInput, userId: number) {
    try {
      const task = await this.prisma.task.findFirst({ where: { id: id } });

      if (task && task.userId !== userId) {
        throw new NotFoundException(`Could not find the task with id: ${id}`);
      }

      return await this.prisma.task.update({
        where: {
          id: id,
        },
        data: input,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause);
      }
      throw error;
    }
  }

  async patch(id: number, input: PatchTaskInput, userId: number) {
    try {
      if (input.folderId) {
        const folder = await this.prisma.folder.findFirst({
          where: {
            id: input.folderId,
          },
        });

        if (!folder) {
          throw new NotFoundException(
            'Couldnt find folder with that id. Try again.',
          );
        }

        if (folder.userId !== userId) {
          throw new UnauthorizedException(`You're not the owner of the folder`);
        }
      }

      const task = await this.prisma.task.findFirst({ where: { id: id } });

      if (task && task.userId !== userId) {
        throw new NotFoundException(`Could not find the task with id: ${id}`);
      }

      return await this.prisma.task.update({
        where: {
          id: id,
        },
        data: {
          title: input.title ? input.title : undefined,
          done: input.done ? input.done : undefined,
          folderId: input.folderId ? input.folderId : undefined,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(`folderId is not valid. Try again.`);
      }
      throw error;
    }
  }
}
