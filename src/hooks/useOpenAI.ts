import { useState } from 'react';
import { OpenAI } from 'openai';

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Ensure this is set correctly in your .env
  dangerouslyAllowBrowser: true, // Only use this if you understand the risks
});

export const useOpenAI = () => {
  const [response, setResponse] = useState<string | null>('');
  const [prompt, setPrompt] = useState<string | undefined>('');

  // Define messages structure
  const chatGptMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: 'system', content: 'Hello' },
    { role: 'user', content: prompt || 'Hello' },
  ];

  // Function to call the OpenAI API and set the response
  const getOpenAIResponse = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    try {
      const res = await openai.chat.completions.create({
        messages: chatGptMessages,
        model: 'gpt-3.5-turbo',
      });
      setResponse(res.choices[0].message?.content || 'No response');
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
    }
  };

  return {
    prompt,
    setPrompt,
    response,
    getOpenAIResponse,
  };
};