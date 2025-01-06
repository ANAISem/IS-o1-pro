import { openai } from '../config/services';

interface ExpertResponse {
  content: string;
  score: number;
  quality: number;
}

export async function generateResponse(expertResponses: ExpertResponse[]): Promise<string> {
  // Sortiere die Antworten nach Score und Qualität
  const scored = [...expertResponses].sort((a, b) => {
    const scoreComparison = Number(b.score) - Number(a.score);
    if (scoreComparison !== 0) return scoreComparison;
    return Number(b.quality) - Number(a.quality);
  });

  // Wähle die beste Antwort aus
  const bestResponse = scored[0];
  
  try {
    // Verbessere die beste Antwort mit GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du bist ein Experte für präzise und hilfreiche Antworten. Verbessere die folgende Antwort, indem du sie klarer und informativer machst."
        },
        {
          role: "user",
          content: bestResponse.content
        }
      ]
    });

    return completion.choices[0]?.message?.content || bestResponse.content;
  } catch (error) {
    console.error('Fehler bei der GPT-Verbesserung:', error);
    return bestResponse.content;
  }
}
