import React from 'react';

export interface ChatToolbarProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => Promise<void>;
  isLoading?: boolean;
}

export const ChatToolbar: React.FC<ChatToolbarProps> = ({
  input,
  onInputChange,
  onSend,
  isLoading = false
}) => {
  return (
    <div className="flex gap-2 p-4 border-t">
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded"
        disabled={isLoading}
      />
      <button
        onClick={onSend}
        disabled={isLoading || !input.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};
