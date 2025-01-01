import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Public } from "~decorators/public.decorator";
import { SearchableTypesEnum } from "~modules/questions-modules/0-generals/enums/searchable-types.enum";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";
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

  @Public()
  @Get("/badges/user/:userId")
  @HttpCode(HttpStatus.OK)
  async getUserBadges(@Param("userId", ParseObjectIdPipe) userId: ObjectId) {
    return this.generalService.getUserBadges(userId);
  }
}
