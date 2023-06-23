import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FolderModule } from './folder/folder.module';

@Module({
  imports: [PrismaModule, TaskModule, UserModule, FolderModule, AuthModule],
  providers: [],
})
export class AppModule {}
