import openai from './config';

export class OpenAiCompletions {
  public constructor() {}

  public async createCompletion(
    prompt: string,
  ): Promise<string | Error | null> {
    try {
      const result = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
      return result.choices[0].message.content;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error;
      }

      return new Error('Something went wrong while called OpenAI API');
    }
  }
}
