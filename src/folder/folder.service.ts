import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Folder, Prisma } from '@prisma/client';
import { FolderInput, UpdateFolder } from './dto/folder.dto';

@Injectable()
export class FolderService {
  constructor(private prisma: PrismaService) {}

  async showFolders(userId: number): Promise<Folder[]> {
    return await this.prisma.folder.findMany({
      where: {
        userId,
      },
      include: { tasks: true },
    });
  }

  async addFolders(input: FolderInput, userId: number): Promise<Folder> {
    const { title } = input;
    return await this.prisma.folder.create({
      data: {
        title,
        userId,
        // User: { connect: { email: input.userEmail } },
      },
    });
  }

  async deleteFolder(id: number, userId: number) {
    try {
      const user = await this.prisma.folder.deleteMany({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!user.count) {
        throw new NotFoundException(`Could not find the folder with id: ${id}`);
      }

      return {
        success: true,
        message: `Folder with id: ${id} deleted succesfully.`,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause);
      }
      throw error;
    }
  }

  async patch(id: number, input: UpdateFolder, userId: number) {
    try {
      const folder = await this.prisma.folder.findFirst({ where: { id: id } });

      if (folder && folder.userId !== userId) {
        throw new NotFoundException(`Could not find the folder with id: ${id}`);
      }

      return await this.prisma.folder.update({
        where: {
          id: id,
        },
        data: {
          title: input.title ? input.title : undefined,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause);
      }
      throw error;
    }
  }
}
