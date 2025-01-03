import { Injectable } from "@nestjs/common";
import { EnvStatic } from "src/configurations/static.env";

@Injectable()
export class ChatgptService {
  constructor() {}

  async generateAIAnswerByGemini(question: string) {
    const response = await fetch(
      `${EnvStatic.getAIConfig().geminiUrl}?key=${EnvStatic.getAIConfig().geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      data,
      reply: data.candidates[0].content.parts[0].text,
    };
  }
}
