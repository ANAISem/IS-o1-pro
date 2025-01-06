interface DiscussionContext {
  currentTopic?: string;
  messageCount: number;
  lastResponseQuality?: number;
}

export default {
  adjustFlow(_context: DiscussionContext) {
    return {
      shouldChangeTopic: _context.messageCount > 5 && (_context.lastResponseQuality || 0) < 0.5,
      suggestedTopic: _context.currentTopic || 'general'
    };
  },
};
