import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users/:id')
  getUser(@Param('id') id: string): Promise<string> {
    return this.appService.getUser(id);
  }
}
