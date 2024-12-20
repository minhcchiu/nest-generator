import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { EnvStatic } from "src/configurations/static.env";

@Injectable()
export class ChatgptService {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: EnvStatic.getOpenAIConfig().apiKey,
      baseURL: EnvStatic.getOpenAIConfig().baseURL,
    });
  }

  async generateAIAnswer(question: string) {
    const result = await this.client.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable assistant that provides quality information.",
        },
        {
          role: "user",
          content: `Tell me, how to answer this question: ${question}`,
        },
      ],
    });

    return { reply: result.choices[0].message.content };
  }
}
