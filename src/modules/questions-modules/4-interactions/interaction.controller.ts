import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetCurrentUserId } from "~common/decorators/get-current-user-id.decorator";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";
import { InteractionService } from "./interaction.service";

@Controller("interactions")
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  // ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.interactionService.paginate(filter, options);
  }

  // ----- Method: POST -----
  @Post("/view/question/:questionId")
  @HttpCode(HttpStatus.CREATED)
  async viewQuestion(
    @GetCurrentUserId() userId: ObjectId,
    @Param("questionId", ParseObjectIdPipe) questionId: ObjectId,
  ) {
    return this.interactionService.viewQuestion(userId, questionId);
  }

  // ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateInteractionDto) {
    return this.interactionService.updateById(id, body);
  }

  // ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.interactionService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
