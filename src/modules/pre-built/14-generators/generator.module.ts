import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GeneratorController } from "~modules/pre-built/14-generators/generator.controller";
import { GeneratorService } from "~modules/pre-built/14-generators/generator.service";
import {
  Generator,
  GeneratorSchema,
} from "~modules/pre-built/14-generators/schemas/generator.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Generator.name,
        schema: GeneratorSchema,
      },
    ]),
  ],
  controllers: [GeneratorController],
  providers: [GeneratorService],
  exports: [GeneratorService],
})
export class GeneratorModule {}
