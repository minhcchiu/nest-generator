import { PartialType } from "@nestjs/mapped-types";
import { CreateUserQuestionActivityDto } from "./create-user_question_activity.dto";

export class UpdateUserQuestionActivityDto extends PartialType(CreateUserQuestionActivityDto) {}
