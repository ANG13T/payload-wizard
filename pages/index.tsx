import { APIKeyInput } from '@/components/APIKeyInput';
import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { OpenAIModel, TranslateBody } from '@/types/types';
import { GenerationInput, GenerationOutput, InterpretationInput, InterpretationOutput } from '@/utils/defaults';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  // Generation Code
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [outputSnippet, setOutputSnippet] = useState<string>('');

  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isHome, setIsHome] = useState<boolean>(true);
  const [isGeneration, setIsGeneration] = useState<boolean>(false);

  const backToHome = () => {
    setIsHome(true);
    setInputPrompt('');
    setOutputSnippet('')
  }

  const togglePayloadGeneration = () => {
    setIsHome(false);
    setIsGeneration(true);
    // defaults for generation
    setInputPrompt(GenerationInput);
    setOutputSnippet(GenerationOutput);
  }

  const togglePayloadInterpreter = () => {
    setIsHome(false);
    setIsGeneration(false);
    // defaults for interpretation
    setInputPrompt(InterpretationInput);
    setOutputSnippet(InterpretationOutput);
  }

  const handleTranslate = async () => {
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (!apiKey) {
      alert('Please enter an API key.');
      return;
    }

    if (!inputPrompt) {
      alert('Please enter an input');
      return;
    }

    if (inputPrompt.length > maxCodeLength) {
      alert(
        `Please enter an input less than ${maxCodeLength} characters. You are currently at ${inputPrompt.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputSnippet('');

    const controller = new AbortController();

    const body: TranslateBody = {
      input: inputPrompt,
      option: isGeneration ? "Generation" : "Interpretation",
      outputLanguage,
      model,
      apiKey,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputSnippet((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);

    localStorage.setItem('apiKey', value);
  };

  useEffect(() => {
    if (hasTranslated) {
      handleTranslate();
    }
  }, [outputLanguage]);

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');

    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Payload Wizard</title>
        <meta
          name="description"
          content="An AI assistant utilizing GPT language models to interpret and generate cybersecurity payloads"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪄</text></svg>"></link>
      </Head>
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">

        <Link href="https://github.com/ANG13T/payload-wizard" target="_blank">
          <button type="button" className="absolute top-5 right-5 text-white border-white-700 border-2 bg-black-700 hover:bg-[#8933b6] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => backToHome()}>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd" />
            </svg>
          </button>
        </Link>

        {!isHome &&
          <Link href="/">
            <button type="button" onClick={() => backToHome()} className="absolute top-5 left-5 text-white border-white-700 border-2 bg-black-700 hover:bg-[#8933b6] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          </Link>
        }
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <img className="h-[300px]" src="/logo.png" />
          <img className="h-[50px] mt-10" src="/text.png" />
        </div>

        {isHome &&
          <div className="w-full flex flex-col items-center mt-5">
            <p className='font-mono'>An advanced AI assistant utilizing GPT language models to interpret and generate cybersecurity payloads</p>
            <button
              className="w-[600px] mt-10 text-xl font-mono cursor-pointer rounded-md bg-[#8933b6] px-4 border border-white-700 px-4 py-4 font-bold hover:bg-violet-600 active:bg-violet-700"
              onClick={() => togglePayloadGeneration()}
            >
              Payload Generation   🪄
            </button>

            <button
              className="w-[600px] mt-10 text-xl font-mono cursor-pointer rounded-md  bg-[#8933b6] px-4 border border-white-700 px-4 py-4 font-bold hover:bg-violet-600 active:bg-violet-700"
              onClick={() => togglePayloadInterpreter()}
            >
              Payload Interpreter   ✨
            </button>


          </div>}
        {!isHome &&
          <div className="w-full flex flex-col items-center">
            <div className="w-[1000px] flex flex-col items-center">
              <div className="mt-6 mb-3 text-center text-sm">
                <APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <ModelSelect model={model} onChange={(value) => setModel(value)} />

                <button
                  className="w-[200px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
                  onClick={() => handleTranslate()}
                  disabled={loading}
                >
                  {(loading && !isGeneration) && 'Interpreting'}
                  {(loading && isGeneration) && 'Generating'}
                  {(!loading && !isGeneration) && 'Interpret Payload'}
                  {(!loading && isGeneration) && 'Generate Payload'}

                </button>
              </div>
            </div>

            <div className="mt-3 text-center text-xs">


              {(loading && !isGeneration) && 'Interpreting...'}
              {(loading && isGeneration) && 'Generating...'}
              {(hasTranslated) && 'Output copied to clipboard!'}
              {(!hasTranslated && isGeneration) && 'Enter input and click "Generate Payload"'}
              {(!hasTranslated && !isGeneration) && 'Enter a payload and click "Interpret Payload"'}

            </div>

            {isGeneration &&
              <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
                <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
                  <div className="text-center text-xl font-bold mb-2">Input</div>

                  <TextBlock
                    text={inputPrompt}
                    editable={!loading}
                    onChange={(value) => {
                      setInputPrompt(value);
                      setHasTranslated(false);
                    }}
                    defaultText="Input payload functionality here..."
                  />

                  <div className="h-12"></div>

                </div>
                <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
                  <div className="text-center text-xl font-bold">Output</div>

                  <LanguageSelect
                    language={outputLanguage}
                    onChange={(value) => {
                      setOutputLanguage(value);
                      setOutputSnippet('');
                    }}
                  />

                  <CodeBlock code={outputSnippet} />
                </div>
              </div>
            }


            {!isGeneration &&
              <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
                <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
                  <div className="text-center text-xl font-bold">Payload</div>

                  <CodeBlock
                    code={inputPrompt}
                    editable={!loading}
                    onChange={(value) => {
                      setInputPrompt(value);
                      setHasTranslated(false);
                    }}
                    defaultText="Input payload code here..."
                  />

                </div>
                <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
                  <div className="text-center text-xl font-bold">Output</div>

                  <TextBlock text={outputSnippet} />
                </div>
              </div>
            }


          </div>
      }


      </div>

      <footer className="bg-[#0e1117]">
        <div className="w-full max-w-screen-xl mx-auto p-4">
          <span className="block text-sm text-white sm:text-center font-mono">Developed by <a href="https://angelinatsuboi.com" target="_blank" className="underline">Angelina Tsuboi</a> for <a href="https://stellaryxlabs.com" target="_blank" className="underline">Stellaryx Labs</a></span>
        </div>
      </footer>

    </>
  );
}
