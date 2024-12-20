import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { Public } from "~decorators/public.decorator";
import { SearchableTypesEnum } from "~modules/questions-modules/0-generals/enums/searchable-types.enum";
import { GeneralService } from "./general.service";

@Controller("generals")
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  // ----- Method: GET -----
  @Public()
  @Get("/global-search")
  @HttpCode(HttpStatus.OK)
  async globalSearch(
    @Query("keyword") keyword: string,
    @Query("searchType")
    searchType?: SearchableTypesEnum,
  ) {
    return this.generalService.globalSearch(keyword, searchType);
  }
}
