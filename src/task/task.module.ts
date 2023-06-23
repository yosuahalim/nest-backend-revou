import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TasksController],
  providers: [TaskService],
})
export class TaskModule {}
