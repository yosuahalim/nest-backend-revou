import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.authService.register(username, password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(
    @Body() { username, password }: { username: string; password: string },
  ) {
    console.log(`${username} login`);
  }
}
