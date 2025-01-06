import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Supabase client initialization
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// OpenAI client initialization
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat history table name in Supabase
export const CHAT_HISTORY_TABLE = 'chat_history';

// OpenAI model configuration
export const GPT_CONFIG = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 1000,
} as const; 