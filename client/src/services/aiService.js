const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

export async function explainVerse(verseText, reference, language = 'en') {
  const langInstruction = language === 'gu'
    ? 'Respond in simple Gujarati (ગુજરાતી). Keep it warm and accessible.'
    : 'Respond in simple, modern English.';

  const prompt = `You are a warm, knowledgeable Bible teacher. Explain this verse briefly (3-4 sentences max):

"${verseText}" — ${reference}

${langInstruction}

Cover: what it means, its historical/spiritual context, and a practical takeaway for modern life. Be warm, clear, and encouraging. Do NOT start with "This verse..."`;

  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error('AI explanation failed');
  
  const data = await response.json();
  return data.content?.[0]?.text || 'Explanation unavailable.';
}
