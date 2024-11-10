const API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

export const chatWithBot = async (message: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key is not configured. Please set VITE_HUGGINGFACE_API_KEY in your environment.');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: message }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your credentials.');
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data[0]?.generated_text) {
      throw new Error('Invalid response from AI service');
    }

    return data[0].generated_text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while connecting to the AI service');
  }
};