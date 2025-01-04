import { OpenAI } from 'openai';

/**
 * Generates a response from OpenAI based on the provided messages.
 * 
 * @param messages - Array of chat messages for the OpenAI API.
 * @returns The response from OpenAI's ChatCompletion endpoint.
 */
export const getOpenAIResponse = async (
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  apiKey: string,
  model: string = 'gpt-3.5-turbo'
): Promise<string> => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.chat.completions.create({
      messages,
      model,
    });

    return response.choices[0].message?.content || 'No response from OpenAI.';
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(error.message || 'Failed to get a response from OpenAI.');
  }
};
