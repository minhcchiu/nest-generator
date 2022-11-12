import { AuthAccessController } from './auth-access.controller';
import { AuthAccess, AuthAccessSchema } from './schemas/auth-access.schema';
import { AuthAccessService } from './auth-access.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthAccess.name,
        schema: AuthAccessSchema,
      },
    ]),
  ],
  controllers: [AuthAccessController],
  providers: [AuthAccessService],
  exports: [AuthAccessService],
})
export class AuthAccessModule {}
