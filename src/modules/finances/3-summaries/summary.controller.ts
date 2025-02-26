import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { Public } from "~decorators/public.decorator";
import { SummaryDto } from "~modules/finances/3-summaries/dto/summary.dto";
import { SummaryService } from "./summary.service";

@Controller("summaries")
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  // ----- Method: GET -----
  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async getTransactionStats(@Query() query: SummaryDto) {
    return this.summaryService.getTransactionStats(query);
  }
}
