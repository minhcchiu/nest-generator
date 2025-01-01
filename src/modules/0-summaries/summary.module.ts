import { Module } from "@nestjs/common";
import { TransactionModule } from "~modules/0-transactions/transaction.module";
import { SummaryController } from "./summary.controller";
import { SummaryService } from "./summary.service";

@Module({
  imports: [TransactionModule],
  controllers: [SummaryController],
  providers: [SummaryService],
  exports: [SummaryService],
})
export class SummaryModule {}
