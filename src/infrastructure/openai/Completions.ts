import openai from './config';

export class OpenAiCompletions {
  public constructor() {}

  public async createCompletion(prompt: string): Promise<string | null> {
    const result = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });
    return result.choices[0].message.content;
  }
}
