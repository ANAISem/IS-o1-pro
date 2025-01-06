import React, { useState, useEffect } from 'react';
import ChatToolbar from './ChatToolbar';
import EarlAugustineModeration from '../modules/EarlAugustineModeration';
import ExpertModuleA from '../modules/ExpertModuleA';
import ExpertModuleB from '../modules/ExpertModuleB';
import { generateResponse } from '../services/ResponseGenerator';
import { checkRules, shouldBlockMessage } from '../services/RuleChecker';
import { analyzeQuality } from '../services/QualityAnalyzer';
import { 
  saveChatMessage, 
  getConversationHistory, 
  ChatMessage 
} from '../services/ChatHistoryManager';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load chat history on component mount
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    const history = await getConversationHistory(50, 'asc');
    setMessages(history);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // Check rules first
      const ruleCheck = await checkRules(input);
      if (shouldBlockMessage(ruleCheck)) {
        await saveChatMessage({
          content: 'Message blocked due to rule violations: ' + ruleCheck.violations.join(', '),
          role: 'system',
        });
        setInput('');
        return;
      }

      // Save user message
      await saveChatMessage({
        content: input,
        role: 'user',
      });

      // Moderation
      const moderatedInput = EarlAugustineModeration.moderate(input);

      // Get expert responses
      const expertResponses = [
        await ExpertModuleA.respond(moderatedInput),
        await ExpertModuleB.respond(moderatedInput),
      ];

      // Generate and analyze final response
      const finalResponse = await generateResponse(expertResponses);
      const qualityMetrics = await analyzeQuality(finalResponse);

      // Save AI response with quality metrics
      await saveChatMessage({
        content: finalResponse,
        role: 'assistant',
        quality_metrics: qualityMetrics,
      });

      // Reload chat history to show new messages
      await loadChatHistory();
      setInput('');
    } catch (error) {
      console.error('Error in chat flow:', error);
      await saveChatMessage({
        content: 'An error occurred while processing your message.',
        role: 'system',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="message-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
            {msg.quality_metrics && (
              <small className="quality-metrics">
                Quality: {Math.round(msg.quality_metrics.overall * 100)}%
              </small>
            )}
          </div>
        ))}
      </div>
      <ChatToolbar
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
