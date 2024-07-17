import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DistrictController } from "./district.controller";
import { DistrictService } from "./district.service";
import { District, DistrictSchema } from "./schemas/district.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: District.name,
        schema: DistrictSchema,
      },
    ]),
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
