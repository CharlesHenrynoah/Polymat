const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // The Blenderbot model returns an array with a single response object
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text;
    }

    throw new Error("Format de réponse inattendu");
  } catch (error) {
    console.error('Erreur lors de la communication avec Hugging Face:', error);
    throw new Error('Impossible de communiquer avec l\'IA pour le moment.');
  }
}