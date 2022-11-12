import { RightsGroup, RightsGroupSchema } from './schemas/rights-group.schema';
import { RightsGroupController } from './rights-group.controller';
import { RightsGroupService } from './rights-group.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RightsGroup.name,
        schema: RightsGroupSchema,
      },
    ]),
  ],
  controllers: [RightsGroupController],
  providers: [RightsGroupService],
  exports: [RightsGroupService],
})
export class RightsGroupModule {}
