import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PatchTaskInput, PutTaskInput, TaskInput } from './dto/task.dto';
import { TaskService } from './task.service';
import { CurrentUser } from '../decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TaskEntity } from './entities/task.entity';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity, isArray: true })
  @ApiQuery({
    name: 'q',
    description: 'query search',
    required: false,
    type: String,
  })
  findAll(@CurrentUser() currentUser: User, @Query('q') query?: string) {
    return this.taskService.findAll(query, currentUser.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.findById(id, currentUser.id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TaskEntity })
  create(@Body() input: TaskInput, @CurrentUser() currentUser: User) {
    return this.taskService.create(input, currentUser.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.remove(id, currentUser.id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: PutTaskInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.update(id, input, currentUser.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: PatchTaskInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.patch(id, input, currentUser.id);
  }
}
