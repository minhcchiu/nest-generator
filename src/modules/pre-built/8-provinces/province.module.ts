import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProvinceController } from "./province.controller";
import { ProvinceService } from "./province.service";
import { Province, ProvinceSchema } from "./schemas/province.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Province.name,
        schema: ProvinceSchema,
      },
    ]),
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
  exports: [ProvinceService],
})
export class ProvinceModule {}
