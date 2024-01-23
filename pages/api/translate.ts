import { TranslateBody } from '@/types/types';
import { OpenAIStream } from '@/utils';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { option, input, outputLanguage, model, apiKey } =
      (await req.json()) as TranslateBody;

    const stream = await OpenAIStream(
      option,
      input,
      outputLanguage,
      model,
      apiKey,
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
