import { openai, GPT_CONFIG } from '../config/services';
import { z } from 'zod';

const QualitySchema = z.object({
  coherence: z.number().min(0).max(1),
  relevance: z.number().min(0).max(1),
  toxicity: z.number().min(0).max(1),
  overall: z.number().min(0).max(1),
});

type QualityMetrics = z.infer<typeof QualitySchema>;

export async function analyzeQuality(response: string): Promise<QualityMetrics> {
  const prompt = `Analyze the following response for quality metrics:
  "${response}"
  
  Rate each metric from 0 to 1:
  - Coherence: How well-structured and logical is the response?
  - Relevance: How well does it address the context?
  - Toxicity: Is there any harmful content? (0 = toxic, 1 = safe)
  - Overall: Overall quality score
  
  Respond in JSON format only.`;

  try {
    const completion = await openai.chat.completions.create({
      ...GPT_CONFIG,
      messages: [{ role: 'user', content: prompt }],
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return QualitySchema.parse(result);
  } catch (error) {
    console.error('Quality analysis failed:', error);
    return {
      coherence: 0.5,
      relevance: 0.5,
      toxicity: 1,
      overall: 0.5,
    };
  }
}
