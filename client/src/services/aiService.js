const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function translateToGujarati(text) {
  if (!text) {
    throw new Error("Text is required for translation.");
  }

  const url = `${SERVER_URL}/translate`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Translation failed from backend');
    }
    
    const data = await res.json();
    return data.translation;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

export async function explainVerse(text, reference, lang = 'en') {
  if (!text || !reference) {
    throw new Error("Text and reference are required for explanation.");
  }

  const url = `${SERVER_URL}/explain`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, reference, lang }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Explanation failed from backend');
    }
    
    const data = await res.json();
    return data.explanation;
  } catch (error) {
    console.error("AI Service Explain Error:", error);
    throw error;
  }
}
