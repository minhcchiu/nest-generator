import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
