import { camelCase, pascalCase, snakeCase } from "change-case";
import * as pluralize from "pluralize";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";

export const generateControllerCode = ({ schemaName }: CreateGeneratorDto) => {
  const nameSnakeCase = snakeCase(schemaName);
  const namePascalCase = pascalCase(schemaName);
  const nameCamelCase = camelCase(schemaName);

  // Generate create dto
  const controllerCode = `import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { Create${namePascalCase}Dto } from "~modules/${pluralize(nameSnakeCase)}/dto/create-${nameSnakeCase}.dto";
import { Update${namePascalCase}Dto } from "~modules/${pluralize(nameSnakeCase)}/dto/update-${nameSnakeCase}.dto";
import { ${namePascalCase}Service } from "~modules/${pluralize(nameSnakeCase)}/${nameSnakeCase}.service";

@Controller("${nameSnakeCase}s")
export class ${namePascalCase}Controller {
  constructor(private readonly ${nameCamelCase}Service: ${namePascalCase}Service) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.${nameCamelCase}Service.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.${nameCamelCase}Service.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.${nameCamelCase}Service.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: Create${namePascalCase}Dto) {
    return this.${nameCamelCase}Service.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: Update${namePascalCase}Dto) {
    return this.${nameCamelCase}Service.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.${nameCamelCase}Service.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
`;

  return {
    controllerCode,
  };
};
