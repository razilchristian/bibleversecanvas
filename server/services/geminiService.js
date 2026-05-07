import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const translateToGujarati = async (text) => {
  try {
    const prompt = `Translate this Bible verse into natural Gujarati language while preserving spiritual meaning: \n\n"${text}"`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (e) {
    console.error('Gemini Translation Error:', e);
    throw new Error('Translation failed');
  }
};

export const findReferencesByKeyword = async (keyword) => {
  try {
    const prompt = `Act as a Bible search engine. Find exactly 5 most relevant Bible verse references for the keyword: "${keyword}". 
    Return ONLY the references in a JSON array format like this: ["John 3:16", "Romans 8:28"]. 
    No other text.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Gemini Search Error:', e);
    return ['John 3:16', 'Psalm 23:1']; // Fallback
  }
};
