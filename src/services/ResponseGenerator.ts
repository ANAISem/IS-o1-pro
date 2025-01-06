import { checkRules } from './RuleChecker';
import { analyzeQuality } from './QualityAnalyzer';

interface ScoredResponse {
  text: string;
  score: number;
}

// Kombiniert Expertenantworten, führt Checks durch und generiert ein finales Resultat
export async function generateResponse(expertResponses: string[]): Promise<string> {
  // Regelprüfung und Qualitätsanalyse
  const validResponses = expertResponses.filter((resp) => checkRules(resp));
  
  const scoredResponses: Promise<ScoredResponse>[] = validResponses.map(async (resp) => {
    const quality = await analyzeQuality(resp);
    return {
      text: resp,
      score: quality.overall
    };
  });

  const scored = await Promise.all(scoredResponses);
  scored.sort((a, b) => Number(b.score) - Number(a.score));

  // Hier könnte man ggf. GPT-Aufrufe einbinden, um die finalen Antworten zu verfeinern
  return scored.length ? scored[0].text : 'Keine passende Antwort gefunden.';
}
