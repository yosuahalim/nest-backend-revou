import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FolderInput, UpdateFolder } from './dto/folder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('folders')
@ApiTags('folders')
export class FolderController {
  constructor(private folderService: FolderService) {}

  @Get()
  @ApiBearerAuth()
  async findFolder(@CurrentUser() user: User) {
    return await this.folderService.showFolders(user.id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: FolderInput })
  async addFolder(@Body() input: FolderInput, @CurrentUser() user: User) {
    return await this.folderService.addFolders(input, user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async patch(
    @Param('id') id: string,
    @Body() input: UpdateFolder,
    @CurrentUser() user: User,
  ) {
    return await this.folderService.patch(Number(id), input, user.id);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  async deleteFolder(@Param('id') id: string, @CurrentUser() user: User) {
    return this.folderService.deleteFolder(Number(id), user.id);
  }
}
