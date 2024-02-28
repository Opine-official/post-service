import { OpenAiCompletions } from '../../infrastructure/openai/Completions';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGenerateOpenaiCompletionsDTO {
  prompt: string;
}

export class GenerateOpenaiCompletions
  implements IUseCase<IGenerateOpenaiCompletionsDTO, string | Error>
{
  public constructor(private readonly _completions: OpenAiCompletions) {}

  public async execute(
    input: IGenerateOpenaiCompletionsDTO,
  ): Promise<string | Error> {
    const result = await this._completions.createCompletion(input.prompt);

    if (typeof result !== 'string') {
      return new Error(`${result} is not a string`);
    }

    return result;
  }
}
