import { openai, GPT_CONFIG } from '../config/services';
import { z } from 'zod';

const RuleViolationSchema = z.object({
  hasViolation: z.boolean(),
  violations: z.array(z.string()),
  severity: z.enum(['low', 'medium', 'high']),
});

type RuleViolation = z.infer<typeof RuleViolationSchema>;

const CONTENT_RULES = [
  'No harmful or discriminatory content',
  'No personal information sharing',
  'No explicit or adult content',
  'No promotion of illegal activities',
  'Must maintain professional tone',
  'Must be relevant to the discussion context',
] as const;

export async function checkRules(message: string): Promise<RuleViolation> {
  const prompt = `Analyze the following message for rule violations:
  "${message}"
  
  Rules to check:
  ${CONTENT_RULES.map((rule) => `- ${rule}`).join('\n')}
  
  Respond in JSON format with:
  - hasViolation (boolean)
  - violations (array of violated rules)
  - severity (low/medium/high based on violations)`;

  try {
    const completion = await openai.chat.completions.create({
      ...GPT_CONFIG,
      messages: [{ role: 'user', content: prompt }],
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return RuleViolationSchema.parse(result);
  } catch (error) {
    console.error('Rule checking failed:', error);
    return {
      hasViolation: false,
      violations: [],
      severity: 'low',
    };
  }
}

// Utility function to check if message should be blocked
export function shouldBlockMessage(violation: RuleViolation): boolean {
  return violation.severity === 'high' || violation.violations.length > 2;
}
