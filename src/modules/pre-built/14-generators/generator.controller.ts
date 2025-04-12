import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { Public } from "~common/decorators/public.decorator";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import { GeneratorService } from "./generator.service";

@Controller("generators")
export class GeneratorController {
  constructor(private readonly schemaGeneratorService: GeneratorService) {}

  //  ----- Method: GET -----
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    const pagination = await this.schemaGeneratorService.paginate(filter, options);

    return pagination;
  }

  //  ----- Method: POST -----
  @Public()
  @Post("/crud")
  @HttpCode(HttpStatus.OK)
  async generate(@Body() body: CreateGeneratorDto) {
    return this.schemaGeneratorService.generateSchema(body);
  }
}
