import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public } from "~decorators/public.decorator";
import { ChatgptService } from "./chatgpt.service";

@Controller("chatgpt")
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  // ----- Method: GET -----
  @Public()
  @Post("/generate-ai-answer")
  @HttpCode(HttpStatus.OK)
  async generateAIAnswer(@Body("question") question: string) {
    return this.chatgptService.generateAIAnswer(question);
  }
}
