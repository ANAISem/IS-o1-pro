interface DiscussionContext {
  currentTopic?: string;
  messageCount: number;
  lastResponseQuality?: number;
}

export default {
  adjustFlow(context: DiscussionContext) {
    const { currentTopic, messageCount, lastResponseQuality } = context;
    // Implementierung folgt
    return {
      shouldChangeTopic: messageCount > 5 && (lastResponseQuality || 0) < 0.5,
      suggestedTopic: currentTopic || 'general'
    };
  },
};
