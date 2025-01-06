import { supabase, CHAT_HISTORY_TABLE } from '../config/services';

export interface ChatMessage {
  id?: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  quality_metrics?: Record<string, number>;
  rule_violations?: string[];
}

export async function saveChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
  try {
    const { data, error } = await supabase
      .from(CHAT_HISTORY_TABLE)
      .insert([
        {
          ...message,
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Failed to save chat message:', error);
    return null;
  }
}

export async function getConversationHistory(
  limit: number = 50,
  order: 'asc' | 'desc' = 'desc'
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from(CHAT_HISTORY_TABLE)
      .select('*')
      .order('timestamp', { ascending: order === 'asc' })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    return [];
  }
}

export async function deleteConversationHistory(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(CHAT_HISTORY_TABLE)
      .delete()
      .not('id', 'is', null);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete chat history:', error);
    return false;
  }
} 